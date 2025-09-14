# Round Results Screen Documentation

## Overview
A comprehensive results screen that displays between rounds, showing detailed comparison between the target location and the user's photo location.

## Features

### 🗺️ **Location Visualization**
- **Visual Map**: Shows target location (green flag) vs photo location (red camera icon)
- **Distance Line**: Visual connection between the two points
- **Distance Display**: Exact distance in meters with color coding
- **Legend**: Clear indicators for target vs photo locations

### 📍 **Location Details**
- **Target Location**: Exact coordinates of the street view target
- **Photo Location**: Exact coordinates where the user took their photo
- **Distance Calculation**: Precise distance between the two points
- **Visual Comparison**: Side-by-side coordinate display

### 📸 **Image Comparison**
- **Side-by-Side Display**: Target street view image vs user's photo
- **Clear Labels**: "Target Image" and "Your Photo" labels
- **Consistent Sizing**: Both images displayed at same size for easy comparison

### 📊 **Detailed Analysis**
- **Image Similarity**: Percentage from the similarity function (random for now)
- **Distance**: Exact distance in meters with color coding
- **Time Taken**: How long the user took to complete the round
- **Points Earned**: Final score for the round

### 🎯 **Score Breakdown**
- **Similarity Score**: How much the similarity contributed to the final score
- **Proximity Score**: How much the distance contributed to the final score
- **Total Score**: Final points earned with color coding
- **Formula Display**: Shows the calculation breakdown

## Visual Design

### **Color Coding**
- **Green (#4CAF50)**: Excellent performance (4000+ points, <100m distance)
- **Orange (#FF9800)**: Good performance (2500+ points, <500m distance)
- **Yellow (#FFC107)**: Average performance (1000+ points)
- **Red (#F44336)**: Poor performance (<1000 points, >500m distance)

### **Layout Structure**
1. **Header**: Round number and final round indicator
2. **Score Display**: Large circular score with color-coded border
3. **Location Map**: Visual representation of both locations
4. **Location Details**: Coordinate comparison with distance
5. **Image Comparison**: Side-by-side photo display
6. **Detailed Analysis**: Statistics and metrics
7. **Score Breakdown**: Formula explanation
8. **Next Button**: Proceed to next round or end screen

## Components

### **RoundResultsScreen** (`components/RoundResultsScreen.tsx`)
Main results screen component that orchestrates all the display elements.

### **LocationMap** (`components/LocationMap.tsx`)
Visual map component showing the relative positions of target and photo locations.

## Data Flow

### **Input Data**
```typescript
interface GameRound {
    roundNumber: number;
    targetLocation: { latitude: number; longitude: number };
    streetViewImage: string;
    photoLocation?: { latitude: number; longitude: number };
    photoUri?: string;
    similarity?: number; // 0-100%
    proximity?: number; // Distance in meters
    points?: number; // 0-5000
    startTime: number;
    endTime?: number;
}
```

### **Calculations**
- **Distance**: Haversine formula for accurate distance calculation
- **Score Breakdown**: 
  - Similarity Score = similarity% × 60% × 5000
  - Proximity Score = (100 - distance/1000 × 100)% × 40% × 5000
  - Total Score = Similarity Score + Proximity Score

## User Experience

### **Progressive Disclosure**
- Initial display shows only score
- Details appear after 1-second delay
- Smooth animations and transitions

### **Information Hierarchy**
1. **Primary**: Score and overall performance
2. **Secondary**: Location and image comparison
3. **Tertiary**: Detailed statistics and breakdown

### **Accessibility**
- Clear color coding for different performance levels
- Large, readable text
- Intuitive icons and visual indicators
- Consistent spacing and layout

## Integration

### **Game Flow Integration**
- Replaces the simple `ScoringScreen` component
- Seamlessly integrates with the existing game state management
- Maintains the same interface for easy replacement

### **State Management**
- Uses existing `GameRound` data structure
- No additional state management required
- Leverages existing game state manager

## Future Enhancements

### **Map Improvements**
- Integration with real map library (Mapbox, Google Maps)
- Satellite view option
- Street view integration
- Zoom and pan functionality

### **Image Analysis**
- Real image similarity analysis
- Feature detection and comparison
- AI-powered similarity scoring

### **Social Features**
- Share results on social media
- Compare with friends' results
- Leaderboard integration

### **Analytics**
- Detailed performance tracking
- Improvement suggestions
- Historical performance data

## Technical Details

### **Performance**
- Efficient image loading and caching
- Optimized distance calculations
- Smooth animations and transitions

### **Responsive Design**
- Adapts to different screen sizes
- Consistent layout across devices
- Touch-friendly interface

### **Error Handling**
- Graceful handling of missing data
- Fallback displays for incomplete rounds
- Robust coordinate validation
