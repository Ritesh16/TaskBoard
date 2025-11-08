import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { RegisterSchema } from "../schemas/registerSchema";
import agent from "../api/agent";
import { useNavigate } from "react-router";

export const useAccount = () => {
    const queryClient = useQueryClient();
     const navigate = useNavigate();

    const registerUser = useMutation({
        mutationFn: async (user: RegisterSchema) => {
            await agent.post('/account/register', user);
        },
        onSuccess: async () => {
            navigate('/login');
        }
    });

    return {
        registerUser
    }
}