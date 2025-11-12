export interface User {
    name: string;
    email: string;
}

export interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (userData: User, userToken: string) => void;
    logout: () => void;
}

export interface AuthProviderProps {
    children: React.ReactNode;
}