import { ContextProvider } from '@/components/Context';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/lib/store';

import "../global.css"

export default function RootLayout() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ContextProvider>
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    </Stack>
                </ContextProvider>
            </PersistGate>
        </Provider>
    );
}
