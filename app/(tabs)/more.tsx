import { Colors } from '@/constants/Colors';
import { useCheckAuth } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Types
interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    therapistName: string;
    nextSession: string;
    sessionsCompleted: number;
}

interface TabItem {
    id: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
}

// Mock user data
const User: User = {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332-original.jpg?w=150&h=150&fit=crop&crop=face',
    therapistName: 'Dr. Emily Carter',
    nextSession: '2024-01-15 at 2:00 PM',
    sessionsCompleted: 12,
};

const tabs: TabItem[] = [
    { id: 'profile', title: 'Profile', icon: 'person-outline' },
    { id: 'security', title: 'Security', icon: 'lock-closed-outline' },
    { id: 'sessions', title: 'Sessions', icon: 'calendar-outline' },
    { id: 'settings', title: 'Settings', icon: 'settings-outline' },
];

const More: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('profile');
    const { session, loading: isPending } = useCheckAuth()
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const styles = createStyles(colors);
    const initialUser = {
        name: session?.user?.user_metadata?.full_name || User.name,
        email: session?.user?.email || User.email,
        phone: "+234 (80) 123-4567", // fallback phone
    };
    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [notifications, setNotifications] = useState<boolean>(true);
    const [biometricAuth, setBiometricAuth] = useState<boolean>(false);
    // const updateAuthMutation = useUpdate("auth", session?.user?.id || "", ["user"])
    // const updateUserMutation = useUpdate("user", session?.user?.id || "", ["user"])

    const { loading, logout } = useAuth()

    // const handleSaveProfile = () => {
    //     updateAuthMutation.mutate(user)
    //     updateUserMutation.mutate(user)
    //     setIsEditing(false);
    //     Alert.alert('Success', 'Profile updated successfully!');
    // }
    const toggleEdit = () => {
        if (isEditing) {
            // Reset form back to original if cancelled
            setUser(initialUser);
        }
        setIsEditing(!isEditing);
    };
    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long');
            return;
        }
        Alert.alert('Success', 'Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const signOut = async () => {
        await logout()
        router.replace('/auth/signin')
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.profileHeader}>
                            <Image source={{ uri: User.avatar }} style={styles.avatar} />
                            <View style={styles.profileInfo}>
                                <Text style={styles.userName}>{session?.user?.user_metadata?.full_name}</Text>
                                <Text style={styles.userRole}>{session?.user?.user_metadata?.designation === "patient" ? "Therapy Client" : "Therapy provider"}</Text>
                                <Text style={styles.therapistInfo}>
                                    {/* Therapist: {User.therapistName} */}
                                    Betterspace LTD.
                                </Text>
                            </View>
                            {/* <TouchableOpacity activeOpacity={1} 
                                style={styles.editButton}
                                onPress={toggleEdit}
                                activeOpacity={1}
                            >
                                <Text style={styles.editButtonText}>
                                    {isEditing ? 'Cancel' : 'Edit'}
                                </Text>
                            </TouchableOpacity> */}
                        </View>

                        <View style={styles.formSection}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={[styles.input, styles.inputDisabled]}
                                    value={user.name}
                                    onChangeText={(text) => setUser({ ...user, name: text })}
                                    editable={false}
                                    selectTextOnFocus={false}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={user.email}
                                    onChangeText={(text) => setUser({ ...user, email: text })}
                                    editable={isEditing}
                                    keyboardType="email-address"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Phone Number</Text>
                                <TextInput
                                    style={[styles.input, !isEditing && styles.inputDisabled]}
                                    value={user.phone}
                                    onChangeText={(text) => setUser({ ...user, phone: text })}
                                    editable={isEditing}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            {isEditing && (
                                <TouchableOpacity activeOpacity={1}
                                    style={styles.saveButton}
                                // onPress={handleSaveProfile}
                                >
                                    <Text style={styles.saveButtonText}>Save Changes</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                );

            case 'security':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Change Password</Text>
                            <Text style={styles.sectionSubtitle}>
                                Keep your account secure by using a strong password
                            </Text>
                        </View>

                        <View style={styles.formSection}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Current Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={passwordData.currentPassword}
                                    onChangeText={(text) =>
                                        setPasswordData({ ...passwordData, currentPassword: text })
                                    }
                                    secureTextEntry
                                    placeholder="Enter current password"
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>New Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={passwordData.newPassword}
                                    onChangeText={(text) =>
                                        setPasswordData({ ...passwordData, newPassword: text })
                                    }
                                    secureTextEntry
                                    placeholder="Enter new password"
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Confirm New Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={passwordData.confirmPassword}
                                    onChangeText={(text) =>
                                        setPasswordData({ ...passwordData, confirmPassword: text })
                                    }
                                    secureTextEntry
                                    placeholder="Confirm new password"
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>

                            <TouchableOpacity activeOpacity={1}
                                style={styles.changePasswordButton}
                                onPress={handleChangePassword}
                            >
                                <Text style={styles.changePasswordButtonText}>
                                    Change Password
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.securityOptions}>
                            <View style={styles.securityOption}>
                                <View>
                                    <Text style={styles.optionTitle}>Biometric Authentication</Text>
                                    <Text style={styles.optionSubtitle}>
                                        Unlock app with fingerprint or face ID
                                    </Text>
                                </View>
                                <Switch
                                    value={biometricAuth}
                                    onValueChange={setBiometricAuth}
                                    trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                                    thumbColor={biometricAuth ? '#FFFFFF' : '#F3F4F6'}
                                />
                            </View>
                        </View>
                    </View>
                );

            case 'sessions':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.sessionStats}>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>{User.sessionsCompleted}</Text>
                                <Text style={styles.statLabel}>Sessions Completed</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>4</Text>
                                <Text style={styles.statLabel}>This Month</Text>
                            </View>
                        </View>

                        <View style={styles.nextSession}>
                            <Text style={styles.nextSessionTitle}>Next Session</Text>
                            <Text style={styles.nextSessionDate}>{User.nextSession}</Text>
                            <Text style={styles.nextSessionTherapist}>
                                with {User.therapistName}
                            </Text>
                            <TouchableOpacity activeOpacity={1} style={styles.rescheduleButton}>
                                <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.sessionHistory}>
                            <Text style={styles.historyTitle}>Recent Sessions</Text>
                            {[1, 2, 3].map((session) => (
                                <View key={session} style={styles.sessionItem}>
                                    <View style={styles.sessionDate}>
                                        <Text style={styles.sessionDay}>Jan {15 - session}</Text>
                                        <Text style={styles.sessionTime}>2:00 PM</Text>
                                    </View>
                                    <View style={styles.sessionDetails}>
                                        <Text style={styles.sessionType}>Individual Therapy</Text>
                                        <Text style={styles.sessionStatus}>Completed</Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={1} style={styles.sessionAction}>
                                        <Text style={styles.sessionActionText}>View Notes</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                );

            case 'settings':
                return (
                    <View style={styles.tabContent}>
                        <View style={styles.settingsSection}>
                            <Text style={styles.sectionTitle}>Preferences</Text>

                            <View style={styles.settingItem}>
                                <View>
                                    <Text style={styles.settingTitle}>Push Notifications</Text>
                                    <Text style={styles.settingSubtitle}>
                                        Receive reminders and updates
                                    </Text>
                                </View>
                                <Switch
                                    value={notifications}
                                    onValueChange={setNotifications}
                                    trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                                    thumbColor={notifications ? '#FFFFFF' : '#F3F4F6'}
                                />
                            </View>

                            <TouchableOpacity activeOpacity={1} style={styles.settingItem}>
                                <View>
                                    <Text style={styles.settingTitle}>Language</Text>
                                    <Text style={styles.settingSubtitle}>English</Text>
                                </View>
                                <Text style={styles.settingArrow}>›</Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={1} style={styles.settingItem}>
                                <View>
                                    <Text style={styles.settingTitle}>Privacy Policy</Text>
                                    <Text style={styles.settingSubtitle}>
                                        Review our privacy practices
                                    </Text>
                                </View>
                                <Text style={styles.settingArrow}>›</Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={1} style={styles.settingItem}>
                                <View>
                                    <Text style={styles.settingTitle}>Terms of Service</Text>
                                    <Text style={styles.settingSubtitle}>
                                        Read our terms and conditions
                                    </Text>
                                </View>
                                <Text style={styles.settingArrow}>›</Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={1} style={[styles.settingItem, styles.dangerItem]} onPress={signOut}>
                                <View>
                                    <Text style={[styles.settingTitle, styles.dangerText]}>
                                        {loading ? "Signing Out..." : "Sign Out"}
                                    </Text>
                                    <Text style={styles.settingSubtitle}>
                                        Sign out of your account
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            {/* Standard Tab Bar */}
            <View style={styles.tabContainer}>
                <View style={styles.tabBar}>
                    {tabs.map((tab) => (
                        <TouchableOpacity activeOpacity={1}
                            key={tab.id}
                            style={[
                                styles.tab,
                                activeTab === tab.id && styles.activeTab,
                            ]}
                            onPress={() => setActiveTab(tab.id)}
                        >
                            <Ionicons
                                name={tab.icon}
                                size={18}
                                color={activeTab === tab.id ? '#10B981' : '#6B7280'}
                            />
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab.id && styles.activeTabText,
                                ]}
                            >
                                {tab.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {renderTabContent()}
            </ScrollView>
        </SafeAreaView>
    );
};

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        // backgroundColor: '#FFFFFF',
        // borderBottomWidth: 1,
        // borderBottomColor: '#E5E7EB',
        // elevation: 2,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.1,
        // shadowRadius: 3,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    tabContainer: {
        // backgroundColor: '#FFFFFF',
        // borderBottomWidth: 1,
        // borderBottomColor: '#E5E7EB',
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    tab: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        // paddingVertical: 12,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#10B981',
    },
    tabText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.textSecondary,
        marginTop: 4,
        textAlign: 'center',
    },
    activeTabText: {
        color: '#10B981',
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    tabContent: {
        padding: 20,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
        borderColor: colors.border,
        borderWidth: 1,

    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
        backgroundColor: colors.item, // Fallback background color
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    therapistInfo: {
        fontSize: 12,
        color: '#10B981',
    },
    editButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#10B981',
        borderRadius: 8,
    },
    editButtonText: {
        color: colors.item,
        fontSize: 14,
        fontWeight: '500',
    },
    formSection: {
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: 12,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
        borderColor: colors.border,
        borderWidth: 1,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.inputBorder,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: colors.inputBackground,
    },
    inputDisabled: {
        backgroundColor: colors.item,
        color: colors.textSecondary,
    },
    saveButton: {
        backgroundColor: '#10B981',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    sectionHeader: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    changePasswordButton: {
        backgroundColor: '#EF4444',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    changePasswordButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    securityOptions: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 20,
        marginTop: 20,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
        borderColor: colors.border,
        borderWidth: 1,
    },
    securityOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    optionSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    sessionStats: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginRight: 10,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
        borderColor: colors.border,
        borderWidth: 1,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#10B981',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    nextSession: {
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
        borderColor: colors.border,
        borderWidth: 1,
    },
    nextSessionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    nextSessionDate: {
        fontSize: 16,
        color: '#10B981',
        fontWeight: '500',
        marginBottom: 4,
    },
    nextSessionTherapist: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    rescheduleButton: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    rescheduleButtonText: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '500',
    },
    sessionHistory: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 20,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
        borderColor: colors.border,
        borderWidth: 1,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    sessionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    sessionDate: {
        width: 60,
        marginRight: 16,
    },
    sessionDay: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
    },
    sessionTime: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    sessionDetails: {
        flex: 1,
    },
    sessionType: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 2,
    },
    sessionStatus: {
        fontSize: 12,
        color: '#10B981',
    },
    sessionAction: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: colors.item,
        borderRadius: 6,
    },
    sessionActionText: {
        fontSize: 12,
        color: colors.text,
        fontWeight: '500',
    },
    settingsSection: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 20,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
        borderColor: colors.border,
        borderWidth: 1,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 4,
    },
    settingSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    settingArrow: {
        fontSize: 20,
        color: colors.textTertiary,
    },
    dangerItem: {
        borderBottomWidth: 0,
    },
    dangerText: {
        color: '#EF4444',
    },
});

export default More;