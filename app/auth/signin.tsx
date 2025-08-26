import { useCheckAuth } from '@/context/AuthContext';
import { loginSchema } from '@/lib/validationSchema';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@supabase/supabase-js';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation, useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';



interface LoginData {
    data: {
        user: User | null;
    }
}


const SignIn = () => {
    const navigation = useNavigation();
    const router = useRouter()

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [rememberMe, setRememberMe] = useState(false);
    const { login, loading } = useCheckAuth()
    const [biometricIcon, setBiometricIcon] = useState<keyof typeof Ionicons.glyphMap>('scan');
    const [biometricText, setBiometricText] = useState('Continue with Biometrics');

    useEffect(() => {
        checkBiometricTypes();
    }, []);

    const checkBiometricTypes = async () => {
        try {
            const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

            if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                setBiometricIcon('scan');
                setBiometricText('Continue with Face ID');
            } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                setBiometricIcon('finger-print');
                setBiometricText('Continue with Fingerprint');
            } else {
                setBiometricIcon('scan');
                setBiometricText('Continue with Biometrics');
            }
        } catch (error) {
            console.error('Error checking biometric types:', error);
        }
    };

    const handleBiometricAuth = async () => {
        try {
            // Check if biometric authentication is available
            const isAvailable = await LocalAuthentication.hasHardwareAsync();
            if (!isAvailable) {
                Alert.alert('Error', 'Biometric authentication is not available on this device');
                return;
            }

            // Check what types of biometrics are enrolled
            const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

            // Check if biometrics are enrolled
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                Alert.alert('Error', 'No biometric data is enrolled on this device');
                return;
            }

            // Perform authentication
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to continue',
                fallbackLabel: 'Use PIN/Password',
                disableDeviceFallback: false,
            });

            if (result.success) {
                // Authentication successful
                console.log('Biometric authentication successful');
                // Proceed with login logic
                const email = await SecureStore.getItemAsync('email');
                const password = await SecureStore.getItemAsync('password');

                if (!email || !password) {
                    // Credentials were cleared => force user to log in manually
                    Alert.alert('Please login manually');
                    return;
                }

                const { data }: LoginData = await login(email, password);

                router.push("chat");
                // if (data && data?.user?.user_metadata?.designation === "therapist") {

                // }
            } else {
                // Authentication failed or cancelled
                console.log('Biometric authentication failed');
            }

        } catch (error) {
            console.error('Biometric authentication error:', error);
            Alert.alert('Error', 'An error occurred during biometric authentication');
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };


    const handleSignIn = async () => {
        Keyboard.dismiss();
        console.log("fire")
        const validationSchema = loginSchema.safeParse({
            email: formData.email,
            password: formData.password
        })
        if (!validationSchema.success) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: validationSchema.error.issues[0].message
            })
            throw new Error(validationSchema.error.issues[0].message);
        }

        const { data }: LoginData = await login(formData.email, formData.password);

        if (data && data?.user?.user_metadata?.designation === "therapist") {
            router.push("therapist-dashboard");
        } else {
            router.push("chat");
        }
    };

    const handleForgotPassword = () => {
        Alert.alert(
            'Forgot Password',
            'Enter your email address and we\'ll send you a link to reset your password.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Send Reset Link',
                    onPress: () => {
                        // Handle password reset
                        console.log('Password reset for:', formData.email);
                        Alert.alert('Success', 'Password reset link sent to your email!');
                    }
                }
            ]
        );
    };

    const renderInputField = (
        label: string,
        field: string,
        placeholder: string,
        iconName: keyof typeof Ionicons.glyphMap,
        secureTextEntry = false,
        keyboardType: 'default' | 'email-address' = 'default'
    ) => (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={[
                styles.inputWrapper,
                errors[field] ? styles.inputWrapperError : styles.inputWrapperDefault
            ]}>
                <Ionicons
                    name={iconName}
                    size={20}
                    color='#9ca3af'
                    // color={errors[field] ? '#ef4444' : '#9ca3af'}
                    style={styles.inputIcon}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder={placeholder}
                    value={formData[field as keyof typeof formData]}
                    onChangeText={(value) => handleInputChange(field, value)}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={field === 'email' ? 'none' : 'words'}
                    autoCorrect={false}
                    placeholderTextColor="#9ca3af"
                />
            </View>
            {/* {errors[field] && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )} */}
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />


                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>betterspace</Text>
                    <Text style={styles.logoSubtext}>Professional therapy platform</Text>
                </View> */}

                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome Back</Text>

                        <Text style={styles.subtitle}>
                            Sign in to your BetterSpace account
                        </Text>
                    </View>
                    <View style={styles.form}>
                        {renderInputField('Email Address', 'email', 'Enter your email address', 'mail-outline', false, 'email-address')}
                        {renderInputField('Password', 'password', 'Enter your password', 'lock-closed-outline', true)}

                        <View style={styles.optionsContainer}>
                            <TouchableOpacity
                                style={styles.rememberMeContainer}
                                onPress={() => setRememberMe(!rememberMe)}
                            >
                                <View style={[
                                    styles.checkbox,
                                    rememberMe ? styles.checkboxChecked : styles.checkboxUnchecked
                                ]}>
                                    {rememberMe && (
                                        <Ionicons name="checkmark" size={14} color="white" />
                                    )}
                                </View>
                                <Text style={styles.rememberMeText}>Remember me</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleForgotPassword}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.signInButton,
                                loading ? styles.signInButtonDisabled : styles.signInButtonEnabled
                            ]}
                            onPress={handleSignIn}
                            disabled={loading}
                        >
                            <Text style={[
                                styles.signInButtonText,
                                loading ? styles.signInButtonTextDisabled : styles.signInButtonTextEnabled
                            ]}>
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* <TouchableOpacity style={styles.googleSignInButton}>
                            <View style={styles.googleButtonContent}>
                                <Ionicons name="logo-google" size={20} color="#4285f4" style={styles.googleIcon} />
                                <Text style={styles.googleSignInButtonText}>
                                    Continue with Google
                                </Text>
                            </View>
                        </TouchableOpacity> */}

                        <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricAuth}>
                            <View style={styles.buttonContent}>
                                <Ionicons name={biometricIcon} size={20} color="#6366f1" style={styles.icon} />
                                <Text style={styles.buttonText}>
                                    {biometricText}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.createAccountContainer}>
                            <Text style={styles.createAccountText}>
                                <Text>Don&apos;t have an account?{' '}</Text>
                                <TouchableOpacity onPress={() => {/* Navigate to CreateAccount */ }}>
                                    <Text style={styles.createAccountLink}>Create Account</Text>
                                </TouchableOpacity>
                            </Text>
                        </View>
                    </View>
                </ScrollView>

            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 24,
    },
    scrollContent: {
        // flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 32,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#047857', // emerald-700
        marginBottom: 4,
    },
    logoSubtext: {
        color: '#4b5563', // gray-600
        fontSize: 16,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827', // gray-900
        marginBottom: 8,
    },
    subtitle: {
        color: '#4b5563', // gray-600
        fontSize: 16,
        textAlign: 'center',
    },
    form: {
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151', // gray-700
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 12,
        backgroundColor: '#ffffff',
    },
    inputWrapperDefault: {
        borderColor: '#e5e7eb', // gray-200
    },
    inputWrapperError: {
        borderColor: '#ef4444', // red-500
    },
    inputIcon: {
        marginLeft: 16,
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        paddingVertical: 14,
        paddingRight: 16,
        fontSize: 16,
        color: '#111827',
    },
    // errorText: {
    //     color: '#ef4444', // red-500
    //     fontSize: 14,
    //     marginTop: 4,
    // },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxUnchecked: {
        borderColor: '#d1d5db', // gray-300
        backgroundColor: '#ffffff',
    },
    checkboxChecked: {
        borderColor: '#047857', // emerald-700
        backgroundColor: '#047857', // emerald-700
    },
    rememberMeText: {
        color: '#4b5563', // gray-600
        fontSize: 14,
    },
    forgotPasswordText: {
        color: '#047857', // emerald-700
        fontSize: 14,
        fontWeight: '600',
    },
    signInButton: {
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    signInButtonEnabled: {
        backgroundColor: '#047857', // emerald-700
    },
    signInButtonDisabled: {
        backgroundColor: '#d1d5db', // gray-300
    },
    signInButtonText: {
        fontSize: 18,
        fontWeight: '600',
    },
    signInButtonTextEnabled: {
        color: 'white',
    },
    signInButtonTextDisabled: {
        color: '#6b7280', // gray-500
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e7eb', // gray-200
    },
    dividerText: {
        color: '#6b7280', // gray-500
        fontSize: 14,
        marginHorizontal: 16,
    },
    // googleSignInButton: {
    //     borderWidth: 2,
    //     borderColor: '#e5e7eb', // gray-200
    //     borderRadius: 25,
    //     paddingVertical: 16,
    //     alignItems: 'center',
    //     backgroundColor: '#ffffff',
    //     marginBottom: 32,
    // },
    // googleButtonContent: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    // },
    // googleIcon: {
    //     marginRight: 12,
    // },
    // googleSignInButtonText: {
    //     color: '#374151', // gray-700
    //     fontSize: 16,
    //     fontWeight: '600',
    // },
    biometricButton: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingVertical: 12,
        marginVertical: 8,
        marginBottom: 32,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#1f2937',
        fontSize: 16,
        fontWeight: '500',
    },
    createAccountContainer: {
        alignItems: 'center',
    },
    createAccountText: {
        color: '#4b5563', // gray-600
        fontSize: 16,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createAccountLink: {
        color: '#047857', // emerald-700
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default SignIn;