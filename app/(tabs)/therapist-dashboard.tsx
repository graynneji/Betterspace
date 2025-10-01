import { useCheckAuth } from '@/context/AuthContext';
import { useCrudCreate, useGetById } from '@/hooks/useCrud';
import { PatientNote, Patients } from '@/types';
import { formatDate } from '@/utils';
import { generatePatientId } from '@/utils/uniqueId';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { Suspense, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
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
    const senderId = session?.user?.id!
    const { data: therapistData, isLoading: isLoad, error: therapistError, refetch: refetch1, isError } = useGetById("therapist", { therapist_id: senderId }, "id, balance, pending, total_earning", !!senderId)

    const therapistId = therapistData?.result[0]?.id;
    const { data, isLoading, error, refetch } = useGetById("patients", { therapist: therapistId }, "id, created_at, name, therapist, patient_id, appointment, is_subscribed, subscription, patient_notes!patient_id(*)", !!therapistId)

    const handleRefetch = () => {
        refetch1()
        refetch()
    }
    const handleRecieverId = (patient_id: string, id: number) => {
        const receiverId = patient_id;
        // setPatientId(receiverId)

        // router.replace("/(tabs)/session")
        router.push({
            pathname: "/(tabs)/session",
            //the id is the patients table id i use to join patient_note table 
            //while patient_id is uuid used for for the messaging
            params: {
                id: String(id),
                patientId: receiverId
            },
        });
    }

    // Note form state
    const [noteForm, setNoteForm] = useState<noteFormProps>({
        content: '',
        type: 'session' as PatientNote['type'],
        is_private: false,
        patient_id: ''
    });

    // Filter patients based on search query
    const filteredPatients = data?.result?.filter((patient: Patients) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.patient_id.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? []
    // Get status color
    const getStatusColor = (status: Patients['subscription']) => {
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

    // Open add note modal
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
    // Open earnings modal
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

    // setIsAddNoteModalVisible(false);

    // console.log(newNote, "notte")
    // };

    // // Delete note
    // const deleteNote = (noteId: string) => {
    //     Alert.alert(
    //         'Delete Note',
    //         'Are you sure you want to delete this note?',
    //         [
    //             { text: 'Cancel', style: 'cancel' },
    //             {
    //                 text: 'Delete',
    //                 style: 'destructive',
    //                 onPress: () => {
    //                     if (!selectedPatient) return;

    //                     setPatients(prev => prev.map((patient:Patient) =>
    //                         patient.id === selectedPatient.id
    //                             ? { ...patient, notes: patient.notes.filter(note => note.id !== noteId) }
    //                             : patient
    //                     ));

    //                     setSelectedPatient(prev => prev ? {
    //                         ...prev,
    //                         notes: prev.notes.filter(note => note.id !== noteId)
    //                     } : null);
    //                 },
    //             },
    //         ]
    //     );
    // };

    // Navigate to secure in-app chat
    const navigateToChat = (patient: Patients) => {
        Alert.alert(
            'Open Secure Chat',
            `Opening secure in-app messaging with ${patient.name}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Open Chat', onPress: () => {
                        // Navigate to secure chat within the app
                        handleRecieverId(patient.patient_id, patient.id)
                    }
                }
            ]
        );
    };

    // Schedule session through platform
    // const scheduleSession = (patient: Patients) => {
    //     Alert.alert(
    //         'Schedule Session',
    //         `Schedule a session with ${patient.name} through the platform`,
    //         [
    //             { text: 'Cancel', style: 'cancel' },
    //             {
    //                 text: 'Schedule', onPress: () => {
    //                     console.log(`Scheduling session for patient ${patient.patientId}`);
    //                 }
    //             }
    //         ]
    //     );
    // };

    // Request emergency contact (through platform admin)
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
    // Patient List View
    if (!selectedPatient) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Patients</Text>
                    <TouchableOpacity
                        style={styles.earningsButton}
                        onPress={openEarningsModal}
                    >
                        <Ionicons name='wallet-outline' size={20} color='#f8f9f8' />
                        <Text style={styles.earningsButtonText}>Earnings</Text>
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
                    <Suspense fallback={<Text style={{ marginTop: 12 }}>Loading...</Text>}>
                        {(error || therapistError || isError) ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>Error loading patients</Text>
                                <TouchableOpacity style={styles.retryButton} onPress={handleRefetch}>
                                    <Text style={styles.retryText}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                        ) : filteredPatients.map((patient: Patients) => (
                            <TouchableOpacity
                                key={patient.id}
                                style={styles.patientCard}
                                onPress={() => setSelectedPatient(patient)}
                            >
                                <View style={styles.patientHeader}>
                                    <View style={styles.patientInfo}>
                                        <Text style={styles.patientName}>{patient.name}</Text>
                                        <Text style={styles.patientId}>ID: {generatePatientId(patient?.created_at, patient?.id)}</Text>
                                    </View>
                                    <View style={[
                                        styles.statusBadge,
                                        { backgroundColor: getStatusColor('active') }
                                    ]}>
                                        <Text style={styles.statusText}>active</Text>
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

    // Patient Detail View
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => setSelectedPatient(null)}
                    style={styles.backButton}
                >
                    <View style={styles.backButtonTextCon}>

                        <Ionicons name="chevron-back-outline" size={26} />
                        <Text style={styles.backButtonText}>Back</Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{selectedPatient.name}</Text>
                <TouchableOpacity
                    onPress={() => navigateToChat(selectedPatient)}
                    style={styles.chatButton}
                >
                    <Ionicons name='chatbubbles-outline' size={20} color='#f8f9f8' />

                    <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.patientDetailContainer}>
                {/* Patient Info Card */}
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
                            {/* {selectedPatient.communicationPreference.replace('-', ' ')} */}
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
                        {/* <Text style={styles.infoValue}>{selectedPatient.sessionCount}</Text> */}
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Emergency Contact:</Text>
                        <View style={styles.emergencyContactRow}>
                            <Text style={[
                                styles.infoValue,
                                // { color: selectedPatient.hasEmergencyContact ? '#28a745' : '#dc3545' }
                                { color: true ? '#28a745' : '#dc3545' }
                            ]}>
                                {/* {selectedPatient.hasEmergencyContact ? 'Available' : 'Not provided'} */}
                                {true ? 'Available' : 'Not provided'}
                            </Text>
                            {/* {selectedPatient.hasEmergencyContact && ( */}
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

                {/* Action Buttons */}
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

                {/* Notes */}
                <Notes
                    openAddNoteModal={openAddNoteModal}
                    selectedPatient={selectedPatient}
                    //    deleteNote={deleteNote}
                    getNoteTypeColor={getNoteTypeColor}

                />
            </ScrollView>

            {/* Add Note Modal */}

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
        // backgroundColor: '#fff',
        // borderBottomWidth: 1,
        // borderBottomColor: '#e9ecef',
        // elevation: 2,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.1,
        // shadowRadius: 3,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d4150',
        flex: 1,
        // textAlign: 'center',
    },
    earningsButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    earningsButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    backButton: {
        // paddingVertical: 8,
        paddingRight: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    backButtonTextCon: {
        flex: 1,
        // gap: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    backButtonText: {
        // color: '#4CAF50',
        fontSize: 16,
    },
    chatButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    chatButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    errorContainer: {
        alignItems: 'center',
        padding: 20,
        minHeight: 400,
        justifyContent: 'center',
    },
    errorText: {
        color: '#ff4444',
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    retryText: {
        color: '#fff',
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingBottom: 5,
        // paddingVertical: 12,
        // backgroundColor: '#fff',
        // borderBottomWidth: 1,
        // borderBottomColor: '#e9ecef',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#dee2e6',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    patientsList: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: 500,
        marginBottom: 12,
        textAlign: 'left',
    },
    patientCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
        borderColor: "#DEE2E6",
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
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
        borderColor: "#DEE2E6",
        borderWidth: 1,
    },
    actionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
        borderColor: "#DEE2E6",
        borderWidth: 1,
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
    commPref: {
        textTransform: 'capitalize',
    },
    emergencyContactRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emergencyButton: {
        backgroundColor: '#dc3545',
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
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        flex: 0.48,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#4CAF50',
    },
});

export default TherapistDashboard;