// import { Colors } from '@/constants/Colors';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation, useRouter } from "expo-router";
// import React, { useEffect, useRef, useState } from 'react';
// import {
//     Alert,
//     Clipboard,
//     Keyboard,
//     KeyboardAvoidingView,
//     Platform,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     TouchableWithoutFeedback,
//     useColorScheme,
//     View
// } from 'react-native';
// import { SafeAreaView } from "react-native-safe-area-context";

// const VerifyScreen: React.FC = () => {
//     const colorScheme = useColorScheme();
//     const colors = Colors[colorScheme ?? 'light'];
//     const styles = createStyles(colors);
//     const router = useRouter();
//     const navigation = useNavigation()

//     const [code, setCode] = useState(['', '', '', '', '', '']);
//     const [isLoading, setIsLoading] = useState(false);
//     const [timer, setTimer] = useState(60);
//     const [canResend, setCanResend] = useState(false);

//     const inputRefs = useRef<(TextInput | null)[]>([]);

//     useEffect(() => {
//         navigation.setOptions({
//             headerShown: false,
//         });
//     }, []);
//     useEffect(() => {
//         inputRefs.current[0]?.focus();
//         checkClipboard();
//     }, []);

//     useEffect(() => {
//         if (timer > 0 && !canResend) {
//             const interval = setInterval(() => {
//                 setTimer(prev => prev - 1);
//             }, 1000);
//             return () => clearInterval(interval);
//         } else if (timer === 0) {
//             setCanResend(true);
//         }
//     }, [timer, canResend]);

//     useEffect(() => {
//         if (code.every(digit => digit !== '')) {
//             handleVerify();
//         }
//     }, [code]);

//     const checkClipboard = async () => {
//         try {
//             const clipboardContent = await Clipboard.getString();
//             if (/^\d{6}$/.test(clipboardContent)) {
//                 const digits = clipboardContent.split('');
//                 setCode(digits);
//             }
//         } catch (error) {
//             console.log('Error checking clipboard:', error);
//         }
//     };

//     const handleCodeChange = (text: string, index: number) => {
//         if (text && !/^\d+$/.test(text)) return;

//         const newCode = [...code];

//         if (text.length > 1) {
//             const pastedCode = text.slice(0, 6).split('');
//             pastedCode.forEach((digit, i) => {
//                 if (index + i < 6) {
//                     newCode[index + i] = digit;
//                 }
//             });
//             setCode(newCode);
//             const lastFilledIndex = Math.min(index + pastedCode.length - 1, 5);
//             inputRefs.current[lastFilledIndex]?.focus();
//             return;
//         }

//         newCode[index] = text;
//         setCode(newCode);

//         if (text && index < 5) {
//             inputRefs.current[index + 1]?.focus();
//         }
//     };

//     const handleKeyPress = (e: any, index: number) => {
//         if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
//             inputRefs.current[index - 1]?.focus();
//         }
//     };

//     const handleVerify = async () => {
//         const verificationCode = code.join('');

//         if (verificationCode.length !== 6) {
//             Alert.alert('Error', 'Please enter the complete verification code');
//             return;
//         }

//         setIsLoading(true);

//         try {
//             await new Promise(resolve => setTimeout(resolve, 1500));

