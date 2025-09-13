import React, { useState } from "react";
import { View } from "react-native";
import { useFocusEffect } from "expo-router";
import * as Location from 'expo-location';

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
    const [location, setLocationPermissions] = useState(false);

    useFocusEffect(React.useCallback(() => {
        // let { granted, canAskAgain } = await Location.requestForegroundPermissionsAsync();
        // if (granted === false) {
        //     console.log("Permission to access location was denied");
        //     if (canAskAgain === false) {
        //         setLocationPermissions(false);
        //     } else {
        //         setLocationPermissions(null);
        //     }
        // }
        // setLocationPermissions(true);
    }, [location, setLocationPermissions]));

    return (
        <View>

        </View>
    )
}