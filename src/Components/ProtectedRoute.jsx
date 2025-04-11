import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const isLoggedIn = localStorage.getItem("isLoggedIn");
            if (!isLoggedIn) {
                navigate("/login");
            } else {
                setIsAuthenticated(true);
            }
        };

        checkAuth();
    }, [navigate]);

    // Show loading state while checking authentication
    if (!isAuthenticated) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute; 