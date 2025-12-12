export interface TaskSchedulePayload {
    taskId?: number;
    startDate: string | null;
    oneTimeOption: string | null;
    repeat: string;
    customRepeat: string;
    customUnit: string;
    selectedDays: number[];
    endType: string;
    endDate: string | null;
    endAfter: string | null;
}

export interface TaskSchedule {
    taskId : number;
    taskScheduleId: number;
    frequency: string;
    interval?: string;
    daysOfWeek?: number[];
    startDate?: Date;
    endDate?: Date;
    stopAfter?: number;
    isDeleted: boolean;
    oneTimeOption: string;
}