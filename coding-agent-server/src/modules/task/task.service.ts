import { TaskStatus } from '../../constants/enum';
import { Task } from './task.model';
import { CreateTaskRecordInput } from './task.types';
import { createTaskRecord, saveRepoSummary, understandRepo, updateTaskStatus } from './task.utils';


export async function createTask(input: CreateTaskRecordInput) {
    const { repoUrl, userId } = input;

    //create task
    const task = await createTaskRecord({
        repoUrl,
        status: TaskStatus.CREATED,
        userId
    })


    //move to repo understanding
    await updateTaskStatus(task._id.toString(), TaskStatus.UNDERSTANDING_REPO);

    //understand repo
    const repoSummary = await understandRepo(repoUrl, task._id.toString());

    //persist understanding
    await saveRepoSummary(task._id.toString(), repoSummary);

    //ready for user action
    await updateTaskStatus(task._id.toString(), TaskStatus.AWAITING_ACTION);

    return task._id.toString();
}