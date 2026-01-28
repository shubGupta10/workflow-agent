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
    frameworks: string[];
    styling: string[];
    uiLibraries: string[];
    stateManagement: string[];
    database: { type: string; orm: string } | null;
    packageManager: string;
    runtime: string;
  };
  fileTree: any; // Complete nested file tree structure
  fileMap: Record<string, string[]>;
  configContents: Record<string, string>;
  analysis: {
    dependencies: Record<string, string[]>;
    fileInfo: Record<string, {
      exports: string[];
      snippet?: string;
    }>;
  };
  summary: {
    totalModels: number;
    totalServices: number;
    totalComponents: number;
    totalHooks: number;
    totalPages: number;
    totalFiles: number;
  };
  _cached?: boolean;
}