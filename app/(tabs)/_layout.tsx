import { Tabs } from 'expo-router';
import React from 'react';
import {useColorScheme} from "nativewind";
import {HapticTab} from "@/app-example/components/haptic-tab";
import {Colors} from "@/app-example/constants/theme";
import {IconSymbol} from "@/app-example/components/ui/icon-symbol.ios";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
