import type { Task } from "./Task";

export interface Category {
    categoryId: number;
    userId: number;
    name: string;
    description: string;
    isActive: boolean;
    tasks: Task[]
}