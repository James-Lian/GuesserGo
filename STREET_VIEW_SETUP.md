# Street View Challenge Setup

## Google Street View API Setup

To use the Street View challenge feature, you'll need to set up a Google Street View Static API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Street View Static API"
4. Create credentials (API Key)
5. Set up your API key as an environment variable:
   - Create a `.env` file in the project root
   - Add: `GOOGLE_MAPS_KEY=your_actual_api_key_here`
   - Or set it in your system environment variables

## Troubleshooting

### Street View Images Not Loading

If you see a black screen or "Failed to load street view" error:

1. **Check API Key**: Make sure `GOOGLE_MAPS_KEY` is set correctly
2. **API Permissions**: Ensure the Street View Static API is enabled in Google Cloud Console
3. **API Quotas**: Check if you've exceeded your API quota limits
4. **Network**: Verify internet connection
5. **Fallback**: The app will show a placeholder image if the API key is missing

### Debug Information

The app logs helpful debug information:
- Generated street view URL
- API key presence status
- Image loading errors

Check the console/logs for these messages to diagnose issues.

## Features Implemented

### Camera2 Tab

- ✅ Removed drawing functionality
- ✅ Added image capture with location storage
- ✅ Added similarity calculation function (returns random percentage for now)
- ✅ Camera2 controls for taking pictures and switching camera

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

1. **Camera2 Tab**: Take pictures and get similarity scores with location data
2. **Explore Tab**: Navigate to camera or other features
3. **Street View Tab**: Generate location challenges and test your navigation skills

## Future Enhancements

- Implement real image similarity analysis using computer vision
- Add more sophisticated scoring algorithms
- Store challenge history
- Add multiplayer functionality
- Implement different challenge types
