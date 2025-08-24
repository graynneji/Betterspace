import CreateAccount from "@/components/CreateAccount";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GetStarted = () => {
    const navigation = useNavigation()
    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);
    const [currentScreen, setCurrentScreen] = useState('questionnaire');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const questions = [
        {
            id: 'q1',
            title: "Let's get to know you!",
            subtitle: "What is your primary area of expertise or focusing therapy?",
            options: [
                "Trauma and PTSD",
                "Addiction and Recovery",
                "Relationship Therapy",
                "Anxiety and Depression",
                "Family Therapy"
            ]
        },
        {
            id: 'q2',
            title: "Let's get to know you!",
            subtitle: "How many years of experience do you have as a licensed therapist?",
            options: [
                "0-1 years",
                "2-5 years",
                "6-10 years",
                "11-15 years",
                "16+ years"
            ]
        },
        {
            id: 'q3',
            title: "Let's get to know you!",
            subtitle: "What therapeutic approaches do you primarily use in your practice?",
            options: [
                "Cognitive Behavioral Therapy (CBT)",
                "Dialectical Behavior Therapy (DBT)",
                "Psychodynamic Therapy",
                "Humanistic/Person-Centered Therapy",
                "Solution-Focused Brief Therapy"
            ]
        },
        {
            id: 'q4',
            title: "Let's get to know you!",
            subtitle: "How did you first hear about BetterSpace and our services?",
            options: [
                "Social media",
                "Professional referral",
                "Online search",
                "Conference or workshop",
                "Word of mouth"
            ]
        },
        {
            id: 'q5',
            title: "Let's get to know you!",
            subtitle: "What age groups are you most comfortable working with?",
            options: [
                "Children (5-12)",
                "Adolescents (13-17)",
                "Young Adults (18-25)",
                "Adults (26-64)",
                "Seniors (65+)"
            ]
        }
    ];

    const handleAnswerSelect = (questionId: string, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Complete questionnaire
            console.log(answers)
            setCurrentScreen('complete');
        }
    };

    // const renderStartScreen = () => (
    //     <SafeAreaView style={styles.startContainer}>
    //         <StatusBar barStyle="light-content" backgroundColor="#065f46" />
    //         <View style={styles.startContent}>
    //             <Text style={styles.startTitle}>
    //                 betterspace
    //             </Text>
    //             <Text style={styles.startSubtitle}>
    //                 Professional therapy platform for licensed therapists
    //             </Text>

    //             <TouchableOpacity
    //                 style={styles.startGetStartedButton}
    //                 onPress={() => setCurrentScreen('questionnaire')}
    //             >
    //                 <Text style={styles.startGetStartedButtonText}>
    //                     Get Started
    //                 </Text>
    //             </TouchableOpacity>

    //             <TouchableOpacity style={styles.startSignInButton}>
    //                 <Text style={styles.startSignInButtonText}>
    //                     I already have an account
    //                 </Text>
    //             </TouchableOpacity>
    //         </View>
    //     </SafeAreaView>
    // );

    const renderQuestionnaireScreen = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const isLastQuestion = currentQuestionIndex === questions.length - 1;
        const hasAnswer = answers[currentQuestion.id];

        return (
            <SafeAreaView style={styles.questionnaireContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressText}>
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </Text>
                        <Text style={styles.progressPercentage}>
                            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                        </Text>
                    </View>
                    <View style={styles.progressBarBackground}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
                            ]}
                        />
                    </View>
                </View>

                <ScrollView style={styles.questionnaireScrollView}>
                    <View style={styles.questionHeader}>
                        <Text style={styles.questionTitle}>
                            {currentQuestion.title}
                        </Text>
                        <Text style={styles.questionSubtitle}>
                            {currentQuestion.subtitle}
                        </Text>
                    </View>

                    <View style={styles.optionsContainer}>
                        {currentQuestion.options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionButton,
                                    answers[currentQuestion.id] === option
                                        ? styles.optionButtonSelected
                                        : styles.optionButtonDefault
                                ]}
                                onPress={() => handleAnswerSelect(currentQuestion.id, option)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    answers[currentQuestion.id] === option
                                        ? styles.optionTextSelected
                                        : styles.optionTextDefault
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {/* Bottom Navigation */}
                <View style={styles.bottomNavigation}>
                    <View style={styles.bottomNavigationContent}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => {
                                if (currentQuestionIndex > 0) {
                                    setCurrentQuestionIndex(currentQuestionIndex - 1);
                                } else {
                                    setCurrentScreen('onboarding');
                                }
                            }}
                        >
                            <Text style={styles.backButtonText}>
                                Back
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.nextButton,
                                hasAnswer ? styles.nextButtonEnabled : styles.nextButtonDisabled
                            ]}
                            disabled={!hasAnswer}
                            onPress={handleNext}
                        >
                            <Text style={[
                                styles.nextButtonText,
                                hasAnswer ? styles.nextButtonTextEnabled : styles.nextButtonTextDisabled
                            ]}>
                                {isLastQuestion ? 'Complete' : 'Next'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    };

    const renderCompleteScreen = () => (
        <SafeAreaView style={styles.completeContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <View style={styles.completeContent}>
                <View style={styles.completeIcon}>
                    <Text style={styles.completeIconText}>✓</Text>
                </View>

                <Text style={styles.completeTitle}>
                    Setup Complete!
                </Text>

                <Text style={styles.completeDescription}>
                    Thank you for completing your profile. You&apos;re now ready to start using BetterSpace.
                </Text>

                <TouchableOpacity
                    style={styles.completeGetStartedButton}
                    onPress={() => setCurrentScreen('createAccount')}
                >
                    <Text style={styles.completeGetStartedButtonText}>
                        Create Account
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    // Main render logic
    switch (currentScreen) {
        // case 'start':
        //     return renderStartScreen();
        // case 'onboarding':
        //     return renderOnboardingScreen();
        case 'questionnaire':
            return renderQuestionnaireScreen();
        case 'complete':
            return renderCompleteScreen();
        case 'createAccount':
            return <CreateAccount />
        default:
            return renderQuestionnaireScreen();
    }
};

const styles = StyleSheet.create({
    // Start Screen Styles
    startContainer: {
        flex: 1,
        backgroundColor: '#065f46', // emerald-800
    },
    startContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    startTitle: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    startSubtitle: {
        color: '#a7f3d0', // emerald-200
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 48,
    },
    startGetStartedButton: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 48,
        paddingVertical: 16,
        marginBottom: 24,
    },
    startGetStartedButtonText: {
        color: '#065f46', // emerald-800
        fontWeight: '600',
        fontSize: 18,
    },
    startSignInButton: {
        marginBottom: 16,
    },
    startSignInButtonText: {
        color: '#a7f3d0', // emerald-200
        fontSize: 16,
        textDecorationLine: 'underline',
    },

    // Questionnaire Screen Styles
    questionnaireContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    progressContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressText: {
        color: '#4b5563', // gray-600
        fontSize: 14,
    },
    progressPercentage: {
        color: '#047857', // emerald-700
        fontSize: 14,
        fontWeight: '600',
    },
    progressBarBackground: {
        width: '100%',
        backgroundColor: '#e5e7eb', // gray-200
        borderRadius: 4,
        height: 8,
    },
    progressBarFill: {
        backgroundColor: '#047857', // emerald-700
        height: 8,
        borderRadius: 4,
    },
    questionnaireScrollView: {
        flex: 1,
        paddingHorizontal: 24,
    },
    questionHeader: {
        marginBottom: 32,
    },
    questionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827', // gray-900
        marginBottom: 16,
    },
    questionSubtitle: {
        color: '#4b5563', // gray-600
        fontSize: 18,
        lineHeight: 28,
    },
    optionsContainer: {
        gap: 12,
        marginBottom: 32,
    },
    optionButton: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
    },
    optionButtonSelected: {
        borderColor: '#047857', // emerald-700
        backgroundColor: '#ecfdf5', // emerald-50
    },
    optionButtonDefault: {
        borderColor: '#e5e7eb', // gray-200
        backgroundColor: '#ffffff',
    },
    optionText: {
        fontSize: 16,
    },
    optionTextSelected: {
        color: '#047857', // emerald-700
        fontWeight: '600',
    },
    optionTextDefault: {
        color: '#374151', // gray-700
    },
    bottomNavigation: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb', // gray-200
    },
    bottomNavigationContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    backButtonText: {
        color: '#4b5563', // gray-600
        fontSize: 16,
    },
    nextButton: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
    },
    nextButtonEnabled: {
        backgroundColor: '#047857', // emerald-700
    },
    nextButtonDisabled: {
        backgroundColor: '#d1d5db', // gray-300
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    nextButtonTextEnabled: {
        color: 'white',
    },
    nextButtonTextDisabled: {
        color: '#6b7280', // gray-500
    },

    // Complete Screen Styles
    completeContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    completeContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    completeIcon: {
        width: 80,
        height: 80,
        backgroundColor: '#047857', // emerald-700
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    completeIconText: {
        color: 'white',
        fontSize: 24,
    },
    completeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827', // gray-900
        marginBottom: 16,
        textAlign: 'center',
    },
    completeDescription: {
        color: '#4b5563', // gray-600
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 32,
    },
    completeGetStartedButton: {
        backgroundColor: '#047857', // emerald-700
        borderRadius: 25,
        paddingHorizontal: 48,
        paddingVertical: 16,
    },
    completeGetStartedButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
    },
});

export default GetStarted;