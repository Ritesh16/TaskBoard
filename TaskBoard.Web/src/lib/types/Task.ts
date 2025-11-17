export interface Task {
    taskId: number;
    userId: number;
    title: string;
    categoryName: string;
    date?: Date;
}