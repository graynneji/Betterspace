// import React, { useState } from 'react';
// import {
//     Alert,
//     Modal,
//     SafeAreaView,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from 'react-native';

// // Patient interface
// interface Patient {
//     id: string;
//     name: string;
//     email: string;
//     phone: string;
//     lastSession: string;
//     status: 'active' | 'inactive' | 'pending';
//     notes: PatientNote[];
//     emergencyContact: string;
//     sessionCount: number;
// }

// // Patient Note interface
// interface PatientNote {
//     id: string;
//     date: string;
//     content: string;
//     type: 'session' | 'observation' | 'goal' | 'reminder';
//     isPrivate: boolean;
// }

// // Mock patient data
// const MOCK_PATIENTS: Patient[] = [
//     {
//         id: '1',
//         name: 'Sarah Johnson',
//         email: 'sarah.johnson@email.com',
//         phone: '+1 (555) 123-4567',
//         lastSession: '2025-08-20',
//         status: 'active',
//         emergencyContact: '+1 (555) 987-6543',
//         sessionCount: 12,
//         notes: [
//             {
//                 id: '1',
//                 date: '2025-08-20',
//                 content: 'Patient showed significant improvement in anxiety management techniques. Discussed coping strategies for work-related stress.',
//                 type: 'session',
//                 isPrivate: false,
//             },
//             {
//                 id: '2',
//                 date: '2025-08-15',
//                 content: 'Goal: Practice mindfulness exercises daily for 10 minutes.',
//                 type: 'goal',
//                 isPrivate: false,
//             },
//         ],
//     },
//     {
//         id: '2',
//         name: 'Michael Chen',
//         email: 'michael.chen@email.com',
//         phone: '+1 (555) 234-5678',
//         lastSession: '2025-08-18',
//         status: 'active',
//         emergencyContact: '+1 (555) 876-5432',
//         sessionCount: 8,
//         notes: [
//             {
//                 id: '3',
//                 date: '2025-08-18',
//                 content: 'Discussed career transition concerns. Patient is making good progress with decision-making framework.',
//                 type: 'session',
//                 isPrivate: false,
//             },
//         ],
//     },
//     {
//         id: '3',
//         name: 'Emily Rodriguez',
//         email: 'emily.rodriguez@email.com',
//         phone: '+1 (555) 345-6789',
//         lastSession: '2025-08-16',
//         status: 'pending',
//         emergencyContact: '+1 (555) 765-4321',
//         sessionCount: 3,
//         notes: [],
//     },
// ];

// const NOTE_TYPES = [
//     { value: 'session', label: 'Session Note' },
//     { value: 'observation', label: 'Observation' },
//     { value: 'goal', label: 'Goal' },
//     { value: 'reminder', label: 'Reminder' },
// ];

// const TherapistDashboard: React.FC = () => {
//     const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
//     const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//     const [isAddNoteModalVisible, setIsAddNoteModalVisible] = useState<boolean>(false);
//     const [searchQuery, setSearchQuery] = useState<string>('');

//     // Note form state
//     const [noteForm, setNoteForm] = useState({
//         content: '',
//         type: 'session' as PatientNote['type'],
//         isPrivate: false,
//     });

//     // Filter patients based on search query
//     const filteredPatients = patients.filter(patient =>
//         patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         patient.email.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     // Get status color
//     const getStatusColor = (status: Patient['status']) => {
//         switch (status) {
//             case 'active':
//                 return '#28a745';
//             case 'pending':
//                 return '#ffc107';
//             case 'inactive':
//                 return '#6c757d';
//             default:
//                 return '#6c757d';
//         }
//     };

//     // Get note type color
//     const getNoteTypeColor = (type: PatientNote['type']) => {
//         switch (type) {
//             case 'session':
//                 return '#007AFF';
//             case 'observation':
//                 return '#28a745';
//             case 'goal':
//                 return '#ffc107';
//             case 'reminder':
//                 return '#dc3545';
//             default:
//                 return '#6c757d';
//         }
//     };

//     // Open add note modal
//     const openAddNoteModal = () => {
//         setNoteForm({
//             content: '',
//             type: 'session',
//             isPrivate: false,
//         });
//         setIsAddNoteModalVisible(true);
//     };

