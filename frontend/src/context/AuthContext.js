import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                // Only set state if the token is still valid
                if (decodedToken.exp > currentTime) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Invalid token');
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        }
    }, []); // Empty dependency array to avoid re-triggering

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

