import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GameRound } from '@/lib/types';
import LocationMap from './LocationMap';

interface RoundResultsScreenProps {
    round: GameRound;
    onNext: () => void;
    isLastRound: boolean;
}

// const { width } = Dimensions.get('window'); // Unused for now

export default function RoundResultsScreen({ round, onNext, isLastRound }: RoundResultsScreenProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [distance, setDistance] = useState<number>(0);

    useEffect(() => {
        // Calculate distance between locations
        if (round.photoLocation) {
            const dist = calculateDistance(
                round.targetLocation.latitude,
                round.targetLocation.longitude,
                round.photoLocation.latitude,
                round.photoLocation.longitude
            );
            setDistance(dist);
        }

        // Auto-show details after a short delay
        const timer = setTimeout(() => {
            setShowDetails(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, [round]);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c * 1000; // Return distance in meters
    };

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

    const formatCoordinate = (lat: number, lon: number) => {
        return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.roundText}>Round {round.roundNumber} Results</Text>
                    {isLastRound && <Text style={styles.finalText}>Final Round!</Text>}
                </View>

                {/* Score Display */}
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
                    <>
                        {/* Location Map */}
                        {round.photoLocation && (
                            <LocationMap
                                targetLocation={round.targetLocation}
                                photoLocation={round.photoLocation}
                                distance={distance}
                            />
                        )}

                        {/* Location Comparison */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>📍 Location Details</Text>
                            
                            <View style={styles.locationContainer}>
                                <View style={styles.locationItem}>
                                    <View style={[styles.locationPin, { backgroundColor: '#4CAF50' }]}>
                                        <Ionicons name="flag" size={16} color="white" />
                                    </View>
                                    <View style={styles.locationInfo}>
                                        <Text style={styles.locationLabel}>Target Location</Text>
                                        <Text style={styles.locationCoords}>
                                            {formatCoordinate(round.targetLocation.latitude, round.targetLocation.longitude)}
                                        </Text>
                                    </View>
                                </View>

                                {round.photoLocation && (
                                    <>
                                        <View style={styles.distanceContainer}>
                                            <View style={styles.distanceLine} />
                                            <Text style={styles.distanceText}>
                                                {distance.toFixed(0)}m away
                                            </Text>
                                            <View style={styles.distanceLine} />
                                        </View>

                                        <View style={styles.locationItem}>
                                            <View style={[styles.locationPin, { backgroundColor: '#FF6B6B' }]}>
                                                <Ionicons name="camera" size={16} color="white" />
                                            </View>
                                            <View style={styles.locationInfo}>
                                                <Text style={styles.locationLabel}>Your Photo</Text>
                                                <Text style={styles.locationCoords}>
                                                    {formatCoordinate(round.photoLocation.latitude, round.photoLocation.longitude)}
                                                </Text>
                                            </View>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>

                        {/* Image Comparison */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>📸 Image Comparison</Text>
                            
                            <View style={styles.imageComparison}>
                                <View style={styles.imageContainer}>
                                    <Text style={styles.imageLabel}>Target Image</Text>
                                    <Image 
                                        source={{ uri: round.streetViewImage }} 
                                        style={styles.comparisonImage}
                                        resizeMode="cover"
                                    />
                                </View>

                                {round.photoUri && (
                                    <View style={styles.imageContainer}>
                                        <Text style={styles.imageLabel}>Your Photo</Text>
                                        <Image 
                                            source={{ uri: round.photoUri }} 
                                            style={styles.comparisonImage}
                                            resizeMode="cover"
                                        />
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Detailed Stats */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>📊 Detailed Analysis</Text>
                            
                            <View style={styles.statsContainer}>
                                <View style={styles.statRow}>
                                    <View style={styles.statItem}>
                                        <Ionicons name="image" size={20} color="#666" />
                                        <Text style={styles.statLabel}>Image Similarity</Text>
                                    </View>
                                    <Text style={[styles.statValue, { color: getScoreColor((round.similarity || 0) * 50) }]}>
                                        {round.similarity?.toFixed(1)}%
                                    </Text>
                                </View>

                                <View style={styles.statRow}>
                                    <View style={styles.statItem}>
                                        <Ionicons name="location" size={20} color="#666" />
                                        <Text style={styles.statLabel}>Distance</Text>
                                    </View>
                                    <Text style={[styles.statValue, { color: distance < 100 ? '#4CAF50' : distance < 500 ? '#FF9800' : '#F44336' }]}>
                                        {distance.toFixed(0)}m
                                    </Text>
                                </View>

                                <View style={styles.statRow}>
                                    <View style={styles.statItem}>
                                        <Ionicons name="time" size={20} color="#666" />
                                        <Text style={styles.statLabel}>Time Taken</Text>
                                    </View>
                                    <Text style={styles.statValue}>
                                        {round.endTime && round.startTime 
                                            ? `${Math.round((round.endTime - round.startTime) / 1000)}s`
                                            : 'N/A'
                                        }
                                    </Text>
                                </View>

                                <View style={styles.statRow}>
                                    <View style={styles.statItem}>
                                        <Ionicons name="trophy" size={20} color="#666" />
                                        <Text style={styles.statLabel}>Points Earned</Text>
                                    </View>
                                    <Text style={[styles.statValue, { color: getScoreColor(round.points || 0) }]}>
                                        {round.points || 0}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Score Breakdown */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>🎯 Score Breakdown</Text>
                            
                            <View style={styles.breakdownContainer}>
                                <View style={styles.breakdownItem}>
                                    <Text style={styles.breakdownLabel}>Similarity Score</Text>
                                    <Text style={styles.breakdownValue}>
                                        {Math.round((round.similarity || 0) * 0.6 * 50)} pts
                                    </Text>
                                    <Text style={styles.breakdownDetail}>
                                        {round.similarity?.toFixed(1)}% × 60% × 5000
                                    </Text>
                                </View>

                                <View style={styles.breakdownItem}>
                                    <Text style={styles.breakdownLabel}>Proximity Score</Text>
                                    <Text style={styles.breakdownValue}>
                                        {Math.round(Math.max(0, 100 - (distance / 1000) * 100) * 0.4 * 50)} pts
                                    </Text>
                                    <Text style={styles.breakdownDetail}>
                                        {Math.max(0, 100 - (distance / 1000) * 100).toFixed(1)}% × 40% × 5000
                                    </Text>
                                </View>

                                <View style={[styles.breakdownItem, styles.totalBreakdown]}>
                                    <Text style={styles.breakdownLabel}>Total Score</Text>
                                    <Text style={[styles.breakdownValue, { color: getScoreColor(round.points || 0) }]}>
                                        {round.points || 0} pts
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Next Button */}
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
    scrollView: {
        flex: 1,
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
        padding: 30,
        backgroundColor: 'white',
    },
    scoreCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    scoreText: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    scoreLabel: {
        fontSize: 10,
        color: '#666',
        marginTop: 2,
    },
    scoreMessage: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 12,
    },
    section: {
        backgroundColor: 'white',
        margin: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    locationContainer: {
        alignItems: 'center',
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 8,
    },
    locationPin: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    locationInfo: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    locationCoords: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'monospace',
        marginTop: 2,
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        width: '100%',
    },
    distanceLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#e0e0e0',
    },
    distanceText: {
        fontSize: 12,
        color: '#666',
        marginHorizontal: 12,
        fontWeight: '600',
    },
    imageComparison: {
        flexDirection: 'row',
        gap: 12,
    },
    imageContainer: {
        flex: 1,
    },
    imageLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    comparisonImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
    },
    statsContainer: {
        gap: 12,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    breakdownContainer: {
        gap: 12,
    },
    breakdownItem: {
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    totalBreakdown: {
        backgroundColor: '#e3f2fd',
        borderWidth: 1,
        borderColor: '#2196f3',
    },
    breakdownLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    breakdownValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 4,
    },
    breakdownDetail: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    buttonContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
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
