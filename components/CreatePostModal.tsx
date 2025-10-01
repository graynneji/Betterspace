import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Category {
    id: number;
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

interface CreatePostModalProps {
    visible: boolean;
    onClose: () => void;
    categories: Category[];
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ visible, onClose, categories }) => {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<number>();
    const [isUrgent, setIsUrgent] = useState<boolean>(false);
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (): Promise<void> => {
        if (!title.trim() || !content.trim() || !selectedCategory) {
            Alert.alert(
                'Missing Information',
                'Please fill in all required fields and select a category.'
            );
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Here you would typically make an API call to create the post
            console.log('Creating post:', {
                title: title.trim(),
                content: content.trim(),
                category: selectedCategory,
                isUrgent,
                isAnonymous,
                timestamp: new Date().toISOString(),
            });

            // Reset form
            setTitle('');
            setContent('');
            setSelectedCategory(undefined);
            setIsUrgent(false);
            setIsAnonymous(false);

            onClose();

            Alert.alert(
                'Post Created',
                'Your post has been shared with the community.',
                [{ text: 'OK' }]
            );
        } catch (error) {
            Alert.alert(
                'Error',
                'Failed to create post. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = (): void => {
        if (title.trim() || content.trim()) {
            Alert.alert(
                'Discard Post?',
                'You have unsaved changes. Are you sure you want to close?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => {
                            setTitle('');
                            setContent('');
                            setSelectedCategory(undefined);
                            setIsUrgent(false);
                            setIsAnonymous(false);
                            onClose();
                        }
                    }
                ]
            );
        } else {
            onClose();
        }
    };

    const renderCategoryOption = (category: Category) => (
        <TouchableOpacity
            key={category.id}
            style={[
                styles.categoryOption,
                selectedCategory === category.id && styles.categoryOptionSelected
            ]}
            onPress={() => setSelectedCategory(category.id)}
        >
            <View style={[
                styles.categoryIconContainer,
                { backgroundColor: category.color }
            ]}>
                <Ionicons name={category.icon} size={16} color="white" />
            </View>
            <Text style={[
                styles.categoryOptionText,
                selectedCategory === category.id && styles.categoryOptionTextSelected
            ]}>
                {category.name}
            </Text>
            {selectedCategory === category.id && (
                <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
            )}
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={handleClose}
                    >
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>New Post</Text>

                    <TouchableOpacity
                        style={[
                            styles.submitBtn,
                            (!title.trim() || !content.trim() || !selectedCategory || isSubmitting) &&
                            styles.submitBtnDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!title.trim() || !content.trim() || !selectedCategory || isSubmitting}
                    >
                        <Text style={[
                            styles.submitBtnText,
                            (!title.trim() || !content.trim() || !selectedCategory || isSubmitting) &&
                            styles.submitBtnTextDisabled
                        ]}>
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Guidelines Banner */}
                    <View style={styles.guidelinesBanner}>
                        <Ionicons name="information-circle" size={20} color="#3b82f6" />
                        <Text style={styles.guidelinesText}>
                            Please be respectful and supportive. Share your experiences to help others.
                        </Text>
                    </View>

                    {/* Title Input */}
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>
                            Title <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="What would you like to discuss?"
                            value={title}
                            onChangeText={setTitle}
                            maxLength={100}
                            placeholderTextColor="#9ca3af"
                        />
                        <Text style={styles.charCount}>{title.length}/100</Text>
                    </View>

                    {/* Content Input */}
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>
                            Content <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.contentInput}
                            placeholder="Share your thoughts, experiences, or questions..."
                            value={content}
                            onChangeText={setContent}
                            multiline
                            maxLength={1000}
                            textAlignVertical="top"
                            placeholderTextColor="#9ca3af"
                        />
                        <Text style={styles.charCount}>{content.length}/1000</Text>
                    </View>

                    {/* Category Selection */}
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>
                            Category <Text style={styles.required}>*</Text>
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoriesScroll}
                            contentContainerStyle={styles.categoriesContainer}
                        >
                            {categories.filter(cat => cat.id !== 0).map(renderCategoryOption)}
                        </ScrollView>
                    </View>

                    {/* Options */}
                    <View style={styles.optionsSection}>
                        <Text style={styles.sectionTitle}>Options</Text>

                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={() => setIsUrgent(!isUrgent)}
                        >
                            <View style={styles.optionContent}>
                                <View style={styles.optionIcon}>
                                    <Ionicons name="warning" size={20} color="#f59e0b" />
                                </View>
                                <View style={styles.optionText}>
                                    <Text style={styles.optionTitle}>Mark as Urgent</Text>
                                    <Text style={styles.optionDescription}>
                                        For situations requiring immediate support
                                    </Text>
                                </View>
                            </View>
                            <View style={[
                                styles.toggle,
                                isUrgent && styles.toggleActive
                            ]}>
                                {isUrgent && <Ionicons name="checkmark" size={16} color="white" />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={() => setIsAnonymous(!isAnonymous)}
                        >
                            <View style={styles.optionContent}>
                                <View style={styles.optionIcon}>
                                    <Ionicons name="eye-off" size={20} color="#6b7280" />
                                </View>
                                <View style={styles.optionText}>
                                    <Text style={styles.optionTitle}>Post Anonymously</Text>
                                    <Text style={styles.optionDescription}>
                                        Your name will not be visible to others
                                    </Text>
                                </View>
                            </View>
                            <View style={[
                                styles.toggle,
                                isAnonymous && styles.toggleActive
                            ]}>
                                {isAnonymous && <Ionicons name="checkmark" size={16} color="white" />}
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Crisis Resources */}
                    <View style={styles.crisisSection}>
                        <View style={styles.crisisHeader}>
                            <Ionicons name="heart" size={20} color="#ef4444" />
                            <Text style={styles.crisisTitle}>Need immediate help?</Text>
                        </View>
                        <Text style={styles.crisisText}>
                            If you're in crisis, please contact emergency services or a crisis hotline immediately.
                        </Text>
                        <TouchableOpacity style={styles.crisisBtn}>
                            <Text style={styles.crisisBtnText}>View Crisis Resources</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    cancelBtn: {
        padding: 4,
        color: '#4CAF50'
    },
    cancelBtnText: {
        fontSize: 16,
        color: '#6b7280',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    submitBtn: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    submitBtnDisabled: {
        backgroundColor: '#d1d5db',
    },
    submitBtnText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 14,
    },
    submitBtnTextDisabled: {
        color: '#9ca3af',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    guidelinesBanner: {
        backgroundColor: '#eff6ff',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 24,
    },
    guidelinesText: {
        fontSize: 13,
        color: '#1d4ed8',
        marginLeft: 8,
        flex: 1,
        lineHeight: 18,
    },
    inputSection: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    required: {
        color: '#ef4444',
    },
    titleInput: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#374151',
    },
    contentInput: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#374151',
        height: 120,
    },
    charCount: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'right',
        marginTop: 4,
    },
    categoriesScroll: {
        marginTop: 8,
    },
    categoriesContainer: {
        paddingRight: 16,
    },
    categoryOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        minWidth: 120,
    },
    categoryOptionSelected: {
        backgroundColor: '#eff6ff',
        borderColor: '#3b82f6',
    },
    categoryIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    categoryOptionText: {
        fontSize: 14,
        color: '#374151',
        flex: 1,
        fontWeight: '500',
    },
    categoryOptionTextSelected: {
        color: '#1d4ed8',
    },
    optionsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    optionItem: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIcon: {
        marginRight: 12,
    },
    optionText: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
    },
    optionDescription: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
    },
    toggle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleActive: {
        backgroundColor: '#3b82f6',
    },
    crisisSection: {
        backgroundColor: '#fef2f2',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    crisisHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    crisisTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#dc2626',
        marginLeft: 8,
    },
    crisisText: {
        fontSize: 14,
        color: '#7f1d1d',
        lineHeight: 20,
        marginBottom: 12,
    },
    crisisBtn: {
        backgroundColor: '#dc2626',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    crisisBtnText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 14,
    },
});

export default CreatePostModal;