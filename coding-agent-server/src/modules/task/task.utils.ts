import prisma from "../../lib/prisma";
import { CreateTaskRecordInput } from "./task.types";

export function createTaskRecord(taskData: CreateTaskRecordInput) {
    const {repoUrl, status, userId} = taskData;

    if(!repoUrl || !status){
        throw new Error("Missing required fields to create a task record");
    }

    // const newTask = prisma.task.create({
    //     data: {
    //         repoUrl,
    //         status,
    //         userId
    //     }
    // })

    // return newTask;
}