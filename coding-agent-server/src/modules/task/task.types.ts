import { ITask } from './task.model';
import { TaskStatus } from '../../constants/enum';


export interface CreateTaskRecordInput {
    repoUrl: string;
    status: TaskStatus,
    userId?: string
}

export interface createTaskRecord {
    (input: CreateTaskRecordInput): Promise<ITask | null>;
}

export interface RepoSummary {
  taskId: string;
  repoUrl: string;
  languages: string[];
  framework: string | null;
  configFiles: string[];
  packageManager: string;
  folderStructure: string[];
  entryPoints: string[];
}