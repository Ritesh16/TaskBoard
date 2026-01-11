import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import type { Category } from "../types/Category";
import type { AddCategorySchema } from "../schemas/addCategorySchema";

export const useCategory = () => {
    const queryClient = useQueryClient();
    
    const {data: userCategories = [], isLoading: userCategoriesLoading} = useQuery({
        queryKey: ['categories'],
        queryFn: async() => {
            const response = await agent.get<Category[]>('/categories');
            return response.data;
        }
    });

    const saveCategory = useMutation({
        mutationFn: async (addCategory: AddCategorySchema) => {
            const response = await agent.post('/categories', addCategory);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['categories']
            });
        }
    });

    return {
        userCategories,
        userCategoriesLoading,
        saveCategory
    };
}