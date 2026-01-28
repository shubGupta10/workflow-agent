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
  const fetchSessions = useTaskStore((state) => state.fetchSessions);
  const removeSessionByTaskId = useTaskStore((state) => state.removeSessionByTaskId);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    fetchSessions();
  }, [fetchSessions]);

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


