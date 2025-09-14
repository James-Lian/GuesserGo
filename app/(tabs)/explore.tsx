import * as Location from 'expo-location';
import { useFocusEffect, router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";


import { useGlobals } from '@/lib/useGlobals';

import * as Linking from "expo-linking";
import CustomButton from '@/components/CustomButton';


export function requestPermissions(locationPermissions: null | boolean, setLocationPermissions: React.Dispatch<React.SetStateAction<boolean | null>>) {
    // immediately executed async function
    (async () => {
        if (locationPermissions !== false) {
            let { granted, canAskAgain } = await Location.requestForegroundPermissionsAsync();
            if (granted === false) {
                console.log("Permission to access location was denied");
                if (canAskAgain === false) {
                    setLocationPermissions(false);
                    return;
                }
                setLocationPermissions(null);
                return;
            }
            setLocationPermissions(true);
        }
    })();
}

export async function updateLocationData(setLocationData: React.Dispatch<Location.LocationObject | null>) {
    let location = await Location.getCurrentPositionAsync({});
}

export default function Explore() {
    const { locationPermissions, setLocationPermissions, locationData, setLocationData } = useGlobals();

    useFocusEffect(React.useCallback(() => {
        requestPermissions(locationPermissions, setLocationPermissions);
    }, [locationPermissions, setLocationPermissions]));

    return (
        <View style={{ flex: 1 }}>
            {locationPermissions
                ? <>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 24, marginBottom: 20 }}>Explore Screen</Text>
                        <CustomButton
                            onPress={(e) => {
                                router.replace("/camera");
                            }}
                        >
                            <View
                                style={{
                                    paddingTop: 12, 
                                    paddingBottom: 12, 
                                    paddingLeft: 16, 
                                    paddingRight: 16, 
                                    display: "flex", 
                                    borderRadius: 12,
                                    shadowOffset: {
                                        width: 3,
                                        height: 3,
                                    },
                                    shadowColor: "black",
                                    shadowOpacity: 0.8,
                                    shadowRadius: 8,
                                    elevation: 5,
                                    backgroundColor: "rgba(123, 123, 123, 0.3)"
                                }}
                            >
                                <Text style={{fontSize: 22, color: "white", fontWeight: "bold"}}>Start an Expedition!</Text>
                            </View>
                        </CustomButton>
                    </View>
                </>
                : <View className='flex-1 flex flex-col justify-center items-center'>
                    <CustomButton
                        onPress={() => {Linking.openSettings()}}
                    >
                        <Text style={{color: "black",}}>Location permission denied.</Text>
                        <Text style={{color: "black",}}>Open settings.</Text>
                    </CustomButton>
                </View>
            }
        </View>
    )
}