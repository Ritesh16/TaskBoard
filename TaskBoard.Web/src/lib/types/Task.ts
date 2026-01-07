import type { TaskSchedulePayload } from "./TaskSchedulePayload";

export interface Task {
    taskId: number;
    userId: number;
    title: string;
    categoryName: string;
    date?: Date;
    details?: string;
    categoryId: number;
    schedule: TaskSchedulePayload;
}