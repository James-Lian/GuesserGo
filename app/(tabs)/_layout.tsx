import { Tabs } from 'expo-router';
import React from 'react';

import "../../global.css"

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
        }}>
        <Tabs.Screen
            name="index"
            options={{
                title: 'Rooms',
            }}
        />
        <Tabs.Screen
            name="explore"
            options={{
                title: 'Explore',
            }}
        />
        <Tabs.Screen
            name="streetview"
            options={{
                title: 'Street View',
            }}
        />
        </Tabs>
    );
}
