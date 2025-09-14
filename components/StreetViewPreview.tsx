import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
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
    const handleContinue = () => {
        console.log('StreetViewPreview: Continue button pressed, calling onComplete');
        onComplete();
    };

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
                <Image 
                    source={{ uri: streetViewImage }} 
                    style={styles.streetViewImage}
                    resizeMode="cover"
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
});
