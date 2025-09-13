import React, { useState } from "react";
import { View } from "react-native";
import { useFocusEffect } from "expo-router";
import * as Location from 'expo-location';

export async function requestLocationPermissions() {

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