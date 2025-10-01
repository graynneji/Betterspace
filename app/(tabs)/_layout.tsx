// import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import TabBarBackground from '@/components/ui/TabBarBackground';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import {
//   QueryClient,
//   QueryClientProvider,
// } from '@tanstack/react-query';
// import { Tabs } from 'expo-router';
// import React from 'react';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <QueryClientProvider client={new QueryClient()}>

//       <Tabs
//         screenOptions={{
//           // tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
//           tabBarActiveTintColor: '#222',
//           headerShown: false,
//           tabBarButton: HapticTab,
//           tabBarBackground: TabBarBackground,
//           tabBarStyle: {
//             backgroundColor: '#fff',
//             borderTopWidth: 0,
//             elevation: 0,
//             position: 'relative',
//           },
//           tabBarLabelStyle: {
//             fontSize: 12,
//           },
//         }}>
//         <Tabs.Screen
//           name="chat"
//           options={{
//             title: 'Chat',
//             tabBarIcon: ({ color }) => <IconSymbol size={28} name="bubble.left.and.bubble.right.fill" color={color} />,
//           }}
//         />
//         <Tabs.Screen
//           name="schedule"
//           options={{
//             title: 'Schedule',
//             tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
//           }}
//         />
//         <Tabs.Screen
//           name="community"
//           options={{
//             title: 'Community',
//             tabBarIcon: ({ color }) =>
//               <IconSymbol size={32} name="person.3.fill" color={color} />,
//           }}
//         />
//         <Tabs.Screen
//           name="more"
//           options={{
//             title: 'More',
//             tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.grid.2x2.fill" color={color} />,
//           }}
//         />
//       </Tabs>
//     </QueryClientProvider>
//   );
// }

import { HapticTab } from '@/components/HapticTab';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#222',
        headerShown: false,
        tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        tabBarStyle: {
          // backgroundColor: '#fff',
          backgroundColor: '#f9fafb',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          // shadowOpacity: 0.1,
          shadowRadius: 8,
          position: 'relative',
          paddingTop: 8,
          // paddingBottom: 8,
          // height: 70,
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
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "calendar" : "calendar-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "people" : "people-outline"}
              color={color}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="therapist-dashboard"
        options={{
          href: null,
        }}
      /> */}
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "grid" : "grid-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="therapist-dashboard"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}