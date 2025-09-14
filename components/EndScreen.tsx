import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameSession } from '@/lib/types';

interface EndScreenProps {
    gameSession: GameSession;
    onPlayAgain: () => void;
    onExit: () => void;
}

export default function EndScreen({ gameSession, onPlayAgain, onExit }: EndScreenProps) {
    const getTotalTime = () => {
        if (!gameSession.endTime || !gameSession.startTime) return 0;
        return Math.round((gameSession.endTime - gameSession.startTime) / 1000);
    };

    const getAverageScore = () => {
        const completedRounds = gameSession.rounds.filter(round => round.completed);
        if (completedRounds.length === 0) return 0;
        const totalPoints = completedRounds.reduce((sum, round) => sum + (round.points || 0), 0);
        return Math.round(totalPoints / completedRounds.length);
    };

    const getBestRound = () => {
        return gameSession.rounds.reduce((best, round) => {
            return (round.points || 0) > (best.points || 0) ? round : best;
        }, gameSession.rounds[0]);
    };

    const getScoreGrade = (score: number) => {
        if (score >= 20000) return { grade: 'S', color: '#FFD700', message: 'Perfect!' };
        if (score >= 15000) return { grade: 'A', color: '#4CAF50', message: 'Excellent!' };
        if (score >= 10000) return { grade: 'B', color: '#2196F3', message: 'Great!' };
        if (score >= 5000) return { grade: 'C', color: '#FF9800', message: 'Good!' };
        return { grade: 'D', color: '#F44336', message: 'Keep practicing!' };
    };

    const grade = getScoreGrade(gameSession.totalScore);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Game Complete!</Text>
                    <View style={[styles.gradeContainer, { backgroundColor: grade.color }]}>
                        <Text style={styles.gradeText}>{grade.grade}</Text>
                    </View>
                    <Text style={[styles.gradeMessage, { color: grade.color }]}>{grade.message}</Text>
                </View>

                <View style={styles.scoreContainer}>
                    <View style={styles.mainScore}>
                        <Text style={styles.scoreLabel}>Total Score</Text>
                        <Text style={styles.scoreValue}>{gameSession.totalScore.toLocaleString()}</Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Ionicons name="time" size={24} color="#666" />
                            <Text style={styles.statLabel}>Total Time</Text>
                            <Text style={styles.statValue}>{getTotalTime()}s</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Ionicons name="trophy" size={24} color="#666" />
                            <Text style={styles.statLabel}>Average Score</Text>
                            <Text style={styles.statValue}>{getAverageScore()}</Text>
                        </View>

                        <View style={styles.statItem}>
                            <Ionicons name="star" size={24} color="#666" />
                            <Text style={styles.statLabel}>Best Round</Text>
                            <Text style={styles.statValue}>{getBestRound()?.points || 0}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.roundsContainer}>
                    <Text style={styles.roundsTitle}>Round Breakdown</Text>
                    {gameSession.rounds.map((round, index) => (
                        <View key={index} style={styles.roundItem}>
                            <View style={styles.roundHeader}>
                                <Text style={styles.roundNumber}>Round {round.roundNumber}</Text>
                                <Text style={[styles.roundScore, { color: grade.color }]}>
                                    {round.points || 0} pts
                                </Text>
                            </View>
                            <View style={styles.roundDetails}>
                                <Text style={styles.roundDetail}>
                                    Similarity: {round.similarity?.toFixed(1)}%
                                </Text>
                                <Text style={styles.roundDetail}>
                                    Distance: {round.proximity?.toFixed(0)}m
                                </Text>
                                <Text style={styles.roundDetail}>
                                    Time: {round.endTime && round.startTime 
                                        ? `${Math.round((round.endTime - round.startTime) / 1000)}s`
                                        : 'N/A'
                                    }
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.playAgainButton} onPress={onPlayAgain}>
                    <Ionicons name="refresh" size={20} color="white" />
                    <Text style={styles.playAgainText}>Play Again</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.exitButton} onPress={onExit}>
                    <Ionicons name="home" size={20} color="#666" />
                    <Text style={styles.exitText}>Exit</Text>
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
    scrollView: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    gradeContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    gradeText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
    },
    gradeMessage: {
        fontSize: 20,
        fontWeight: '600',
    },
    scoreContainer: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    mainScore: {
        alignItems: 'center',
        marginBottom: 24,
    },
    scoreLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    roundsContainer: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    roundsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    roundItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingVertical: 12,
    },
    roundHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    roundNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    roundScore: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    roundDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    roundDetail: {
        fontSize: 12,
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
    },
    playAgainButton: {
        flex: 1,
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
    },
    playAgainText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    exitButton: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    exitText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
