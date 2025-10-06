import SkeletonLoader from '@/components/SkeletonLoader';
import { Colors } from '@/constants/Colors';
import { useCheckAuth } from '@/context/AuthContext';
import { NavigationProp } from '@react-navigation/native';
import { SplashScreen, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect, useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";



// useEffect(() => {
//   // Subscribe to network state changes
//   const unsubscribe = NetInfo.addEventListener(state => {
//     if (!state.isConnected) {
//       Toast.show({
//         type: 'warning',
//         text1: 'No Internet Connection',
//         text2: 'Please check your network settings',
//         autoHide: false,
//       });
//     } else {
//       // Optionally hide the toast when connection is restored
//       Toast.hide();
//     }
//   });

//   // Cleanup subscription on unmount
//   return () => {
//     unsubscribe();
//   };
// }, []);

SplashScreen.preventAutoHideAsync();
const WelcomeScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const router = useRouter()
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [tapCount, setTapCount] = useState(0);


  const handleSecretTap = () => {
    setTapCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setTimeout(() => {
          router.replace("/auth/therapist-signin");
        }, 50);
      }
      return newCount;
    });
  };

  const { session, loading } = useCheckAuth()

  useLayoutEffect(() => {
    if (loading) return;
    // SplashScreen.hideAsync();

    if (session?.user) {
      if (session.user.user_metadata?.designation === "therapist") {
        router.replace('/(tabs)/therapist-dashboard');
      } else {
        router.replace('/(tabs)/session');
      }
    }
  }, [loading, session]);

  // Subscribe to realtime updates
  // useAppointmentSync(session?.user?.id as string);
  // // Initial sync on login
  // useEffect(() => {
  //   if (session?.user?.id) {
  //     syncAppointments(session?.user?.id);
  //   }
  // }, [session?.user?.id]);
  const handleGetStarted = () => router.replace('/auth/get-started');
  const handleSignIn = () => router.replace('/auth/signin');
  if (loading) return <SkeletonLoader />;

  return (
    <View style={styles.container}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      {/* Background Image */}
      <ImageBackground
        source={require('../assets/images/IMg.png')}
        style={styles.container}
        resizeMode="cover"
      >
        {/* Dark overlay */}
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>

            {/* Content */}
            <View style={styles.content}>
              {/* Main heading */}
              <Text style={styles.heading}>
                Welcome to betterspace!
              </Text>

              {/* Description */}
              <Text style={styles.description}>
                A betterspace for you to better your mental health,
                we&apos;re committed to helping you connect, thrive, and
                make a difference.
              </Text>

              {/* Privacy notice */}
              <Text style={styles.privacyText}>
                I agree that betterspace may use my responses to personalize
                my experience and other purposes as described in the Privacy
                Policy.
              </Text>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {/* Get Started Button */}
                <TouchableOpacity
                  onPress={handleGetStarted}
                  style={styles.getStartedButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.getStartedButtonText}>
                    Get started
                  </Text>
                </TouchableOpacity>

                {/* Sign In Button */}
                <TouchableOpacity
                  onPress={handleSignIn}
                  style={styles.signInButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.signInButtonText}>
                    Sign in
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.6} onPress={handleSecretTap}>
                  <Text style={styles.provider}>I am a betterspace provider</Text>
                </TouchableOpacity>
                {/* {tapCount > 0 && tapCount < 5 && (
                  <Text style={styles.hintText}>
                    {5 - tapCount} more taps to unlock provider access
                  </Text>
                )} */}
              </View>

              {/* Bottom indicator */}
              {/* <View style={styles.indicatorContainer}>
                <View style={styles.indicator} />
              </View> */}
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  heading: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 42,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 48,
  },
  privacyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 12,
  },
  getStartedButton: {
    backgroundColor: '#16a34a', // green-600
    paddingVertical: 16,
    borderRadius: 25,
  },
  getStartedButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  signInButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 16,
    borderRadius: 25,
  },
  signInButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  provider: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)', // subtle fade
    textAlign: 'center',
    marginTop: 6,
  },
  hintText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center'
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  indicator: {
    width: 32,
    height: 4,
    backgroundColor: 'white',
    borderRadius: 2,
  },
});

export default WelcomeScreen;