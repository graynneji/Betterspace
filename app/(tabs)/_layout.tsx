import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  // const styles = createStyles(colors);


  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.text,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowRadius: 8,
            position: 'relative',
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}>
        <Tabs.Screen
          name="session"
          options={{
            title: 'Session',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={24}
                name={focused ? "chatbubbles" : "chatbubbles-outline"}
                color={color} />
            ),
            tabBarBadge: 10
          }} />
        <Tabs.Screen
          name="schedule"
          options={{
            title: 'Schedule',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={24}
                name={focused ? "calendar" : "calendar-outline"}
                color={color} />
            ),
          }} />
        <Tabs.Screen
          name="community"
          options={{
            title: 'Community',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={24}
                name={focused ? "people" : "people-outline"}
                color={color} />
            ),
          }} />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={24}
                name={focused ? "grid" : "grid-outline"}
                color={color} />
            ),
          }} />
        <Tabs.Screen
          name="therapist-dashboard"
          options={{
            href: null,
          }} />
        <Tabs.Screen
          name="discussion-view"
          options={{
            href: null,
          }} />
      </Tabs></>
  );
}