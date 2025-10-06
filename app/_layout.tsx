// import ErrorBoundary from '@/components/ErrorBoundary';
// import { AuthProvider } from '@/context/AuthContext';
// import { PatientIdProvider } from '@/context/patientIdContext';
// import { queryClient } from '@/utils/queryClient';
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { QueryClientProvider } from '@tanstack/react-query';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect } from 'react';
// import { useColorScheme } from 'react-native';
// import 'react-native-reanimated';
// import Toast from 'react-native-toast-message';
// // import { createNotifications } from 'react-native-notificated';
// // const { NotificationsProvider, useNotifications } = createNotifications();


// SplashScreen.preventAutoHideAsync();
// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });


//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (

//     <AuthProvider>
//       <PatientIdProvider>
//         {/* <ThemeProvider value={DefaultTheme}> */}
//         <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//           <QueryClientProvider client={queryClient}>
//             <ErrorBoundary>
//               <Stack>
//                 <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//                 <Stack.Screen name="+not-found" />
//                 <Stack.Screen name="index" options={{ headerShown: false, headerShadowVisible: false, }} />
//               </Stack>
//             </ErrorBoundary>
//           </QueryClientProvider>
//           <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
//           <Toast />
//           {/* <Toast config={toastConfig} /> */}
//         </ThemeProvider>
//       </PatientIdProvider>
//     </AuthProvider>
//   );
// }
import ErrorBoundary from '@/components/ErrorBoundary';
import { Colors } from '@/constants/Colors';
import { AuthProvider } from '@/context/AuthContext';
import { PatientIdProvider } from '@/context/patientIdContext';
import { queryClient } from '@/utils/queryClient';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

// Custom Light Theme using your Colors.ts
const CustomLightTheme: Theme = {
  dark: false,
  colors: {
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.surface,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.primary,
  },
  fonts: {
    regular: {
      fontFamily: '',
      fontWeight: 'bold'
    },
    medium: {
      fontFamily: '',
      fontWeight: 'bold'
    },
    bold: {
      fontFamily: '',
      fontWeight: 'bold'
    },
    heavy: {
      fontFamily: '',
      fontWeight: 'bold'
    }
  }
};

// Custom Dark Theme using your Colors.ts
const CustomDarkTheme: Theme = {
  dark: true,
  colors: {
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.primary,
  },
  fonts: {
    regular: {
      fontFamily: '',
      fontWeight: 'bold'
    },
    medium: {
      fontFamily: '',
      fontWeight: 'bold'
    },
    bold: {
      fontFamily: '',
      fontWeight: 'bold'
    },
    heavy: {
      fontFamily: '',
      fontWeight: 'bold'
    }
  }
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <PatientIdProvider>
        <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
                <Stack.Screen
                  name="index"
                  options={{
                    headerShown: false,
                    headerShadowVisible: false,
                  }}
                />
              </Stack>
            </ErrorBoundary>
          </QueryClientProvider>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Toast />
        </ThemeProvider>
      </PatientIdProvider>
    </AuthProvider>
  );
}