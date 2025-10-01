import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { SafeAreaView } from "react-native-safe-area-context";

// Event interface
interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    color: string;
    category: string;
}

// Color palette for events
const EVENT_COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F', // Light Yellow
];

const EVENT_CATEGORIES = [
    'Work',
    'Personal',
    'Health',
    'Social',
    'Education',
    'Travel',
    'Other'
];

const Schedule: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState<string>(today);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);


    // const {data} = useGetById()

    // Form state
    const [eventForm, setEventForm] = useState({
        title: '',
        description: '',
        time: new Date(),
        color: EVENT_COLORS[0],
        category: EVENT_CATEGORIES[0],
    });

    // Get today's date as default

    // Generate marked dates for calendar
    const getMarkedDates = () => {
        const marked: { [key: string]: any } = {};

        events.forEach(event => {
            if (!marked[event.date]) {
                marked[event.date] = { dots: [] };
            }
            marked[event.date].dots.push({ color: event.color });
        });

        // Add selection styling
        if (selectedDate) {
            marked[selectedDate] = {
                ...marked[selectedDate],
                selected: true,
                selectedColor: '#007AFF',
            };
        }

        return marked;
    };

    // Handle date selection
    const onDayPress = (day: DateData) => {
        // setSelectedDate(day.dateString);
        setSelectedDate(day.dateString === selectedDate ? '' : day.dateString);
    };

    // Open modal for new event
    const openAddEventModal = () => {
        setEventForm({
            title: '',
            description: '',
            time: new Date(),
            color: EVENT_COLORS[0],
            category: EVENT_CATEGORIES[0],
        });
        setEditingEvent(null);
        setIsModalVisible(true);
    };

    // Open modal for editing event
    const openEditEventModal = (event: CalendarEvent) => {
        const [hours, minutes] = event.time.split(':');
        const eventTime = new Date();
        eventTime.setHours(parseInt(hours), parseInt(minutes));

        setEventForm({
            title: event.title,
            description: event.description,
            time: eventTime,
            color: event.color,
            category: event.category,
        });
        setEditingEvent(event);
        setIsModalVisible(true);
    };

    // Save event
    const saveEvent = () => {
        if (!eventForm.title.trim()) {
            Alert.alert('Error', 'Please enter an event title');
            return;
        }

        if (!selectedDate) {
            Alert.alert('Error', 'Please select a date first');
            return;
        }

        const timeString = eventForm.time.toTimeString().slice(0, 5);

        if (editingEvent) {
            // Update existing event
            setEvents(prev => prev.map(event =>
                event.id === editingEvent.id
                    ? {
                        ...event,
                        title: eventForm.title,
                        description: eventForm.description,
                        time: timeString,
                        color: eventForm.color,
                        category: eventForm.category,
                    }
                    : event
            ));
        } else {
            // Add new event
            const newEvent: CalendarEvent = {
                id: Date.now().toString(),
                title: eventForm.title,
                description: eventForm.description,
                date: selectedDate,
                time: timeString,
                color: eventForm.color,
                category: eventForm.category,
            };
            setEvents(prev => [...prev, newEvent]);
            console.log("newEvent", newEvent)
        }
        setIsModalVisible(false);
    };
    console.log("event", events)
    // Delete event
    const deleteEvent = (eventId: string) => {
        Alert.alert(
            'Delete Event',
            'Are you sure you want to delete this event?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setEvents(prev => prev.filter(event => event.id !== eventId));
                    },
                },
            ]
        );
    };

    // Get events for selected date
    const getEventsForDate = (date: string) => {
        return events
            .filter(event => event.date === date)
            .sort((a, b) => a.time.localeCompare(b.time));
    };

    // Handle time picker
    const onTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            setEventForm(prev => ({ ...prev, time: selectedTime }));
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Schedule</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={openAddEventModal}
                    disabled={!selectedDate}
                >
                    <Text style={styles.addButtonText}>+ Add Event</Text>
                </TouchableOpacity>
            </View>

            <Calendar
                style={styles.calendar}
                initialDate={today}
                onDayPress={onDayPress}
                markingType="multi-dot"
                markedDates={getMarkedDates()}

                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#007AFF',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#007AFF',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#00adf5',
                    selectedDotColor: '#ffffff',
                    arrowColor: '#007AFF',
                    disabledArrowColor: '#d9e1e8',
                    monthTextColor: '#2d4150',
                    indicatorColor: '#007AFF',
                }}
            />

            {selectedDate && (
                <View style={styles.eventsSection}>
                    <Text style={styles.eventsSectionTitle}>
                        Events for {new Date(selectedDate).toLocaleDateString()}
                    </Text>
                    <ScrollView style={styles.eventsList}>
                        {getEventsForDate(selectedDate).map(event => (
                            <TouchableOpacity
                                key={event.id}
                                style={[styles.eventItem, { borderLeftColor: event.color }]}
                                onPress={() => openEditEventModal(event)}
                            >
                                <View style={styles.eventHeader}>
                                    <Text style={styles.eventTitle}>{event.title}</Text>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => deleteEvent(event.id)}
                                    >
                                        <Text style={styles.deleteButtonText}>×</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.eventTime}>{event.time}</Text>
                                <Text style={styles.eventCategory}>{event.category}</Text>
                                {event.description ? (
                                    <Text style={styles.eventDescription}>{event.description}</Text>
                                ) : null}
                            </TouchableOpacity>
                        ))}
                        {getEventsForDate(selectedDate).length === 0 && (
                            <Text style={styles.noEventsText}>No events for this day</Text>
                        )}
                    </ScrollView>
                </View>
            )}

            {/* Add/Edit Event Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            onPress={() => setIsModalVisible(false)}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>
                            {editingEvent ? 'Edit Event' : 'Add Event'}
                        </Text>
                        <TouchableOpacity
                            onPress={saveEvent}
                            style={styles.saveButton}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Title *</Text>
                            <TextInput
                                style={styles.textInput}
                                value={eventForm.title}
                                onChangeText={(text) => setEventForm(prev => ({ ...prev, title: text }))}
                                placeholder="Enter event title"
                                autoFocus
                                placeholderTextColor="#9ca3af"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.textInput, styles.textArea]}
                                value={eventForm.description}
                                onChangeText={(text) => setEventForm(prev => ({ ...prev, description: text }))}
                                placeholder="Enter event description"
                                multiline
                                numberOfLines={3}
                                placeholderTextColor="#9ca3af"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Time</Text>
                            <TouchableOpacity
                                style={styles.timeButton}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Text style={styles.timeButtonText}>
                                    {eventForm.time.toTimeString().slice(0, 5)}
                                </Text>
                            </TouchableOpacity>

                            {showTimePicker && (
                                <DateTimePicker
                                    value={eventForm.time}
                                    mode="time"
                                    is24Hour={true}
                                    display="default"
                                    onChange={onTimeChange}
                                />
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Category</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.categoryContainer}>
                                    {EVENT_CATEGORIES.map(category => (
                                        <TouchableOpacity
                                            key={category}
                                            style={[
                                                styles.categoryButton,
                                                eventForm.category === category && styles.categoryButtonSelected
                                            ]}
                                            onPress={() => setEventForm(prev => ({ ...prev, category }))}
                                        >
                                            <Text style={[
                                                styles.categoryButtonText,
                                                eventForm.category === category && styles.categoryButtonTextSelected
                                            ]}>
                                                {category}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Color</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.colorContainer}>
                                    {EVENT_COLORS.map(color => (
                                        <TouchableOpacity
                                            key={color}
                                            style={[
                                                styles.colorButton,
                                                { backgroundColor: color },
                                                eventForm.color === color && styles.colorButtonSelected
                                            ]}
                                            onPress={() => setEventForm(prev => ({ ...prev, color }))}
                                        />
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    </ScrollView>

                    {/* {showTimePicker && (
                        <DateTimePicker
                            value={eventForm.time}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={onTimeChange}
                        />
                    )} */}
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
        marginBottom: 10,
        // backgroundColor: '#fff',
        // borderBottomWidth: 1,
        // borderBottomColor: '#e9ecef',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d4150',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    calendar: {
        marginBottom: 8,
    },
    eventsSection: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 8,
        paddingTop: 16,
    },
    eventsSectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d4150',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    eventsList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    eventItem: {
        // backgroundColor: '#fff',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d4150',
        flex: 1,
        marginRight: 12,
    },
    deleteButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#dc3545',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20,
    },
    eventTime: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500',
        marginBottom: 4,
    },
    eventCategory: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '500',
        marginBottom: 8,
    },
    eventDescription: {
        fontSize: 14,
        color: '#495057',
        lineHeight: 20,
    },
    noEventsText: {
        textAlign: 'center',
        color: '#6c757d',
        fontSize: 16,
        marginTop: 32,
        fontStyle: 'italic',
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
        backgroundColor: '#f8f9fa',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    timeButton: {
        borderWidth: 1,
        borderColor: '#dee2e6',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f8f9fa',
    },
    timeButtonText: {
        fontSize: 16,
        color: '#2d4150',
    },
    categoryContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#e9ecef',
        marginRight: 8,
    },
    categoryButtonSelected: {
        backgroundColor: '#4CAF50',
    },
    categoryButtonText: {
        fontSize: 14,
        color: '#495057',
        fontWeight: '500',
    },
    categoryButtonTextSelected: {
        color: '#fff',
    },
    colorContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorButtonSelected: {
        borderColor: '#2d4150',
    },
});

export default Schedule;