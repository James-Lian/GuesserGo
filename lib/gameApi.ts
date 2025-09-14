import { GameData } from '@/components/GameUI';

// Placeholder API function - replace with actual API calls
export const fetchGameData = async (gameId?: string): Promise<GameData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data - replace with actual API call
    return {
        score: Math.floor(Math.random() * 1000),
        timer: 300, // 5 minutes in seconds
        opponents: Math.floor(Math.random() * 8) + 1,
        kmRadius: Math.floor(Math.random() * 5) + 1,
        round: Math.floor(Math.random() * 5) + 1,
        maxRounds: 5,
        targetLocation: {
            latitude: 43.47260261491713 + (Math.random() - 0.5) * 0.01,
            longitude: -80.53998 + (Math.random() - 0.5) * 0.01,
        },
        gameStatus: 'active' as const,
        playerRank: Math.floor(Math.random() * 10) + 1,
        totalPlayers: Math.floor(Math.random() * 20) + 5,
    };
};

export const submitPhoto = async (photoUri: string, coordinates: { latitude: number; longitude: number }): Promise<{ success: boolean; similarity: number; points: number }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock response - replace with actual API call
    const similarity = Math.floor(Math.random() * 100);
    const points = Math.floor(similarity * 10);
    
    return {
        success: true,
        similarity,
        points,
    };
};

export const updateGameStatus = async (gameId: string, status: GameData['gameStatus']): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock response - replace with actual API call
    console.log(`Updating game ${gameId} status to ${status}`);
    return true;
};
