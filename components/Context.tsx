import React, { Dispatch, SetStateAction, createContext, useState } from "react";

export const defaults = {
    locationPermissions: null,
    setLocationPermissions: (_: SetStateAction<null | boolean>) => {}
    // location perms: false = can't ask again, null = can ask again, true = has permissions
}

export interface GlobalContextTypes {
    locationPermissions: boolean | null,
    setLocationPermissions: Dispatch<SetStateAction<boolean | null>>,
}

export const GlobalContext = createContext<GlobalContextTypes>(defaults);

interface ComponentProps {
    children: React.ReactNode;
}

export const ContextProvider = ({ children } : ComponentProps) => {
    const [locationPermissions, setLocationPermissions] = useState<boolean| null>(defaults.locationPermissions);

    return (
        <GlobalContext.Provider value={{ 
            locationPermissions,
            setLocationPermissions
        }}>
            {children}
        </GlobalContext.Provider>)
}