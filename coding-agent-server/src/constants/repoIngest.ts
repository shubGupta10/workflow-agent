import { exec } from 'child_process';
import { promisify } from 'util';

export const execAsync = promisify(exec);

// Complete repository understanding script - extracts full context
export const INTERNAL_ANALYSIS_SCRIPT = `
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const MAX_DEPTH = 7;
const MAX_FILE_SIZE = 250_000;
const SNIPPET_LINES = 100;

// Directories to ignore
const IGNORE_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'coverage', '.cache', 'out', 'public/assets', '.gemini']);
const CODE_EXT = ['.js', '.ts', '.tsx', '.jsx', '.mjs', '.cjs'];

function walk(dir, depth = 0) {
  if (depth > MAX_DEPTH) return null;
  const out = {};
  try {
    const items = fs.readdirSync(dir);
    for (const name of items) {
      if (IGNORE_DIRS.has(name) || name.startsWith('.')) continue;
      const full = path.join(dir, name);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          const child = walk(full, depth + 1);
          if (child) out[name] = { type: 'dir', children: child };
        } else {
          out[name] = {
            type: 'file',
            ext: path.extname(name),
            size: stat.size,
            path: full.replace(ROOT + '/', '')
          };
        }
      } catch {}
    }
  } catch {}
  return out;
}

function readSafe(file) {
  try {
    const stat = fs.statSync(file);
    if (stat.size > MAX_FILE_SIZE) return null;
    return fs.readFileSync(file, 'utf8');
  } catch { return null; }
}

function extractImports(code) {
  const imports = [];
  const regex = /(import\\s+.*?from\\s+['"](.*?)['"])|(require\\(['"](.*?)['"]\\))/g;
  let m;
  while ((m = regex.exec(code))) {
    const imp = m[2] || m[4];
    if (imp) imports.push(imp);
  }
  return [...new Set(imports)];
}

function extractExports(code) {
  const exports = [];
  const patterns = [
    /export\\s+(?:const|function|class|interface|type|enum)\\s+(\\w+)/g,
    /export\\s+default\\s+(?:function|class|interface|type|enum)?\\s*(\\w+)?/g,
    /module\\.exports\\s*=\\s*{?([\\s\\S]*?)}?/g
  ];
  for (const r of patterns) {
    let m;
    while ((m = r.exec(code))) {
      if (m[1]) exports.push(m[1].trim());
    }
  }
  return [...new Set(exports)];
}

function categorizeFile(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.includes('/models/')) return 'models';
  if (lower.includes('service')) return 'services';
  if (lower.includes('controller')) return 'controllers';
  if (lower.includes('route')) return 'routes';
  if (lower.includes('component')) return 'components';
  if (lower.includes('hooks/')) return 'hooks';
  if (lower.includes('context/') || lower.includes('provider')) return 'context';
  if (lower.includes('lib/')) return 'lib';
  if (lower.includes('util')) return 'utils';
  if (lower.includes('type') || lower.includes('interface')) return 'types';
  if (lower.includes('page') || lower.includes('app/')) return 'pages';
  return 'other';
}

function detectTech(pkg) {
  const tech = {
    runtime: 'node',
    languages: [],
    frameworks: [],
    database: null,
    styling: [],
    uiLibraries: [],
    stateManagement: [],
    packageManager: 'unknown'
  };

  if (!pkg) return tech;
  const d = { ...pkg.dependencies, ...pkg.devDependencies };

  const langs = new Set(['JavaScript']);
  if (d.typescript) langs.add('TypeScript');
  tech.languages = Array.from(langs);

  if (fs.existsSync(path.join(ROOT, 'yarn.lock'))) tech.packageManager = 'yarn';
  else if (fs.existsSync(path.join(ROOT, 'pnpm-lock.yaml'))) tech.packageManager = 'pnpm';
  else if (fs.existsSync(path.join(ROOT, 'package-lock.json'))) tech.packageManager = 'npm';

  if (d.next) tech.frameworks.push('Next.js');
  if (d.react && !d.next) tech.frameworks.push('React');
  if (d.express) tech.frameworks.push('Express');
  if (d.mongoose) tech.database = { type: 'MongoDB', orm: 'Mongoose' };
  if (d.prisma) tech.database = { type: 'Unknown', orm: 'Prisma' };
  if (d.zustand) tech.stateManagement.push('Zustand');
  if (d.redux) tech.stateManagement.push('Redux');
  if (d.tailwindcss) tech.styling.push('Tailwind');

  return tech;
}

const tree = walk(ROOT);
const fileMap = {};
const fileInfo = {};
const dependencies = {};
const configContents = {};

const CONFIG_FILES = [
  'package.json', 'tsconfig.json', 'tailwind.config.js', 'tailwind.config.ts',
  'components.json', 'next.config.js', 'next.config.mjs'
];

for (const cf of CONFIG_FILES) {
  const content = readSafe(path.join(ROOT, cf));
  if (content) configContents[cf] = content;
}

const pkg = configContents['package.json'] ? JSON.parse(configContents['package.json']) : null;
const tech = detectTech(pkg);

function processNode(node) {
  for (const k in node) {
    const v = node[k];
    if (v.type === 'file' && CODE_EXT.includes(v.ext)) {
      const cat = categorizeFile(v.path);
      if (!fileMap[cat]) fileMap[cat] = [];
      fileMap[cat].push(v.path);

      const code = readSafe(path.join(ROOT, v.path));
      if (code) {
        const imports = extractImports(code);
        const exports = extractExports(code);
        dependencies[v.path] = imports;
        
        const isEntry = ['index.ts', 'main.ts', 'app/page.tsx', 'server.ts'].some(e => v.path.includes(e));
        const shouldSnippet = isEntry || (fileMap[cat].length <= 3);
        
        fileInfo[v.path] = {
          exports,
          snippet: shouldSnippet ? code.split('\\n').slice(0, SNIPPET_LINES).join('\\n') : undefined
        };
      }
    } else if (v.type === 'dir') {
      processNode(v.children);
    }
  }
}

processNode(tree);

const output = {
  technologies: tech,
  fileTree: tree,
  fileMap: fileMap,
  configContents: configContents,
  analysis: {
    dependencies,
    fileInfo
  },
  summary: {
    totalModels: (fileMap.models || []).length,
    totalServices: (fileMap.services || []).length,
    totalComponents: (fileMap.components || []).length,
    totalHooks: (fileMap.hooks || []).length,
    totalPages: (fileMap.pages || []).length,
    totalFiles: Object.keys(fileInfo).length
  }
};

console.log(JSON.stringify(output));
`;
