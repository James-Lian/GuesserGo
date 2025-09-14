import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { distanceBetween } from '../lib/distanceCheck';

const LocationImageOverlay = ({ targetLat, targetLon, radius = 50, imageSource, onPress }) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [withinRadius, setWithinRadius] = useState(false);

    useEffect(() => {
        const getLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.warn('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location.coords);

            const distance = distanceBetween(
                location.coords.latitude,
                location.coords.longitude,
                targetLat,
                targetLon
            );

            setWithinRadius(distance <= radius);
        };

        getLocation();

        const subscription = Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, distanceInterval: 1 },
            (location) => {
                setCurrentLocation(location.coords);
                const distance = distanceBetween(
                    location.coords.latitude,
                    location.coords.longitude,
                    targetLat,
                    targetLon
                );
                setWithinRadius(distance <= radius);
            }
        );

        return () => subscription.then((sub) => sub.remove());
    }, [targetLat, targetLon, radius]);

    if (!withinRadius) return null; // nothing is rendered if out of radius

    const { width, height } = Dimensions.get('window');
    const imageSize = width * 0.3; // scale image relative to screen

    return (
        <View style={styles.container} pointerEvents="box-none">
            <Pressable onPress={onPress} style={{ position: 'absolute', top: height/2 - imageSize/2, left: width/2 - imageSize/2 }}>
                <Image source={imageSource} style={{ width: imageSize, height: imageSize, resizeMode: 'contain' }} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject, // fill the screen
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LocationImageOverlay;
