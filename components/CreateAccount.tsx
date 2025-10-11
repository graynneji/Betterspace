import { CrudAdapter } from '@/adapter/crudAdapter';
import { Colors } from '@/constants/Colors';
import { useCheckAuth } from '@/context/AuthContext';
import { useCrudCreate } from '@/hooks/useCrud';
import { signUpschema } from '@/lib/validationSchema';
import { CrudService } from '@/services/crudService';
import { Client } from '@/utils/client';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
// type QuestionnaireAnswers = Record<string, string>;


interface QuestionAireAnswersProps {
    answers: Record<string, string>;
}
const client = new Client();
const crudAdapter = new CrudAdapter(client);
const crudService = new CrudService(crudAdapter);
const CreateAccount: React.FC<QuestionAireAnswersProps> = ({ answers }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const styles = createStyles(colors);
    const navigation = useNavigation();
    const { register } = useCheckAuth()
    const signUpMutation = useCrudCreate("user")
    const patientMutation = useCrudCreate("patient")
    const router = useRouter()

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const [formData, setFormData] = useState({
        fullName: '',
        // lastName: '',
        email: '',
        phone: '',
        password: '',
        // confirmPassword: '',
        // licenseNumber: '',
    });

    const others = {
        full_name: formData.fullName,
        designation: 'patient'
    }
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value.toString()
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };



    const handleCreateAccount = async () => {
        console.log(formData.fullName, formData.email, formData.password, others, "form fileds")
        // if (!validateForm()) {
        //     return;
        // }
        const validationSchema = signUpschema.safeParse({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            phone: formData.password?.toString()

        })
        if (!validationSchema.success) {
            return new Promise((resolve, reject) => {
                Alert.alert("Something went wrong", validationSchema.error.issues[0].message, [
                    { text: "Cancel", style: "cancel", onPress: () => { return } },
                ]);
            });
        }

        setIsLoading(true);
        try {
            const { data: signUpData, error } = await register(formData.fullName, formData.email, formData.password, others)
            // const response = await fetch(`http://www.geoplugin.net/json.gp`);
            // if (!response.ok) throw new Error("unable to create account at the moment")
            // const location = await response.json()
            console.log(signUpData, "location")

            // const { data: fetchTherapistData, isLoading, error: fetchTherapistError, refetch } = useGetAll('therapist', {}, "id", true)
            const fetchTherapistData = await crudService.read('therapist', {}, 'id');
            const therapistIds = (fetchTherapistData?.result ?? []).map((t) => t.id);
            const randomTherapistId =
                therapistIds.length > 0
                    ? therapistIds[Math.floor(Math.random() * therapistIds.length)]
                    : null;
            const userData = {
                user_id: signUpData?.user?.id,
                name: formData.fullName,
                phone: formData.phone.toString(),
                email: formData.email,
                // role: options ? selectedQuesAnswers : undefined,
                // selected: !options ? JSON.stringify(selectedQuesAnswers) : undefined,
                selected_answers: [answers],
                therapist_id: randomTherapistId,
                // ip: location.geoplugin_request,
                // city: location.geoplugin_city,
                // region: location.geoplugin_region,
                // country: location.geoplugin_countryName,
            };

            const result = await signUpMutation.mutateAsync(userData);

            if (result.error) throw new Error(result.error.message);
            const therapist = await patientMutation.mutateAsync({
                patient_id: signUpData?.user?.id,
                therapist: randomTherapistId,
                name: formData.fullName,
                email: formData.email,
                selected_answers: [answers],
            })

            if (therapist.error) throw new Error(therapist.error.message);

            Alert.alert(
                'Success',
                'Account created successfully! Please check your email for verification.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Navigate to sign in or verification screen
                            router.replace('/auth/verify');
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
                    color={errors[field] ? '#ef4444' : colors.placeholder}
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
                    placeholderTextColor={colors.placeholder}
                />
            </View>
            {errors[field] && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>
                                Join BetterSpace and start connecting with clients
                            </Text>
                        </View>

                        <View style={styles.form}>
                            {renderInputField('Full Name', 'fullName', 'Enter your first name', 'person-outline')}
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

                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
        color: colors.text, // gray-900
        marginBottom: 8,
    },
    subtitle: {
        color: colors.textTertiary, // gray-600
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
        color: colors.inputText, // gray-700
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 12,
        backgroundColor: colors.inputBackground,
    },
    inputWrapperDefault: {
        borderColor: colors.inputBorder, // gray-200
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
        color: colors.inputText,
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
        color: colors.textTertiary, // gray-600
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        flex: 1,
    },
    termsLink: {
        color: colors.primary, // emerald-700
        textDecorationLine: 'underline',
    },
    createAccountButton: {
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    createAccountButtonEnabled: {
        backgroundColor: colors.primary, // emerald-700
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
        color: colors.textTertiary, // gray-600
        fontSize: 16,
    },
    signInLink: {
        color: colors.primary, // emerald-700
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default CreateAccount;