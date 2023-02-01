import React, { useState, createContext, useContext, useEffect } from "react";

const PermissionContext = createContext();
export const usePermission = () => useContext(PermissionContext);

export default function PermissionProvider({ children }) {
    const [permission, setPermission] = useState(null);

    useEffect(() => {
        setPermission(JSON.parse(localStorage.getItem('permission')))
    }, [permission]);

    return (
        <PermissionContext.Provider value={{ permission, setPermission }}>
            {children}
        </PermissionContext.Provider>
    );
}