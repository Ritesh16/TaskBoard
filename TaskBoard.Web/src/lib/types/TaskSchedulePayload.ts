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