//     // Save note
//     const saveNote = () => {
//         if (!noteForm.content.trim()) {
//             Alert.alert('Error', 'Please enter note content');
//             return;
//         }

//         if (!selectedPatient) return;

//         const newNote: PatientNote = {
//             id: Date.now().toString(),
//             date: new Date().toISOString().split('T')[0],
//             content: noteForm.content.trim(),
//             type: noteForm.type,
//             isPrivate: noteForm.isPrivate,
//         };

//         setPatients(prev => prev.map(patient =>
//             patient.id === selectedPatient.id
//                 ? { ...patient, notes: [newNote, ...patient.notes] }
//                 : patient
//         ));

//         // Update selected patient
//         setSelectedPatient(prev => prev ? {
//             ...prev,
//             notes: [newNote, ...prev.notes]
//         } : null);

//         setIsAddNoteModalVisible(false);
//     };

//     // Delete note
//     const deleteNote = (noteId: string) => {
//         Alert.alert(
//             'Delete Note',
//             'Are you sure you want to delete this note?',
//             [
//                 { text: 'Cancel', style: 'cancel' },
//                 {
//                     text: 'Delete',
//                     style: 'destructive',
//                     onPress: () => {
//                         if (!selectedPatient) return;

//                         setPatients(prev => prev.map(patient =>
//                             patient.id === selectedPatient.id
//                                 ? { ...patient, notes: patient.notes.filter(note => note.id !== noteId) }
//                                 : patient
//                         ));

//                         setSelectedPatient(prev => prev ? {
//                             ...prev,
//                             notes: prev.notes.filter(note => note.id !== noteId)
//                         } : null);
//                     },
//                 },
//             ]
//         );
//     };

//     // Navigate to chat (placeholder)
//     const navigateToChat = (patient: Patient) => {
//         Alert.alert('Navigate to Chat', `Opening chat with ${patient.name}`);
//     };

//     // Patient List View
//     if (!selectedPatient) {
//         return (
//             <SafeAreaView style={styles.container}>
//                 <View style={styles.header}>
//                     <Text style={styles.headerTitle}>My Patients</Text>
//                     <Text style={styles.headerSubtitle}>{patients.length} total patients</Text>
//                 </View>

//                 <View style={styles.searchContainer}>
//                     <TextInput
//                         style={styles.searchInput}
//                         placeholder="Search patients..."
//                         value={searchQuery}
//                         onChangeText={setSearchQuery}
//                         placeholderTextColor="#9ca3af"
//                     />
//                 </View>

//                 <ScrollView style={styles.patientsList}>
//                     {filteredPatients.map(patient => (
//                         <TouchableOpacity
//                             key={patient.id}
//                             style={styles.patientCard}
//                             onPress={() => setSelectedPatient(patient)}
//                         >
//                             <View style={styles.patientHeader}>
//                                 <View style={styles.patientInfo}>
//                                     <Text style={styles.patientName}>{patient.name}</Text>
//                                     <Text style={styles.patientEmail}>{patient.email}</Text>
//                                 </View>
//                                 <View style={[
//                                     styles.statusBadge,
//                                     { backgroundColor: getStatusColor(patient.status) }
//                                 ]}>
//                                     <Text style={styles.statusText}>{patient.status}</Text>
//                                 </View>
//                             </View>
//                             <View style={styles.patientDetails}>
//                                 <Text style={styles.lastSession}>
//                                     Last session: {new Date(patient.lastSession).toLocaleDateString()}
//                                 </Text>
//                                 <Text style={styles.sessionCount}>
//                                     {patient.sessionCount} sessions • {patient.notes.length} notes
//                                 </Text>
//                             </View>
//                         </TouchableOpacity>
//                     ))}
//                 </ScrollView>
//             </SafeAreaView>
//         );
//     }

