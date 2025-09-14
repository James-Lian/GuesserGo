import * as Location from 'expo-location';
import { useFocusEffect, Stack, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View, Image } from "react-native";

import Mapbox, { MapView, Camera, Images, LocationPuck, UserTrackingMode, MarkerView, UserLocation } from "@rnmapbox/maps"; // import default export

import { useGlobals } from '@/lib/useGlobals';

import * as Linking from "expo-linking";
import CustomButton from '@/components/CustomButton';
import { Entypo, Ionicons } from '@expo/vector-icons'
import { SvgXml } from 'react-native-svg';


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

function getDistance(coord1: number[], coord2: number[]) {
    const toRad = x => x * Math.PI / 180;
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const R = 6371000; // meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function Explore() {
    const { locationPermissions, setLocationPermissions, imagesData, imagesFound, locationData, setLocationData } = useGlobals();

    useEffect(() => {
        if (!locationData) return;

        imagesData.forEach(image => {
            const distance = getDistance([image.locationCoords.longitude, image.locationCoords.latitude], [locationData.coords.longitude, locationData.coords.latitude]);
            if (distance < 15) { // 50 meters threshold
                handleImageModal(image);
            }
        });
    }, [locationData]);

    const onUserLocationDataUpdate = (location: Location)  => {
        setLocationData(location);
    }

    useFocusEffect(React.useCallback(() => {
        requestPermissions(locationPermissions, setLocationPermissions);
    }, [locationPermissions, setLocationPermissions]));

    const CameraRef = useRef(null);

    const [imageModalSrc, setImageModalSrc] = useState<{svg: string, downloadLink: string, locationCoords: Location.LocationObjectCoords} | null>(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);

    const handleImageModal = (img: {svg: string, downloadLink: string, locationCoords: Location.LocationObjectCoords}) => {
        setImageModalSrc(img);
        setImageModalVisible(true);
    }

    const handleImageModalClose = () => {
        setImageModalVisible(false);
    }


    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType='slide'
                transparent={true}
                visible={imageModalVisible}
                onRequestClose={() => {
                    handleImageModalClose();
                }}
                style={{display: "flex", flex: 1,}}
            >
                <Pressable className="flex flex-1 justify-center items-center bg-[#00000099] p-[12px]" onPress={() => {handleImageModalClose()}}>
                    <View className="bg-white py-[20px] h-[600px] px-[12px]" style={{borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomLeftRadius: 12, borderBottomRightRadius: 12}}>
                        <Image source={{uri: imageModalSrc?.downloadLink}} style={{width: 280, height: 500}} resizeMode='contain'/>
                        <Text>Found!</Text>
                        <SvgXml xml={imageModalSrc ? imageModalSrc?.downloadLink : ""} width={300} height={300}/>
                    </View>
                </Pressable>

            </Modal>
            
            {locationPermissions
                ? <>
                    <MapView style={{ flex: 1 }}
                        styleURL={Mapbox.StyleURL.Outdoors}
                        compassEnabled={true}
                    >
                        <Camera
                            zoomLevel={15}
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
                        <UserLocation onUpdate={onUserLocationDataUpdate}/>
                        {imagesData.map((image, id) => {
                            return (
                                <>
                                    {imagesFound.includes(image.downloadLink) &&
                                        <MarkerView 
                                            key={id}
                                            coordinate={[image.locationCoords.longitude, image.locationCoords.latitude]}    
                                            anchor={{ x: 0.5, y: 1 }}
                                        >
                                            <TouchableOpacity className="shadow-lg">
                                                <Entypo name="location-pin" size={20} color="red"/>
                                            </TouchableOpacity>
                                        </MarkerView>
                                    }
                                </>
                            )
                        })}
                    </MapView>
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