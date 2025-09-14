# Street View Challenge Setup

## Google Street View API Setup

To use the Street View challenge feature, you'll need to set up a Google Street View Static API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Street View Static API"
4. Create credentials (API Key)
5. Replace `YOUR_GOOGLE_STREET_VIEW_API_KEY` in `app/(tabs)/streetview.tsx` with your actual API key

## Features Implemented

### Camera Tab

- ✅ Removed drawing functionality
- ✅ Added image capture with location storage
- ✅ Added similarity calculation function (returns random percentage for now)
- ✅ Camera controls for taking pictures and switching camera

### Explore Tab

- ✅ Removed map component
- ✅ Simplified to basic navigation screen

### Street View Tab (New)

- ✅ Takes user's current location
- ✅ Finds random street within specified radius (default 5km)
- ✅ Calls Google Street View API to get image at random coordinates
- ✅ Allows user to check if they've found the correct location
- ✅ Scoring system based on proximity to target

## Utility Functions

Created `lib/imageUtils.ts` with reusable functions:

- `calculateSimilarity()` - Returns similarity percentage (random for now)
- `storeImageWithLocation()` - Stores image with coordinates
- `calculateDistance()` - Calculates distance between two coordinates
- `generateRandomLocation()` - Generates random location within radius

## Usage

1. **Camera Tab**: Take pictures and get similarity scores with location data
2. **Explore Tab**: Navigate to camera or other features
3. **Street View Tab**: Generate location challenges and test your navigation skills

## Future Enhancements

- Implement real image similarity analysis using computer vision
- Add more sophisticated scoring algorithms
- Store challenge history
- Add multiplayer functionality
- Implement different challenge types