//     // Patient Detail View
//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.header}>
//                 <TouchableOpacity
//                     onPress={() => setSelectedPatient(null)}
//                     style={styles.backButton}
//                 >
//                     <Text style={styles.backButtonText}>← Back</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>{selectedPatient.name}</Text>
//                 <TouchableOpacity
//                     onPress={() => navigateToChat(selectedPatient)}
//                     style={styles.chatButton}
//                 >
//                     <Text style={styles.chatButtonText}>Chat</Text>
//                 </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.patientDetailContainer}>
//                 {/* Patient Info Card */}
//                 <View style={styles.infoCard}>
//                     <Text style={styles.cardTitle}>Patient Information</Text>
//                     <View style={styles.infoRow}>
//                         <Text style={styles.infoLabel}>Email:</Text>
//                         <Text style={styles.infoValue}>{selectedPatient.email}</Text>
//                     </View>
//                     <View style={styles.infoRow}>
//                         <Text style={styles.infoLabel}>Phone:</Text>
//                         <Text style={styles.infoValue}>{selectedPatient.phone}</Text>
//                     </View>
//                     <View style={styles.infoRow}>
//                         <Text style={styles.infoLabel}>Emergency Contact:</Text>
//                         <Text style={styles.infoValue}>{selectedPatient.emergencyContact}</Text>
//                     </View>
//                     <View style={styles.infoRow}>
//                         <Text style={styles.infoLabel}>Status:</Text>
//                         <View style={[
//                             styles.statusBadge,
//                             { backgroundColor: getStatusColor(selectedPatient.status) }
//                         ]}>
//                             <Text style={styles.statusText}>{selectedPatient.status}</Text>
//                         </View>
//                     </View>
//                     <View style={styles.infoRow}>
//                         <Text style={styles.infoLabel}>Sessions:</Text>
//                         <Text style={styles.infoValue}>{selectedPatient.sessionCount}</Text>
//                     </View>
//                 </View>

//                 {/* Notes Section */}
//                 <View style={styles.notesCard}>
//                     <View style={styles.notesHeader}>
//                         <Text style={styles.cardTitle}>Notes ({selectedPatient.notes.length})</Text>
//                         <TouchableOpacity
//                             style={styles.addNoteButton}
//                             onPress={openAddNoteModal}
//                         >
//                             <Text style={styles.addNoteButtonText}>+ Add Note</Text>
//                         </TouchableOpacity>
//                     </View>

//                     {selectedPatient.notes.length === 0 ? (
//                         <Text style={styles.noNotesText}>No notes yet. Add the first note!</Text>
//                     ) : (
//                         selectedPatient.notes.map(note => (
//                             <View key={note.id} style={styles.noteItem}>
//                                 <View style={styles.noteHeader}>
//                                     <View style={styles.noteHeaderLeft}>
//                                         <View style={[
//                                             styles.noteTypeBadge,
//                                             { backgroundColor: getNoteTypeColor(note.type) }
//                                         ]}>
//                                             <Text style={styles.noteTypeText}>
//                                                 {NOTE_TYPES.find(t => t.value === note.type)?.label}
//                                             </Text>
//                                         </View>
//                                         {note.isPrivate && (
//                                             <View style={styles.privateBadge}>
//                                                 <Text style={styles.privateBadgeText}>Private</Text>
//                                             </View>
//                                         )}
//                                     </View>
//                                     <TouchableOpacity
//                                         style={styles.deleteNoteButton}
//                                         onPress={() => deleteNote(note.id)}
//                                     >
//                                         <Text style={styles.deleteNoteButtonText}>×</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                                 <Text style={styles.noteDate}>
//                                     {new Date(note.date).toLocaleDateString()}
//                                 </Text>
//                                 <Text style={styles.noteContent}>{note.content}</Text>
//                             </View>
//                         ))
//                     )}
//                 </View>
//             </ScrollView>

//             {/* Add Note Modal */}
//             <Modal
//                 visible={isAddNoteModalVisible}
//                 animationType="slide"
//                 presentationStyle="pageSheet"
//             >
//                 <SafeAreaView style={styles.modalContainer}>
//                     <View style={styles.modalHeader}>
//                         <TouchableOpacity
//                             onPress={() => setIsAddNoteModalVisible(false)}
//                             style={styles.cancelButton}
//                         >
//                             <Text style={styles.cancelButtonText}>Cancel</Text>
//                         </TouchableOpacity>
//                         <Text style={styles.modalTitle}>Add Note</Text>
//                         <TouchableOpacity
//                             onPress={saveNote}
//                             style={styles.saveButton}
//                         >
//                             <Text style={styles.saveButtonText}>Save</Text>
//                         </TouchableOpacity>
//                     </View>

