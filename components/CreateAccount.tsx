import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CreateAccount = () => {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        licenseNumber: '',
        phone: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.licenseNumber.trim()) {
            newErrors.licenseNumber = 'License number is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateAccount = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Handle successful account creation
            console.log('Account created:', formData);
            Alert.alert(
                'Success',
                'Account created successfully! Please check your email for verification.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Navigate to sign in or verification screen
                            // navigation.navigate('SignIn');
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', `Failed to create account. Please try again. ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderInputField = (
        label: string,
        field: string,
        placeholder: string,
        iconName: keyof typeof Ionicons.glyphMap,
        secureTextEntry = false,
        keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default'
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
                    color={errors[field] ? '#ef4444' : '#9ca3af'}
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
            {errors[field] && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>
                        Join BetterSpace and start connecting with clients
                    </Text>
                </View>

                <View style={styles.form}>
                    {renderInputField('First Name', 'firstName', 'Enter your first name', 'person-outline')}
                    {renderInputField('Email Address', 'email', 'Enter your email address', 'mail-outline', false, 'email-address')}
                    {renderInputField('Phone Number', 'phone', 'Enter your phone number', 'call-outline', false, 'phone-pad')}
                    {renderInputField('Password', 'password', 'Create a password', 'lock-closed-outline', true)}

                    <View style={styles.termsContainer}>
                        <View style={styles.termsIconWrapper}>
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={24}
                                color="#047857"
                                style={styles.termsIcon}
                            />
                            <Text style={styles.termsText}>
                                By creating an account, you agree to our{' '}
                                <Text style={styles.termsLink}>Terms of Service</Text>
                                {' '}and{' '}
                                <Text style={styles.termsLink}>Privacy Policy</Text>
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.createAccountButton,
                            isLoading ? styles.createAccountButtonDisabled : styles.createAccountButtonEnabled
                        ]}
                        onPress={handleCreateAccount}
                        disabled={isLoading}
                    >
                        <Text style={[
                            styles.createAccountButtonText,
                            isLoading ? styles.createAccountButtonTextDisabled : styles.createAccountButtonTextEnabled
                        ]}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.signInContainer}>
                        <Text style={styles.signInText}>
                            Already have an account?{' '}
                            <TouchableOpacity onPress={() => {/* Navigate to SignIn */ }}>
                                <Text style={styles.signInLink}>Sign In</Text>
                            </TouchableOpacity>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
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
    header: {
        marginTop: 32,
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827', // gray-900
        marginBottom: 8,
    },
    subtitle: {
        color: '#4b5563', // gray-600
        fontSize: 18,
        lineHeight: 28,
    },
    form: {
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 24,
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
    errorText: {
        color: '#ef4444', // red-500
        fontSize: 14,
        marginTop: 4,
    },
    termsContainer: {
        marginBottom: 32,
    },
    termsIconWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    termsIcon: {
        marginRight: 8,
        marginTop: 2,
    },
    termsText: {
        color: '#4b5563', // gray-600
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        flex: 1,
    },
    termsLink: {
        color: '#047857', // emerald-700
        textDecorationLine: 'underline',
    },
    createAccountButton: {
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    createAccountButtonEnabled: {
        backgroundColor: '#047857', // emerald-700
    },
    createAccountButtonDisabled: {
        backgroundColor: '#d1d5db', // gray-300
    },
    createAccountButtonText: {
        fontSize: 18,
        fontWeight: '600',
    },
    createAccountButtonTextEnabled: {
        color: 'white',
    },
    createAccountButtonTextDisabled: {
        color: '#6b7280', // gray-500
    },
    signInContainer: {
        alignItems: 'center',
    },
    signInText: {
        color: '#4b5563', // gray-600
        fontSize: 16,
    },
    signInLink: {
        color: '#047857', // emerald-700
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default CreateAccount;