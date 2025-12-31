import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TaskScheduleSchema } from "../schemas/taskScheduleSchema";
import agent from "../api/agent";
import type { TaskSchedule } from "../types/TaskSchedulePayload";

export const useTaskSchedules = (taskId?: number) => {
    const queryClient = useQueryClient();

    const { data: taskSchedule, isLoading: taskScheduleLoading } = useQuery({
        queryKey: ['taskSchedule', taskId],
        queryFn: async () => {
            const response = await agent.get<TaskSchedule>(`/taskschedules?taskId=${taskId}`);
            return response.data;
        },
        enabled: !!taskId
    });
    
    const saveTaskSchedules = useMutation({
        mutationFn: async (taskSchedule: TaskScheduleSchema) => {
            const response = await agent.post('/taskschedules', taskSchedule);
            return response.data;
        },
        onSuccess: async (_data, variables) => {
            const id = variables?.taskId ?? taskId;
            if (!id) return;
            await queryClient.invalidateQueries({
                queryKey: ['taskSchedule', id]
            });
        }
    });

    const deleteTaskSchedule = useMutation({
        mutationFn: async (id: number) => {
            const response = await agent.delete(`/taskschedules?taskId=${id}`);
            return response.data;
        },
        onSuccess: async (_data, variables) => {
            const id = variables ?? taskId;
            if (!id) return;
            await queryClient.invalidateQueries({
                queryKey: ['taskSchedule', id]
            });
        }
    });

    return {
        taskSchedule,
        taskScheduleLoading,
        saveTaskSchedules,
        deleteTaskSchedule
    }
}