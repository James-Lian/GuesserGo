import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LocationMapProps {
    targetLocation: {
        latitude: number;
        longitude: number;
    };
    photoLocation?: {
        latitude: number;
        longitude: number;
    };
    distance: number;
}

const { width } = Dimensions.get('window');
const MAP_SIZE = width - 40;

export default function LocationMap({ targetLocation, photoLocation, distance }: LocationMapProps) {
    // Calculate relative positions for visualization
    const getRelativePosition = (lat: number, lon: number, isTarget: boolean) => {
        // Simple visualization - in a real app you'd use a proper map library
        const centerLat = targetLocation.latitude;
        const centerLon = targetLocation.longitude;
        
        const deltaLat = (lat - centerLat) * 100000; // Scale for visualization
        const deltaLon = (lon - centerLon) * 100000;
        
        const x = (MAP_SIZE / 2) + deltaLon;
        const y = (MAP_SIZE / 2) - deltaLat;
        
        return {
            x: Math.max(20, Math.min(MAP_SIZE - 20, x)),
            y: Math.max(20, Math.min(MAP_SIZE - 20, y)),
        };
    };

    const targetPos = getRelativePosition(targetLocation.latitude, targetLocation.longitude, true);
    const photoPos = photoLocation ? getRelativePosition(photoLocation.latitude, photoLocation.longitude, false) : null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📍 Location Map</Text>
            
            <View style={styles.mapContainer}>
                {/* Map Background */}
                <View style={styles.mapBackground}>
                    {/* Grid lines for reference */}
                    <View style={styles.gridLine} />
                    <View style={[styles.gridLine, { transform: [{ rotate: '90deg' }] }]} />
                    
                    {/* Target Location */}
                    <View style={[styles.locationMarker, styles.targetMarker, { left: targetPos.x - 15, top: targetPos.y - 15 }]}>
                        <Ionicons name="flag" size={20} color="white" />
                    </View>
                    
                    {/* Photo Location */}
                    {photoPos && (
                        <>
                            {/* Connection Line */}
                            <View 
                                style={[
                                    styles.connectionLine,
                                    {
                                        left: Math.min(targetPos.x, photoPos.x),
                                        top: Math.min(targetPos.y, photoPos.y),
                                        width: Math.abs(photoPos.x - targetPos.x),
                                        height: Math.abs(photoPos.y - targetPos.y),
                                    }
                                ]}
                            />
                            
                            <View style={[styles.locationMarker, styles.photoMarker, { left: photoPos.x - 15, top: photoPos.y - 15 }]}>
                                <Ionicons name="camera" size={20} color="white" />
                            </View>
                        </>
                    )}
                </View>
                
                {/* Legend */}
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendMarker, styles.targetMarker]} />
                        <Text style={styles.legendText}>Target Location</Text>
                    </View>
                    {photoLocation && (
                        <View style={styles.legendItem}>
                            <View style={[styles.legendMarker, styles.photoMarker]} />
                            <Text style={styles.legendText}>Your Photo</Text>
                        </View>
                    )}
                </View>
            </View>
            
            {/* Distance Info */}
            <View style={styles.distanceInfo}>
                <Text style={styles.distanceLabel}>Distance:</Text>
                <Text style={[styles.distanceValue, { color: distance < 100 ? '#4CAF50' : distance < 500 ? '#FF9800' : '#F44336' }]}>
                    {distance.toFixed(0)} meters
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    mapContainer: {
        alignItems: 'center',
    },
    mapBackground: {
        width: MAP_SIZE,
        height: MAP_SIZE,
        backgroundColor: '#f0f8ff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        position: 'relative',
        marginBottom: 16,
    },
    gridLine: {
        position: 'absolute',
        width: MAP_SIZE,
        height: 2,
        backgroundColor: '#e0e0e0',
        top: MAP_SIZE / 2,
        left: 0,
    },
    locationMarker: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    targetMarker: {
        backgroundColor: '#4CAF50',
    },
    photoMarker: {
        backgroundColor: '#FF6B6B',
    },
    connectionLine: {
        position: 'absolute',
        backgroundColor: '#FF6B6B',
        opacity: 0.6,
        borderWidth: 2,
        borderColor: '#FF6B6B',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendMarker: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
    },
    legendText: {
        fontSize: 12,
        color: '#666',
    },
    distanceInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    distanceLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    distanceValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
