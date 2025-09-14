// satellite image of somewhere between x km
// user has to get to the location and take a picture which is x% similar
// geoguessr style rounds and points system, micro scale

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import LocationImageOverlay from "@/components/ImagePopUp";
import GameUI from "@/components/GameUI";
import { calculateSimilarity, storeImageWithLocation } from "@/lib/imageUtils";
import { GameStateManager } from "@/lib/gameState";
import { GameSession, GameRound } from "@/lib/types";

export default function Camera({ defaultColor = '#ff0000' }) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [gameSession, setGameSession] = useState<GameSession | null>(null);
    const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
    const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [capturedLocation, setCapturedLocation] = useState<Location.LocationObject['coords'] | null>(null);
    // Timer removed - using manual progression
    const cameraRef = useRef<CameraView>(null);
    const gameStateManager = GameStateManager.getInstance();

    // Simple function to refresh game state
    const refreshGameState = () => {
        const session = gameStateManager.getCurrentSession();
        const round = gameStateManager.getCurrentRound();
        setGameSession(session);
        setCurrentRound(round);
        console.log('Camera: State refreshed, status:', session?.gameStatus);
    };

    // Initialize game state on mount
    useEffect(() => {
        refreshGameState();
    }, []);

    // Timer removed - using manual progression instead

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

    const handlePhotoCapture = async () => {
        if (cameraRef.current && gameSession?.gameStatus === 'camera') {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                const location = await Location.getCurrentPositionAsync({});
                
                // Store image with location
                await storeImageWithLocation(photo.uri, location.coords);
                
                // Update state
                setCapturedPhoto(photo.uri);
                setCapturedLocation(location.coords);
                setIsPhotoCaptured(true);
                
                Alert.alert(
                    'Photo Captured!', 
                    `Location: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}\nReady to submit!`
                );
            } catch (error) {
                console.error('Error taking picture:', error);
                Alert.alert('Error', 'Failed to take picture');
            }
        }
    };

    const handleSubmit = async () => {
        if (!capturedPhoto || !capturedLocation || !currentRound) {
            Alert.alert('Error', 'No photo captured yet');
            return;
        }

        try {
            // Calculate similarity using placeholder function
            const similarity = calculateSimilarity(capturedPhoto, capturedLocation);
            
            // Submit photo to game state manager
            const points = gameStateManager.submitPhoto(capturedPhoto, {
                latitude: capturedLocation.latitude,
                longitude: capturedLocation.longitude
            }, similarity);

            Alert.alert(
                'Photo Submitted!', 
                `Similarity: ${similarity}%\nPoints earned: ${points}`
            );

            // Reset photo capture state
            setIsPhotoCaptured(false);
            setCapturedPhoto(null);
            setCapturedLocation(null);
            
            // Refresh game state after submission
            refreshGameState();
        } catch (error) {
            console.error('Error submitting photo:', error);
            Alert.alert('Error', 'Failed to submit photo');
        }
    };

    const handleImagePress = () => {
        alert('Image Pressed!'); //animation here + wait for opponent (geoguessr opponent has 5 sec)
    }

    if (!gameSession || !currentRound) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading game...</Text>
                </View>
            </View>
        );
    }

    // Only show camera when in camera phase
    if (gameSession.gameStatus !== 'camera') {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Waiting for camera phase... Status: {gameSession.gameStatus}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
            
            {/* Game UI Overlay */}
            <GameUI 
                gameData={{
                    score: gameSession.totalScore,
                    timer: 0, // Timer removed - using manual progression
                    // opponents: 0, // Commented out for single player
                    kmRadius: 5, // Default radius
                    round: currentRound.roundNumber,
                    maxRounds: gameSession.totalRounds,
                    targetLocation: currentRound.targetLocation,
                    gameStatus: gameSession.gameStatus,
                }}
                onPhotoCapture={handlePhotoCapture}
                onSubmit={handleSubmit}
                isPhotoCaptured={isPhotoCaptured}
            />

            <LocationImageOverlay
                targetLat={currentRound.targetLocation.latitude}
                targetLon={currentRound.targetLocation.longitude}
                radius={5000} // 5km radius
                imageSource={require('../../assets/flower.png')}
                onPress={handleImagePress}
            />

            {/* Camera controls */}
            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={toggleFacing} style={styles.iconButton}>
                    <Ionicons name="camera-reverse" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => {
                        console.log('Camera: Skip round button pressed');
                        gameStateManager.timeUp();
                        refreshGameState();
                    }} 
                    style={styles.skipButton}
                >
                    <Text style={styles.skipButtonText}>Skip Round</Text>
                </TouchableOpacity>
            </View>
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
    captureButton: {
        marginHorizontal: 10,
        padding: 15,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderWidth: 3,
        borderColor: 'white',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    loadingText: {
        color: 'white',
        fontSize: 18,
    },
    skipButton: {
        backgroundColor: 'rgba(255, 107, 107, 0.8)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        marginLeft: 10,
    },
    skipButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
