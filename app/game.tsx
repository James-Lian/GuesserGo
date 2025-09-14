import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameStateManager } from '@/lib/gameState';
import { GameSession, GameRound } from '@/lib/types';
import { generateRandomLocation } from '@/lib/imageUtils';
import StreetViewPreview from '@/components/StreetViewPreview';
import RoundResultsScreen from '@/components/RoundResultsScreen';
import EndScreen from '@/components/EndScreen';
import Camera from './(tabs)/camera';
// Stable singleton without useRef
const manager = GameStateManager.getInstance();
export default function Game() {
    const [gameSession, setGameSession] = useState<GameSession | null>(null);
    const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
    const [streetViewImage, setStreetViewImage] = useState('');
    const [isStartingRound, setIsStartingRound] = useState(false);   // mutex
    const [shouldStartRound, setShouldStartRound] = useState(false); // intent
    const syncFromManager = () => {
        setGameSession(manager.getCurrentSession());
        setCurrentRound(manager.getCurrentRound());
    };
    const generateStreetViewImage = async (lat: number, lon: number) => {
        const apiKey =
            process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY ??
            process.env.GOOGLE_MAPS_KEY ??
            '';
        const size = '640x480';
        const fov = '90';
        const heading = Math.floor(Math.random() * 360);
        return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lon}&fov=${fov}&heading=${heading}&pitch=0&key=${apiKey}`;
    };
    // 1) Bootstrap on first mount
    useEffect(() => {
        syncFromManager();
        const s = manager.getCurrentSession();
        const r = manager.getCurrentRound();
        if (!s || s.gameStatus === 'waiting' || !r) {
            setShouldStartRound(true);
        }
    }, []);
    // 2) Safety net: if we ever land in waiting with no round, request a start
    useEffect(() => {
        if (gameSession?.gameStatus === 'waiting' && !currentRound) {
            setShouldStartRound(true);
        }
    }, [gameSession?.gameStatus, currentRound?.roundNumber]);
    // 3) Orchestrator: the only place that actually runs start-next-round
    useEffect(() => {
        if (!shouldStartRound || isStartingRound) return;
        (async () => {
            setIsStartingRound(true);
            try {
                const centerLat = 43.47260261491713;
                const centerLon = -80.53998;
                const randomLocation = generateRandomLocation(centerLat, centerLon, 5);
                let url = '';
                try {
                    url = await generateStreetViewImage(randomLocation.latitude, randomLocation.longitude);
                } catch (err) {
                    console.error('Street View generation failed:', err);
                    Alert.alert('Error', 'Failed to generate street view image');
                }
                await Promise.resolve(manager.startRound(randomLocation, url, 60));
                setStreetViewImage(url);
                syncFromManager();
            } catch (err) {
                console.error('Failed to start next round:', err);
                Alert.alert('Error', 'Failed to start next round');
            } finally {
                setIsStartingRound(false);
                setShouldStartRound(false);
            }
        })();
    }, [shouldStartRound, isStartingRound]);
    const requestStartRound = () => setShouldStartRound(true);
    if (!gameSession) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <Text>Starting game...</Text>
                    <TouchableOpacity style={styles.debugButton} onPress={requestStartRound}>
                        <Text style={styles.debugButtonText}>Start Round</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
    switch (gameSession.gameStatus) {
        case 'waiting':
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.centerContainer}>
                        <Text>Starting round...</Text>
                        <TouchableOpacity style={styles.debugButton} onPress={requestStartRound}>
                            <Text style={styles.debugButtonText}>Start Round (Debug)</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        case 'streetview':
            if (!currentRound) return null;
            return (
                <StreetViewPreview
                    streetViewImage={streetViewImage}
                    targetLocation={currentRound.targetLocation}
                    roundNumber={currentRound.roundNumber}
                    totalRounds={gameSession.totalRounds}
                    onComplete={async () => {
                        try {
                            manager.moveToCameraPhase();
                            syncFromManager();
                        } catch (e) {
                            console.error('Failed to move to camera phase', e);
                            Alert.alert('Error', 'Could not move to camera phase');
                        }
                    }}
                />
            );
        case 'camera':
            console.log('Rendering Camera phase ---');
            return <Camera />;
        case 'scoring':
            if (!currentRound) return null;
            return (
                <RoundResultsScreen
                    round={currentRound}
                    isLastRound={currentRound.roundNumber >= gameSession.totalRounds}
                    onNext={async () => {
                        try {
                            const isLast = currentRound.roundNumber >= gameSession.totalRounds;
                            if (isLast) {
                                await Promise.resolve(manager.endGame());
                                syncFromManager();
                            } else {
                                await Promise.resolve(manager.nextRound());
                                syncFromManager();
                                setShouldStartRound(true); // queue next round start
                            }
                        } catch (e) {
                            console.error('Failed advancing from scoring', e);
                            Alert.alert('Error', 'Could not proceed to next round');
                        }
                    }}
                />
            );
        case 'finished':
            return (
                <EndScreen
                    gameSession={gameSession}
                    onPlayAgain={async () => {
                        try {
                            await Promise.resolve(manager.reset());
                            syncFromManager();
                            setShouldStartRound(true);
                        } catch (e) {
                            console.error('Failed to restart game', e);
                            Alert.alert('Error', 'Could not restart game');
                        }
                    }}
                    onExit={async () => {
                        try {
                            await Promise.resolve(manager.reset());
                            syncFromManager();
                        } catch (e) {
                            console.error('Failed to reset game', e);
                            Alert.alert('Error', 'Could not reset game');
                        }
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
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    debugButton: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    debugButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});









