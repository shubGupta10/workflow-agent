export interface CreateTaskRecordInput {
  repoUrl: string;
  action?: string;
  userInput?: string;
  userId: string;
  status?: string;
}

export interface RepoSummary {
  taskId: string;
  repoUrl: string;
  technologies: {
    languages: string[];
    frameworks: Array<{ name: string; type: 'backend' | 'frontend' | 'fullstack' }>;
    database: { type: string; orm: string } | null;
    packageManager: string;
    dependencies: {
      core: string[];
      database: string[];
      framework: string[];
    };
  };
  fileTree: any; // Complete nested file tree structure
  fileMap: {
    models: string[];
    schemas: string[];
    services: string[];
    controllers: string[];
    routes: string[];
    middleware: string[];
    utils: string[];
    helpers: string[];
    config: string[];
    types: string[];
    interfaces: string[];
    components: string[];
    pages: string[];
    api: string[];
    hooks: string[];
    lib: string[];
    database: string[];
    migrations: string[];
    seeds: string[];
    tests: string[];
    docs: string[];
  };
  summary: {
    totalModels: number;
    totalServices: number;
    totalControllers: number;
    totalRoutes: number;
    totalComponents: number;
    totalTests: number;
  };
  _cached?: boolean;
}