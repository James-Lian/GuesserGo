import { ContextProvider } from '@/components/Context';
import { Stack } from 'expo-router';

import "../global.css"

export default function RootLayout() {

    return (
        <ContextProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </ContextProvider>
  );
}
