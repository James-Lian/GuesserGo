import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameData } from '@/lib/types';

interface GameUIProps {
    gameData: GameData;
    onPhotoCapture?: () => void;
    onSubmit?: () => void;
    isPhotoCaptured?: boolean;
}

export default function GameUI({ gameData, onPhotoCapture, onSubmit, isPhotoCaptured = false }: GameUIProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'camera': return '#4CAF50';
            case 'waiting': return '#FF9800';
            case 'streetview': return '#2196F3';
            case 'scoring': return '#FF9800';
            case 'finished': return '#9C27B0';
            default: return '#2196F3';
        }
    };

    return (
        <View style={styles.container}>
            {/* Top Status Bar */}
            <View style={styles.topBar}>
                <View style={styles.statusIndicator}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(gameData.gameStatus) }]} />
                    <Text style={styles.statusText}>{gameData.gameStatus.toUpperCase()}</Text>
                </View>
                <Text style={styles.roundText}>Round {gameData.round}/{gameData.maxRounds}</Text>
            </View>

            {/* Main Game Info */}
            <View style={styles.mainInfo}>
                <View style={styles.scoreContainer}>
                    <Ionicons name="trophy" size={20} color="#FFD700" />
                    <Text style={styles.scoreText}>{gameData.score}</Text>
                </View>
                
                <View style={styles.timerContainer}>
                    <Ionicons name="time" size={20} color="#FF6B6B" />
                    <Text style={styles.timerText}>{formatTime(gameData.timer)}</Text>
                </View>
            </View>

            {/* Game Details */}
            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <Ionicons name="location" size={16} color="#666" />
                    <Text style={styles.detailText}>{gameData.kmRadius}km radius</Text>
                </View>

                {/* Commented out multiplayer features */}
                {/* <View style={styles.detailItem}>
                    <Ionicons name="people" size={16} color="#666" />
                    <Text style={styles.detailText}>{gameData.opponents} opponents</Text>
                </View>

                {gameData.playerRank && gameData.totalPlayers && (
                    <View style={styles.detailItem}>
                        <Ionicons name="medal" size={16} color="#666" />
                        <Text style={styles.detailText}>Rank {gameData.playerRank}/{gameData.totalPlayers}</Text>
                    </View>
                )} */}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={onPhotoCapture}>
                    <Ionicons 
                        name={isPhotoCaptured ? "checkmark-circle" : "camera"} 
                        size={24} 
                        color={isPhotoCaptured ? "#4CAF50" : "white"} 
                    />
                    <Text style={[styles.buttonText, { color: isPhotoCaptured ? "#4CAF50" : "white" }]}>
                        {isPhotoCaptured ? "Photo Taken" : "Capture"}
                    </Text>
                </TouchableOpacity>

                {isPhotoCaptured && (
                    <TouchableOpacity style={[styles.actionButton, styles.submitButton]} onPress={onSubmit}>
                        <Ionicons name="send" size={24} color="white" />
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 16,
        padding: 16,
        zIndex: 1000,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    roundText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    mainInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    scoreText: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    timerText: {
        color: '#FF6B6B',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    detailsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 4,
    },
    detailText: {
        color: '#ccc',
        fontSize: 12,
        marginLeft: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        flex: 1,
        marginHorizontal: 4,
        justifyContent: 'center',
    },
    submitButton: {
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
});