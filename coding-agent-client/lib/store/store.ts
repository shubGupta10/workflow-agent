import { create } from 'zustand';
import { Session, TaskStatus, ActionType, Message, generateId } from '@/lib/types';

interface TaskStore {
    sessions: Session[];
    activeSessionId: string | null;
    currentTaskId: string | null;

    createSession: () => string;
    setSessions: (sessions: Session[]) => void;
    setActiveSession: (sessionId: string) => void;
    addMessage: (sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
    updateSessionStatus: (sessionId: string, status: TaskStatus) => void;
    updateSession: (sessionId: string, updates: Partial<Session>) => void;
    getActiveSession: () => Session | undefined;
    removeLastMessage: (sessionId: string) => void;
    setCurrentTaskId: (taskId: string | null) => void;
    removeSessionByTaskId: (taskId: string) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    sessions: [],
    activeSessionId: null,
    currentTaskId: null,

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
            sessions: [...state.sessions, session],
            activeSessionId: id,
        }));
        return id;
    },

    setSessions: (sessions: Session[]) => {
        set((state) => {
            if (sessions.length === 0) {
                return state;
            }

            const existingById = new Map(state.sessions.map((session) => [session.id, session]));

            const merged = [
                ...state.sessions,
                ...sessions.filter((session) => !existingById.has(session.id)),
            ];

            const activeSessionId =
                state.activeSessionId !== null ? state.activeSessionId : merged[0]?.id ?? null;

            return {
                sessions: merged,
                activeSessionId,
            };
        });
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
}));
