import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
    startNewGame, 
    startRound, 
    moveToCameraPhase, 
    nextRound, 
    endGame, 
    reset,
    setLoading,
    setError 
} from '@/lib/gameSlice';
import { generateRandomLocation } from '@/lib/imageUtils';
import StreetViewPreview from '@/components/StreetViewPreview';
import RoundResultsScreen from '@/components/RoundResultsScreen';
import EndScreen from '@/components/EndScreen';
import Camera from './(tabs)/camera';

export default function Game() {
    const dispatch = useAppDispatch();
    const { gameSession, currentRound, streetViewImage, isLoading, error } = useAppSelector(state => state.game);

    // Generate street view image URL
    const generateStreetViewImage = useCallback((lat: number, lon: number): string => {
        const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
        
        if (!apiKey) {
            console.warn('Google Maps API key not found, using placeholder image');
            // Return a placeholder image URL
            return `https://via.placeholder.com/640x480/cccccc/666666?text=Street+View+Image+Placeholder`;
        }
        
        const size = '640x480';
        const fov = '90';
        const heading = Math.floor(Math.random() * 360);
        return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lon}&fov=${fov}&heading=${heading}&pitch=0&key=${apiKey}`;
    }, []);

    // Start a new round
    const handleStartRound = useCallback(() => {
        if (isLoading) return;
        
        dispatch(setLoading(true));
        dispatch(setError(null));
        
        try {
            const centerLat = 43.47260261491713;
            const centerLon = -80.53998;
            const randomLocation = generateRandomLocation(centerLat, centerLon, 5);
            const streetViewUrl = generateStreetViewImage(randomLocation.latitude, randomLocation.longitude);
            
            console.log('Generated street view URL:', streetViewUrl);
            console.log('API Key present:', !!process.env.EXPO_PUBLIC_GOOGLE_API_KEY);
            
            dispatch(startRound({
                targetLocation: randomLocation,
                streetViewUrl,
                timeLimit: 60
            }));
        } catch (err) {
            console.error('Failed to start round:', err);
            dispatch(setError('Failed to start round'));
            Alert.alert('Error', 'Failed to start round');
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, isLoading, generateStreetViewImage]);

    // Handle street view completion
    const handleStreetViewComplete = useCallback(() => {
        dispatch(moveToCameraPhase());
    }, [dispatch]);

    // Handle round results next
    const handleRoundResultsNext = useCallback(() => {
        if (!currentRound || !gameSession) return;
        
        const isLastRound = currentRound.roundNumber >= gameSession.totalRounds;
        if (isLastRound) {
            dispatch(endGame());
        } else {
            dispatch(nextRound());
        }
    }, [dispatch, currentRound, gameSession]);

    // Handle play again
    const handlePlayAgain = useCallback(() => {
        dispatch(reset());
        dispatch(startNewGame());
    }, [dispatch]);

    // Handle exit
    const handleExit = useCallback(() => {
        dispatch(reset());
    }, [dispatch]);

    // Auto-start round when in waiting state
    useEffect(() => {
        if (gameSession?.gameStatus === 'waiting' && !isLoading) {
            handleStartRound();
        }
    }, [gameSession?.gameStatus, isLoading, handleStartRound]);

    // Show error alerts
    useEffect(() => {
        if (error) {
            Alert.alert('Error', error);
        }
    }, [error]);
    if (!gameSession) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <Text>Starting game...</Text>
                    <TouchableOpacity 
                        style={styles.debugButton} 
                        onPress={handleStartRound}
                        disabled={isLoading}
                    >
                        <Text style={styles.debugButtonText}>
                            {isLoading ? 'Loading...' : 'Start Game'}
                        </Text>
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
                        <TouchableOpacity 
                            style={styles.debugButton} 
                            onPress={handleStartRound}
                            disabled={isLoading}
                        >
                            <Text style={styles.debugButtonText}>
                                {isLoading ? 'Loading...' : 'Start Round'}
                            </Text>
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
                    onComplete={handleStreetViewComplete}
                />
            );

        case 'camera':
            return <Camera />;

        case 'scoring':
            if (!currentRound) return null;
            return (
                <RoundResultsScreen
                    round={currentRound}
                    isLastRound={currentRound.roundNumber >= gameSession.totalRounds}
                    onNext={handleRoundResultsNext}
                />
            );

        case 'finished':
            return (
                <EndScreen
                    gameSession={gameSession}
                    onPlayAgain={handlePlayAgain}
                    onExit={handleExit}
                />
            );

        default:
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
