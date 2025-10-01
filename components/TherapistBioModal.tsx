import { Ionicons } from '@expo/vector-icons';
import React, { Dispatch, SetStateAction } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface TherapistProps {
    name: string;
    specialization: string;
    license: string
    summary: string
}

interface TherapistBioModalProps {
    showTherapistBio: boolean;
    setShowTherapistBio: Dispatch<SetStateAction<boolean>>
    therapist: TherapistProps
}


const TherapistBioModal: React.FC<TherapistBioModalProps> = ({ showTherapistBio, setShowTherapistBio, therapist }) => {
    const therapistInfo = {
        name: 'Dr. Sarah Johnson',
        specialty: 'Clinical Psychologist',
        experience: '8 years',
        education: 'PhD in Clinical Psychology, Stanford University',
        specializations: ['Anxiety', 'Depression', 'Trauma', 'Relationships'],
        bio: 'Dr. Sarah is a licensed clinical psychologist with extensive experience in cognitive behavioral therapy and mindfulness-based interventions.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        rating: 4.9,
        sessions: 1247,
    };
    return (
        <Modal
            visible={showTherapistBio}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.bioModalOverlay}>
                <View style={styles.bioContainer}>
                    <View style={styles.bioHeader}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowTherapistBio(false)}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bioContent}>
                        <Image
                            source={{ uri: therapistInfo.image }}
                            style={styles.therapistImage}
                        />
                        <Text style={styles.therapistName}>{therapist?.name}</Text>
                        <Text style={styles.therapistSpecialty}>{therapistInfo.specialty}</Text>

                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{therapistInfo.rating}</Text>
                                <Text style={styles.statLabel}>Rating</Text>
                                <Ionicons name="star" size={16} color="#FFD700" />
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{therapistInfo.sessions}</Text>
                                <Text style={styles.statLabel}>Sessions</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{therapistInfo.experience}</Text>
                                <Text style={styles.statLabel}>Experience</Text>
                            </View>
                        </View>

                        <Text style={styles.bioSectionTitle}>License number</Text>
                        <Text style={styles.bioText}>{therapist.license}</Text>

                        <Text style={styles.bioSectionTitle}>Specializations</Text>
                        <View style={styles.specializationsContainer}>
                            {therapistInfo.specializations.map((spec, index) => (
                                <View key={index} style={styles.specializationTag}>
                                    <Text style={styles.specializationText}>{spec}</Text>
                                </View>
                            ))}
                        </View>

                        <Text style={styles.bioSectionTitle}>About</Text>
                        <Text style={styles.bioText}>{therapist.summary}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    // Bio Modal Styles
    bioModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bioContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '85%',
    },
    bioHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bioContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    therapistImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 16,
    },
    therapistName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    therapistSpecialty: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 32,
        paddingVertical: 20,
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    bioSectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 20,
    },
    bioText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    specializationsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    specializationTag: {
        backgroundColor: '#e8f5e8',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    specializationText: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '500',
    },
})

export default TherapistBioModal