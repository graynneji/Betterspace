import { NOTE_TYPES, PatientNote } from "@/types";
import React, { Dispatch, SetStateAction } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface noteFormProps {
    content: string,
    type: "session" | "observation" | "goal" | "reminder",
    is_private: boolean
    patient_id: string | undefined | number
}
interface AddNotesModalProps {
    setIsAddNoteModalVisible: Dispatch<SetStateAction<boolean>>
    isAddNoteModalVisible: boolean
    noteForm: noteFormProps
    setNoteForm: Dispatch<SetStateAction<noteFormProps>>
    saveNote: () => void
}

const AddNotesModal: React.FC<AddNotesModalProps> = ({
    setIsAddNoteModalVisible,
    isAddNoteModalVisible,
    noteForm,
    setNoteForm,
    saveNote
}) => {
    return (
        <Modal
            visible={isAddNoteModalVisible}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <SafeAreaView style={styles.modalContainer} >
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
                                        activeOpacity={1}
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
                            placeholderTextColor="#9ca3af"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        activeOpacity={1}
                        onPress={() => setNoteForm(prev => ({ ...prev, is_private: !prev.is_private }))}
                    >
                        <View style={[
                            styles.checkbox,
                            noteForm.is_private && styles.checkboxChecked
                        ]}>
                            {noteForm.is_private && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxLabel}>Make this note private</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
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
    saveButton: {
        paddingVertical: 8,
    },
    saveButtonText: {
        color: '#4CAF50',
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
        backgroundColor: '#fff',
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
        backgroundColor: '#4CAF50',
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
})

export default AddNotesModal