//             Alert.alert(
//                 'Success',
//                 'Your account has been verified successfully!',
//                 [
//                     {
//                         text: 'Continue',
//                         onPress: () => router.replace('/(tabs)')
//                     }
//                 ]
//             );
//         } catch (error) {
//             Alert.alert('Error', 'Invalid verification code. Please try again.');
//             setCode(['', '', '', '', '', '']);
//             inputRefs.current[0]?.focus();
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleResendCode = async () => {
//         if (!canResend) return;

//         setIsLoading(true);
//         try {
//             await new Promise(resolve => setTimeout(resolve, 1000));

//             Alert.alert('Success', 'Verification code has been resent to your email');
//             setTimer(60);
//             setCanResend(false);
//             setCode(['', '', '', '', '', '']);
//             inputRefs.current[0]?.focus();
//         } catch (error) {
//             Alert.alert('Error', 'Failed to resend code. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === "ios" ? "padding" : "height"}
//                 style={{ flex: 1 }}
//             >
//                 <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                     <View style={styles.content}>
//                         <TouchableOpacity
//                             style={styles.backButton}
//                             onPress={() => router.back()}
//                         >
//                             <Ionicons
//                                 name="arrow-back"
//                                 size={24}
//                                 color={colors.text}
//                             />
//                         </TouchableOpacity>

//                         <View style={styles.header}>
//                             <Text style={styles.title}>Verify Your Account</Text>
//                             <Text style={styles.subtitle}>
//                                 Enter the 6-digit code we sent to your email address
//                             </Text>
//                         </View>

//                         <View style={styles.codeContainer}>
//                             {code.map((digit, index) => (
//                                 <View key={index} style={styles.codeInputWrapper}>
//                                     <TextInput
//                                         ref={ref => { inputRefs.current[index] = ref }}
//                                         style={[
//                                             styles.codeInput,
//                                             digit ? styles.codeInputFilled : null
//                                         ]}
//                                         value={digit}
//                                         onChangeText={(text) => handleCodeChange(text, index)}
//                                         onKeyPress={(e) => handleKeyPress(e, index)}
//                                         keyboardType="number-pad"
//                                         maxLength={1}
//                                         selectTextOnFocus
//                                         editable={!isLoading}
//                                         placeholderTextColor={colors.placeholder}
//                                     />
//                                     {digit && (
//                                         <View style={styles.filledIndicator} />
//                                     )}
//                                 </View>
//                             ))}
//                         </View>

//                         <View style={styles.infoBox}>
//                             <Ionicons
//                                 name="information-circle"
//                                 size={20}
//                                 color={colors.primary}
//                                 style={styles.infoIcon}
//                             />
//                             <Text style={styles.infoText}>
//                                 Code expires in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
//                             </Text>
//                         </View>

//                         <TouchableOpacity
//                             style={[
//                                 styles.verifyButton,
//                                 (isLoading || code.some(d => !d)) ? styles.verifyButtonDisabled : styles.verifyButtonEnabled
//                             ]}
//                             onPress={handleVerify}
//                             disabled={isLoading || code.some(d => !d)}
//                         >
//                             {isLoading ? (
//                                 <Text style={styles.verifyButtonText}>Verifying...</Text>
//                             ) : (
//                                 <>
//                                     <Text style={styles.verifyButtonText}>Verify & Continue</Text>
//                                     <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
//                                 </>
//                             )}
//                         </TouchableOpacity>

//                         <View style={styles.footer}>
//                             <Text style={styles.footerText}>Didn't receive the code?</Text>
//                             <TouchableOpacity
//                                 onPress={handleResendCode}
//                                 disabled={!canResend || isLoading}
//                             >
//                                 <Text style={[
//                                     styles.resendLink,
//                                     (!canResend || isLoading) && styles.resendLinkDisabled
//                                 ]}>
//                                     {canResend ? 'Resend Code' : `Resend in ${timer}s`}
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </TouchableWithoutFeedback>
//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     );
// };

// const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: colors.background,
//     },
//     content: {
//         flex: 1,
//         paddingHorizontal: 24,
//     },
//     backButton: {
//         width: 40,
//         height: 40,
//         marginTop: 8,
//         marginBottom: 24,
//     },
//     header: {
//         marginBottom: 48,
//     },
//     title: {
//         fontSize: 32,
//         fontWeight: 'bold',
//         color: colors.text,
//         marginBottom: 12,
//     },
//     subtitle: {
//         fontSize: 16,
//         color: colors.textTertiary,
//         lineHeight: 24,
//     },
//     codeContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 24,
//     },
//     codeInputWrapper: {
//         position: 'relative',
//     },
//     codeInput: {
//         width: 52,
//         height: 60,
//         borderWidth: 2,
//         borderColor: colors.inputBorder,
//         borderRadius: 12,
//         backgroundColor: colors.inputBackground,
//         fontSize: 24,
//         fontWeight: '700',
//         color: colors.text,
//         textAlign: 'center',
//     },
//     codeInputFilled: {
//         borderColor: colors.primary,
//     },
//     filledIndicator: {
//         position: 'absolute',
//         bottom: 8,
//         left: '50%',
//         marginLeft: -3,
//         width: 6,
//         height: 6,
//         borderRadius: 3,
//         backgroundColor: colors.primary,
//     },
//     infoBox: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: colors.primary + '10',
//         paddingVertical: 12,
//         paddingHorizontal: 16,
//         borderRadius: 12,
//         marginBottom: 32,
//     },
//     infoIcon: {
//         marginRight: 8,
//     },
//     infoText: {
//         fontSize: 14,
//         color: colors.primary,
//         fontWeight: '600',
//     },
//     verifyButton: {
//         flexDirection: 'row',
//         borderRadius: 25,
//         paddingVertical: 16,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 24,
//     },
//     verifyButtonEnabled: {
//         backgroundColor: colors.primary,
//     },
//     verifyButtonDisabled: {
//         backgroundColor: '#d1d5db',
//     },
//     verifyButtonText: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: 'white',
//     },
//     buttonIcon: {
//         marginLeft: 8,
//     },
//     footer: {
//         alignItems: 'center',
//     },
//     footerText: {
//         fontSize: 15,
//         color: colors.textTertiary,
//         marginBottom: 8,
//     },
//     resendLink: {
//         fontSize: 16,
//         color: colors.primary,
//         fontWeight: '600',
//     },
//     resendLinkDisabled: {
//         color: colors.textTertiary,
//     },
// });

// export default VerifyScreen;
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Clipboard,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
    View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const VerifyScreen: React.FC = () => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const styles = createStyles(colors);
    const router = useRouter();
    const navigation = useNavigation()

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    useEffect(() => {
        inputRefs.current[0]?.focus();
        checkClipboard();
    }, []);

    useEffect(() => {
        if (timer > 0 && !canResend) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            setCanResend(true);
        }
    }, [timer, canResend]);

    useEffect(() => {
        if (code.every(digit => digit !== '')) {
            handleVerify();
        }
    }, [code]);

    const checkClipboard = async () => {
        try {
            const clipboardContent = await Clipboard.getString();
            if (/^\d{6}$/.test(clipboardContent)) {
                const digits = clipboardContent.split('');
                setCode(digits);
            }
        } catch (error) {
            console.log('Error checking clipboard:', error);
        }
    };

    const handleCodeChange = (text: string, index: number) => {
        // Only allow digits
        if (text && !/^\d+$/.test(text)) return;

        const newCode = [...code];

        // Handle pasted code (multiple digits)
        if (text.length > 1) {
            const pastedCode = text.slice(0, 6).split('');
            pastedCode.forEach((digit, i) => {
                if (index + i < 6) {
                    newCode[index + i] = digit;
                }
            });
            setCode(newCode);
            const lastFilledIndex = Math.min(index + pastedCode.length - 1, 5);
            inputRefs.current[lastFilledIndex]?.focus();
            return;
        }

        // Handle single digit input
        if (text) {
            newCode[index] = text;
            setCode(newCode);
            // Move to next input after entering a digit
            if (index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        } else {
            // Handle clearing input
            newCode[index] = '';
            setCode(newCode);
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        const { key } = e.nativeEvent;

        // On backspace, move to previous input if current is empty
        if (key === 'Backspace') {
            if (code[index] === '' && index > 0) {
                // Clear previous input and move focus back
                const newCode = [...code];
                newCode[index - 1] = '';
                setCode(newCode);
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleVerify = async () => {
        const verificationCode = code.join('');

        if (verificationCode.length !== 6) {
            Alert.alert('Error', 'Please enter the complete verification code');
            return;
        }

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            Alert.alert(
                'Success',
                'Your account has been verified successfully!',
                [
                    {
                        text: 'Continue',
                        onPress: () => router.replace('/(tabs)')
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Invalid verification code. Please try again.');
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!canResend) return;

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            Alert.alert('Success', 'Verification code has been resent to your email');
            setTimer(60);
            setCanResend(false);
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error) {
            Alert.alert('Error', 'Failed to resend code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color={colors.text}
                            />
                        </TouchableOpacity>

                        <View style={styles.header}>
                            <Text style={styles.title}>Verify Your Account</Text>
                            <Text style={styles.subtitle}>
                                Enter the 6-digit code we sent to your email address
                            </Text>
                        </View>

                        <View style={styles.codeContainer}>
                            {code.map((digit, index) => (
                                <View key={index} style={styles.codeInputWrapper}>
                                    <TextInput
                                        ref={ref => { inputRefs.current[index] = ref }}
                                        style={[
                                            styles.codeInput,
                                            digit ? styles.codeInputFilled : null
                                        ]}
                                        value={digit}
                                        onChangeText={(text) => handleCodeChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        selectTextOnFocus
                                        editable={!isLoading}
                                        placeholderTextColor={colors.placeholder}
                                    />
                                    {digit && (
                                        <View style={styles.filledIndicator} />
                                    )}
                                </View>
                            ))}
                        </View>

                        <View style={styles.infoBox}>
                            <Ionicons
                                name="information-circle"
                                size={20}
                                color={colors.primary}
                                style={styles.infoIcon}
                            />
                            <Text style={styles.infoText}>
                                Code expires in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.verifyButton,
                                (isLoading || code.some(d => !d)) ? styles.verifyButtonDisabled : styles.verifyButtonEnabled
                            ]}
                            onPress={handleVerify}
                            disabled={isLoading || code.some(d => !d)}
                        >
                            {isLoading ? (
                                <Text style={styles.verifyButtonText}>Verifying...</Text>
                            ) : (
                                <>
                                    <Text style={styles.verifyButtonText}>Verify & Continue</Text>
                                    <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Didn't receive the code?</Text>
                            <TouchableOpacity
                                onPress={handleResendCode}
                                disabled={!canResend || isLoading}
                            >
                                <Text style={[
                                    styles.resendLink,
                                    (!canResend || isLoading) && styles.resendLinkDisabled
                                ]}>
                                    {canResend ? 'Resend Code' : `Resend in ${timer}s`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        marginTop: 8,
        marginBottom: 24,
    },
    header: {
        marginBottom: 48,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textTertiary,
        lineHeight: 24,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    codeInputWrapper: {
        position: 'relative',
    },
    codeInput: {
        width: 52,
        height: 60,
        borderWidth: 2,
        borderColor: colors.inputBorder,
        borderRadius: 12,
        backgroundColor: colors.inputBackground,
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
    },
    codeInputFilled: {
        borderColor: colors.primary,
    },
    filledIndicator: {
        position: 'absolute',
        bottom: 8,
        left: '50%',
        marginLeft: -3,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary + '10',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 32,
    },
    infoIcon: {
        marginRight: 8,
    },
    infoText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    verifyButton: {
        flexDirection: 'row',
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    verifyButtonEnabled: {
        backgroundColor: colors.primary,
    },
    verifyButtonDisabled: {
        backgroundColor: '#d1d5db',
    },
    verifyButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    buttonIcon: {
        marginLeft: 8,
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 15,
        color: colors.textTertiary,
        marginBottom: 8,
    },
    resendLink: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '600',
    },
    resendLinkDisabled: {
        color: colors.textTertiary,
    },
});

export default VerifyScreen;