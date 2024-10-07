import { Tabs } from "expo-router";
import React from "react";
import { Heart, Telescope } from "lucide-react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <Telescope color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Liked",
          tabBarIcon: ({ color, focused }) => <Heart color={color} />,
        }}
      />
    </Tabs>
  );
}
