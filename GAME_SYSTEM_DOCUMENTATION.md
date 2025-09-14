# Complete Round-Based Game System

## Overview

A complete 5-round location-based photo challenge game with street view preview, camera timer, scoring system, and end screen.

## Game Flow

### 1. **Game Start** (`app/(tabs)/streetview.tsx`)

- User clicks "Start Game" button
- Creates new game session with 5 rounds
- Navigates to main game screen

### 2. **Round Loop** (`app/game.tsx`)

Each round follows this sequence:

#### **Street View Phase** (5 seconds)

- Displays random street view image
- Shows target coordinates
- 5-second countdown timer
- Auto-advances to camera phase

#### **Camera2 Phase** (60 seconds)

- User navigates to find the location
- Camera2 interface with timer overlay
- Photo capture and submit functionality
- Auto-submit if time runs out (0 points)

#### **Scoring Phase**

- Shows similarity percentage and proximity
- Displays points earned
- Shows photo taken
- Auto-advances to next round

### 3. **End Screen**

- Total score and grade (S, A, B, C, D)
- Round-by-round breakdown
- Play again or exit options

## Key Components

### **Game State Management** (`lib/gameState.ts`)

```typescript
class GameStateManager {
    // Singleton pattern for global state
    startNewGame(): GameSession
    startRound(): GameRound
    submitPhoto(): number // Returns points
    timeUp(): void // Auto-submit with 0 points
    nextRound(): void
    endGame(): void
}
```

### **Scoring Formula**

```typescript
// 60% similarity + 40% proximity
const combinedScore = (similarity * 0.6) + (proximity * 0.4);
const finalPoints = Math.round((combinedScore / 100) * 5000);
```

**Maximum Points: 5000**

- Perfect similarity (100%) + Perfect proximity (0m) = 5000 points
- Poor similarity (20%) + Far proximity (1000m) = 0 points

### **Components**

#### **StreetViewPreview** (`components/StreetViewPreview.tsx`)

- 5-second countdown display
- Street view image with coordinates
- Auto-advance to camera phase

#### **Camera2** (`app/(tabs)/camera2.tsx`)

- 60-second timer with auto-submit
- Photo capture with location storage
- GameUI overlay with real-time updates

#### **ScoringScreen** (`components/ScoringScreen.tsx`)

- Points earned with color coding
- Similarity and proximity details
- Photo preview
- Auto-advance to next round

#### **EndScreen** (`components/EndScreen.tsx`)

- Total score with grade system
- Round-by-round breakdown
- Statistics (total time, average score, best round)
- Play again/exit options

## Game States

```typescript
type GameStatus = 'waiting' | 'streetview' | 'camera' | 'scoring' | 'finished';
```

### State Transitions:

1. `waiting` → `streetview` (Start round)
2. `streetview` → `camera` (After 5 seconds)
3. `camera` → `scoring` (After photo submit or timeout)
4. `scoring` → `waiting` (Next round) or `finished` (Game complete)

## Round Data Structure

```typescript
interface GameRound {
    roundNumber: number;
    targetLocation: { latitude: number; longitude: number };
    streetViewImage: string;
    timeLimit: number; // 60 seconds
    startTime: number;
    endTime?: number;
    photoLocation?: { latitude: number; longitude: number };
    photoUri?: string;
    similarity?: number; // 0-100%
    proximity?: number; // Distance in meters
    points?: number; // 0-5000
    completed: boolean;
}
```

## Features

### ✅ **Implemented Features:**

- 5-round game loop with automatic progression
- 5-second street view preview with countdown
- 60-second camera timer with auto-submit
- Location-based photo capture and storage
- Similarity calculation (placeholder function)
- Proximity-based scoring system
- Point formula: 60% similarity + 40% proximity
- Maximum 5000 points per round
- End screen with total score and grade
- Round-by-round breakdown
- Play again functionality

### 🎮 **Game Mechanics:**

- **Time Pressure**: 60 seconds per round creates urgency
- **Location Challenge**: Find exact street view location
- **Scoring System**: Rewards both accuracy and proximity
- **Progressive Difficulty**: Each round is independent
- **Feedback**: Immediate scoring and detailed breakdown

### 📱 **User Experience:**
- Smooth transitions between phases
- Clear visual feedback and instructions
- Real-time timer and score updates
- Professional UI with proper styling
- Error handling and loading states

## Setup Requirements

### **Google Street View API**
Replace `YOUR_GOOGLE_STREET_VIEW_API_KEY` in:
- `app/game.tsx` (line 45)
- `app/(tabs)/streetview.tsx` (line 24)

### **Location Permissions**
- Required for photo capture with coordinates
- Required for proximity calculations

## Future Enhancements

- **Real Image Similarity**: Replace placeholder with computer vision
- **Multiplayer Mode**: Real-time competition with other players
- **Difficulty Levels**: Adjustable time limits and radius
- **Achievement System**: Unlock rewards for high scores
- **Leaderboards**: Global and local high scores
- **Custom Challenges**: User-generated locations
- **Offline Mode**: Download challenges for offline play

## Technical Architecture

- **State Management**: Singleton pattern with observer pattern
- **Navigation**: Expo Router with screen transitions
- **Camera2**: Expo Camera2 with location integration
- **Storage**: In-memory state (can be extended to persistent storage)
- **API Integration**: Placeholder functions ready for real APIs
- **Error Handling**: Comprehensive error states and user feedback
