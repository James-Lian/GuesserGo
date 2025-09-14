import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { initializeApp } from 'firebase/app';
// import { getAuth, browserLocalPersistence } from 'firebase/auth';
import { GameStateManager } from '@/lib/gameState';
import { GameSession, GameRound } from '@/lib/types';
import { generateRandomLocation } from '@/lib/imageUtils';
import StreetViewPreview from '@/components/StreetViewPreview';
import RoundResultsScreen from '@/components/RoundResultsScreen';
import EndScreen from '@/components/EndScreen';
import Camera from './(tabs)/camera';
import { Button } from '@react-navigation/elements';

// const firebaseConfig = {
//     apiKey: 'YOUR_API_KEY',
//     authDomain: 'YOUR_AUTH_DOMAIN',
//     projectId: 'YOUR_PROJECT_ID',
//     storageBucket: 'YOUR_STORAGE_BUCKET',
//     messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
//     appId: 'YOUR_APP_ID',
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// auth.setPersistence(browserLocalPersistence);

export default function Game() {
    const [gameSession, setGameSession] = useState<GameSession | null>(null);
    const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
    const [streetViewImage, setStreetViewImage] = useState<string>('');
    const gameStateManager = GameStateManager.getInstance();

    useEffect(() => {
        const unsubscribe = gameStateManager.subscribe((session) => {
            console.log('Game: Session updated, status:', session?.gameStatus, 'round:', session?.currentRound);
            setGameSession(session);
            if (session) {
                const round = gameStateManager.getCurrentRound();
                setCurrentRound(round);
                console.log('Game: Current round set:', round?.roundNumber);
            }
        });

        return unsubscribe;
    }, [gameStateManager]);

    const startNextRound = useCallback(async () => {
        console.log('Game: Starting next round');
        // if (!gameSession) return;

        try {
            const centerLat = 43.47260261491713;
            const centerLon = -80.53998;
            const randomLocation = generateRandomLocation(centerLat, centerLon, 5);
            let streetViewUrl = '';
            try {
                console.log('Game: Generating street view image for location:', randomLocation);
                streetViewUrl = await generateStreetViewImage(randomLocation.latitude, randomLocation.longitude);
            } catch (error) {
                console.error('Failed to generate street view image:', error);
                Alert.alert('Error', 'Failed to generate street view image');
            }

            gameStateManager.startRound(randomLocation, streetViewUrl, 60);
            setStreetViewImage(streetViewUrl);

            // Remove conflicting timeout - let StreetViewPreview handle the transition
        } catch (error) {
            console.error('Failed to start next round:', error);
            Alert.alert('Error', 'Failed to start next round');
        }
    }, [gameSession, gameStateManager]);

    const startNewGame = useCallback(async () => {
        try {
            // Game session is already created in streetview.tsx, just start the first round
            console.log('Game: Starting new game');
            await startNextRound();
        } catch (error) {
            console.error('Failed to start new game:', error);
            Alert.alert('Error', 'Failed to start new game');
        }
    }, [startNextRound]);

    const generateStreetViewImage = async (lat: number, lon: number): Promise<string> => {
        console.log('Game: Generating street view image for location:', lat, lon);
        const apiKey = 'AIzaSyDRcdvQwQpG3hzlkhE4pykDG5yqqHeCi_w';
        const size = '400x300';
        const fov = '90';
        const heading = Math.floor(Math.random() * 360);
        return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lon}&fov=${fov}&heading=${heading}&pitch=0&key=${apiKey}`;
    };

    // Auto-start rounds when in waiting state
    useEffect(() => {
        if (gameSession?.gameStatus === 'waiting') {
            console.log('Game: Auto-starting round, current round:', gameSession.currentRound);
            startNextRound();
        }
    }, [gameSession?.gameStatus, gameSession?.currentRound, startNextRound]);

    if (!gameSession) {
        console.log('Game: No game session, returning null');
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <Text>Starting game...</Text>
                    <Button onPress={startNextRound}>Start Round</Button>
                </View>
            </SafeAreaView>
        );
    }

    console.log('Game: Rendering with status:', gameSession.gameStatus);
    
    switch (gameSession.gameStatus) {
        case 'waiting':
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.centerContainer}>
                        <Text>Starting round...</Text>
                        <TouchableOpacity 
                            style={styles.debugButton} 
                            onPress={() => {
                                console.log('Game: Debug button pressed, starting round manually');
                                startNextRound();
                            }}
                        >
                            <Text style={styles.debugButtonText}>Start Round (Debug)</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );

        case 'streetview':
            if (!currentRound) {
                console.log('Game: No current round, returning null');
                return null;
            }
            return (
                <StreetViewPreview
                    streetViewImage={streetViewImage}
                    targetLocation={currentRound.targetLocation}
                    roundNumber={currentRound.roundNumber}
                    totalRounds={gameSession.totalRounds}
                    onComplete={() => {
                        console.log('Game: StreetViewPreview completed, moving to camera phase');
                        gameStateManager.moveToCameraPhase();
                    }}
                />
            );

        case 'camera':
            console.log('Game: Rendering camera');
            return <Camera />;

        case 'scoring':
            if (!currentRound) return null;
            return (
                <RoundResultsScreen
                    round={currentRound}
                    onNext={() => {
                        if (currentRound.roundNumber >= gameSession.totalRounds) {
                            gameStateManager.endGame();
                        } else {
                            gameStateManager.nextRound();
                            setTimeout(() => startNextRound(), 1000);
                        }
                    }}
                    isLastRound={currentRound.roundNumber >= gameSession.totalRounds}
                />
            );

        case 'finished':
            return (
                <EndScreen
                    gameSession={gameSession}
                    onPlayAgain={() => {
                        gameStateManager.reset();
                        startNewGame();
                    }}
                    onExit={() => {
                        gameStateManager.reset();
                    }}
                />
            );

        default:
            Alert.alert('Error', 'Unknown game status');
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.centerContainer}>
                        <Text>Error: Unknown game status</Text>
                    </View>
                </SafeAreaView>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    debugButton: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    debugButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});