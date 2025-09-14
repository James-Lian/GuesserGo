# Game UI Features

## Overview

The GameUI component has been completely redesigned to display game information as overlays on the camera screen with proper API integration.

## Features

### 🎮 Game Data Display

- **Score**: Current player score with trophy icon
- **Timer**: Countdown timer with time icon (formatted as MM:SS)
- **Status**: Game status indicator with colored dot (active, waiting, paused, finished)
- **Round**: Current round and total rounds
- **Opponents**: Number of competing players
- **Radius**: Search radius in kilometers
- **Rank**: Player ranking (if available)

### 📸 Photo Capture & Submit

- **Capture Button**: Takes photo and stores location data
- **Submit Button**: Appears after photo is captured
- **Visual Feedback**: Button changes color and icon when photo is taken
- **State Management**: Tracks photo capture status

### 🎨 UI Design

- **Overlay Style**: Semi-transparent dark background
- **Positioned**: Top of screen with proper spacing
- **Responsive**: Adapts to different screen sizes
- **Icons**: Uses Ionicons for visual clarity
- **Color Coding**: Different colors for different statuses

## API Integration

### Game Data API (`lib/gameApi.ts`)

```typescript
interface GameData {
    score: number;
    timer: number;
    opponents: number;
    kmRadius: number;
    round: number;
    maxRounds: number;
    targetLocation?: {
        latitude: number;
        longitude: number;
    };
    gameStatus: 'waiting' | 'active' | 'paused' | 'finished';
    playerRank?: number;
    totalPlayers?: number;
}
```

### Functions

- `fetchGameData()`: Loads game data from API (placeholder implementation)
- `submitPhoto()`: Submits captured photo with location
- `updateGameStatus()`: Updates game status

## Usage in Camera Component

```typescript
<GameUI 
    gameData={{
        ...gameData,
        timer: timer
    }}
    onPhotoCapture={handlePhotoCapture}
    onSubmit={handleSubmit}
    isPhotoCaptured={isPhotoCaptured}
/>
```

## State Management

- **Local Timer**: Counts down from API-provided timer value
- **Photo State**: Tracks if photo has been captured
- **Game Data**: Loaded from API on component mount
- **Score Updates**: Real-time score updates after photo submission

## Future Enhancements

- Real-time multiplayer updates
- Push notifications for game events
- Advanced scoring algorithms
- Photo preview before submission
- Offline mode support
