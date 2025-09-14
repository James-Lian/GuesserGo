import * as Location from 'expo-location';

export interface ImageWithLocation {
    uri: string;
    coordinates: Location.LocationObject['coords'];
    timestamp: number;
}

export const calculateSimilarity = (imageUri: string, coordinates: Location.LocationObject['coords']): number => {
    // Random percentage for now - in real implementation this would:
    // 1. Analyze the image using computer vision
    // 2. Compare with target image features
    // 3. Consider location proximity
    // 4. Return a similarity score based on visual and geographical factors
    
    const baseSimilarity = Math.random() * 100;
    
    // Add some location-based variation (closer locations might have higher similarity)
    const locationBonus = Math.random() * 20;
    
    return Math.min(100, Math.floor(baseSimilarity + locationBonus));
};

export const storeImageWithLocation = async (imageUri: string, coordinates: Location.LocationObject['coords']): Promise<ImageWithLocation> => {
    const imageData: ImageWithLocation = {
        uri: imageUri,
        coordinates: coordinates,
        timestamp: Date.now()
    };
    
    // In a real app, you might want to save this to AsyncStorage or a database
    console.log('Stored image with location:', imageData);
    
    return imageData;
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

export const generateRandomLocation = (centerLat: number, centerLon: number, radiusKm: number = 5): {latitude: number, longitude: number} => {
    // Convert radius from km to degrees (approximate)
    const radiusDegrees = radiusKm / 111; // 1 degree ≈ 111 km
    
    // Generate random offset within radius
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusDegrees;
    
    const newLat = centerLat + (distance * Math.cos(angle));
    const newLon = centerLon + (distance * Math.sin(angle));
    
    return { latitude: newLat, longitude: newLon };
};
