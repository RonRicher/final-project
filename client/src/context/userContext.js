import React, { useState, createContext, useContext, useEffect } from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export default function UserProvider({ children }) {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            localStorage.clear();
        }
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
}