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