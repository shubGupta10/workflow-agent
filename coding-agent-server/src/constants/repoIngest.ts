import { exec } from 'child_process';
import { promisify } from 'util';

export const execAsync = promisify(exec);


// Script injected into the container to analyze the filesystem
export const INTERNAL_ANALYSIS_SCRIPT = `
const fs = require('fs');
const path = require('path');
const WORK_DIR = '/app';

// Helper: Get nested folder structure (2 levels deep)
function getNestedStructure(dir, depth = 2, currentDepth = 0) {
  if (currentDepth >= depth) return [];
  
  try {
    const items = fs.readdirSync(dir);
    const result = {};
    
    for (const item of items) {
      // Skip common ignore patterns
      if (['node_modules', '.git', 'dist', 'build', '.next', 'coverage'].includes(item)) continue;
      
      const fullPath = path.join(dir, item);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          const children = getNestedStructure(fullPath, depth, currentDepth + 1);
          if (children.length > 0 || currentDepth < depth - 1) {
            result[item] = children;
          }
        }
      } catch (e) {
        // Skip inaccessible directories
      }
    }
    
    return Object.keys(result).length > 0 ? result : Object.keys(result);
  } catch (e) {
    return [];
  }
}

// Helper: Detect file patterns
function detectPatterns(dir) {
  const patterns = { models: [], services: [], controllers: [], routes: [] };
  
  function scan(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      for (const item of items) {
        if (['node_modules', '.git', 'dist', 'build'].includes(item)) continue;
        
        const fullPath = path.join(currentDir, item);
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            scan(fullPath);
          } else if (stat.isFile()) {
            const relativePath = fullPath.replace(WORK_DIR + '/', '');
            if (item.endsWith('.model.ts') || item.endsWith('.model.js')) patterns.models.push(relativePath);
            if (item.endsWith('.service.ts') || item.endsWith('.service.js')) patterns.services.push(relativePath);
            if (item.endsWith('.controller.ts') || item.endsWith('.controller.js')) patterns.controllers.push(relativePath);
            if (item.endsWith('.router.ts') || item.endsWith('.router.js') || item.endsWith('.routes.ts')) patterns.routes.push(relativePath);
          }
        } catch (e) {}
      }
    } catch (e) {}
  }
  
  scan(dir);
  return patterns;
}

try {
  const files = fs.readdirSync(WORK_DIR);
  
  // 1. Configs
  const configFiles = files.filter(f => 
    ['tsconfig.json', 'package.json', 'go.mod', 'requirements.txt', 'pom.xml', 'Dockerfile', '.eslintrc'].includes(f)
  );

  // 2. Top-level folders
  const topLevelFolders = files.filter(f => {
    try { return fs.statSync(path.join(WORK_DIR, f)).isDirectory() && f !== '.git'; } catch { return false; }
  });

  // 3. Nested folder structure (2 levels deep)
  const folderStructure = getNestedStructure(WORK_DIR, 2);

  // 4. Package Manager
  let packageManager = 'unknown';
  if (files.includes('yarn.lock')) packageManager = 'yarn';
  else if (files.includes('pnpm-lock.yaml')) packageManager = 'pnpm';
  else if (files.includes('package-lock.json')) packageManager = 'npm';
  else if (files.includes('go.mod')) packageManager = 'go modules';
  else if (files.includes('requirements.txt')) packageManager = 'pip';

  // 5. Languages, Frameworks, Database, Dependencies
  const languages = new Set();
  const frameworks = [];
  let database = null;
  const dependencies = { core: [], database: [], framework: [] };
  
  // JavaScript/TypeScript/Node.js projects
  if (files.includes('package.json')) {
    languages.add('JavaScript');
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(WORK_DIR, 'package.json'), 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      // Detect TypeScript
      if (deps['typescript']) languages.add('TypeScript');
      
      // Detect backend frameworks
      if (deps['express']) frameworks.push({ name: 'Express', type: 'backend' });
      if (deps['@nestjs/core']) frameworks.push({ name: 'NestJS', type: 'backend' });
      if (deps['fastify']) frameworks.push({ name: 'Fastify', type: 'backend' });
      if (deps['koa']) frameworks.push({ name: 'Koa', type: 'backend' });
      
      // Detect frontend frameworks
      // Check if Next.js has API routes (full-stack) or is client-only
      if (deps['next']) {
        // Check for app/api or pages/api directories to determine if full-stack
        const hasAppApi = fs.existsSync(path.join(WORK_DIR, 'app', 'api')) || 
                          fs.existsSync(path.join(WORK_DIR, 'pages', 'api'));
        
        if (hasAppApi) {
          frameworks.push({ name: 'Next.js', type: 'fullstack' });
        } else {
          frameworks.push({ name: 'Next.js', type: 'frontend' });
        }
      }
      
      if (deps['react'] && !deps['next']) frameworks.push({ name: 'React', type: 'frontend' });
      if (deps['vue']) frameworks.push({ name: 'Vue', type: 'frontend' });
      if (deps['@angular/core']) frameworks.push({ name: 'Angular', type: 'frontend' });
      if (deps['svelte']) frameworks.push({ name: 'Svelte', type: 'frontend' });
      
      // Detect database and ORM (priority order: specific ORM first, then drivers)
      if (deps['mongoose']) {
        database = { type: 'MongoDB', orm: 'Mongoose' };
        dependencies.database.push('mongoose');
      } else if (deps['prisma'] || deps['@prisma/client']) {
        database = { type: 'Unknown', orm: 'Prisma' };
        dependencies.database.push('prisma');
      } else if (deps['typeorm']) {
        database = { type: 'Unknown', orm: 'TypeORM' };
        dependencies.database.push('typeorm');
      } else if (deps['sequelize']) {
        database = { type: 'Unknown', orm: 'Sequelize' };
        dependencies.database.push('sequelize');
      } else if (deps['drizzle-orm']) {
        database = { type: 'Unknown', orm: 'Drizzle' };
        dependencies.database.push('drizzle-orm');
      } else if (deps['pg']) {
        database = { type: 'PostgreSQL', orm: 'none' };
        dependencies.database.push('pg');
      } else if (deps['mysql'] || deps['mysql2']) {
        database = { type: 'MySQL', orm: 'none' };
        dependencies.database.push('mysql');
      } else if (deps['mongodb']) {
        database = { type: 'MongoDB', orm: 'none' };
        dependencies.database.push('mongodb');
      } else if (deps['sqlite3'] || deps['better-sqlite3']) {
        database = { type: 'SQLite', orm: 'none' };
        dependencies.database.push('sqlite3');
      }
      
      // Extract core dependencies
      const coreDeps = ['express', 'mongoose', 'axios', 'dotenv', 'cors', 'jsonwebtoken', 'bcrypt', 'joi', 'zod'];
      for (const dep of coreDeps) {
        if (deps[dep]) dependencies.core.push(dep);
      }
      
      // Extract framework dependencies
      const frameworkDeps = ['next', 'react', 'vue', '@nestjs/core', 'fastify', '@angular/core', 'svelte'];
      for (const dep of frameworkDeps) {
        if (deps[dep]) dependencies.framework.push(dep);
      }
      
    } catch (e) {
      // Failed to parse package.json, continue with other detections
    }
  }
  
  // Go projects
  if (files.includes('go.mod')) {
    languages.add('Go');
    try {
      const goMod = fs.readFileSync(path.join(WORK_DIR, 'go.mod'), 'utf8');
      // Detect popular Go frameworks
      if (goMod.includes('gin-gonic/gin')) frameworks.push({ name: 'Gin', type: 'backend' });
      if (goMod.includes('gofiber/fiber')) frameworks.push({ name: 'Fiber', type: 'backend' });
      if (goMod.includes('labstack/echo')) frameworks.push({ name: 'Echo', type: 'backend' });
      if (goMod.includes('gorilla/mux')) frameworks.push({ name: 'Gorilla Mux', type: 'backend' });
      
      // Detect Go database drivers
      if (goMod.includes('go.mongodb.org/mongo-driver')) {
        database = { type: 'MongoDB', orm: 'none' };
        dependencies.database.push('mongo-driver');
      } else if (goMod.includes('lib/pq')) {
        database = { type: 'PostgreSQL', orm: 'none' };
        dependencies.database.push('pq');
      } else if (goMod.includes('gorm.io/gorm')) {
        database = { type: 'Unknown', orm: 'GORM' };
        dependencies.database.push('gorm');
      }
    } catch (e) {}
  }
  
  // Python projects
  if (files.includes('requirements.txt')) {
    languages.add('Python');
    try {
      const requirements = fs.readFileSync(path.join(WORK_DIR, 'requirements.txt'), 'utf8');
      // Detect Python frameworks
      if (requirements.includes('django')) frameworks.push({ name: 'Django', type: 'backend' });
      if (requirements.includes('flask')) frameworks.push({ name: 'Flask', type: 'backend' });
      if (requirements.includes('fastapi')) frameworks.push({ name: 'FastAPI', type: 'backend' });
      
      // Detect Python database libraries
      if (requirements.includes('pymongo')) {
        database = { type: 'MongoDB', orm: 'none' };
        dependencies.database.push('pymongo');
      } else if (requirements.includes('psycopg2')) {
        database = { type: 'PostgreSQL', orm: 'none' };
        dependencies.database.push('psycopg2');
      } else if (requirements.includes('sqlalchemy')) {
        database = { type: 'Unknown', orm: 'SQLAlchemy' };
        dependencies.database.push('sqlalchemy');
      }
    } catch (e) {}
  }
  
  // Java projects
  if (files.includes('pom.xml')) {
    languages.add('Java');
    try {
      const pom = fs.readFileSync(path.join(WORK_DIR, 'pom.xml'), 'utf8');
      // Detect Java frameworks
      if (pom.includes('spring-boot')) frameworks.push({ name: 'Spring Boot', type: 'backend' });
      if (pom.includes('quarkus')) frameworks.push({ name: 'Quarkus', type: 'backend' });
      
      // Detect Java database libraries
      if (pom.includes('mongodb-driver')) {
        database = { type: 'MongoDB', orm: 'none' };
      } else if (pom.includes('hibernate')) {
        database = { type: 'Unknown', orm: 'Hibernate' };
      }
    } catch (e) {}
  }

  // 6. Entry Points
  const entryPoints = files.filter(f => 
    ['index.js', 'index.ts', 'main.go', 'app.py', 'server.js', 'src/index.js'].includes(f)
  );

  // 7. Detect code patterns
  const patterns = detectPatterns(WORK_DIR);

  // Output comprehensive analysis
  console.log(JSON.stringify({ 
    languages: Array.from(languages), 
    frameworks,
    database,
    configFiles, 
    packageManager, 
    folderStructure,
    entryPoints,
    dependencies,
    patterns
  }));
} catch (err) {
  process.exit(1);
}
`;