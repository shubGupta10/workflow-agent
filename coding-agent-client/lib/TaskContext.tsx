"use client";

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from "react";
import { Session, Message, TaskStatus, generateId } from "./types";

// State shape
interface TaskState {
    sessions: Session[];
    activeSessionId: string | null;
}

// Action types
type TaskAction =
    | { type: "CREATE_SESSION"; payload: Session }
    | { type: "SET_ACTIVE_SESSION"; payload: string }
    | { type: "ADD_MESSAGE"; payload: { sessionId: string; message: Message } }
    | { type: "UPDATE_SESSION_STATUS"; payload: { sessionId: string; status: TaskStatus } }
    | { type: "UPDATE_SESSION"; payload: { sessionId: string; updates: Partial<Session> } }
    | { type: "REMOVE_LAST_MESSAGE"; payload: { sessionId: string } };

// Context shape
interface TaskContextType {
    state: TaskState;
    createSession: () => string;
    setActiveSession: (sessionId: string) => void;
    addMessage: (sessionId: string, message: Omit<Message, "id" | "timestamp">) => void;
    updateSessionStatus: (sessionId: string, status: TaskStatus) => void;
    updateSession: (sessionId: string, updates: Partial<Session>) => void;
    getActiveSession: () => Session | undefined;
    removeLastMessage: (sessionId: string) => void;
}

// Reducer
function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case "CREATE_SESSION":
            return {
                ...state,
                sessions: [...state.sessions, action.payload],
                activeSessionId: action.payload.id,
            };
        case "SET_ACTIVE_SESSION":
            return {
                ...state,
                activeSessionId: action.payload,
            };
        case "ADD_MESSAGE":
            return {
                ...state,
                sessions: state.sessions.map((session) =>
                    session.id === action.payload.sessionId
                        ? { ...session, messages: [...session.messages, action.payload.message] }
                        : session
                ),
            };
        case "UPDATE_SESSION_STATUS":
            return {
                ...state,
                sessions: state.sessions.map((session) =>
                    session.id === action.payload.sessionId
                        ? { ...session, status: action.payload.status }
                        : session
                ),
            };
        case "UPDATE_SESSION":
            return {
                ...state,
                sessions: state.sessions.map((session) =>
                    session.id === action.payload.sessionId
                        ? { ...session, ...action.payload.updates }
                        : session
                ),
            };
        case "REMOVE_LAST_MESSAGE":
            return {
                ...state,
                sessions: state.sessions.map((session) =>
                    session.id === action.payload.sessionId
                        ? { ...session, messages: session.messages.slice(0, -1) }
                        : session
                ),
            };
        default:
            return state;
    }
}

// Initial state with a default session
const initialState: TaskState = {
    sessions: [],
    activeSessionId: null,
};

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Provider component
export function TaskProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(taskReducer, initialState);

    const createSession = useCallback((): string => {
        const id = generateId();
        const session: Session = {
            id,
            title: "New Task",
            status: "AWAITING_REPO",
            messages: [],
            createdAt: new Date(),
        };
        dispatch({ type: "CREATE_SESSION", payload: session });
        return id;
    }, []);

    const setActiveSession = useCallback((sessionId: string) => {
        dispatch({ type: "SET_ACTIVE_SESSION", payload: sessionId });
    }, []);

    const addMessage = useCallback(
        (sessionId: string, message: Omit<Message, "id" | "timestamp">) => {
            const fullMessage: Message = {
                ...message,
                id: generateId(),
                timestamp: new Date(),
            };
            dispatch({ type: "ADD_MESSAGE", payload: { sessionId, message: fullMessage } });
        },
        []
    );

    const updateSessionStatus = useCallback((sessionId: string, status: TaskStatus) => {
        dispatch({ type: "UPDATE_SESSION_STATUS", payload: { sessionId, status } });
    }, []);

    const updateSession = useCallback((sessionId: string, updates: Partial<Session>) => {
        dispatch({ type: "UPDATE_SESSION", payload: { sessionId, updates } });
    }, []);

    const getActiveSession = useCallback(() => {
        return state.sessions.find((s) => s.id === state.activeSessionId);
    }, [state.sessions, state.activeSessionId]);

    const removeLastMessage = useCallback((sessionId: string) => {
        dispatch({ type: "REMOVE_LAST_MESSAGE", payload: { sessionId } });
    }, []);

    return (
        <TaskContext.Provider
            value={{
                state,
                createSession,
                setActiveSession,
                addMessage,
                updateSessionStatus,
                updateSession,
                getActiveSession,
                removeLastMessage,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

// Hook to use task context
export function useTask() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error("useTask must be used within a TaskProvider");
    }
    return context;
}
