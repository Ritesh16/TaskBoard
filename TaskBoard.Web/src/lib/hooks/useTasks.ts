import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import agent from "../api/agent";
import type { Task } from "../types/Task";
import { useToast } from "../../app/shared/components/toast/useToast";
import type { AddTaskTitleSchema } from "../schemas/addTaskTitleSchema";

export const useTasks = () => {
    const toast = useToast();
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
            toast.success('Task added successfully.');
        }
    });

    return {
        userTasks,
        userTasksLoading,
        saveTaskTitle
    }
}