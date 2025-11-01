import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import Register from "../../features/account/Register";
import Login from "../../features/account/Login";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
        ]
    }
]);