import { createContext, useState } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    function login(newToken, userData) {
        setToken(newToken);
        setUser(userData);
    }

    function logout() {
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };