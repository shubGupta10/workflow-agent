import { ITask } from './task.model';
import { TaskStatus } from '../../constants/enum';


export interface CreateTaskRecordInput {
  repoUrl: string;
  status?: TaskStatus,
  userId?: string
}

export interface createTaskRecord {
  (input: CreateTaskRecordInput): Promise<ITask | null>;
}

export interface RepoSummary {
  taskId: string;
  repoUrl: string;
  languages: string[];
  frameworks: Array<{ name: string; type: 'backend' | 'frontend' | 'fullstack' }>;
  database: { type: string; orm: string } | null;
  configFiles: string[];
  packageManager: string;
  folderStructure: { [key: string]: any };
  entryPoints: string[];
  dependencies: {
    core: string[];
    database: string[];
    framework: string[];
  };
  patterns: {
    models: string[];
    services: string[];
    controllers: string[];
    routes: string[];
  };
}