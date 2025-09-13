import * as Location from 'expo-location';
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

import { useGlobals } from '@/lib/useGlobals';

export function requestPermissions(locationPermissions: null | boolean, setLocationPermissions: React.Dispatch<React.SetStateAction<boolean | null>>) {
    // immediately executed async function
    (async () => {
        if (locationPermissions !== false) {
            let { granted, canAskAgain } = await Location.requestForegroundPermissionsAsync();
            if (granted === false) {
                console.log("Permission to access location was denied");
                if (canAskAgain === false) {
                    setLocationPermissions(false);
                } else {
                    setLocationPermissions(null);
                }
                return { granted, canAskAgain };
            }
            setLocationPermissions(true);
            return { granted, canAskAgain };
        }
        return { granted: true, canAskAgain: true };
    })();
}

export default function Explore() {
    const { locationPermissions, setLocationPermissions } = useGlobals();

    useFocusEffect(React.useCallback(() => {
        requestPermissions(locationPermissions, setLocationPermissions);
    }, [locationPermissions, setLocationPermissions]));

    return (
        <View>

        </View>
    )
}