//                     <ScrollView style={styles.modalContent}>
//                         <View style={styles.inputGroup}>
//                             <Text style={styles.inputLabel}>Note Type</Text>
//                             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                                 <View style={styles.typeContainer}>
//                                     {NOTE_TYPES.map(type => (
//                                         <TouchableOpacity
//                                             key={type.value}
//                                             style={[
//                                                 styles.typeButton,
//                                                 noteForm.type === type.value && styles.typeButtonSelected
//                                             ]}
//                                             onPress={() => setNoteForm(prev => ({ ...prev, type: type.value as PatientNote['type'] }))}
//                                         >
//                                             <Text style={[
//                                                 styles.typeButtonText,
//                                                 noteForm.type === type.value && styles.typeButtonTextSelected
//                                             ]}>
//                                                 {type.label}
//                                             </Text>
//                                         </TouchableOpacity>
//                                     ))}
//                                 </View>
//                             </ScrollView>
//                         </View>

//                         <View style={styles.inputGroup}>
//                             <Text style={styles.inputLabel}>Content *</Text>
//                             <TextInput
//                                 style={[styles.textInput, styles.textArea]}
//                                 value={noteForm.content}
//                                 onChangeText={(text) => setNoteForm(prev => ({ ...prev, content: text }))}
//                                 placeholder="Enter note content..."
//                                 multiline
//                                 numberOfLines={6}
//                                 autoFocus
//                             />
//                         </View>

