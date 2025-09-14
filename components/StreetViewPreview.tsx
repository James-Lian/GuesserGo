import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface StreetViewPreviewProps {
    streetViewImage: string;
    targetLocation: {
        latitude: number;
        longitude: number;
    };
    roundNumber: number;
    totalRounds: number;
    onComplete: () => void;
}

// const { width, height } = Dimensions.get('window'); // Unused for now

export default function StreetViewPreview({ 
    streetViewImage, 
    targetLocation, 
    roundNumber, 
    totalRounds, 
    onComplete 
}: StreetViewPreviewProps) {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [imageKey, setImageKey] = useState(0);

    const handleContinue = () => {
        console.log('StreetViewPreview: Continue button pressed, calling onComplete');
        onComplete();
    };

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
        console.error('Failed to load street view image:', streetViewImage);
    };

    const handleRetry = () => {
        setImageError(false);
        setImageLoading(true);
        setImageKey(prev => prev + 1); // Force image reload by changing key
    };

    // Reset loading state when streetViewImage changes
    useEffect(() => {
        setImageLoading(true);
        setImageError(false);
        setImageKey(prev => prev + 1);
    }, [streetViewImage]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.roundInfo}>
                    <Text style={styles.roundText}>Round {roundNumber} of {totalRounds}</Text>
                    <Text style={styles.instructionText}>Study this location carefully!</Text>
                </View>
                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
                {imageLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                        <Text style={styles.loadingText}>Loading street view...</Text>
                    </View>
                )}
                {imageError && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="image-outline" size={64} color="#ccc" />
                        <Text style={styles.errorText}>Failed to load street view</Text>
                        <Text style={styles.errorSubtext}>Please try again</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <Image 
                    key={imageKey}
                    source={{ uri: streetViewImage }} 
                    style={[styles.streetViewImage, (imageLoading || imageError) && styles.hiddenImage]}
                    resizeMode="cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
                <View style={styles.overlay}>
                    <View style={styles.locationInfo}>
                        <Ionicons name="location" size={20} color="white" />
                        <Text style={styles.locationText}>
                            {targetLocation.latitude.toFixed(6)}, {targetLocation.longitude.toFixed(6)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.tipContainer}>
                    <Ionicons name="bulb" size={20} color="#FFD700" />
                    <Text style={styles.tipText}>
                        Find this exact location and take a photo to score points!
                    </Text>
                </View>
                <TouchableOpacity style={styles.bottomContinueButton} onPress={handleContinue}>
                    <Text style={styles.bottomContinueButtonText}>Ready to Find Location</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    roundInfo: {
        flex: 1,
    },
    roundText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    instructionText: {
        color: '#ccc',
        fontSize: 14,
        marginTop: 2,
    },
    continueButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        flex: 1,
        position: 'relative',
    },
    streetViewImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 16,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 8,
        fontFamily: 'monospace',
    },
    footer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
    },
    tipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    tipText: {
        color: '#FFD700',
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    bottomContinueButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginTop: 16,
        alignItems: 'center',
    },
    bottomContinueButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorText: {
        marginTop: 16,
        fontSize: 18,
        color: '#666',
        fontWeight: 'bold',
    },
    errorSubtext: {
        marginTop: 8,
        fontSize: 14,
        color: '#999',
    },
    hiddenImage: {
        opacity: 0,
    },
    retryButton: {
        marginTop: 16,
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
