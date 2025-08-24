import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface Patient {
    id: string;
    name: string;
    email: string;
    lastSession: string;
    status: 'active' | 'inactive' | 'new';
    nextAppointment?: string;
    unreadNotes: number;
}

const TherapistDashboard = () => {
    const navigation = useNavigation();
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    // Mock patient data - replace with actual API call
    const [patients, setPatients] = useState<Patient[]>([
        {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            lastSession: '2024-08-22',
            status: 'active',
            nextAppointment: '2024-08-26',
            unreadNotes: 2
        },
        {
            id: '2',
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            lastSession: '2024-08-20',
            status: 'active',
            nextAppointment: '2024-08-27',
            unreadNotes: 0
        },
        {
            id: '3',
            name: 'Emma Williams',
            email: 'emma.w@email.com',
            lastSession: '2024-08-15',
            status: 'inactive',
            unreadNotes: 1
        },
        {
            id: '4',
            name: 'David Rodriguez',
            email: 'david.r@email.com',
            lastSession: 'Never',
            status: 'new',
            unreadNotes: 0
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive' | 'new'>('all');

    useEffect(() => {
        let filtered = patients;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(patient =>
                patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by status
        if (activeFilter !== 'all') {
            filtered = filtered.filter(patient => patient.status === activeFilter);
        }

        setFilteredPatients(filtered);
    }, [searchQuery, activeFilter, patients]);

    const getStatusColor = (status: Patient['status']) => {
        switch (status) {
            case 'active':
                return '#10b981'; // emerald-500
            case 'inactive':
                return '#6b7280'; // gray-500
            case 'new':
                return '#3b82f6'; // blue-500
            default:
                return '#6b7280';
        }
    };

    const getStatusText = (status: Patient['status']) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'inactive':
                return 'Inactive';
            case 'new':
                return 'New Patient';
            default:
                return 'Unknown';
        }
    };

    const renderPatientItem = ({ item }: { item: Patient }) => (
        <TouchableOpacity
            style={styles.patientCard}
            onPress={() => router.push(`/patient-details/${item.id}`)}
        >
            <View style={styles.patientCardHeader}>
                <View style={styles.patientInfo}>
                    <View style={styles.patientNameContainer}>
                        <Text style={styles.patientName}>{item.name}</Text>
                        {item.unreadNotes > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadBadgeText}>{item.unreadNotes}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.patientEmail}>{item.email}</Text>
                </View>
                <View style={styles.patientActions}>
                    <TouchableOpacity
                        style={styles.chatButton}
                        onPress={() => router.push(`/chat/${item.id}`)}
                    >
                        <Ionicons name="chatbubble-outline" size={18} color="#047857" />
                    </TouchableOpacity>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </View>
            </View>

            <View style={styles.patientCardBody}>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {getStatusText(item.status)}
                    </Text>
                </View>

                <View style={styles.sessionInfo}>
                    <Text style={styles.sessionLabel}>Last Session:</Text>
                    <Text style={styles.sessionDate}>{item.lastSession}</Text>
                </View>

                {item.nextAppointment && (
                    <View style={styles.sessionInfo}>
                        <Text style={styles.sessionLabel}>Next:</Text>
                        <Text style={styles.sessionDate}>{item.nextAppointment}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderFilterButton = (filter: typeof activeFilter, label: string) => (
        <TouchableOpacity
            style={[
                styles.filterButton,
                activeFilter === filter ? styles.filterButtonActive : styles.filterButtonInactive
            ]}
            onPress={() => setActiveFilter(filter)}
        >
            <Text style={[
                styles.filterButtonText,
                activeFilter === filter ? styles.filterButtonTextActive : styles.filterButtonTextInactive
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>My Patients</Text>
                        <Text style={styles.subtitle}>
                            Manage your patient sessions and notes
                        </Text>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <View style={styles.inputWrapper}>
                            <Ionicons
                                name="search-outline"
                                size={20}
                                color="#9ca3af"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Search patients..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholderTextColor="#9ca3af"
                            />
                        </View>
                    </View>

                    {/* Filter Buttons */}
                    <View style={styles.filterContainer}>
                        {renderFilterButton('all', 'All')}
                        {renderFilterButton('active', 'Active')}
                        {renderFilterButton('new', 'New')}
                        {renderFilterButton('inactive', 'Inactive')}
                    </View>

                    {/* Patient List */}
                    <View style={styles.patientsContainer}>
                        <FlatList
                            data={filteredPatients}
                            renderItem={renderPatientItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            ListEmptyComponent={() => (
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="people-outline" size={48} color="#9ca3af" />
                                    <Text style={styles.emptyTitle}>No patients found</Text>
                                    <Text style={styles.emptySubtitle}>
                                        {searchQuery ? 'Try adjusting your search' : 'Your patient list is empty'}
                                    </Text>
                                </View>
                            )}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 24,
    },
    scrollContent: {
        paddingVertical: 32,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        color: '#4b5563',
        fontSize: 16,
        textAlign: 'center',
    },
    searchContainer: {
        marginBottom: 24,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        backgroundColor: '#ffffff',
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
        color: '#111827',
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 8,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 2,
    },
    filterButtonActive: {
        backgroundColor: '#047857',
        borderColor: '#047857',
    },
    filterButtonInactive: {
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    filterButtonTextActive: {
        color: '#ffffff',
    },
    filterButtonTextInactive: {
        color: '#6b7280',
    },
    patientsContainer: {
        flex: 1,
    },
    patientCard: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    patientCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    patientInfo: {
        flex: 1,
    },
    patientNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    patientName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginRight: 8,
    },
    unreadBadge: {
        backgroundColor: '#dc2626',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
    },
    unreadBadgeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    patientEmail: {
        color: '#6b7280',
        fontSize: 14,
    },
    patientActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    chatButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f0fdf4',
    },
    patientCardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
    },
    sessionInfo: {
        alignItems: 'flex-end',
    },
    sessionLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 2,
    },
    sessionDate: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
});

export default TherapistDashboard;