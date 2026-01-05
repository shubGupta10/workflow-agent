"use client";

import { useEffect, useRef } from "react";
import { useTaskStore } from "@/lib/store/store";
import { getSidebarTasks, deleteTask as deleteTaskApi } from "@/lib/api";
import type { ActionType, Session, TaskStatus } from "@/lib/types";

interface BackendSidebarTask {
  taskId: string;
  userId: string;
  repoUrl: string;
  status: TaskStatus;
  action?: ActionType;
  createdAt: string;
  updatedAt: string;
}

export function useSidebarTasks() {
  const setSessions = useTaskStore((state) => state.setSessions);
  const removeSessionByTaskId = useTaskStore((state) => state.removeSessionByTaskId);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const hydrate = async () => {
      try {
        const response = await getSidebarTasks();
        const tasks = (response?.data ?? []) as BackendSidebarTask[];

        const sessions: Session[] = tasks.map((task) => {
          const repoName = task.repoUrl.split("/").filter(Boolean).slice(-1)[0] ?? "Task";

          return {
            id: task.taskId,
            taskId: task.taskId,
            title: repoName,
            status: task.status,
            messages: [],
            createdAt: new Date(task.createdAt),
            selectedAction: task.action,
          };
        });

        if (sessions.length > 0) {
          setSessions(sessions);
        }
      } catch (error) {
        console.error("[Sidebar] Failed to hydrate tasks from backend:", error);
      }
    };

    hydrate();
  }, [setSessions]);

  const deleteTask = async (taskId: string) => {
    try {
      await deleteTaskApi(taskId);
      removeSessionByTaskId(taskId);
    } catch (error) {
      console.error("[Sidebar] Failed to delete task:", error);
      throw error;
    }
  };

  return { deleteTask };
}


