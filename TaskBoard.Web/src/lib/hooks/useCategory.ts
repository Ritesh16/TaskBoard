import { useQuery } from "@tanstack/react-query";
import agent from "../api/agent";
import type { Category } from "../types/Category";

export const useCategory = () => {

     const {data: userCategories = [], isLoading: userCategoriesLoading} = useQuery({
        queryKey: ['categories'],
        queryFn: async() => {
            const response = await agent.get<Category[]>('/categories');
            return response.data;
        }
    });

    return {
        userCategories,
        userCategoriesLoading
    };
}