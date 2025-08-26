import { toastConfig } from '@/components/toastConfig';
import { AuthProvider } from '@/context/AuthContext';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

const queryClient = new QueryClient();
export default function RootLayout() {
  const colorScheme = useColorScheme();
  // const { session, loading } = useCheckAuth();
  // const router = useRouter();

  // useLayoutEffect(() => {
  //   if (loading) return;
  //   if (session) {
  //     router.replace("/(tabs)/chat");
  //   } else {
  //     router.replace("/auth/signin");
  //   }
  // }, [session, loading]);

  // if (loading) {
  //   return (
  //     <SkeletonLoader />
  //   );
  // }

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="index" options={{ headerShown: false, headerShadowVisible: false, }} />
          </Stack>
        </QueryClientProvider>
        <StatusBar style="auto" />
        <Toast config={toastConfig} />
      </ThemeProvider>
    </AuthProvider>
  );
}
