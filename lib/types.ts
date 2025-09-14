export type GameStatus = 'waiting' | 'streetview' | 'camera' | 'scoring' | 'finished';

export interface GameData {
    score: number;
    timer: number;
    opponents?: number;
    kmRadius: number;
    round: number;
    maxRounds: number;
    targetLocation?: {
        latitude: number;
        longitude: number;
    };
    gameStatus: GameStatus;
    playerRank?: number;
    totalPlayers?: number;
}

export interface GameRound {
    roundNumber: number;
    targetLocation: {
        latitude: number;
        longitude: number;
    };
    streetViewUrl: string;
    timeLimit: number;
    startTime: string;
    endTime?: string | null;
    photoLocation?: {
        latitude: number;
        longitude: number;
    } | null;
    photoUri?: string | null;
    similarity?: number;
    distance?: number;
    points?: number;
    isCompleted: boolean;
}

export interface GameSession {
    gameId: string;
    totalRounds: number;
    currentRound: number;
    rounds: GameRound[];
    totalScore: number;
    gameStatus: GameStatus;
    startTime: string;
    endTime?: string | null;
}
