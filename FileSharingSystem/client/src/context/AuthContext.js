import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Helper to fetch user profile from backend
    const fetchUserProfile = async (token) => {
        try {
            const res = await fetch('http://localhost:8080/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    };

    useEffect(() => {
        // On mount, check for token and fetch user profile from backend
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserProfile(token).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (userDataOrToken, tokenMaybe) => {
        // login(userData, token) or login(token)
        let token, userData;
        if (tokenMaybe) {
            // login(userData, token)
            token = tokenMaybe;
            userData = userDataOrToken;
        } else {
            // login(token)
            token = userDataOrToken;
        }
        localStorage.setItem('token', token);
        await fetchUserProfile(token);
        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
    };

    // Don't render children until initial auth check is complete
    if (loading) {
        return null; // or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 