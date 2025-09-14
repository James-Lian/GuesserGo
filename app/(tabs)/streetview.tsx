import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useGlobals } from '@/lib/useGlobals';
import { useAppDispatch } from '@/lib/hooks';
import { startNewGame } from '@/lib/gameSlice';

export default function StreetView() {
    const dispatch = useAppDispatch();
    const { locationPermissions } = useGlobals();
    const [loading, setLoading] = useState(false);


    const startGame = async () => {
        if (!locationPermissions) {
            Alert.alert('Error', 'Location permission required');
            return;
        }

        setLoading(true);
        try {
            dispatch(startNewGame());
            router.push('/game');
        } catch (error) {
            console.error('Error starting game:', error);
            Alert.alert('Error', 'Failed to start game');
        } finally {
            setLoading(false);
        }
    };
    
    if (!locationPermissions) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Text style={styles.errorText}>Location permission required</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Street View Challenge</Text>
                <Text style={styles.subtitle}>5 rounds • Find the locations • Score points!</Text>
                
                <View style={styles.gameInfo}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoNumber}>5</Text>
                        <Text style={styles.infoLabel}>Rounds</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoNumber}>60s</Text>
                        <Text style={styles.infoLabel}>Per Round</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoNumber}>5000</Text>
                        <Text style={styles.infoLabel}>Max Points</Text>
                    </View>
                </View>

                <View style={styles.rulesContainer}>
                    <Text style={styles.rulesTitle}>How to Play:</Text>
                    <Text style={styles.ruleText}>1. Study the street view image for 5 seconds</Text>
                    <Text style={styles.ruleText}>2. Find the exact location in real life</Text>
                    <Text style={styles.ruleText}>3. Take a photo within 60 seconds</Text>
                    <Text style={styles.ruleText}>4. Score points based on similarity and proximity</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={startGame}
                        disabled={loading}
                        style={[styles.button, loading && styles.buttonDisabled]}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Starting...' : 'Start Game'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
    },
    gameInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoItem: {
        alignItems: 'center',
    },
    infoNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    rulesContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    rulesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    ruleText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        lineHeight: 20,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#007AFF',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
});
