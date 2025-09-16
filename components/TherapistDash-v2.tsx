import { UserQueryData } from '@/app/(tabs)/chat';
import { useCrud } from '@/hooks/useCrud';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Patient {
    id: string;
    name: string;
    patientId: string; // Platform-generated ID for reference
    lastSession: string;
    status: 'active' | 'inactive' | 'pending';
    notes: PatientNote[];
    sessionCount: number;
    joinedDate: string;
    hasEmergencyContact: boolean; // Just indicate if emergency contact exists
    communicationPreference: 'in-app' | 'scheduled-calls' | 'messages-only';
}

// Patient interface - privacy focused
interface Patients {
    id: number; // Internal DB ID
    name: string; // Only first name + last initial for privacy
    appointment?: string; // Last appointment date
    patient_id: string; // Platform-generated ID for reference
    is_subscribed?: boolean; // Subscription status
    subscription?: 'active' | 'inactive' | 'pending'; // Subscription plan name
    therapist?: number; // Therapist ID
}

// Patient Note interface
interface PatientNote {
    id: string;
    date: string;
    content: string;
    type: 'session' | 'observation' | 'goal' | 'reminder';
    isPrivate: boolean;
}

interface PatientUserData {
    result?: Patients[];
    [key: string]: any
}

// Bank Details interface
interface BankDetails {
    id?: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
    isDefault: boolean;
}

// Payout Request interface
interface PayoutRequest {
    id: string;
    amount: number;
    requestDate: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    bankDetails: BankDetails;
    estimatedArrival?: string;
}

const NOTE_TYPES = [
    { value: 'session', label: 'Session Note' },
    { value: 'observation', label: 'Observation' },
    { value: 'goal', label: 'Goal' },
    { value: 'reminder', label: 'Reminder' },
];

interface TherapistDashboardProps {
    senderId: string;
}

