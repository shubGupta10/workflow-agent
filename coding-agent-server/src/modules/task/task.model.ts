import mongoose, { Schema, Document } from 'mongoose';
import { TimelineEnum } from './task.enum';

export enum TaskStatus {
  CREATED = 'CREATED',
  UNDERSTANDING_REPO = 'UNDERSTANDING_REPO',
  AWAITING_ACTION = 'AWAITING_ACTION',
  PLANNING = 'PLANNING',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  EXECUTING = 'EXECUTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum TaskAction {
  REVIEW_PR = 'REVIEW_PR',
  FIX_ISSUE = 'FIX_ISSUE',
  PLAN_CHANGE = 'PLAN_CHANGE',
  FREE_FORM = 'FREE_FORM',
}

export interface ITask extends Document {
  repoUrl: string;
  repoBranch?: string;
  status: TaskStatus;
  action?: TaskAction;
  userInput?: Record<string, unknown>;
  repoSummary?: Record<string, unknown>;
  plan?: string | Record<string, unknown>;
  planVersion: number;
  approvedAt?: Date;
  approvedBy?: string;
  executionLog?: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
  userId?: string;
  llmUsage?: {
    purpose: string;
    model: string;
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    createdAt: Date;
  },
  timeline: Array<{
    role: 'system' | 'user' | 'agent';
    type: string;
    content: string;
    createdAt: Date;
  }>,
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    repoUrl: {
      type: String,
      required: true,
    },
    repoBranch: String,
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.CREATED,
      required: true,
    },
    action: {
      type: String,
      enum: Object.values(TaskAction),
    },
    userInput: Schema.Types.Mixed,
    repoSummary: Schema.Types.Mixed,
    plan: Schema.Types.Mixed,
    planVersion: {
      type: Number,
      default: 1,
    },
    approvedAt: Date,
    approvedBy: String,
    executionLog: Schema.Types.Mixed,
    result: Schema.Types.Mixed,
    error: {
      type: String,
      required: false,
    },
    userId: String,
    llmUsage: {
      purpose: { type: String },
      model: { type: String },
      inputTokens: { type: Number },
      outputTokens: { type: Number },
      totalTokens: { type: Number },
      createdAt: { type: Date, default: Date.now },
    },
    timeline: [{
      role: { type: String, enum: Object.values(TimelineEnum), required: true },
      type: { type: String, required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }
    ]
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model<ITask>('Task', taskSchema);
