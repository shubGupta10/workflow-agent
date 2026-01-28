import { create } from 'zustand';
import { Session, TaskStatus, ActionType, Message, generateId, TaskDetails } from '@/lib/types';
import { getSidebarTasks } from '@/lib/api';

interface TaskStore {
    sessions: Session[];
    activeSessionId: string | null;
    currentTaskId: string | null;
    taskDetailsCache: Record<string, TaskDetails>;

    isLoadingTasks: boolean;
    createSession: () => string;
    setSessions: (sessions: Session[]) => void;
    fetchSessions: () => Promise<void>;
    setActiveSession: (sessionId: string) => void;
    addMessage: (sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
    updateSessionStatus: (sessionId: string, status: TaskStatus) => void;
    updateSession: (sessionId: string, updates: Partial<Session>) => void;
    getActiveSession: () => Session | undefined;
    removeLastMessage: (sessionId: string) => void;
    setCurrentTaskId: (taskId: string | null) => void;
    removeSessionByTaskId: (taskId: string) => void;
    setTaskDetails: (taskId: string, details: TaskDetails) => void;
    getTaskDetails: (taskId: string) => TaskDetails | undefined;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    sessions: [],
    activeSessionId: null,
    currentTaskId: null,
    taskDetailsCache: {},
    isLoadingTasks: false,

    createSession: () => {
        const id = generateId();
        const session: Session = {
            id,
            title: 'New Task',
            status: 'AWAITING_REPO',
            messages: [],
            createdAt: new Date(),
        };
        set((state) => ({
            sessions: [session, ...state.sessions],
            activeSessionId: id,
        }));
        return id;
    },

    setSessions: (sessions: Session[]) => {
        set((state) => {
            if (sessions.length === 0) {
                return { ...state, sessions: [] };
            }

            const existingById = new Map(state.sessions.map((session) => [session.id, session]));

            const merged = [
                ...state.sessions.filter(s => existingById.has(s.id)), // Keep existing ones that are still relevant
                ...sessions.filter((session) => !existingById.has(session.id)),
            ];

            // Filter out exact duplicates if any and sort by createdAt
            const unique = Array.from(new Map(merged.map(s => [s.id, s])).values())
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            const activeSessionId =
                state.activeSessionId !== null ? state.activeSessionId : unique[0]?.id ?? null;

            return {
                sessions: unique,
                activeSessionId,
            };
        });
    },

    fetchSessions: async () => {
        const { setSessions } = get();
        set({ isLoadingTasks: true });
        try {
            const response = await getSidebarTasks();
            const tasks = response?.data ?? [];

            const sessions: Session[] = tasks.map((task: any) => {
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

            setSessions(sessions);
        } catch (error) {
            console.error("[TaskStore] Failed to fetch sessions:", error);
        } finally {
            set({ isLoadingTasks: false });
        }
    },

    setActiveSession: (sessionId: string) => {
        set({ activeSessionId: sessionId });
    },

    addMessage: (sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
        const fullMessage: Message = {
            ...message,
            id: generateId(),
            timestamp: new Date(),
        };
        set((state) => ({
            sessions: state.sessions.map((session) =>
                session.id === sessionId
                    ? { ...session, messages: [...session.messages, fullMessage] }
                    : session
            ),
        }));
    },

    updateSessionStatus: (sessionId: string, status: TaskStatus) => {
        set((state) => ({
            sessions: state.sessions.map((session) =>
                session.id === sessionId ? { ...session, status } : session
            ),
        }));
    },

    updateSession: (sessionId: string, updates: Partial<Session>) => {
        set((state) => ({
            sessions: state.sessions.map((session) =>
                session.id === sessionId ? { ...session, ...updates } : session
            ),
        }));
    },

    getActiveSession: () => {
        const state = get();
        return state.sessions.find((s) => s.id === state.activeSessionId);
    },

    removeLastMessage: (sessionId: string) => {
        set((state) => ({
            sessions: state.sessions.map((session) =>
                session.id === sessionId
                    ? { ...session, messages: session.messages.slice(0, -1) }
                    : session
            ),
        }));
    },

    setCurrentTaskId: (taskId: string | null) => {
        console.log('[Zustand] Setting currentTaskId:', taskId);
        set({ currentTaskId: taskId });
    },

    removeSessionByTaskId: (taskId: string) => {
        set((state) => {
            const remaining = state.sessions.filter((session) => session.taskId !== taskId);
            let activeSessionId = state.activeSessionId;

            const removedActive = state.sessions.find(
                (session) => session.taskId === taskId && session.id === state.activeSessionId
            );

            if (removedActive) {
                activeSessionId = remaining[0]?.id ?? null;
            }

            return {
                sessions: remaining,
                activeSessionId,
            };
        });
    },

    setTaskDetails: (taskId: string, details: TaskDetails) => {
        set((state) => ({
            taskDetailsCache: {
                ...state.taskDetailsCache,
                [taskId]: details,
            },
        }));
    },

    getTaskDetails: (taskId: string) => {
        const state = get();
        return state.taskDetailsCache[taskId];
    },
}));
