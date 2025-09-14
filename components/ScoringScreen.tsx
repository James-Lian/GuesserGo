import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameRound } from '@/lib/gameState';

interface ScoringScreenProps {
    round: GameRound;
    onNext: () => void;
    isLastRound: boolean;
}

export default function ScoringScreen({ round, onNext, isLastRound }: ScoringScreenProps) {
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        // Auto-show details after a short delay
        const timer = setTimeout(() => {
            setShowDetails(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const getScoreColor = (points: number) => {
        if (points >= 4000) return '#4CAF50'; // Green
        if (points >= 2500) return '#FF9800'; // Orange
        if (points >= 1000) return '#FFC107'; // Yellow
        return '#F44336'; // Red
    };

    const getScoreMessage = (points: number) => {
        if (points >= 4000) return 'Excellent!';
        if (points >= 2500) return 'Great job!';
        if (points >= 1000) return 'Good work!';
        if (points > 0) return 'Not bad!';
        return 'Better luck next time!';
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.roundText}>Round {round.roundNumber} Results</Text>
                {isLastRound && <Text style={styles.finalText}>Final Round!</Text>}
            </View>

            <View style={styles.scoreContainer}>
                <View style={[styles.scoreCircle, { borderColor: getScoreColor(round.points || 0) }]}>
                    <Text style={[styles.scoreText, { color: getScoreColor(round.points || 0) }]}>
                        {round.points || 0}
                    </Text>
                    <Text style={styles.scoreLabel}>POINTS</Text>
                </View>
                <Text style={[styles.scoreMessage, { color: getScoreColor(round.points || 0) }]}>
                    {getScoreMessage(round.points || 0)}
                </Text>
            </View>

            {showDetails && (
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Ionicons name="image" size={20} color="#666" />
                        <Text style={styles.detailLabel}>Similarity:</Text>
                        <Text style={styles.detailValue}>{round.similarity?.toFixed(1)}%</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Ionicons name="location" size={20} color="#666" />
                        <Text style={styles.detailLabel}>Distance:</Text>
                        <Text style={styles.detailValue}>
                            {round.proximity ? `${round.proximity.toFixed(0)}m` : 'N/A'}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Ionicons name="time" size={20} color="#666" />
                        <Text style={styles.detailLabel}>Time taken:</Text>
                        <Text style={styles.detailValue}>
                            {round.endTime && round.startTime 
                                ? `${Math.round((round.endTime - round.startTime) / 1000)}s`
                                : 'N/A'
                            }
                        </Text>
                    </View>
                </View>
            )}

            {round.photoUri && showDetails && (
                <View style={styles.photoContainer}>
                    <Text style={styles.photoLabel}>Your Photo:</Text>
                    <Image source={{ uri: round.photoUri }} style={styles.photo} />
                </View>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.nextButton, { opacity: showDetails ? 1 : 0.5 }]} 
                    onPress={onNext}
                    disabled={!showDetails}
                >
                    <Text style={styles.nextButtonText}>
                        {isLastRound ? 'View Final Score' : 'Next Round'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    roundText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    finalText: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    scoreContainer: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: 'white',
    },
    scoreCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    scoreText: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    scoreLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    scoreMessage: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    detailsContainer: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 16,
        color: '#666',
        marginLeft: 12,
        flex: 1,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    photoContainer: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    photoLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    photo: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    buttonContainer: {
        padding: 20,
        flex: 1,
        justifyContent: 'flex-end',
    },
    nextButton: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
});
