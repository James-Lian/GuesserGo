import { GameRound, GameSession } from './types';

export class GameStateManager {
    private static instance: GameStateManager;
    private gameSession: GameSession | null = null;

    static getInstance(): GameStateManager {
        if (!GameStateManager.instance) {
            GameStateManager.instance = new GameStateManager();
        }
        return GameStateManager.instance;
    }

    startNewGame(): GameSession {
        const sessionId = `game_${Date.now()}`;
        this.gameSession = {
            sessionId,
            totalRounds: 5,
            currentRound: 0,
            rounds: [],
            totalScore: 0,
            gameStatus: 'waiting',
            startTime: Date.now(),
        };
        console.log('GameStateManager: New game started', this.gameSession);
        return this.gameSession;
    }

    getCurrentSession(): GameSession | null {
        return this.gameSession;
    }

    startRound(targetLocation: { latitude: number; longitude: number }, streetViewImage: string, timeLimit: number = 60): GameRound {
        if (!this.gameSession) {
            throw new Error('No active game session');
        }

        const round: GameRound = {
            roundNumber: this.gameSession.currentRound + 1,
            targetLocation,
            streetViewImage,
            timeLimit,
            startTime: Date.now(),
            completed: false,
        };

        this.gameSession.rounds.push(round);
        this.gameSession.currentRound = round.roundNumber;
        this.gameSession.gameStatus = 'streetview';
        console.log('GameStateManager: Round started', round);

        return round;
    }

    moveToCameraPhase() {
        if (!this.gameSession) {
            console.log('GameStateManager: No game session, cannot move to camera phase');
            return;
        }
        console.log('GameStateManager: Moving to camera phase from', this.gameSession.gameStatus);
        this.gameSession.gameStatus = 'camera';
        console.log('GameStateManager: Status updated to', this.gameSession.gameStatus);
    }

    submitPhoto(photoUri: string, photoLocation: { latitude: number; longitude: number }, similarity: number): number {
        if (!this.gameSession) return 0;

        const currentRound = this.getCurrentRound();
        if (!currentRound) return 0;

        // Calculate proximity (distance in meters)
        const proximity = this.calculateDistance(
            currentRound.targetLocation.latitude,
            currentRound.targetLocation.longitude,
            photoLocation.latitude,
            photoLocation.longitude
        ) * 1000; // Convert km to meters

        // Calculate points using the formula
        const points = this.calculatePoints(similarity, proximity);

        // Update round data
        currentRound.photoUri = photoUri;
        currentRound.photoLocation = photoLocation;
        currentRound.similarity = similarity;
        currentRound.proximity = proximity;
        currentRound.points = points;
        currentRound.completed = true;
        currentRound.endTime = Date.now();

        // Update session
        this.gameSession.totalScore += points;
        this.gameSession.gameStatus = 'scoring';
        console.log('GameStateManager: Photo submitted, points:', points, 'total score:', this.gameSession.totalScore);

        return points;
    }

    timeUp() {
        if (!this.gameSession) return;

        const currentRound = this.getCurrentRound();
        if (!currentRound) return;

        currentRound.completed = true;
        currentRound.endTime = Date.now();
        currentRound.points = 0;

        this.gameSession.gameStatus = 'scoring';
        console.log('GameStateManager: Time up, moving to scoring phase');
    }

    nextRound() {
        if (!this.gameSession) return;

        if (this.gameSession.currentRound >= this.gameSession.totalRounds) {
            this.endGame();
        } else {
            this.gameSession.gameStatus = 'waiting';
            console.log('GameStateManager: Moving to next round, status set to waiting');
        }
    }

    endGame() {
        if (!this.gameSession) return;

        this.gameSession.gameStatus = 'finished';
        this.gameSession.endTime = Date.now();
        console.log('GameStateManager: Game ended, final score:', this.gameSession.totalScore);
    }

    getCurrentRound(): GameRound | null {
        if (!this.gameSession || this.gameSession.rounds.length === 0) return null;
        return this.gameSession.rounds[this.gameSession.rounds.length - 1];
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    private calculatePoints(similarity: number, proximity: number): number {
        // Base similarity score (0-100)
        const similarityScore = similarity;
        
        // Proximity score (closer = higher score)
        // Perfect proximity (0m) = 100 points, 1000m = 0 points
        const maxDistance = 1000; // meters
        const proximityScore = Math.max(0, 100 - (proximity / maxDistance) * 100);
        
        // Combined score with weights
        // 60% similarity, 40% proximity
        const combinedScore = (similarityScore * 0.6) + (proximityScore * 0.4);
        
        // Scale to 0-5000 points
        const finalPoints = Math.round((combinedScore / 100) * 5000);
        
        return Math.max(0, finalPoints);
    }

    reset() {
        this.gameSession = null;
        console.log('GameStateManager: Game state reset');
    }
}