const TherapistDashboard: React.FC<TherapistDashboardProps> = ({ senderId }) => {
    console.log(senderId)
    const [patients, setPatients] = useState<Patient[] | Patient>();
    const [selectedPatient, setSelectedPatient] = useState<Patients | null>(null);
    const [isAddNoteModalVisible, setIsAddNoteModalVisible] = useState<boolean>(false);
    const [isEarningsModalVisible, setIsEarningsModalVisible] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeEarningsTab, setActiveEarningsTab] = useState<'overview' | 'banking' | 'payout'>('overview');




    const { getUserById } = useCrud()

    const { data: therapistData, error: therapistError } = useQuery<UserQueryData>({
        queryKey: ["therapist", { therapist_id: senderId }, "id, balance, pending, total_earning"],
        queryFn: async ({ queryKey }) => {
            const [table, filter, column] = queryKey
            return await getUserById(table as string, filter as Record<any, any>, column as string);
        },
        enabled: !!senderId
    });

    const therapistId = 6
    // const therapistId = therapistData?.result[0]?.id;

    const { data, isLoading, error } = useQuery<PatientUserData>({
        queryKey: ["patients", { therapist: therapistId }, "id, name, therapist, patient_id, appointment, is_subscribed, subscription"],
        queryFn: async ({ queryKey }) => {
            const [table, filter, column] = queryKey
            return await getUserById(table as string, filter as Record<any, any>, column as string)
        },
        enabled: !!therapistId
    });

    // Note form state
    const [noteForm, setNoteForm] = useState({
        content: '',
        type: 'session' as PatientNote['type'],
        isPrivate: false,
    });

    // Filter patients based on search query
    const filteredPatients = data?.result?.filter((patient: Patients) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.patient_id.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? []

    console.log(therapistData, data, filteredPatients, error, "testing for patients", senderId, therapistId)

    // Get status color
    const getStatusColor = (status: Patient['status']) => {
        switch (status) {
            case 'active':
                return '#28a745';
            case 'pending':
                return '#ffc107';
            case 'inactive':
                return '#6c757d';
            default:
                return '#6c757d';
        }
    };

    // Get note type color
    const getNoteTypeColor = (type: PatientNote['type']) => {
        switch (type) {
            case 'session':
                return '#007AFF';
            case 'observation':
                return '#28a745';
            case 'goal':
                return '#ffc107';
            case 'reminder':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    // Get payout status color
    const getPayoutStatusColor = (status: PayoutRequest['status']) => {
        switch (status) {
            case 'completed':
                return '#28a745';
            case 'processing':
                return '#007AFF';
            case 'pending':
                return '#ffc107';
            case 'failed':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    // Open add note modal
    const openAddNoteModal = () => {
        setNoteForm({
            content: '',
            type: 'session',
            isPrivate: false,
        });
        setIsAddNoteModalVisible(true);
    };

    // Open earnings modal
    const openEarningsModal = () => {
        setIsEarningsModalVisible(true);
        setActiveEarningsTab('overview');
    };



    // Navigate to secure in-app chat
    const navigateToChat = (patient: Patients) => {
        Alert.alert(
            'Open Secure Chat',
            `Opening secure in-app messaging with ${patient.name}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Open Chat', onPress: () => {
                        console.log(`Opening secure chat with patient ${patient.patient_id}`);
                    }
                }
            ]
        );
    };

    // Patient List View
    if (!selectedPatient) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>My Patients</Text>

                    </View>
                    <TouchableOpacity
                        style={styles.earningsButton}
                        onPress={openEarningsModal}
                    >
                        <Text style={styles.earningsButtonText}>💰 Earnings</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search patients by name or ID..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <ScrollView style={styles.patientsList}>
                    <Text style={styles.headerSubtitle}>{data?.result?.length} total patients</Text>
                    {filteredPatients.map((patient: Patients) => (
                        <TouchableOpacity
                            key={patient.id}
                            style={styles.patientCard}
                            onPress={() => setSelectedPatient(patient)}
                        >
                            <View style={styles.patientHeader}>
                                <View style={styles.patientInfo}>
                                    <Text style={styles.patientName}>{patient.name}</Text>
                                    <Text style={styles.patientId}>ID: {patient.patient_id}</Text>
                                </View>
                                <View style={styles.statusBadge}>
                                    {/* Status content */}
                                </View>
                            </View>
                            <View style={styles.patientDetails}>
                                <Text style={styles.lastSession}>
                                    {/* Last session content */}
                                </Text>
                                <Text style={styles.sessionCount}>
                                    {/* Session count content */}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                {/* EArnings was removed here */}


            </SafeAreaView>
        );
    }

    // Patient Detail View (unchanged)
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => setSelectedPatient(null)}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{selectedPatient.name}</Text>
                <TouchableOpacity
                    onPress={() => navigateToChat(selectedPatient)}
                    style={styles.chatButton}
                >
                    <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.patientDetailContainer}>
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Patient Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Patient ID:</Text>
                        <Text style={styles.infoValue}>{selectedPatient.patient_id}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d4150',
        flex: 1,
    },

    earningsButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    earningsButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    backButton: {
        paddingVertical: 8,
        paddingRight: 16,
    },
    backButtonText: {
        color: '#4CAF50',
        fontSize: 16,
    },
    chatButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    chatButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#dee2e6',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
    },
    patientsList: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 2,
        textAlign: 'left',
    },
    patientCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    patientHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    patientInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d4150',
        marginBottom: 4,
    },
    patientId: {
        fontSize: 14,
        color: '#6c757d',
        fontFamily: 'monospace',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    patientDetails: {
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        paddingTop: 12,
    },
    lastSession: {
        fontSize: 14,
        color: '#495057',
        marginBottom: 4,
    },
    sessionCount: {
        fontSize: 12,
        color: '#6c757d',
    },
    patientDetailContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d4150',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#2d4150',
        fontWeight: '500',
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d4150',
    },
    cancelButton: {
        paddingVertical: 8,
    },
    cancelButtonText: {
        color: '#4CAF50',
        fontSize: 16,
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    // Tab Styles
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        marginHorizontal: 16,
        borderRadius: 8,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    tabButtonActive: {
        backgroundColor: '#4CAF50',
    },
    tabButtonText: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500',
    },
    tabButtonTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    // Earnings Overview Styles
    earningsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    earningsCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    balanceCard: {
        flex: 0.48,
        backgroundColor: '#e8f5e8',
    },
    pendingCard: {
        flex: 0.48,
        backgroundColor: '#fff3cd',
    },
    earningsCardLabel: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 8,
        textAlign: 'center',
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    earningsCardValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d4150',
        textAlign: 'center',
    },
    totalEarnings: {
        fontSize: 32,
        color: '#4CAF50',
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d4150',
        marginBottom: 16,
    },
    emptyStateText: {
        textAlign: 'center',
        color: '#6c757d',
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 16,
    },
    // Payout Item Styles
    payoutItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    payoutItemLeft: {
        flex: 1,
    },
    payoutAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d4150',
        marginBottom: 4,
    },
    payoutDate: {
        fontSize: 12,
        color: '#6c757d',
    },
    payoutStatusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    payoutStatusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    // Input Styles
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2d4150',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#dee2e6',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
    },
    // Account Type Styles
    accountTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    accountTypeButton: {
        flex: 0.48,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
        alignItems: 'center',
    },
    accountTypeButtonSelected: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    accountTypeButtonText: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500',
    },
    accountTypeButtonTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    // Checkbox Styles
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#dee2e6',
        borderRadius: 4,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    checkmark: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#2d4150',
    },
    // Button Styles
    addBankButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    addBankButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Bank Account Item Styles
    bankAccountItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    bankAccountInfo: {
        flex: 1,
    },
    bankName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d4150',
        marginBottom: 4,
    },
    bankAccountDetails: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 2,
        textTransform: 'capitalize',
    },
    bankAccountName: {
        fontSize: 12,
        color: '#6c757d',
    },
    defaultBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    defaultBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    // Payout Request Styles
    availableBalance: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    noBankAccountText: {
        fontSize: 14,
        color: '#dc3545',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 16,
    },
    bankSelectionContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    bankSelectionItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
        marginRight: 12,
        minWidth: 120,
        alignItems: 'center',
    },
    bankSelectionItemSelected: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    bankSelectionName: {
        fontSize: 12,
        color: '#2d4150',
        fontWeight: '600',
        marginBottom: 4,
        textAlign: 'center',
    },
    bankSelectionNameSelected: {
        color: '#fff',
    },
    bankSelectionDetails: {
        fontSize: 10,
        color: '#6c757d',
        textAlign: 'center',
    },
    bankSelectionDetailsSelected: {
        color: '#fff',
    },
    requestPayoutButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    requestPayoutButtonDisabled: {
        backgroundColor: '#dee2e6',
    },
    requestPayoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    payoutNote: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 16,
    },
    // Payout History Styles
    payoutHistoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    payoutHistoryLeft: {
        flex: 1,
    },
    payoutHistoryAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d4150',
        marginBottom: 4,
    },
    payoutHistoryDate: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 2,
    },
    payoutHistoryBank: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 2,
    },
    payoutHistoryEta: {
        fontSize: 11,
        color: '#007AFF',
        fontStyle: 'italic',
    },
    payoutHistoryStatusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 12,
    },
    payoutHistoryStatusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
})

export default TherapistDashboard