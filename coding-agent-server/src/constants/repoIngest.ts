import { exec } from 'child_process';
import { promisify } from 'util';

export const execAsync = promisify(exec);


// Script injected into the container to analyze the filesystem
export const INTERNAL_ANALYSIS_SCRIPT = `
const fs = require('fs');
const path = require('path');
const WORK_DIR = '/app';

try {
  const files = fs.readdirSync(WORK_DIR);
  
  // 1. Configs
  const configFiles = files.filter(f => 
    ['tsconfig.json', 'package.json', 'go.mod', 'requirements.txt', 'pom.xml', 'Dockerfile', '.eslintrc'].includes(f)
  );

  // 2. Folders
  const folderStructure = files.filter(f => {
    try { return fs.statSync(path.join(WORK_DIR, f)).isDirectory() && f !== '.git'; } catch { return false; }
  });

  // 3. Package Manager
  let packageManager = 'unknown';
  if (files.includes('yarn.lock')) packageManager = 'yarn';
  else if (files.includes('pnpm-lock.yaml')) packageManager = 'pnpm';
  else if (files.includes('package-lock.json')) packageManager = 'npm';
  else if (files.includes('go.mod')) packageManager = 'go modules';
  else if (files.includes('requirements.txt')) packageManager = 'pip';

  // 4. Framework & Languages
  let framework = null;
  const languages = new Set();
  
  if (files.includes('package.json')) {
    languages.add('JavaScript');
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(WORK_DIR, 'package.json'), 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps['typescript']) languages.add('TypeScript');
      if (deps['next']) framework = 'Next.js';
      else if (deps['react']) framework = 'React';
      else if (deps['express']) framework = 'Express';
      else if (deps['vue']) framework = 'Vue';
      else if (deps['@nestjs/core']) framework = 'NestJS';
    } catch (e) {}
  }
  
  if (files.includes('go.mod')) languages.add('Go');
  if (files.includes('requirements.txt')) languages.add('Python');
  if (files.includes('pom.xml')) languages.add('Java');

  // 5. Entry Points
  const entryPoints = files.filter(f => 
    ['index.js', 'index.ts', 'main.go', 'app.py', 'server.js', 'src/index.js'].includes(f)
  );

  console.log(JSON.stringify({ languages: Array.from(languages), framework, configFiles, packageManager, folderStructure, entryPoints }));
} catch (err) {
  process.exit(1);
}
`;