import axios from "axios";
import { store } from "../stores/store";

const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

agent.interceptors.request.use(async config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    store.uiStore.isBusy();
    return config;
},
    (error) => {
        return Promise.reject(error);
    }
);

export default agent;