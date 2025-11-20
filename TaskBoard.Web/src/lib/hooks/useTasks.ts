import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import agent from "../api/agent";
import type { Task } from "../types/Task";
import type { AddTaskTitleSchema } from "../schemas/addTaskTitleSchema";

export const useTasks = () => {
    const queryClient = useQueryClient();
    
    const {data: userTasks = [], isLoading: userTasksLoading} = useQuery({
        queryKey: ['tasks'],
        queryFn: async() => {
            const response = await agent.get<Task[]>('/tasks');
            return response.data;
        }
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
        saveTaskTitle
    }
}