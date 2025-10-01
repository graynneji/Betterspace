import SkeletonLoader from '@/components/SkeletonLoader';
import { useCheckAuth } from '@/context/AuthContext';
import { NavigationProp } from '@react-navigation/native';
import { SplashScreen, useRouter } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();
const WelcomeScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const router = useRouter()
  const handleGetStarted = () => {
    // Navigate to next screen (e.g., sign up)
    // navigation.navigate('SignUp');
    router.replace('/auth/get-started');
  };

  const handleSignIn = () => {
    // Navigate to sign in screen
    router.replace('/auth/signin');
    // navigation.navigate('SignIn');
  };
  const { session, loading } = useCheckAuth()
  console.log("check Auth", session)

  useLayoutEffect(() => {
    if (loading) return;
    // SplashScreen.hideAsync();

    if (session?.user) {
      console.log(session.user.user_metadata?.designation, " ✅ Only navigate if user exists")
      if (session.user.user_metadata?.designation === "therapist") {
        router.replace('/(tabs)/therapist-dashboard');
      } else {
        router.replace('/(tabs)/session');
      }
    }
  }, [loading, session]);

  if (loading) {
    return (
      <SkeletonLoader />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

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