import { useMutation } from "@tanstack/react-query"
import type { RegisterSchema } from "../schemas/registerSchema";
import agent from "../api/agent";
import { useNavigate } from "react-router";
import { useToast } from "../../app/shared/components/toast";

export const useAccount = () => {
    //const queryClient = useQueryClient();
     const navigate = useNavigate();
     const toast = useToast();

    const registerUser = useMutation({
        mutationFn: async (user: RegisterSchema) => {
            await agent.post('/account/register', user);
        },
        onSuccess: async () => {
            toast.success("Register has been successful.");
            navigate('/login');
        }
    });

    return {
        registerUser
    }
}