import React, { Dispatch, SetStateAction, createContext, useState } from "react";
import * as Location from 'expo-location';

export const defaults = {
    locationPermissions: null,
    setLocationPermissions: (_: SetStateAction<null | boolean>) => {},
    // location perms: false = can't ask again, null = can ask again, true = has permissions
    locationData: null,

}

export interface GlobalContextTypes {
    locationPermissions: boolean | null,
    setLocationPermissions: Dispatch<SetStateAction<boolean | null>>,
    locationData: Location.LocationObject | null,
}

export const GlobalContext = createContext<GlobalContextTypes>(defaults);

interface ComponentProps {
    children: React.ReactNode;
}

export const ContextProvider = ({ children } : ComponentProps) => {
    const [locationPermissions, setLocationPermissions] = useState<boolean| null>(defaults.locationPermissions);
    const locationData = defaults.locationData

    return (
        <GlobalContext.Provider value={{ 
            locationPermissions,
            setLocationPermissions,
            locationData,
        }}>
            {children}
        </GlobalContext.Provider>)
}