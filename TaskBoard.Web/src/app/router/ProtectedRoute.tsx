import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/context/AuthContext';

const ProtectedRoute: React.FC = () => {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/login" />;
    }

    return <Outlet />; // Renders the child route's element
};

export default ProtectedRoute;
