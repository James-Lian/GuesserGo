require('dotenv').config();

export default {
    "expo": {
        "owner": "jameslian",
        "name": "htn-scavenger",
        "slug": "htn-scavenger",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/images/icon.png",
        "scheme": "htnscavenger",
        "userInterfaceStyle": "automatic",
        "newArchEnabled": true,
        "ios": {
            "supportsTablet": true,
            "bundleIdentifier": "com.jameslian.htn-scavenger",
            "infoPlist": {
                "ITSAppUsesNonExemptEncryption": false
            }
        },
        "android": {
            "package": "com.jameslian.htnscavenger",
            "adaptiveIcon": {
                "backgroundColor": "#E6F4FE",
                "foregroundImage": "./assets/images/android-icon-foreground.png",
                "backgroundImage": "./assets/images/android-icon-background.png",
                "monochromeImage": "./assets/images/android-icon-monochrome.png"
            },
            "edgeToEdgeEnabled": true,
            "predictiveBackGestureEnabled": false
        },
        "web": {
            "bundler": "metro",
            "output": "static",
            "favicon": "./assets/images/favicon.png"
        },
        "extra": {
            "eas": {
                "projectId": "04539d37-dde2-49d9-91c4-9fe13859715c"
            }
        },
        "plugins": [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    "image": "./assets/images/splash-icon.png",
                    "imageWidth": 200,
                    "resizeMode": "contain",
                    "backgroundColor": "#ffffff",
                    "dark": {
                        "backgroundColor": "#000000"
                    }
                }
            ],
            [
                "expo-camera",
                    {
                        "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
                        "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
                        "recordAudioAndroid": true
                    }
            ],
            [
                    "@rnmapbox/maps", {
                        "RNMapboxMapsDownloadToken": process.env.MAPBOX_DOWNLOADSDK
                    }
            ],
            [
                "expo-location",
                {
                    "locationWhenInUsePermission": "Allow $(PRODUCT_NAME) to display your location on a map."
                }
            ],
            [
                "expo-camera",
                {
                    "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
                }
            ],
        ],
        "experiments": {
            "typedRoutes": true,
            "reactCompiler": true
        }
    }
}
