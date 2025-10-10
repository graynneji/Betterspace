import { Colors } from '@/constants/Colors';
import { useCheckAuth } from '@/context/AuthContext';
import { useCrudCreate, useGetById } from '@/hooks/useCrud';
import { PatientNote, Patients } from '@/types';
import { capitalizeFirstLetter, formatDate } from '@/utils';
import { generatePatientId } from '@/utils/uniqueId';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { Suspense, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import AddNotesModal, { noteFormProps } from '../../components/AddNotesModal';
import EarningModal from '../../components/EarningModal';
import Notes from '../../components/Notes';
import SkeletonLoader from '../../components/SkeletonLoader';

interface PatientUserData {
    result?: Patients[];
    [key: string]: any
}

interface NoteForm {
    content: string;
    type: PatientNote['type'];
    is_private: boolean;
    patient_id: string | number;
}

const TherapistDashboard: React.FC = () => {
    const [selectedPatient, setSelectedPatient] = useState<Patients | null>(null);
    const [isAddNoteModalVisible, setIsAddNoteModalVisible] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isEarningsModalVisible, setIsEarningsModalVisible] = useState<boolean>(false);
    const [activeEarningsTab, setActiveEarningsTab] = useState<'overview' | 'banking' | 'payout'>('overview');
    const router = useRouter()
    const { session } = useCheckAuth()
    const staleTime = 1000 * 60 * 60 * 24
    const gcTime = 1000 * 60 * 60 * 24
    const refetchOnWindowFocus = false
    const refetchOnReconnect = false
    const refetchOnMount = false
    const senderId = session?.user?.id!
    const { data: therapistData, isLoading: isLoad, error: therapistError, refetch: refetch1, isError } = useGetById("therapist",
        { therapist_id: senderId },
        "id, balance, pending, total_earning",
        !!senderId,
        {},
        staleTime,
        gcTime,
        refetchOnWindowFocus,
        refetchOnReconnect,
        refetchOnMount
    )

    const therapistId = therapistData?.result[0]?.id;
    const { data, isLoading, error, refetch } = useGetById("patients", { therapist: therapistId }, "id, created_at, name, therapist, patient_id, appointment, is_subscribed, subscription, patient_notes!patient_id(*)", !!therapistId, {})
    const [refreshing, setRefreshing] = useState(false);

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const styles = createStyles(colors);

    const handleRefetch = () => {
        refetch1()
        refetch()
    }

    const onRefresh = () => {
        try {
            setRefreshing(true);
            handleRefetch();
        } finally {
            setRefreshing(false);
        }
    };

    const handleRecieverId = (patient_id: string, id: number, patient_name: string) => {
        const receiverId = patient_id;
        router.push({
            pathname: "/(tabs)/session",
            params: {
                id: String(id),
                patientId: receiverId,
                patientName: patient_name
            },
        });
    }

    const [noteForm, setNoteForm] = useState<noteFormProps>({
        content: '',
        type: 'session' as PatientNote['type'],
        is_private: false,
        patient_id: ''
    });

    const filteredPatients = data?.result?.filter((patient: Patients) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.patient_id.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? []

    const getStatusColor = (status: Patients['subscription']) => {
        switch (status) {
            case 'active':
                return colors.online;
            case 'pending':
                return colors.sending;
            case 'inactive':
                return colors.offline;
            default:
                return colors.offline;
        }
    };

    const getNoteTypeColor: (type: PatientNote['type']) => '#007AFF' | '#6c757d' | '#dc3545' | '#28a745' | '#ffc107' = (type) => {
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

    const openAddNoteModal = () => {
        setNoteForm({
            content: '',
            type: 'session',
            is_private: false,
            patient_id: selectedPatient?.id
        });
        setIsAddNoteModalVisible(true);
    };

    const createUserMutation = useCrudCreate<NoteForm>("patient_notes");

    const openEarningsModal = () => {
        setIsEarningsModalVisible(true);
        setActiveEarningsTab('overview');
    };

    const saveNote = () => {
        if (!noteForm.content.trim()) {
            Alert.alert('Error', 'Please enter note content');
            return;
        }

        if (!selectedPatient) return;

        const newNote: NoteForm = {
            patient_id: selectedPatient?.id,
            content: noteForm.content.trim(),
            type: noteForm.type,
            is_private: noteForm.is_private,
        };
        createUserMutation.mutate(noteForm);
        setIsAddNoteModalVisible(false);
    }

    const navigateToChat = (patient: Patients) => {
        Alert.alert(
            'Open Secure Chat',
            `Opening secure in-app messaging with ${patient.name}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Open Chat', onPress: () => {
                        handleRecieverId(patient.patient_id, patient.id, patient.name)
                    }
                }
            ]
        );
    };

    const requestEmergencyAccess = (patient: Patients) => {
        Alert.alert(
            'Emergency Contact Request',
            'This will send a request to platform administrators for emergency contact information. Use only in genuine emergencies.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Request Access',
                    style: 'destructive',
                    onPress: () => {
                        console.log(`Emergency contact request for patient ${patient.patient_id}`);
                        Alert.alert('Request Sent', 'Emergency contact request has been sent to administrators.');
                    }
                }
            ]
        );
    };

    if (isLoad || isLoading) {
        <SkeletonLoader />
    }

    if (!selectedPatient) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Patients</Text>
                    <TouchableOpacity onPress={openEarningsModal}>
                        <Ionicons name='wallet-outline' size={30} color={colors.icon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search patients by name or ID..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={colors.placeholder}
                    />
                </View>

                <ScrollView style={styles.patientsList} refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                    <Text style={styles.headerSubtitle}>{data?.result?.length} total patients</Text>
                    <Suspense fallback={<Text style={{ marginTop: 12, color: colors.text }}>Loading...</Text>}>
                        {(error || therapistError || isError) ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>Error loading patients</Text>
                                <TouchableOpacity style={styles.retryButton} onPress={handleRefetch}>
                                    <Text style={styles.retryText}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                        ) : filteredPatients.length === 0 ? <View style={styles.noPatients}>
                            <Ionicons name="people-outline" size={32} color="#d1d5db" />
                            <Text style={styles.noPatientsText}>No patient yet</Text>
                            <Text style={styles.noPatientsSubtext}>You will be matched to a new patient to get started.</Text>
                        </View> : filteredPatients.map((patient: Patients) => (
                            <TouchableOpacity
                                key={patient.id}
                                style={styles.patientCard}
                                onPress={() => setSelectedPatient(patient)}
                            >
                                <View style={styles.patientHeader}>
                                    <View style={styles.patientInfo}>
                                        <Text style={styles.patientName}>{capitalizeFirstLetter(patient.name)}</Text>
                                        <View style={styles.patientIdContainer}>
                                            <Ionicons name="card-outline" size={12} color={colors.iconSecondary} />
                                            <Text style={styles.patientId}>ID: {generatePatientId(patient?.created_at, patient?.id)}</Text>
                                        </View>
                                    </View>
                                    <View style={[
                                        styles.statusBadge,
                                        { backgroundColor: getStatusColor(patient.is_subscribed ? 'active' : 'inactive') }
                                    ]}>
                                        <Text style={styles.statusText}>{patient?.is_subscribed ? 'active' : 'inactive'}</Text>
                                    </View>
                                </View>
                                <View style={styles.patientDetails}>
                                    <Text style={styles.lastSession}>
                                        Last session: {formatDate(patient.created_at)}
                                    </Text>
                                    <Text style={styles.sessionCount}>
                                        {10} sessions • {patient.patient_notes.length} notes
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </Suspense>
                </ScrollView>
                <EarningModal
                    isEarningsModalVisible={isEarningsModalVisible}
                    setIsEarningsModalVisible={setIsEarningsModalVisible}
                    therapistData={therapistData}
                    activeEarningsTab={activeEarningsTab}
                    setActiveEarningsTab={setActiveEarningsTab}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => setSelectedPatient(null)}
                    style={styles.backButton}
                >
                    <View style={styles.backButtonTextCon}>
                        <Ionicons name="chevron-back-outline" size={26} color={colors.icon} />
                        <Text style={styles.backButtonText}>Back</Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{capitalizeFirstLetter(selectedPatient.name)}</Text>
                <TouchableOpacity onPress={() => navigateToChat(selectedPatient)}>
                    <Ionicons name='chatbubbles-outline' size={30} color={colors.icon} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.patientDetailContainer}>
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Patient Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Patient ID:</Text>
                        <Text style={styles.infoValue}>{generatePatientId(selectedPatient?.created_at, selectedPatient?.id)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Joined:</Text>
                        <Text style={styles.infoValue}>
                            {formatDate(selectedPatient.created_at)}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Communication:</Text>
                        <Text style={[styles.infoValue, styles.commPref]}>
                            In-app
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Subscription:</Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusColor(selectedPatient.is_subscribed ? 'active' : 'inactive') }
                        ]}>
                            <Text style={styles.statusText}>{selectedPatient.is_subscribed ? 'active' : 'inactive'}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Sessions:</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Emergency Contact:</Text>
                        <View style={styles.emergencyContactRow}>
                            <Text style={[
                                styles.infoValue,
                                { color: true ? colors.online : colors.danger }
                            ]}>
                                {true ? 'Available' : 'Not provided'}
                            </Text>
                            {true && (
                                <TouchableOpacity
                                    style={styles.emergencyButton}
                                    onPress={() => requestEmergencyAccess(selectedPatient)}
                                >
                                    <Text style={styles.emergencyButtonText}>Emergency Access</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.actionCard}>
                    <Text style={styles.cardTitle}>Quick Actions</Text>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => router.push("schedule")}
                        >
                            <Text style={styles.actionButtonText}>Schedule Session</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.secondaryButton]}
                            onPress={() => navigateToChat(selectedPatient)}
                        >
                            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                                Secure Message
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Notes
                    openAddNoteModal={openAddNoteModal}
                    selectedPatient={selectedPatient}
                    getNoteTypeColor={getNoteTypeColor}
                />
            </ScrollView>

            <AddNotesModal
                setIsAddNoteModalVisible={setIsAddNoteModalVisible}
                isAddNoteModalVisible={isAddNoteModalVisible}
                noteForm={noteForm}
                setNoteForm={setNoteForm}
                saveNote={saveNote}
            />
        </SafeAreaView>
    );
};

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        flex: 1,
    },
    backButton: {
        paddingRight: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    backButtonTextCon: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    backButtonText: {
        fontSize: 16,
        color: colors.text,
    },
    errorContainer: {
        alignItems: 'center',
        padding: 20,
        minHeight: 400,
        justifyContent: 'center',
    },
    errorText: {
        color: colors.failed,
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    retryText: {
        color: colors.primaryText,
    },
    noPatients: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    noPatientsText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textSecondary,
        marginTop: 12,
    },
    noPatientsSubtext: {
        fontSize: 14,
        color: colors.textTertiary,
        marginTop: 4,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingBottom: 5,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: colors.surface,
        color: colors.text,
    },
    patientsList: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    headerSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
        marginBottom: 12,
        textAlign: 'left',
    },
    patientCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderColor: colors.border,
        borderWidth: 1,
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
    patientIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    patientName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    patientId: {
        fontSize: 14,
        color: colors.textSecondary,
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
        borderTopColor: colors.divider,
        paddingTop: 12,
    },
    lastSession: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    sessionCount: {
        fontSize: 12,
        color: colors.textTertiary,
    },
    patientDetailContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    infoCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderColor: colors.border,
        borderWidth: 1,
    },
    actionCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderColor: colors.border,
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
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
        color: colors.textSecondary,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '500',
    },
    commPref: {
        textTransform: 'capitalize',
    },
    emergencyContactRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emergencyButton: {
        backgroundColor: colors.danger,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    emergencyButtonText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        flex: 0.48,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    actionButtonText: {
        color: colors.primaryText,
        fontSize: 14,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: colors.primary,
    },
});

export default TherapistDashboard;