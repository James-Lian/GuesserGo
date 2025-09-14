// satellite image of somewhere between x km
// user has to get to the location and take a picture which is x% similar
// geoguessr style rounds and points system, micro scale

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons, Entypo } from '@expo/vector-icons';
import FingerDrawing from '@/components/FingerDrawing';
import LocationImageOverlay from "@/components/ImagePopUp";
import GameUI from "@/components/GameUI";

export default function Camera({ defaultColor = '#ff0000' }) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [isDrawing, setIsDrawing] = useState(false);
    const [score, setScore] = useState(0);

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.centered}>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <Ionicons name="camera" size={32} color="white" />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const toggleFacing = () => setFacing((f) => (f === 'back' ? 'front' : 'back'));

    const handleImagePress = () => {
        alert('Image Pressed!'); //animation here + wait for opponent (geoguessr opponent has 5 sec)
        setScore(score + 100); // increase score by 10
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} />
            <LocationImageOverlay
                targetLat={43.47260261491713}
                targetLon={-80.53998}
                radius={100}
                imageSource={require('../../assets/flower.png')}
                onPress={handleImagePress}
            />

            {isDrawing && (
                <View style={styles.overlay} pointerEvents="box-none">
                    <FingerDrawing />
                </View>
            )}

            {/* Camera controls separate from drawing controls */}
            {!isDrawing && (
                <View style={styles.bottomBar}>
                    <TouchableOpacity onPress={toggleFacing} style={styles.iconButton}>
                        <Ionicons name="camera-reverse" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsDrawing(true)} style={styles.iconButton}>
                        <Entypo name="pencil" size={28} color="white" />
                    </TouchableOpacity>
                </View>
            )}
            <GameUI />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 12,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
    },
    iconButton: {
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 50,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    permissionButton: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
});
