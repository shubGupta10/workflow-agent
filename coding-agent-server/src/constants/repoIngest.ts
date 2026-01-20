import { exec } from 'child_process';
import { promisify } from 'util';

export const execAsync = promisify(exec);


// Complete repository understanding script - extracts full context
export const INTERNAL_ANALYSIS_SCRIPT = `
const fs = require('fs');
const path = require('path');
const W = '/app';

// Ignore patterns
const IGNORE = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.cache', 'out', 'public/assets'];

// Build complete file tree with metadata
function buildFileTree(dir, currentPath = '', depth = 0, maxDepth = 5) {
  if (depth > maxDepth) return null;
  
  try {
    const items = fs.readdirSync(dir);
    const tree = {};
    
    for (const item of items) {
      if (IGNORE.some(ig => item === ig || item.startsWith('.'))) continue;
      
      const fullPath = path.join(dir, item);
      const relativePath = currentPath ? path.join(currentPath, item) : item;
      
      try {
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          const subtree = buildFileTree(fullPath, relativePath, depth + 1, maxDepth);
          if (subtree && Object.keys(subtree).length > 0) {
            tree[item] = { type: 'directory', children: subtree };
          }
        } else if (stat.isFile()) {
          tree[item] = {
            type: 'file',
            path: relativePath,
            size: stat.size,
            ext: path.extname(item)
          };
        }
      } catch (e) {}
    }
    
    return tree;
  } catch (e) {
    return null;
  }
}

// Categorize files by purpose
function categorizeFiles(tree, basePath = '') {
  const categories = {
    models: [],
    schemas: [],
    services: [],
    controllers: [],
    routes: [],
    middleware: [],
    utils: [],
    helpers: [],
    config: [],
    types: [],
    interfaces: [],
    components: [],
    pages: [],
    api: [],
    hooks: [],
    lib: [],
    database: [],
    migrations: [],
    seeds: [],
    tests: [],
    docs: []
  };
  
  function scan(obj, currentPath) {
    for (const key in obj) {
      const item = obj[key];
      const itemPath = currentPath ? \`\${currentPath}/\${key}\` : key;
      
      if (item.type === 'file') {
        const lower = key.toLowerCase();
        const ext = item.ext;
        
        // Categorize by filename patterns
        if (lower.includes('model') && (ext === '.ts' || ext === '.js')) categories.models.push(itemPath);
        if (lower.includes('schema') && (ext === '.ts' || ext === '.js')) categories.schemas.push(itemPath);
        if (lower.includes('service') && (ext === '.ts' || ext === '.js')) categories.services.push(itemPath);
        if (lower.includes('controller') && (ext === '.ts' || ext === '.js')) categories.controllers.push(itemPath);
        if (lower.includes('route') && (ext === '.ts' || ext === '.js')) categories.routes.push(itemPath);
        if (lower.includes('middleware') && (ext === '.ts' || ext === '.js')) categories.middleware.push(itemPath);
        if (lower.includes('util') && (ext === '.ts' || ext === '.js')) categories.utils.push(itemPath);
        if (lower.includes('helper') && (ext === '.ts' || ext === '.js')) categories.helpers.push(itemPath);
        if (lower.includes('config') && (ext === '.ts' || ext === '.js' || ext === '.json')) categories.config.push(itemPath);
        if (lower.includes('type') && ext === '.ts') categories.types.push(itemPath);
        if (lower.includes('interface') && ext === '.ts') categories.interfaces.push(itemPath);
        if (lower.includes('hook') && (ext === '.ts' || ext === '.js' || ext === '.tsx' || ext === '.jsx')) categories.hooks.push(itemPath);
        if (lower.includes('migration') && (ext === '.ts' || ext === '.js')) categories.migrations.push(itemPath);
        if (lower.includes('seed') && (ext === '.ts' || ext === '.js')) categories.seeds.push(itemPath);
        if (lower.includes('test') || lower.includes('spec')) categories.tests.push(itemPath);
        
        // Categorize by directory context
        if (currentPath.includes('component')) categories.components.push(itemPath);
        if (currentPath.includes('page')) categories.pages.push(itemPath);
        if (currentPath.includes('api')) categories.api.push(itemPath);
        if (currentPath.includes('lib')) categories.lib.push(itemPath);
        if (currentPath.includes('db') || currentPath.includes('database')) categories.database.push(itemPath);
        if (currentPath.includes('doc')) categories.docs.push(itemPath);
        
        // Special files
        if (key === 'package.json' || key === 'tsconfig.json' || key === 'go.mod' || 
            key === 'requirements.txt' || key === 'pom.xml' || key === 'Dockerfile' ||
            key === '.env.example' || key === 'README.md') {
          categories.config.push(itemPath);
        }
      } else if (item.type === 'directory' && item.children) {
        scan(item.children, itemPath);
      }
    }
  }
  
  scan(tree, basePath);
  
  // Remove duplicates and sort
  for (const key in categories) {
    categories[key] = [...new Set(categories[key])].sort();
  }
  
  return categories;
}

// Detect technologies from package.json
function detectTech() {
  const tech = {
    languages: new Set(),
    frameworks: [],
    database: null,
    packageManager: 'unknown',
    dependencies: { core: [], database: [], framework: [] }
  };
  
  try {
    const files = fs.readdirSync(W);
    
    // Package manager
    if (files.includes('yarn.lock')) tech.packageManager = 'yarn';
    else if (files.includes('pnpm-lock.yaml')) tech.packageManager = 'pnpm';
    else if (files.includes('package-lock.json')) tech.packageManager = 'npm';
    else if (files.includes('go.mod')) tech.packageManager = 'go modules';
    else if (files.includes('requirements.txt')) tech.packageManager = 'pip';
    else if (files.includes('pom.xml')) tech.packageManager = 'maven';
    
    // Languages and frameworks from package.json
    if (files.includes('package.json')) {
      tech.languages.add('JavaScript');
      const pkg = JSON.parse(fs.readFileSync(path.join(W, 'package.json'), 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      if (deps.typescript) tech.languages.add('TypeScript');
      
      // Frameworks
      if (deps.express) tech.frameworks.push({ name: 'Express', type: 'backend' });
      if (deps['@nestjs/core']) tech.frameworks.push({ name: 'NestJS', type: 'backend' });
      if (deps.fastify) tech.frameworks.push({ name: 'Fastify', type: 'backend' });
      if (deps.next) {
        const hasApi = fs.existsSync(path.join(W, 'app', 'api')) || fs.existsSync(path.join(W, 'pages', 'api'));
        tech.frameworks.push({ name: 'Next.js', type: hasApi ? 'fullstack' : 'frontend' });
      }
      if (deps.react && !deps.next) tech.frameworks.push({ name: 'React', type: 'frontend' });
      if (deps.vue) tech.frameworks.push({ name: 'Vue', type: 'frontend' });
      if (deps.svelte) tech.frameworks.push({ name: 'Svelte', type: 'frontend' });
      
      // Database
      if (deps.mongoose) {
        tech.database = { type: 'MongoDB', orm: 'Mongoose' };
        tech.dependencies.database.push('mongoose');
      } else if (deps.prisma || deps['@prisma/client']) {
        tech.database = { type: 'Unknown', orm: 'Prisma' };
        tech.dependencies.database.push('prisma');
      } else if (deps.typeorm) {
        tech.database = { type: 'Unknown', orm: 'TypeORM' };
        tech.dependencies.database.push('typeorm');
      } else if (deps.pg) {
        tech.database = { type: 'PostgreSQL', orm: 'none' };
        tech.dependencies.database.push('pg');
      } else if (deps.mongodb) {
        tech.database = { type: 'MongoDB', orm: 'none' };
        tech.dependencies.database.push('mongodb');
      }
      
      // Core dependencies
      ['express', 'mongoose', 'cors', 'dotenv', 'axios'].forEach(d => {
        if (deps[d]) tech.dependencies.core.push(d);
      });
      
      // Framework dependencies
      ['next', 'react', 'vue', 'svelte'].forEach(d => {
        if (deps[d]) tech.dependencies.framework.push(d);
      });
    }
    
    // Other languages
    if (files.includes('go.mod')) tech.languages.add('Go');
    if (files.includes('requirements.txt')) tech.languages.add('Python');
    if (files.includes('pom.xml')) tech.languages.add('Java');
    if (files.includes('Cargo.toml')) tech.languages.add('Rust');
    
  } catch (e) {}
  
  return {
    ...tech,
    languages: Array.from(tech.languages)
  };
}

// Main execution
try {
  const fileTree = buildFileTree(W);
  const categories = categorizeFiles(fileTree);
  const tech = detectTech();
  
  const understanding = {
    technologies: tech,
    fileTree: fileTree,
    fileMap: categories,
    summary: {
      totalModels: categories.models.length,
      totalServices: categories.services.length,
      totalControllers: categories.controllers.length,
      totalRoutes: categories.routes.length,
      totalComponents: categories.components.length,
      totalTests: categories.tests.length
    }
  };
  
  console.log(JSON.stringify(understanding));
} catch (e) {
  console.error(e);
  process.exit(1);
}
`;