import "../global.css"

import { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";

export default function RootLayout() {
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />    
        </Stack>
    );
}
