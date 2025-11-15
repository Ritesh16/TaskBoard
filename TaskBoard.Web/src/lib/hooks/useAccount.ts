import { useMutation } from "@tanstack/react-query"
import type { RegisterSchema } from "../schemas/registerSchema";
import agent from "../api/agent";
import { useNavigate } from "react-router";
import { useToast } from "../../app/shared/components/toast/useToast";
import type { LoginSchema } from "../schemas/loginSchema";
import { useAuth } from "../context/AuthContext";

export const useAccount = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { login } = useAuth();
   
    const registerUser = useMutation({
        mutationFn: async (user: RegisterSchema) => {
            await agent.post('/account/register', user);
        },
        onSuccess: async () => {
            toast.success("Register has been successful.");
            navigate('/login');
        },
        onError: (error) => {
            toast.error(`Some error has occurred. ${error.message}`);
        }
    });

    const loginUser = useMutation({
        mutationFn: async (login: LoginSchema) => {
            const response = await agent.post('/account/login', login);
            return response.data;
        },
        onSuccess: (data) => {
            login(data.token);
            navigate('/home');
        }
    });

    return {
        registerUser,
        loginUser
    }
}