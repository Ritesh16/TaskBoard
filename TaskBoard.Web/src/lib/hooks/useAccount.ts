import { useMutation } from "@tanstack/react-query"
import type { RegisterSchema } from "../schemas/registerSchema";
import agent from "../api/agent";
import { useNavigate } from "react-router";
import { useToast } from "../../app/shared/components/toast/useToast";
// import { useToast } from "../ui/toast";
import  "../context/toastContext";
import "../types/toast";

export const useAccount = () => {
     const navigate = useNavigate();
     const toast = useToast();

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

    return {
        registerUser
    }
}