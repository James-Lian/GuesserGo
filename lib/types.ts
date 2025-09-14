export interface GameData {
    score: number;
    timer: number;
    opponents?: number; // Made optional for single player
    kmRadius: number;
    round: number;
    maxRounds: number;
    targetLocation?: {
        latitude: number;
        longitude: number;
    };
    gameStatus: 'waiting' | 'streetview' | 'camera' | 'scoring' | 'finished';
    playerRank?: number;
    totalPlayers?: number;
}

export interface GameRound {
    roundNumber: number;
    targetLocation: {
        latitude: number;
        longitude: number;
    };
    streetViewImage: string;
    timeLimit: number; // seconds
    startTime: number;
    endTime?: number;
    photoLocation?: {
        latitude: number;
        longitude: number;
    };
    photoUri?: string;
    similarity?: number;
    proximity?: number; // distance in meters
    points?: number;
    completed: boolean;
}

export interface GameSession {
    sessionId: string;
    totalRounds: number;
    currentRound: number;
    rounds: GameRound[];
    totalScore: number;
    gameStatus: 'waiting' | 'streetview' | 'camera' | 'scoring' | 'finished';
    startTime: number;
    endTime?: number;
}
