import { createContext, useState } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token');
    });
    const [user, setUser] = useState(() => {
        const savedUser=localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    function login(newToken, userData) {
        setToken(newToken);
        setUser(userData);

        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    function logout() {
        setToken(null);
        setUser(null);

        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };