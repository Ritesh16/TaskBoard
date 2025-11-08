import axios from "axios";
import { store } from "../stores/store";

const agent = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

agent.interceptors.request.use(async config => {
    store.uiStore.isBusy();
    return config;
});

export default agent;