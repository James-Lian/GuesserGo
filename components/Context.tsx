import React, { Dispatch, SetStateAction, createContext, useState } from "react";
import * as Location from 'expo-location';

import { RoomTypes } from "@/lib/firestore";

export const defaults = {
    locationPermissions: null,
    setLocationPermissions: (_: SetStateAction<null | boolean>) => {},
    // location perms: false = can't ask again, null = can ask again, true = has permissions
    locationData: null,
    setLocationData: (_: Location.LocationObject | null) => {},

    onlineRoomId: "",
    setOnlineRoomId: (_: string) => {},
    hostOrNo: false,
    setHostOrNo: (_: SetStateAction<boolean>) => {},
    joined: false,
    setJoined: (_: SetStateAction<boolean>) => {},

    imagesData: [],
    setImagesData: (_: RoomTypes["images"]) => {},
    svgVar: "",
    setSvgVar: (_: string) => {},

    imagesFound: [],
    setImagesFound: (_: string[]) => {},
}

export interface GlobalContextTypes {
    locationPermissions: boolean | null,
    setLocationPermissions: Dispatch<SetStateAction<boolean | null>>,
    locationData: Location.LocationObject | null,
    setLocationData: Dispatch<Location.LocationObject | null>,

    onlineRoomId: string,
    setOnlineRoomId: Dispatch<string>,
    hostOrNo: boolean,
    setHostOrNo: Dispatch<SetStateAction<boolean>>,
    joined: boolean,
    setJoined: Dispatch<SetStateAction<boolean>>,

    imagesData: RoomTypes["images"],
    setImagesData: Dispatch<RoomTypes["images"]>,
    svgVar: string,
    setSvgVar: Dispatch<string>,

    imagesFound: string[],
    setImagesFound: Dispatch<string[]>,
}

export const GlobalContext = createContext<GlobalContextTypes>(defaults);

interface ComponentProps {
    children: React.ReactNode;
}

export const ContextProvider = ({ children } : ComponentProps) => {
    const [locationPermissions, setLocationPermissions] = useState<boolean| null>(defaults.locationPermissions);
    const [locationData, setLocationData] = useState<Location.LocationObject | null>(defaults.locationData);

    const [onlineRoomId, setOnlineRoomId] = useState(defaults.onlineRoomId);
    const [hostOrNo, setHostOrNo] = useState(defaults.hostOrNo);
    const [joined, setJoined] = useState<boolean>(defaults.joined);

    const [imagesData, setImagesData] = useState<RoomTypes["images"]>(defaults.imagesData);
    const [svgVar, setSvgVar] = useState<string>(defaults.svgVar);

    const [imagesFound, setImagesFound] = useState<string[]>(defaults.imagesFound); 

    return (
        <GlobalContext.Provider value={{ 
            locationPermissions,
            setLocationPermissions,
            locationData,
            setLocationData,
            onlineRoomId,
            setOnlineRoomId,
            hostOrNo,
            setHostOrNo,
            joined,
            setJoined,
            imagesData, 
            setImagesData,
            svgVar,
            setSvgVar,
            imagesFound,
            setImagesFound,
        }}>
            {children}
        </GlobalContext.Provider>)
}