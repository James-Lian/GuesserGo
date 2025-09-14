import * as Location from 'expo-location';
import { useFocusEffect, Stack, router } from "expo-router";
import React, { useRef, useState } from "react";
import { Text, View } from "react-native";

import Mapbox, { MapView, Camera, Images, Image, LocationPuck, UserTrackingMode, MarkerView } from "@rnmapbox/maps"; // import default export

import { useGlobals } from '@/lib/useGlobals';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as Linking from "expo-linking";
import CustomButton from '@/components/CustomButton';

Mapbox.setAccessToken("pk.eyJ1IjoiamFtZXMtbGlhbiIsImEiOiJjbWR4azhsaTcwNHUwMmpxN3hybjI2aHNiIn0.33zeGfb12zMby5ZZSVin9Q");

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

export default function Explore() {
    const { locationPermissions, setLocationPermissions, locationData } = useGlobals();

    useFocusEffect(React.useCallback(() => {
        requestPermissions(locationPermissions, setLocationPermissions);
    }, [locationPermissions, setLocationPermissions]));

    const CameraRef = useRef(null);

    return (
        <View style={{ flex: 1 }}>
            {locationPermissions
                ? <>
                    <MapView style={{ flex: 1 }}
                        styleURL={Mapbox.StyleURL.Outdoors}
                        compassEnabled={true}
                    >
                        <Camera
                            defaultSettings={{
                                centerCoordinate: locationData == null ? [0, 0] : [locationData?.coords.longitude, locationData?.coords.latitude] ,
                                zoomLevel: 18,
                            }}
                            followUserLocation={true}
                            ref={CameraRef}
                        />

                        <LocationPuck
                            visible={true}
                            puckBearing="heading"
                            puckBearingEnabled={true}
                            pulsing={{
                                isEnabled: true,
                                color: "black",
                            }}
                        />
                    </MapView>
                    <View className="absolute z-10 flex align-center items-center w-full bottom-12">
                        <CustomButton
                            // do more
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