//                         <TouchableOpacity
//                             style={styles.checkboxContainer}
//                             onPress={() => setNoteForm(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
//                         >
//                             <View style={[
//                                 styles.checkbox,
//                                 noteForm.isPrivate && styles.checkboxChecked
//                             ]}>
//                                 {noteForm.isPrivate && <Text style={styles.checkmark}>✓</Text>}
//                             </View>
//                             <Text style={styles.checkboxLabel}>Make this note private</Text>
//                         </TouchableOpacity>
//                     </ScrollView>
//                 </SafeAreaView>
//             </Modal>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f8f9fa',
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         backgroundColor: '#fff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e9ecef',
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#2d4150',
//         flex: 1,
//         textAlign: 'center',
//     },
//     headerSubtitle: {
//         fontSize: 14,
//         color: '#6c757d',
//         marginTop: 2,
//     },
//     backButton: {
//         paddingVertical: 8,
//         paddingRight: 16,
//     },
//     backButtonText: {
//         color: '#007AFF',
//         fontSize: 16,
//     },
//     chatButton: {
//         backgroundColor: '#007AFF',
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 20,
//     },
//     chatButtonText: {
//         color: '#fff',
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     searchContainer: {
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         // backgroundColor: '#fff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e9ecef',
//     },
//     searchInput: {
//         borderWidth: 1,
//         borderColor: '#dee2e6',
//         borderRadius: 8,
//         padding: 12,
//         fontSize: 16,
//         backgroundColor: '#f8f9fa',
//     },
//     patientsList: {
//         flex: 1,
//         paddingHorizontal: 16,
//         paddingTop: 16,
//     },
//     patientCard: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 16,
//         marginBottom: 12,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     patientHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'flex-start',
//         marginBottom: 12,
//     },
//     patientInfo: {
//         flex: 1,
//     },
//     patientName: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#2d4150',
//         marginBottom: 4,
//     },
//     patientEmail: {
//         fontSize: 14,
//         color: '#6c757d',
//     },
//     statusBadge: {
//         paddingHorizontal: 8,
//         paddingVertical: 4,
//         borderRadius: 12,
//         marginLeft: 12,
//     },
//     statusText: {
//         color: '#fff',
//         fontSize: 12,
//         fontWeight: '600',
//         textTransform: 'uppercase',
//     },
//     patientDetails: {
//         borderTopWidth: 1,
//         borderTopColor: '#e9ecef',
//         paddingTop: 12,
//     },
//     lastSession: {
//         fontSize: 14,
//         color: '#495057',
//         marginBottom: 4,
//     },
//     sessionCount: {
//         fontSize: 12,
//         color: '#6c757d',
//     },
//     patientDetailContainer: {
//         flex: 1,
//         paddingHorizontal: 16,
//         paddingTop: 16,
//     },
//     infoCard: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 16,
//         marginBottom: 16,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     cardTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#2d4150',
//         marginBottom: 16,
//     },
//     infoRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     infoLabel: {
//         fontSize: 14,
//         color: '#6c757d',
//         fontWeight: '500',
//     },
//     infoValue: {
//         fontSize: 14,
//         color: '#2d4150',
//         fontWeight: '500',
//     },
//     notesCard: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 16,
//         marginBottom: 16,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     notesHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 16,
//     },
//     addNoteButton: {
//         backgroundColor: '#007AFF',
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 16,
//     },
//     addNoteButtonText: {
//         color: '#fff',
//         fontSize: 12,
//         fontWeight: '600',
//     },
//     noNotesText: {
//         textAlign: 'center',
//         color: '#6c757d',
//         fontSize: 16,
//         marginTop: 16,
//         fontStyle: 'italic',
//     },
//     noteItem: {
//         backgroundColor: '#f8f9fa',
//         borderRadius: 8,
//         padding: 12,
//         marginBottom: 12,
//     },
//     noteHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'flex-start',
//         marginBottom: 8,
//     },
//     noteHeaderLeft: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         flex: 1,
//     },
//     noteTypeBadge: {
//         paddingHorizontal: 8,
//         paddingVertical: 4,
//         borderRadius: 12,
//         marginRight: 8,
//     },
//     noteTypeText: {
//         color: '#fff',
//         fontSize: 10,
//         fontWeight: '600',
//         textTransform: 'uppercase',
//     },
//     privateBadge: {
//         backgroundColor: '#dc3545',
//         paddingHorizontal: 6,
//         paddingVertical: 2,
//         borderRadius: 8,
//     },
//     privateBadgeText: {
//         color: '#fff',
//         fontSize: 10,
//         fontWeight: '600',
//     },
//     deleteNoteButton: {
//         width: 20,
//         height: 20,
//         borderRadius: 10,
//         backgroundColor: '#dc3545',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     deleteNoteButtonText: {
//         color: '#fff',
//         fontSize: 14,
//         fontWeight: 'bold',
//         lineHeight: 16,
//     },
//     noteDate: {
//         fontSize: 12,
//         color: '#6c757d',
//         marginBottom: 8,
//     },
//     noteContent: {
//         fontSize: 14,
//         color: '#2d4150',
//         lineHeight: 20,
//     },
//     modalContainer: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     modalHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingVertical: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: '#e9ecef',
//     },
//     modalTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#2d4150',
//     },
//     cancelButton: {
//         paddingVertical: 8,
//     },
//     cancelButtonText: {
//         color: '#007AFF',
//         fontSize: 16,
//     },
//     saveButton: {
//         paddingVertical: 8,
//     },
//     saveButtonText: {
//         color: '#007AFF',
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     modalContent: {
//         flex: 1,
//         paddingHorizontal: 16,
//         paddingTop: 16,
//     },
//     inputGroup: {
//         marginBottom: 24,
//     },
//     inputLabel: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#2d4150',
//         marginBottom: 8,
//     },
//     textInput: {
//         borderWidth: 1,
//         borderColor: '#dee2e6',
//         borderRadius: 8,
//         padding: 12,
//         fontSize: 16,
//         backgroundColor: '#f8f9fa',
//     },
//     textArea: {
//         height: 120,
//         textAlignVertical: 'top',
//     },
//     typeContainer: {
//         flexDirection: 'row',
//         paddingVertical: 8,
//     },
//     typeButton: {
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         borderRadius: 16,
//         backgroundColor: '#e9ecef',
//         marginRight: 8,
//     },
//     typeButtonSelected: {
//         backgroundColor: '#007AFF',
//     },
//     typeButtonText: {
//         fontSize: 12,
//         color: '#495057',
//         fontWeight: '500',
//     },
//     typeButtonTextSelected: {
//         color: '#fff',
//     },
//     checkboxContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop: 16,
//     },
//     checkbox: {
//         width: 20,
//         height: 20,
//         borderWidth: 2,
//         borderColor: '#dee2e6',
//         borderRadius: 4,
//         marginRight: 12,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     checkboxChecked: {
//         backgroundColor: '#007AFF',
//         borderColor: '#007AFF',
//     },
//     checkmark: {
//         color: '#fff',
//         fontSize: 12,
//         fontWeight: 'bold',
//     },
//     checkboxLabel: {
//         fontSize: 14,
//         color: '#2d4150',
//     },
// });

// export default TherapistDashboard;

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

// Patient interface - privacy focused
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

// Patient Note interface
interface PatientNote {
    id: string;
    date: string;
    content: string;
    type: 'session' | 'observation' | 'goal' | 'reminder';
    isPrivate: boolean;
}

// Mock patient data - privacy compliant
const MOCK_PATIENTS: Patient[] = [
    {
        id: '1',
        name: 'Sarah J.', // Only first name + last initial
        patientId: 'PT-2024-001',
        lastSession: '2025-08-20',
        status: 'active',
        joinedDate: '2025-06-15',
        hasEmergencyContact: true,
        communicationPreference: 'in-app',
        sessionCount: 12,
        notes: [
            {
                id: '1',
                date: '2025-08-20',
                content: 'Patient showed significant improvement in anxiety management techniques. Discussed coping strategies for work-related stress.',
                type: 'session',
                isPrivate: false,
            },
            {
                id: '2',
                date: '2025-08-15',
                content: 'Goal: Practice mindfulness exercises daily for 10 minutes.',
                type: 'goal',
                isPrivate: false,
            },
        ],
    },
    {
        id: '2',
        name: 'Michael C.',
        patientId: 'PT-2024-002',
        lastSession: '2025-08-18',
        status: 'active',
        joinedDate: '2025-07-01',
        hasEmergencyContact: true,
        communicationPreference: 'scheduled-calls',
        sessionCount: 8,
        notes: [
            {
                id: '3',
                date: '2025-08-18',
                content: 'Discussed career transition concerns. Patient is making good progress with decision-making framework.',
                type: 'session',
                isPrivate: false,
            },
        ],
    },
    {
        id: '3',
        name: 'Emily R.',
        patientId: 'PT-2024-003',
        lastSession: '2025-08-16',
        status: 'pending',
        joinedDate: '2025-08-10',
        hasEmergencyContact: false,
        communicationPreference: 'messages-only',
        sessionCount: 3,
        notes: [],
    },
];

const NOTE_TYPES = [
    { value: 'session', label: 'Session Note' },
    { value: 'observation', label: 'Observation' },
    { value: 'goal', label: 'Goal' },
    { value: 'reminder', label: 'Reminder' },
];

const TherapistDashboard: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isAddNoteModalVisible, setIsAddNoteModalVisible] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Note form state
    const [noteForm, setNoteForm] = useState({
        content: '',
        type: 'session' as PatientNote['type'],
        isPrivate: false,
    });

    // Filter patients based on search query
    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.patientId.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    // Open add note modal
    const openAddNoteModal = () => {
        setNoteForm({
            content: '',
            type: 'session',
            isPrivate: false,
        });
        setIsAddNoteModalVisible(true);
    };

    // Save note
    const saveNote = () => {
        if (!noteForm.content.trim()) {
            Alert.alert('Error', 'Please enter note content');
            return;
        }

        if (!selectedPatient) return;

        const newNote: PatientNote = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            content: noteForm.content.trim(),
            type: noteForm.type,
            isPrivate: noteForm.isPrivate,
        };

        setPatients(prev => prev.map(patient =>
            patient.id === selectedPatient.id
                ? { ...patient, notes: [newNote, ...patient.notes] }
                : patient
        ));

        // Update selected patient
        setSelectedPatient(prev => prev ? {
            ...prev,
            notes: [newNote, ...prev.notes]
        } : null);

        setIsAddNoteModalVisible(false);
    };

    // Delete note
    const deleteNote = (noteId: string) => {
        Alert.alert(
            'Delete Note',
            'Are you sure you want to delete this note?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        if (!selectedPatient) return;

                        setPatients(prev => prev.map(patient =>
                            patient.id === selectedPatient.id
                                ? { ...patient, notes: patient.notes.filter(note => note.id !== noteId) }
                                : patient
                        ));

                        setSelectedPatient(prev => prev ? {
                            ...prev,
                            notes: prev.notes.filter(note => note.id !== noteId)
                        } : null);
                    },
                },
            ]
        );
    };

    // Navigate to secure in-app chat
    const navigateToChat = (patient: Patient) => {
        Alert.alert(
            'Open Secure Chat',
            `Opening secure in-app messaging with ${patient.name}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Open Chat', onPress: () => {
                        // Navigate to secure chat within the app
                        console.log(`Opening secure chat with patient ${patient.patientId}`);
                    }
                }
            ]
        );
    };

    // Schedule session through platform
    const scheduleSession = (patient: Patient) => {
        Alert.alert(
            'Schedule Session',
            `Schedule a session with ${patient.name} through the platform`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Schedule', onPress: () => {
                        console.log(`Scheduling session for patient ${patient.patientId}`);
                    }
                }
            ]
        );
    };

    // Request emergency contact (through platform admin)
    const requestEmergencyAccess = (patient: Patient) => {
        Alert.alert(
            'Emergency Contact Request',
            'This will send a request to platform administrators for emergency contact information. Use only in genuine emergencies.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Request Access',
                    style: 'destructive',
                    onPress: () => {
                        console.log(`Emergency contact request for patient ${patient.patientId}`);
                        Alert.alert('Request Sent', 'Emergency contact request has been sent to administrators.');
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
                    <Text style={styles.headerTitle}>My Patients</Text>
                    <Text style={styles.headerSubtitle}>{patients.length} total patients</Text>
                </View>

                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search patients by name or ID..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <ScrollView style={styles.patientsList}>
                    {filteredPatients.map(patient => (
                        <TouchableOpacity
                            key={patient.id}
                            style={styles.patientCard}
                            onPress={() => setSelectedPatient(patient)}
                        >
                            <View style={styles.patientHeader}>
                                <View style={styles.patientInfo}>
                                    <Text style={styles.patientName}>{patient.name}</Text>
                                    <Text style={styles.patientId}>ID: {patient.patientId}</Text>
                                </View>
                                <View style={[
                                    styles.statusBadge,
                                    { backgroundColor: getStatusColor(patient.status) }
                                ]}>
                                    <Text style={styles.statusText}>{patient.status}</Text>
                                </View>
                            </View>
                            <View style={styles.patientDetails}>
                                <Text style={styles.lastSession}>
                                    Last session: {new Date(patient.lastSession).toLocaleDateString()}
                                </Text>
                                <Text style={styles.sessionCount}>
                                    {patient.sessionCount} sessions • {patient.notes.length} notes
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Patient Detail View
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
                {/* Patient Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>Patient Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Patient ID:</Text>
                        <Text style={styles.infoValue}>{selectedPatient.patientId}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Joined:</Text>
                        <Text style={styles.infoValue}>
                            {new Date(selectedPatient.joinedDate).toLocaleDateString()}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Communication:</Text>
                        <Text style={[styles.infoValue, styles.commPref]}>
                            {selectedPatient.communicationPreference.replace('-', ' ')}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Status:</Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusColor(selectedPatient.status) }
                        ]}>
                            <Text style={styles.statusText}>{selectedPatient.status}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Sessions:</Text>
                        <Text style={styles.infoValue}>{selectedPatient.sessionCount}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Emergency Contact:</Text>
                        <View style={styles.emergencyContactRow}>
                            <Text style={[
                                styles.infoValue,
                                { color: selectedPatient.hasEmergencyContact ? '#28a745' : '#dc3545' }
                            ]}>
                                {selectedPatient.hasEmergencyContact ? 'Available' : 'Not provided'}
                            </Text>
                            {selectedPatient.hasEmergencyContact && (
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
                            onPress={() => scheduleSession(selectedPatient)}
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

                {/* Notes Section */}
                <View style={styles.notesCard}>
                    <View style={styles.notesHeader}>
                        <Text style={styles.cardTitle}>Notes ({selectedPatient.notes.length})</Text>
                        <TouchableOpacity
                            style={styles.addNoteButton}
                            onPress={openAddNoteModal}
                        >
                            <Text style={styles.addNoteButtonText}>+ Add Note</Text>
                        </TouchableOpacity>
                    </View>

                    {selectedPatient.notes.length === 0 ? (
                        <Text style={styles.noNotesText}>No notes yet. Add the first note!</Text>
                    ) : (
                        selectedPatient.notes.map(note => (
                            <View key={note.id} style={styles.noteItem}>
                                <View style={styles.noteHeader}>
                                    <View style={styles.noteHeaderLeft}>
                                        <View style={[
                                            styles.noteTypeBadge,
                                            { backgroundColor: getNoteTypeColor(note.type) }
                                        ]}>
                                            <Text style={styles.noteTypeText}>
                                                {NOTE_TYPES.find(t => t.value === note.type)?.label}
                                            </Text>
                                        </View>
                                        {note.isPrivate && (
                                            <View style={styles.privateBadge}>
                                                <Text style={styles.privateBadgeText}>Private</Text>
                                            </View>
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        style={styles.deleteNoteButton}
                                        onPress={() => deleteNote(note.id)}
                                    >
                                        <Text style={styles.deleteNoteButtonText}>×</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.noteDate}>
                                    {new Date(note.date).toLocaleDateString()}
                                </Text>
                                <Text style={styles.noteContent}>{note.content}</Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Add Note Modal */}
            <Modal
                visible={isAddNoteModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            onPress={() => setIsAddNoteModalVisible(false)}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Add Note</Text>
                        <TouchableOpacity
                            onPress={saveNote}
                            style={styles.saveButton}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Note Type</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.typeContainer}>
                                    {NOTE_TYPES.map(type => (
                                        <TouchableOpacity
                                            key={type.value}
                                            style={[
                                                styles.typeButton,
                                                noteForm.type === type.value && styles.typeButtonSelected
                                            ]}
                                            onPress={() => setNoteForm(prev => ({ ...prev, type: type.value as PatientNote['type'] }))}
                                        >
                                            <Text style={[
                                                styles.typeButtonText,
                                                noteForm.type === type.value && styles.typeButtonTextSelected
                                            ]}>
                                                {type.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Content *</Text>
                            <TextInput
                                style={[styles.textInput, styles.textArea]}
                                value={noteForm.content}
                                onChangeText={(text) => setNoteForm(prev => ({ ...prev, content: text }))}
                                placeholder="Enter note content..."
                                multiline
                                numberOfLines={6}
                                autoFocus
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setNoteForm(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                        >
                            <View style={[
                                styles.checkbox,
                                noteForm.isPrivate && styles.checkboxChecked
                            ]}>
                                {noteForm.isPrivate && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.checkboxLabel}>Make this note private</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
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
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d4150',
        flex: 1,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 2,
    },
    backButton: {
        paddingVertical: 8,
        paddingRight: 16,
    },
    backButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
    chatButton: {
        backgroundColor: '#007AFF',
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
    actionCard: {
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
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        flex: 0.48,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#007AFF',
    },
    notesCard: {
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
    notesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    addNoteButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    addNoteButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    noNotesText: {
        textAlign: 'center',
        color: '#6c757d',
        fontSize: 16,
        marginTop: 16,
        fontStyle: 'italic',
    },
    noteItem: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    noteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    noteHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    noteTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    noteTypeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    privateBadge: {
        backgroundColor: '#dc3545',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    privateBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    deleteNoteButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#dc3545',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteNoteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 16,
    },
    noteDate: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 8,
    },
    noteContent: {
        fontSize: 14,
        color: '#2d4150',
        lineHeight: 20,
    },
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
        color: '#007AFF',
        fontSize: 16,
    },
    saveButton: {
        paddingVertical: 8,
    },
    saveButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    inputGroup: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
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
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    typeContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    typeButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: '#e9ecef',
        marginRight: 8,
    },
    typeButtonSelected: {
        backgroundColor: '#007AFF',
    },
    typeButtonText: {
        fontSize: 12,
        color: '#495057',
        fontWeight: '500',
    },
    typeButtonTextSelected: {
        color: '#fff',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
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
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
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
});

export default TherapistDashboard;