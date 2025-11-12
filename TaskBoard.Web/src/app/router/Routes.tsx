import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import Register from "../../features/account/Register";
import Login from "../../features/account/Login";
import UserHome from "../../features/home/UserHome";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {element: <ProtectedRoute />, children: [
               { path: 'home', element: <UserHome /> },
            ]},
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
        ]
    }
]);