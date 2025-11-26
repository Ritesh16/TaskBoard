import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import agent from "../api/agent";
import type { Task } from "../types/Task";
import type { AddTaskTitleSchema } from "../schemas/addTaskTitleSchema";

export const useTasks = (taskId?: number) => {
    const queryClient = useQueryClient();
    
    const {data: userTasks = [], isLoading: userTasksLoading} = useQuery({
        queryKey: ['tasks'],
        queryFn: async() => {
            const response = await agent.get<Task[]>('/tasks');
            return response.data;
        }
    });

    const {data: userTask, isLoading: userTaskLoading} = useQuery({
        queryKey: ['tasks', taskId],
        queryFn: async() => {
            const response = await agent.get<Task>(`/tasks/${taskId}`);
            return response.data;
        },
        enabled: !!taskId
    });

    const saveTaskTitle = useMutation({
        mutationFn: async (addTaskTitle: AddTaskTitleSchema) => {
            const response = await agent.post('/tasks', addTaskTitle);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['tasks']
            });
        }
    });

    return {
        userTasks,
        userTasksLoading,
        saveTaskTitle,
        userTask,
        userTaskLoading
    }
}