import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameSession, GameRound, GameStatus } from './types';

interface GameState {
  gameSession: GameSession | null;
  currentRound: GameRound | null;
  streetViewImage: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: GameState = {
  gameSession: null,
  currentRound: null,
  streetViewImage: '',
  isLoading: false,
  error: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Game session management
    startNewGame: (state) => {
      state.gameSession = {
        gameId: `game_${Date.now()}`,
        gameStatus: 'waiting' as GameStatus,
        currentRound: 1,
        totalRounds: 5,
        totalScore: 0,
        startTime: new Date().toISOString(),
        endTime: null,
        rounds: [],
      };
      state.currentRound = null;
      state.streetViewImage = '';
      state.error = null;
    },

    // Round management
    startRound: (state, action: PayloadAction<{
      targetLocation: { latitude: number; longitude: number };
      streetViewUrl: string;
      timeLimit: number;
    }>) => {
      if (!state.gameSession) return;

      const { targetLocation, streetViewUrl, timeLimit } = action.payload;
      
      state.currentRound = {
        roundNumber: state.gameSession.currentRound,
        targetLocation,
        streetViewUrl,
        timeLimit,
        startTime: new Date().toISOString(),
        endTime: null,
        photoUri: null,
        photoLocation: null,
        similarity: 0,
        distance: 0,
        points: 0,
        isCompleted: false,
      };

      state.streetViewImage = streetViewUrl;
      state.gameSession.gameStatus = 'streetview';
      state.isLoading = false;
    },

    // Phase transitions
    moveToCameraPhase: (state) => {
      if (state.gameSession) {
        state.gameSession.gameStatus = 'camera';
      }
    },

    moveToScoringPhase: (state) => {
      if (state.gameSession) {
        state.gameSession.gameStatus = 'scoring';
      }
    },

    // Photo submission
    submitPhoto: (state, action: PayloadAction<{
      photoUri: string;
      photoLocation: { latitude: number; longitude: number };
      similarity: number;
      points: number;
    }>) => {
      if (!state.currentRound || !state.gameSession) return;

      const { photoUri, photoLocation, similarity, points } = action.payload;
      
      // Calculate distance
      const distance = calculateDistance(
        state.currentRound.targetLocation.latitude,
        state.currentRound.targetLocation.longitude,
        photoLocation.latitude,
        photoLocation.longitude
      );

      // Update round
      state.currentRound.photoUri = photoUri;
      state.currentRound.photoLocation = photoLocation;
      state.currentRound.similarity = similarity;
      state.currentRound.distance = distance;
      state.currentRound.points = points;
      state.currentRound.endTime = new Date().toISOString();
      state.currentRound.isCompleted = true;

      // Add to rounds array
      state.gameSession.rounds.push({ ...state.currentRound });
      
      // Update total score
      state.gameSession.totalScore += points;
      
      // Move to scoring phase
      state.gameSession.gameStatus = 'scoring';
    },

    // Time up
    timeUp: (state) => {
      if (!state.currentRound || !state.gameSession) return;

      // Mark round as completed with 0 points
      state.currentRound.endTime = new Date().toISOString();
      state.currentRound.isCompleted = true;
      state.currentRound.points = 0;

      // Add to rounds array
      state.gameSession.rounds.push({ ...state.currentRound });
      
      // Move to scoring phase
      state.gameSession.gameStatus = 'scoring';
    },

    // Next round
    nextRound: (state) => {
      if (!state.gameSession) return;

      if (state.gameSession.currentRound < state.gameSession.totalRounds) {
        state.gameSession.currentRound += 1;
        state.gameSession.gameStatus = 'waiting';
        state.currentRound = null;
        state.streetViewImage = '';
      } else {
        // Game finished
        state.gameSession.gameStatus = 'finished';
        state.gameSession.endTime = new Date().toISOString();
      }
    },

    // End game
    endGame: (state) => {
      if (state.gameSession) {
        state.gameSession.gameStatus = 'finished';
        state.gameSession.endTime = new Date().toISOString();
      }
    },

    // Reset game
    reset: (state) => {
      state.gameSession = null;
      state.currentRound = null;
      state.streetViewImage = '';
      state.isLoading = false;
      state.error = null;
    },

    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set street view image
    setStreetViewImage: (state, action: PayloadAction<string>) => {
      state.streetViewImage = action.payload;
    },
  },
});

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

export const {
  startNewGame,
  startRound,
  moveToCameraPhase,
  moveToScoringPhase,
  submitPhoto,
  timeUp,
  nextRound,
  endGame,
  reset,
  setLoading,
  setError,
  setStreetViewImage,
} = gameSlice.actions;

export default gameSlice.reducer;
