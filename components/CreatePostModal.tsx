// import { Colors } from '@/constants/Colors';
// import { useCheckAuth } from '@/context/AuthContext';
// import { useCrudCreate } from '@/hooks/useCrud';
// import { Ionicons } from '@expo/vector-icons';
// import React, { useState } from 'react';
// import {
//     Alert,
//     KeyboardAvoidingView,
//     Linking,
//     Modal,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     useColorScheme,
//     View,
// } from 'react-native';

// interface newPost {
//     title: string;
//     content: string;
//     category_id: number | undefined;
//     is_urgent: boolean;
//     is_anonymous: boolean
//     author_id: string | number;
//     author: string;
//     tags: string;
// }

// interface Category {
//     id: number;
//     name: string;
//     icon: keyof typeof Ionicons.glyphMap;
//     color: string;
// }

// interface CreatePostModalProps {
//     visible: boolean;
//     onClose: () => void;
//     categories: Category[];
// }

// const CreatePostModal: React.FC<CreatePostModalProps> = ({ visible, onClose, categories }) => {
//     const { session } = useCheckAuth()
//     const initialPost = {
//         title: '',
//         content: '',
//         category_id: undefined,
//         is_urgent: false,
//         is_anonymous: false,
//         author_id: session?.user?.id!,
//         author: session?.user?.user_metadata?.full_name! || "Betterspace User",
//         tags: '',
//         profile_picture: session?.user?.user_metadata?.profile_picture
//     }

//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//     const [newPost, setNewPost] = useState<newPost>(initialPost)
//     const createPostMutation = useCrudCreate<newPost>("article")
//     const colorScheme = useColorScheme();
//     const colors = Colors[colorScheme ?? 'light'];
//     const styles = createStyles(colors);

//     const handleSubmit = async (): Promise<void> => {
//         if (!newPost.content.trim() || !newPost.category_id) {
//             Alert.alert('Missing Information', 'Please fill in all required fields and select a category.');
//             return;
//         }

//         setIsSubmitting(true);

//         try {
//             const result = await createPostMutation.mutateAsync(newPost);  // ✅ this ensures Supabase actually responded
//             if (result.error) {
//                 throw new Error(result.error.message || 'Failed to create post.');
//             }
//             Alert.alert('Post Created', 'Your post has been shared with the community.', [{ text: 'OK' }]);
//             // Toast.show({
//             //     type: "success",
//             //     text1: "Post Created",
//             //     text2: "Your post has been shared with the community.",
//             //     visibilityTime: 2000,
//             //     autoHide: true,
//             //     topOffset: 60,
//             // });

//             setNewPost(initialPost);
//             onClose(); // ✅ now only closes *after* the insert succeeds
//         } catch (error) {
//             Alert.alert('Error', (error as Error).message || 'Failed to create post.');
//             // Toast.show({
//             //     type: "Error",
//             //     // text1: (error as Error).message || 'Failed to create post'
//             //     text2: "Your post has been shared with the community.",
//             // });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleClose = (): void => {
//         if (newPost.title.trim() || newPost.content.trim()) {
//             Alert.alert(
//                 'Discard Post?',
//                 'You have unsaved changes. Are you sure you want to close?',
//                 [
//                     { text: 'Cancel', style: 'cancel' },
//                     {
//                         text: 'Discard',
//                         style: 'destructive',
//                         onPress: () => {
//                             setNewPost(initialPost)

//                             onClose();
//                         }
//                     }
//                 ]
//             );
//         } else {
//             onClose();
//         }
//     };

//     const emergencyResource = () => {
//         Alert.alert(
//             'Crisis Resources',
//             'EMERGENCY SERVICES\n' +
//             '• Nigeria: 112 or 767\n' +
//             '• Police: 911\n' +
//             '• Ambulance: 199\n\n' +

//             'MENTAL HEALTH CRISIS LINES\n' +
//             '• Mental Health Nigeria: 0809 210 6493\n' +
//             '• Mentally Aware Nigeria: 0706 210 6493\n' +
//             '• She Writes Woman: 0812 333 3383\n\n' +

//             'INTERNATIONAL HOTLINES\n' +
//             '• Suicide Prevention (US): 988\n' +
//             '• Samaritans (UK): 116 123\n' +
//             '• Lifeline (AUS): 13 11 14\n\n' +

//             'TEXT SUPPORT\n' +
//             '• Crisis Text Line (US): Text HOME to 741741\n\n' +

//             'ONLINE RESOURCES\n' +
//             '• IASP: findahelpline.com\n' +
//             '• WHO: who.int/mental_health\n\n' +

//             'You are not alone. Help is available 24/7.',
//             [
//                 {
//                     text: 'Call Emergency (112)',
//                     onPress: () => Linking.openURL('tel:112'),
//                     style: 'destructive', // Red color on iOS for urgent action
//                 },
//                 {
//                     text: 'Call Mental Health Line',
//                     onPress: () => Linking.openURL('tel:08092106493'),
//                     style: 'default',
//                 },
//                 {
//                     text: 'Close',
//                     style: 'cancel',
//                 },
//             ],
//             { cancelable: true }
//         );
//     }

//     const renderCategoryOption = (category: Category) => (
//         <TouchableOpacity
//             activeOpacity={1}
//             key={category.id}
//             style={[
//                 styles.categoryOption,
//                 newPost.category_id === category.id && styles.categoryOptionSelected
//             ]}
//             onPress={() => setNewPost({ ...newPost, category_id: category.id, tags: category.name.toLowerCase() })}
//         // onPress={() => setSelectedCategory(category.id)}
//         >
//             <View style={[
//                 styles.categoryIconContainer,
//                 { backgroundColor: category.color }
//             ]}>
//                 <Ionicons name={category.icon} size={16} color="white" />
//             </View>
//             <Text style={[
//                 styles.categoryOptionText,
//                 newPost.category_id === category.id && styles.categoryOptionTextSelected
//             ]}>
//                 {category.name}
//             </Text>
//             {newPost.category_id === category.id && (
//                 <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
//             )}
//         </TouchableOpacity>
//     );

//     return (
//         <Modal
//             visible={visible}
//             animationType="slide"
//             presentationStyle="pageSheet"
//             onRequestClose={handleClose}
//         >
//             <KeyboardAvoidingView
//                 style={styles.container}
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             >
//                 {/* Header */}
//                 <View style={styles.header}>
//                     <TouchableOpacity
//                         activeOpacity={1}
//                         style={styles.cancelBtn}
//                         onPress={handleClose}
//                     >
//                         <Text style={styles.cancelBtnText}>Cancel</Text>
//                     </TouchableOpacity>

//                     <Text style={styles.headerTitle}>New Post</Text>

//                     <TouchableOpacity
//                         activeOpacity={1}
//                         style={[
//                             styles.submitBtn,
//                             (!newPost.content.trim() || !newPost.category_id || isSubmitting) &&
//                             styles.submitBtnDisabled
//                         ]}
//                         onPress={handleSubmit}
//                         disabled={!newPost.content.trim() || !newPost.category_id || isSubmitting}
//                     >
//                         <Text style={[
//                             styles.submitBtnText,
//                             (!newPost.content.trim() || !newPost.category_id || isSubmitting) &&
//                             styles.submitBtnTextDisabled
//                         ]}>
//                             {isSubmitting ? 'Posting...' : 'Post'}
//                         </Text>
//                     </TouchableOpacity>
//                 </View>

//                 <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//                     {/* Guidelines Banner */}
//                     <View style={styles.guidelinesBanner}>
//                         <Ionicons name="information-circle" size={20} color="#3b82f6" />
//                         <Text style={styles.guidelinesText}>
//                             Please be respectful and supportive. Share your experiences to help others.
//                         </Text>
//                     </View>

//                     {/* Title Input */}
//                     <View style={styles.inputSection}>
//                         <Text style={styles.label}>
//                             Title
//                         </Text>
//                         <TextInput
//                             style={styles.titleInput}
//                             placeholder="What would you like to discuss?"
//                             value={newPost.title}
//                             onChangeText={(title) => setNewPost({ ...newPost, title })}
//                             maxLength={100}
//                             placeholderTextColor={colors.placeholder}
//                         />
//                         <Text style={styles.charCount}>{newPost.title.length}/100</Text>
//                     </View>

//                     {/* Content Input */}
//                     <View style={styles.inputSection}>
//                         <Text style={styles.label}>
//                             Content <Text style={styles.required}>*</Text>
//                         </Text>
//                         <TextInput
//                             style={styles.contentInput}
//                             placeholder="Share your thoughts, experiences, or questions..."
//                             value={newPost.content}
//                             onChangeText={(content) => setNewPost({ ...newPost, content })}
//                             multiline
//                             maxLength={280}
//                             textAlignVertical="top"
//                             placeholderTextColor={colors.placeholder}
//                         />
//                         <Text style={styles.charCount}>{newPost.content.length}/280</Text>
//                     </View>

//                     {/* Category Selection */}
//                     <View style={styles.inputSection}>
//                         <Text style={styles.label}>
//                             Category <Text style={styles.required}>*</Text>
//                         </Text>
//                         <ScrollView
//                             horizontal
//                             showsHorizontalScrollIndicator={false}
//                             style={styles.categoriesScroll}
//                             contentContainerStyle={styles.categoriesContainer}
//                         >
//                             {categories.filter(cat => cat.id !== 0).map(renderCategoryOption)}
//                         </ScrollView>
//                     </View>

//                     {/* Options */}
//                     <View style={styles.optionsSection}>
//                         <Text style={styles.sectionTitle}>Options</Text>

//                         <TouchableOpacity
//                             activeOpacity={1}
//                             style={styles.optionItem}
//                             onPress={() => setNewPost({ ...newPost, is_urgent: !newPost.is_urgent })}
//                         // onPress={() => setIsUrgent(!isUrgent)}
//                         >
//                             <View style={styles.optionContent}>
//                                 <View style={styles.optionIcon}>
//                                     <Ionicons name="warning" size={20} color="#f59e0b" />
//                                 </View>
//                                 <View style={styles.optionText}>
//                                     <Text style={styles.optionTitle}>Mark as Urgent</Text>
//                                     <Text style={styles.optionDescription}>
//                                         For situations requiring immediate support
//                                     </Text>
//                                 </View>
//                             </View>
//                             <View style={[
//                                 styles.toggle,
//                                 newPost.is_urgent && styles.toggleActive
//                             ]}>
//                                 {newPost.is_urgent && <Ionicons name="checkmark" size={16} color="white" />}
//                             </View>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             activeOpacity={1}
//                             style={styles.optionItem}
//                             onPress={() => setNewPost({ ...newPost, is_anonymous: !newPost.is_anonymous })}
//                         // onPress={() => setIsAnonymous(!isAnonymous)}
//                         >
//                             <View style={styles.optionContent}>
//                                 <View style={styles.optionIcon}>
//                                     <Ionicons name="eye-off" size={20} color="#6b7280" />
//                                 </View>
//                                 <View style={styles.optionText}>
//                                     <Text style={styles.optionTitle}>Post Anonymously</Text>
//                                     <Text style={styles.optionDescription}>
//                                         Your name will not be visible to others
//                                     </Text>
//                                 </View>
//                             </View>
//                             <View style={[
//                                 styles.toggle,
//                                 newPost.is_anonymous && styles.toggleActive
//                             ]}>
//                                 {newPost.is_anonymous && <Ionicons name="checkmark" size={16} color="white" />}
//                             </View>
//                         </TouchableOpacity>
//                     </View>

//                     {/* Crisis Resources */}
//                     <View style={styles.crisisSection}>
//                         <View style={styles.crisisHeader}>
//                             <Ionicons name="heart" size={20} color="#ef4444" />
//                             <Text style={styles.crisisTitle}>Need immediate help?</Text>
//                         </View>
//                         <Text style={styles.crisisText}>
//                             If you're in crisis, please contact emergency services or a crisis hotline immediately.
//                         </Text>
//                         <TouchableOpacity style={styles.crisisBtn} onPress={emergencyResource}>
//                             <Text style={styles.crisisBtnText}>View Crisis Resources</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </Modal>
//     );
// };

// const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: colors.background,
//     },
//     header: {
//         backgroundColor: colors.background,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//         paddingVertical: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: colors.divider,
//     },
//     cancelBtn: {
//         padding: 4,
//         color: colors.primary
//     },
//     cancelBtnText: {
//         fontSize: 16,
//         color: '#6b7280',
//     },
//     headerTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: colors.text,
//     },
//     submitBtn: {
//         backgroundColor: colors.primary,
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 8,
//     },
//     submitBtnDisabled: {
//         backgroundColor: colors.textTertiary
//         // backgroundColor: '#d1d5db',
//     },
//     submitBtnText: {
//         color: 'white',
//         fontWeight: '500',
//         fontSize: 14,
//     },
//     submitBtnTextDisabled: {
//         color: '#9ca3af',
//     },
//     content: {
//         flex: 1,
//         paddingHorizontal: 16,
//     },
//     guidelinesBanner: {
//         backgroundColor: colors.item,
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 12,
//         borderRadius: 8,
//         marginTop: 16,
//         marginBottom: 24,
//     },
//     guidelinesText: {
//         fontSize: 13,
//         color: '#1d4ed8',
//         marginLeft: 8,
//         flex: 1,
//         lineHeight: 18,
//     },
//     inputSection: {
//         marginBottom: 24,
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: colors.text,
//         marginBottom: 8,
//     },
//     required: {
//         color: '#ef4444',
//     },
//     titleInput: {
//         backgroundColor: colors.inputBackground,
//         borderWidth: 1,
//         borderColor: colors.inputBorder,
//         borderRadius: 8,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         fontSize: 16,
//         color: colors.text,
//     },
//     contentInput: {
//         backgroundColor: colors.inputBackground,
//         borderWidth: 1,
//         borderColor: colors.inputBorder,
//         borderRadius: 8,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         fontSize: 16,
//         color: colors.text,
//         height: 120,
//     },
//     charCount: {
//         fontSize: 12,
//         color: colors.textTertiary,
//         textAlign: 'right',
//         marginTop: 4,
//     },
//     categoriesScroll: {
//         marginTop: 8,
//     },
//     categoriesContainer: {
//         paddingRight: 16,
//     },
//     categoryOption: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: colors.surface,
//         paddingHorizontal: 12,
//         paddingVertical: 10,
//         borderRadius: 20,
//         marginRight: 8,
//         borderWidth: 1,
//         borderColor: colors.border,
//         minWidth: 120,
//     },
//     categoryOptionSelected: {
//         // backgroundColor: colors.item,
//         borderColor: '#3b82f6',
//     },
//     categoryIconContainer: {
//         width: 24,
//         height: 24,
//         borderRadius: 12,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginRight: 8,
//     },
//     categoryOptionText: {
//         fontSize: 14,
//         color: colors.textTertiary,
//         flex: 1,
//         fontWeight: '500',
//     },
//     categoryOptionTextSelected: {
//         color: '#1d4ed8',
//     },
//     optionsSection: {
//         marginBottom: 24,
//     },
//     sectionTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: colors.text,
//         marginBottom: 16,
//     },
//     optionItem: {
//         backgroundColor: colors.surface,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: 16,
//         borderRadius: 12,
//         marginBottom: 12,
//         borderWidth: 1,
//         borderColor: colors.border,
//     },
//     optionContent: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         flex: 1,
//     },
//     optionIcon: {
//         marginRight: 12,
//     },
//     optionText: {
//         flex: 1,
//     },
//     optionTitle: {
//         fontSize: 16,
//         fontWeight: '500',
//         color: colors.text,
//     },
//     optionDescription: {
//         fontSize: 13,
//         color: colors.textSecondary,
//         marginTop: 2,
//     },
//     toggle: {
//         width: 24,
//         height: 24,
//         borderRadius: 12,
//         backgroundColor: colors.inputBackground,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     toggleActive: {
//         backgroundColor: '#3b82f6',
//     },
//     crisisSection: {
//         backgroundColor: '#fef2f2',
//         padding: 16,
//         borderRadius: 12,
//         marginBottom: 24,
//         borderWidth: 1,
//         borderColor: '#fecaca',
//     },
//     crisisHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 8,
//     },
//     crisisTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#dc2626',
//         marginLeft: 8,
//     },
//     crisisText: {
//         fontSize: 14,
//         color: '#7f1d1d',
//         lineHeight: 20,
//         marginBottom: 12,
//     },
//     crisisBtn: {
//         backgroundColor: '#dc2626',
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 8,
//         alignSelf: 'flex-start',
//     },
//     crisisBtnText: {
//         color: 'white',
//         fontWeight: '500',
//         fontSize: 14,
//     },
// });

// export default CreatePostModal;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// import { Colors } from '@/constants/Colors';
// import { useCheckAuth } from '@/context/AuthContext';
// import { useCrudCreate } from '@/hooks/useCrud';
// import { Client } from '@/utils/client';
// import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import React, { useState } from 'react';
// import {
//     Alert,
//     Image,
//     KeyboardAvoidingView,
//     Linking,
//     Modal,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     useColorScheme,
//     View,
// } from 'react-native';

// interface newPost {
//     title: string;
//     content: string;
//     category_id: number | undefined;
//     is_urgent: boolean;
//     is_anonymous: boolean
//     author_id: string | number;
//     author: string;
//     tags: string;
//     images?: string[]; // Array of image URIs
// }

// interface Category {
//     id: number;
//     name: string;
//     icon: keyof typeof Ionicons.glyphMap;
//     color: string;
// }

// interface CreatePostModalProps {
//     visible: boolean;
//     onClose: () => void;
//     categories: Category[];
// }

// const CreatePostModal: React.FC<CreatePostModalProps> = ({ visible, onClose, categories }) => {
//     const { session } = useCheckAuth()
//     const initialPost = {
//         title: '',
//         content: '',
//         category_id: undefined,
//         is_urgent: false,
//         is_anonymous: false,
//         author_id: session?.user?.id!,
//         author: session?.user?.user_metadata?.full_name! || "Betterspace User",
//         tags: '',
//         profile_picture: session?.user?.user_metadata?.profile_picture,
//         images: []
//     }

//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//     const [newPost, setNewPost] = useState<newPost>(initialPost)
//     const createPostMutation = useCrudCreate<newPost>("article")
//     const colorScheme = useColorScheme();
//     const colors = Colors[colorScheme ?? 'light'];
//     const styles = createStyles(colors);

//     const client = new Client();



//     const pickImage = async () => {
//         // Request permission
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//             Alert.alert('Permission Denied', 'We need camera roll permissions to select images.');
//             return;
//         }

//         // Launch image picker
//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsMultipleSelection: true,
//             quality: 0.8,
//             selectionLimit: 4 - (newPost.images?.length || 0), // Max 4 images total
//         });

//         if (!result.canceled && result.assets) {
//             // Validate file sizes
//             const maxSize = 2 * 1024 * 1024; // 2MB in bytes
//             const validImages: string[] = [];
//             const oversizedImages: string[] = [];

//             for (const asset of result.assets) {
//                 // Check if fileSize exists (some platforms may not provide it)
//                 if (asset.fileSize && asset.fileSize > maxSize) {
//                     oversizedImages.push(asset.fileName || 'Unknown');
//                 } else {
//                     validImages.push(asset.uri);
//                 }
//             }

//             // Show error if any images are too large
//             if (oversizedImages.length > 0) {
//                 Alert.alert(
//                     'Image Too Large',
//                     `The following image(s) exceed 2MB and cannot be uploaded:\n${oversizedImages.join(', ')}\n\nPlease select smaller images.`,
//                     [{ text: 'OK' }]
//                 );
//             }

//             // Add only valid images
//             if (validImages.length > 0) {
//                 setNewPost({
//                     ...newPost,
//                     images: [...(newPost.images || []), ...validImages].slice(0, 4)
//                 });
//             }
//         }
//     };



//     const uploadImages = async (imageUris: string[]): Promise<string[]> => {
//         const uploadPromises = imageUris.map(async (uri, index) => {
//             const fileName = `${session?.user?.id}_${Date.now()}_${index}.jpg`;
//             const filePath = `post-images/${fileName}`;

//             // Convert URI to blob/file
//             const response = await fetch(uri);
//             const blob = await response.blob();

//             // Upload to Supabase Storage
//             const { data, error } = await client.supabase.storage
//                 .from('community_images') // your bucket name
//                 .upload(filePath, blob, {
//                     contentType: 'image/jpeg',
//                     upsert: false,
//                 });

//             if (error) throw error;

//             // Get public URL
//             const { data: { publicUrl } } = client.supabase.storage
//                 .from('community_images')
//                 .getPublicUrl(filePath);

//             return publicUrl;
//         });

//         return Promise.all(uploadPromises);
//     };

//     const removeImage = (index: number) => {
//         const updatedImages = newPost.images?.filter((_, i) => i !== index);
//         setNewPost({ ...newPost, images: updatedImages });
//     };

//     const handleSubmit = async (): Promise<void> => {
//         if (!newPost.content.trim() || !newPost.category_id) {
//             Alert.alert('Missing Information', 'Please fill in all required fields and select a category.');
//             return;
//         }

//         setIsSubmitting(true);

//         try {
//             let imageUrls: string[] = [];

//             // Upload images if any exist
//             if (newPost.images && newPost.images.length > 0) {
//                 imageUrls = await uploadImages(newPost.images);
//             }

//             // Create post with image URLs
//             const postData = {
//                 ...newPost,
//                 images: imageUrls, // Now contains public URLs instead of local URIs
//             };
//             const result = await createPostMutation.mutateAsync(postData);
//             if (result.error) {
//                 throw new Error(result.error.message || 'Failed to create post.');
//             }
//             Alert.alert('Post Created', 'Your post has been shared with the community.', [{ text: 'OK' }]);

//             setNewPost(initialPost);
//             onClose();
//         } catch (error) {
//             Alert.alert('Error', (error as Error).message || 'Failed to create post.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleClose = (): void => {
//         if (newPost.title.trim() || newPost.content.trim() || (newPost.images && newPost.images.length > 0)) {
//             Alert.alert(
//                 'Discard Post?',
//                 'You have unsaved changes. Are you sure you want to close?',
//                 [
//                     { text: 'Cancel', style: 'cancel' },
//                     {
//                         text: 'Discard',
//                         style: 'destructive',
//                         onPress: () => {
//                             setNewPost(initialPost)
//                             onClose();
//                         }
//                     }
//                 ]
//             );
//         } else {
//             onClose();
//         }
//     };

//     const emergencyResource = () => {
//         Alert.alert(
//             'Crisis Resources',
//             'EMERGENCY SERVICES\n' +
//             '• Nigeria: 112 or 767\n' +
//             '• Police: 911\n' +
//             '• Ambulance: 199\n\n' +

//             'MENTAL HEALTH CRISIS LINES\n' +
//             '• Mental Health Nigeria: 0809 210 6493\n' +
//             '• Mentally Aware Nigeria: 0706 210 6493\n' +
//             '• She Writes Woman: 0812 333 3383\n\n' +

//             'INTERNATIONAL HOTLINES\n' +
//             '• Suicide Prevention (US): 988\n' +
//             '• Samaritans (UK): 116 123\n' +
//             '• Lifeline (AUS): 13 11 14\n\n' +

//             'TEXT SUPPORT\n' +
//             '• Crisis Text Line (US): Text HOME to 741741\n\n' +

//             'ONLINE RESOURCES\n' +
//             '• IASP: findahelpline.com\n' +
//             '• WHO: who.int/mental_health\n\n' +

//             'You are not alone. Help is available 24/7.',
//             [
//                 {
//                     text: 'Call Emergency (112)',
//                     onPress: () => Linking.openURL('tel:112'),
//                     style: 'destructive',
//                 },
//                 {
//                     text: 'Call Mental Health Line',
//                     onPress: () => Linking.openURL('tel:08092106493'),
//                     style: 'default',
//                 },
//                 {
//                     text: 'Close',
//                     style: 'cancel',
//                 },
//             ],
//             { cancelable: true }
//         );
//     }

//     const renderCategoryOption = (category: Category) => (
//         <TouchableOpacity
//             activeOpacity={1}
//             key={category.id}
//             style={[
//                 styles.categoryOption,
//                 newPost.category_id === category.id && styles.categoryOptionSelected
//             ]}
//             onPress={() => setNewPost({ ...newPost, category_id: category.id, tags: category.name.toLowerCase() })}
//         >
//             <View style={[
//                 styles.categoryIconContainer,
//                 { backgroundColor: category.color }
//             ]}>
//                 <Ionicons name={category.icon} size={16} color="white" />
//             </View>
//             <Text style={[
//                 styles.categoryOptionText,
//                 newPost.category_id === category.id && styles.categoryOptionTextSelected
//             ]}>
//                 {category.name}
//             </Text>
//             {newPost.category_id === category.id && (
//                 <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
//             )}
//         </TouchableOpacity>
//     );

//     return (
//         <Modal
//             visible={visible}
//             animationType="slide"
//             presentationStyle="pageSheet"
//             onRequestClose={handleClose}
//         >
//             <KeyboardAvoidingView
//                 style={styles.container}
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             >
//                 {/* Header */}
//                 <View style={styles.header}>
//                     <TouchableOpacity
//                         activeOpacity={1}
//                         style={styles.cancelBtn}
//                         onPress={handleClose}
//                     >
//                         <Text style={styles.cancelBtnText}>Cancel</Text>
//                     </TouchableOpacity>

//                     <Text style={styles.headerTitle}>New Post</Text>

//                     <TouchableOpacity
//                         activeOpacity={1}
//                         style={[
//                             styles.submitBtn,
//                             (!newPost.content.trim() || !newPost.category_id || isSubmitting) &&
//                             styles.submitBtnDisabled
//                         ]}
//                         onPress={handleSubmit}
//                         disabled={!newPost.content.trim() || !newPost.category_id || isSubmitting}
//                     >
//                         <Text style={[
//                             styles.submitBtnText,
//                             (!newPost.content.trim() || !newPost.category_id || isSubmitting) &&
//                             styles.submitBtnTextDisabled
//                         ]}>
//                             {isSubmitting ? 'Posting...' : 'Post'}
//                         </Text>
//                     </TouchableOpacity>
//                 </View>

//                 <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//                     {/* Guidelines Banner */}
//                     <View style={styles.guidelinesBanner}>
//                         <Ionicons name="information-circle" size={20} color="#3b82f6" />
//                         <Text style={styles.guidelinesText}>
//                             Please be respectful and supportive. Share your experiences to help others.
//                         </Text>
//                     </View>

//                     {/* Title Input */}
//                     <View style={styles.inputSection}>
//                         <Text style={styles.label}>
//                             Title
//                         </Text>
//                         <TextInput
//                             style={styles.titleInput}
//                             placeholder="What would you like to discuss?"
//                             value={newPost.title}
//                             onChangeText={(title) => setNewPost({ ...newPost, title })}
//                             maxLength={100}
//                             placeholderTextColor={colors.placeholder}
//                         />
//                         <Text style={styles.charCount}>{newPost.title.length}/100</Text>
//                     </View>

//                     {/* Content Input */}
//                     <View style={styles.inputSection}>
//                         <Text style={styles.label}>
//                             Content <Text style={styles.required}>*</Text>
//                         </Text>
//                         <TextInput
//                             style={styles.contentInput}
//                             placeholder="Share your thoughts, experiences, or questions..."
//                             value={newPost.content}
//                             onChangeText={(content) => setNewPost({ ...newPost, content })}
//                             multiline
//                             maxLength={280}
//                             textAlignVertical="top"
//                             placeholderTextColor={colors.placeholder}
//                         />
//                         <Text style={styles.charCount}>{newPost.content.length}/280</Text>
//                     </View>

//                     {/* Image Upload Section */}
//                     <View style={styles.inputSection}>
//                         <Text style={styles.label}>Images (Optional)</Text>

//                         {newPost.images && newPost.images.length > 0 && (
//                             <ScrollView
//                                 horizontal
//                                 showsHorizontalScrollIndicator={false}
//                                 style={styles.imagePreviewScroll}
//                             >
//                                 {newPost.images.map((uri, index) => (
//                                     <View key={index} style={styles.imagePreviewContainer}>
//                                         <Image source={{ uri }} style={styles.imagePreview} />
//                                         <TouchableOpacity
//                                             style={styles.removeImageBtn}
//                                             onPress={() => removeImage(index)}
//                                         >
//                                             <Ionicons name="close-circle" size={24} color="#ef4444" />
//                                         </TouchableOpacity>
//                                     </View>
//                                 ))}
//                             </ScrollView>
//                         )}

//                         {(!newPost.images || newPost.images.length < 4) && (
//                             <TouchableOpacity
//                                 style={styles.imagePickerBtn}
//                                 onPress={pickImage}
//                             >
//                                 <Ionicons name="image-outline" size={24} color="#3b82f6" />
//                                 <Text style={styles.imagePickerText}>
//                                     Add Images ({newPost.images?.length || 0}/4)
//                                 </Text>
//                             </TouchableOpacity>
//                         )}
//                     </View>

//                     {/* Category Selection */}
//                     <View style={styles.inputSection}>
//                         <Text style={styles.label}>
//                             Category <Text style={styles.required}>*</Text>
//                         </Text>
//                         <ScrollView
//                             horizontal
//                             showsHorizontalScrollIndicator={false}
//                             style={styles.categoriesScroll}
//                             contentContainerStyle={styles.categoriesContainer}
//                         >
//                             {categories.filter(cat => cat.id !== 0).map(renderCategoryOption)}
//                         </ScrollView>
//                     </View>

//                     {/* Options */}
//                     <View style={styles.optionsSection}>
//                         <Text style={styles.sectionTitle}>Options</Text>

//                         <TouchableOpacity
//                             activeOpacity={1}
//                             style={styles.optionItem}
//                             onPress={() => setNewPost({ ...newPost, is_urgent: !newPost.is_urgent })}
//                         >
//                             <View style={styles.optionContent}>
//                                 <View style={styles.optionIcon}>
//                                     <Ionicons name="warning" size={20} color="#f59e0b" />
//                                 </View>
//                                 <View style={styles.optionText}>
//                                     <Text style={styles.optionTitle}>Mark as Urgent</Text>
//                                     <Text style={styles.optionDescription}>
//                                         For situations requiring immediate support
//                                     </Text>
//                                 </View>
//                             </View>
//                             <View style={[
//                                 styles.toggle,
//                                 newPost.is_urgent && styles.toggleActive
//                             ]}>
//                                 {newPost.is_urgent && <Ionicons name="checkmark" size={16} color="white" />}
//                             </View>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             activeOpacity={1}
//                             style={styles.optionItem}
//                             onPress={() => setNewPost({ ...newPost, is_anonymous: !newPost.is_anonymous })}
//                         >
//                             <View style={styles.optionContent}>
//                                 <View style={styles.optionIcon}>
//                                     <Ionicons name="eye-off" size={20} color="#6b7280" />
//                                 </View>
//                                 <View style={styles.optionText}>
//                                     <Text style={styles.optionTitle}>Post Anonymously</Text>
//                                     <Text style={styles.optionDescription}>
//                                         Your name will not be visible to others
//                                     </Text>
//                                 </View>
//                             </View>
//                             <View style={[
//                                 styles.toggle,
//                                 newPost.is_anonymous && styles.toggleActive
//                             ]}>
//                                 {newPost.is_anonymous && <Ionicons name="checkmark" size={16} color="white" />}
//                             </View>
//                         </TouchableOpacity>
//                     </View>

//                     {/* Crisis Resources */}
//                     <View style={styles.crisisSection}>
//                         <View style={styles.crisisHeader}>
//                             <Ionicons name="heart" size={20} color="#ef4444" />
//                             <Text style={styles.crisisTitle}>Need immediate help?</Text>
//                         </View>
//                         <Text style={styles.crisisText}>
//                             If you're in crisis, please contact emergency services or a crisis hotline immediately.
//                         </Text>
//                         <TouchableOpacity style={styles.crisisBtn} onPress={emergencyResource}>
//                             <Text style={styles.crisisBtnText}>View Crisis Resources</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </Modal>
//     );
// };

// const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: colors.background,
//     },
//     header: {
//         backgroundColor: colors.background,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//         paddingVertical: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: colors.divider,
//     },
//     cancelBtn: {
//         padding: 4,
//         color: colors.primary
//     },
//     cancelBtnText: {
//         fontSize: 16,
//         color: '#6b7280',
//     },
//     headerTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: colors.text,
//     },
//     submitBtn: {
//         backgroundColor: colors.primary,
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 8,
//     },
//     submitBtnDisabled: {
//         backgroundColor: colors.textTertiary
//     },
//     submitBtnText: {
//         color: 'white',
//         fontWeight: '500',
//         fontSize: 14,
//     },
//     submitBtnTextDisabled: {
//         color: '#9ca3af',
//     },
//     content: {
//         flex: 1,
//         paddingHorizontal: 16,
//     },
//     guidelinesBanner: {
//         backgroundColor: colors.item,
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 12,
//         borderRadius: 8,
//         marginTop: 16,
//         marginBottom: 24,
//     },
//     guidelinesText: {
//         fontSize: 13,
//         color: '#1d4ed8',
//         marginLeft: 8,
//         flex: 1,
//         lineHeight: 18,
//     },
//     inputSection: {
//         marginBottom: 24,
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: colors.text,
//         marginBottom: 8,
//     },
//     required: {
//         color: '#ef4444',
//     },
//     titleInput: {
//         backgroundColor: colors.inputBackground,
//         borderWidth: 1,
//         borderColor: colors.inputBorder,
//         borderRadius: 8,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         fontSize: 16,
//         color: colors.text,
//     },
//     contentInput: {
//         backgroundColor: colors.inputBackground,
//         borderWidth: 1,
//         borderColor: colors.inputBorder,
//         borderRadius: 8,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         fontSize: 16,
//         color: colors.text,
//         height: 120,
//     },
//     charCount: {
//         fontSize: 12,
//         color: colors.textTertiary,
//         textAlign: 'right',
//         marginTop: 4,
//     },
//     imagePreviewScroll: {
//         marginBottom: 12,
//     },
//     imagePreviewContainer: {
//         position: 'relative',
//         marginRight: 12,
//     },
//     imagePreview: {
//         width: 100,
//         height: 100,
//         borderRadius: 8,
//         backgroundColor: colors.surface,
//     },
//     removeImageBtn: {
//         position: 'absolute',
//         top: -8,
//         right: -8,
//         backgroundColor: 'white',
//         borderRadius: 12,
//     },
//     imagePickerBtn: {
//         backgroundColor: colors.surface,
//         borderWidth: 2,
//         borderColor: '#3b82f6',
//         borderStyle: 'dashed',
//         borderRadius: 8,
//         padding: 16,
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'row',
//     },
//     imagePickerText: {
//         fontSize: 14,
//         color: '#3b82f6',
//         fontWeight: '500',
//         marginLeft: 8,
//     },
//     categoriesScroll: {
//         marginTop: 8,
//     },
//     categoriesContainer: {
//         paddingRight: 16,
//     },
//     categoryOption: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: colors.surface,
//         paddingHorizontal: 12,
//         paddingVertical: 10,
//         borderRadius: 20,
//         marginRight: 8,
//         borderWidth: 1,
//         borderColor: colors.border,
//         minWidth: 120,
//     },
//     categoryOptionSelected: {
//         borderColor: '#3b82f6',
//     },
//     categoryIconContainer: {
//         width: 24,
//         height: 24,
//         borderRadius: 12,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginRight: 8,
//     },
//     categoryOptionText: {
//         fontSize: 14,
//         color: colors.textTertiary,
//         flex: 1,
//         fontWeight: '500',
//     },
//     categoryOptionTextSelected: {
//         color: '#1d4ed8',
//     },
//     optionsSection: {
//         marginBottom: 24,
//     },
//     sectionTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: colors.text,
//         marginBottom: 16,
//     },
//     optionItem: {
//         backgroundColor: colors.surface,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: 16,
//         borderRadius: 12,
//         marginBottom: 12,
//         borderWidth: 1,
//         borderColor: colors.border,
//     },
//     optionContent: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         flex: 1,
//     },
//     optionIcon: {
//         marginRight: 12,
//     },
//     optionText: {
//         flex: 1,
//     },
//     optionTitle: {
//         fontSize: 16,
//         fontWeight: '500',
//         color: colors.text,
//     },
//     optionDescription: {
//         fontSize: 13,
//         color: colors.textSecondary,
//         marginTop: 2,
//     },
//     toggle: {
//         width: 24,
//         height: 24,
//         borderRadius: 12,
//         backgroundColor: colors.inputBackground,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     toggleActive: {
//         backgroundColor: '#3b82f6',
//     },
//     crisisSection: {
//         backgroundColor: '#fef2f2',
//         padding: 16,
//         borderRadius: 12,
//         marginBottom: 24,
//         borderWidth: 1,
//         borderColor: '#fecaca',
//     },
//     crisisHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 8,
//     },
//     crisisTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#dc2626',
//         marginLeft: 8,
//     },
//     crisisText: {
//         fontSize: 14,
//         color: '#7f1d1d',
//         lineHeight: 20,
//         marginBottom: 12,
//     },
//     crisisBtn: {
//         backgroundColor: '#dc2626',
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 8,
//         alignSelf: 'flex-start',
//     },
//     crisisBtnText: {
//         color: 'white',
//         fontWeight: '500',
//         fontSize: 14,
//     },
// });

// export default CreatePostModal;

import { Colors } from '@/constants/Colors';
import { useCheckAuth } from '@/context/AuthContext';
import { useCrudCreate } from '@/hooks/useCrud';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

interface newPost {
    title: string;
    content: string;
    category_id: number | undefined;
    is_urgent: boolean;
    is_anonymous: boolean
    author_id: string | number;
    author: string;
    tags: string;
    image?: string[]; // Array of image URIs
}

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
    const { session } = useCheckAuth()
    const initialPost = {
        title: '',
        content: '',
        category_id: undefined,
        is_urgent: false,
        is_anonymous: false,
        author_id: session?.user?.id!,
        author: session?.user?.user_metadata?.full_name! || "Betterspace User",
        tags: '',
        profile_picture: session?.user?.user_metadata?.profile_picture,
        image: []
    }

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [newPost, setNewPost] = useState<newPost>(initialPost)
    const createPostMutation = useCrudCreate<newPost>("article")
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const styles = createStyles(colors);

    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera roll permissions to select images.');
            return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
            selectionLimit: 4 - (newPost.image?.length || 0), // Max 4 images total
        });

        if (!result.canceled && result.assets) {
            // Validate file sizes
            const maxSize = 2 * 1024 * 1024; // 2MB in bytes
            const validImages: string[] = [];
            const oversizedImages: string[] = [];

            for (const asset of result.assets) {
                // Check if fileSize exists (some platforms may not provide it)
                if (asset.fileSize && asset.fileSize > maxSize) {
                    oversizedImages.push(asset.fileName || 'Unknown');
                } else {
                    validImages.push(asset.uri);
                }
            }

            // Show error if any images are too large
            if (oversizedImages.length > 0) {
                Alert.alert(
                    'Image Too Large',
                    `The following image(s) exceed 2MB and cannot be uploaded:\n${oversizedImages.join(', ')}\n\nPlease select smaller images.`,
                    [{ text: 'OK' }]
                );
            }

            // Add only valid images
            if (validImages.length > 0) {
                setNewPost({
                    ...newPost,
                    image: [...(newPost.image || []), ...validImages].slice(0, 4)
                });
            }
        }
    };

    const removeImage = (index: number) => {
        const updatedImages = newPost.image?.filter((_, i) => i !== index);
        setNewPost({ ...newPost, image: updatedImages });
    };

    const handleSubmit = async (): Promise<void> => {
        if (!newPost.content.trim() || !newPost.category_id) {
            Alert.alert('Missing Information', 'Please fill in all required fields and select a category.');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await createPostMutation.mutateAsync(newPost);
            if (result.error) {
                throw new Error(result.error.message || 'Failed to create post.');
            }
            Alert.alert('Post Created', 'Your post has been shared with the community.', [{ text: 'OK' }]);

            setNewPost(initialPost);
            onClose();
        } catch (error) {
            Alert.alert('Error', (error as Error).message || 'Failed to create post.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = (): void => {
        if (newPost.title.trim() || newPost.content.trim() || (newPost.image && newPost.image.length > 0)) {
            Alert.alert(
                'Discard Post?',
                'You have unsaved changes. Are you sure you want to close?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => {
                            setNewPost(initialPost)
                            onClose();
                        }
                    }
                ]
            );
        } else {
            onClose();
        }
    };

    const emergencyResource = () => {
        Alert.alert(
            'Crisis Resources',
            'EMERGENCY SERVICES\n' +
            '• Nigeria: 112 or 767\n' +
            '• Police: 911\n' +
            '• Ambulance: 199\n\n' +

            'MENTAL HEALTH CRISIS LINES\n' +
            '• Mental Health Nigeria: 0809 210 6493\n' +
            '• Mentally Aware Nigeria: 0706 210 6493\n' +
            '• She Writes Woman: 0812 333 3383\n\n' +

            'INTERNATIONAL HOTLINES\n' +
            '• Suicide Prevention (US): 988\n' +
            '• Samaritans (UK): 116 123\n' +
            '• Lifeline (AUS): 13 11 14\n\n' +

            'TEXT SUPPORT\n' +
            '• Crisis Text Line (US): Text HOME to 741741\n\n' +

            'ONLINE RESOURCES\n' +
            '• IASP: findahelpline.com\n' +
            '• WHO: who.int/mental_health\n\n' +

            'You are not alone. Help is available 24/7.',
            [
                {
                    text: 'Call Emergency (112)',
                    onPress: () => Linking.openURL('tel:112'),
                    style: 'destructive',
                },
                {
                    text: 'Call Mental Health Line',
                    onPress: () => Linking.openURL('tel:08092106493'),
                    style: 'default',
                },
                {
                    text: 'Close',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    }

    const renderCategoryOption = (category: Category) => (
        <TouchableOpacity
            activeOpacity={1}
            key={category.id}
            style={[
                styles.categoryOption,
                newPost.category_id === category.id && styles.categoryOptionSelected
            ]}
            onPress={() => setNewPost({ ...newPost, category_id: category.id, tags: category.name.toLowerCase() })}
        >
            <View style={[
                styles.categoryIconContainer,
                { backgroundColor: category.color }
            ]}>
                <Ionicons name={category.icon} size={16} color="white" />
            </View>
            <Text style={[
                styles.categoryOptionText,
                newPost.category_id === category.id && styles.categoryOptionTextSelected
            ]}>
                {category.name}
            </Text>
            {newPost.category_id === category.id && (
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
                        activeOpacity={1}
                        style={styles.cancelBtn}
                        onPress={handleClose}
                    >
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>New Post</Text>

                    <TouchableOpacity
                        activeOpacity={1}
                        style={[
                            styles.submitBtn,
                            (!newPost.content.trim() || !newPost.category_id || isSubmitting) &&
                            styles.submitBtnDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!newPost.content.trim() || !newPost.category_id || isSubmitting}
                    >
                        <Text style={[
                            styles.submitBtnText,
                            (!newPost.content.trim() || !newPost.category_id || isSubmitting) &&
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
                            Title
                        </Text>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="What would you like to discuss?"
                            value={newPost.title}
                            onChangeText={(title) => setNewPost({ ...newPost, title })}
                            maxLength={100}
                            placeholderTextColor={colors.placeholder}
                        />
                        <Text style={styles.charCount}>{newPost.title.length}/100</Text>
                    </View>

                    {/* Content Input */}
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>
                            Content <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.contentInput}
                            placeholder="Share your thoughts, experiences, or questions..."
                            value={newPost.content}
                            onChangeText={(content) => setNewPost({ ...newPost, content })}
                            multiline
                            maxLength={280}
                            textAlignVertical="top"
                            placeholderTextColor={colors.placeholder}
                        />
                        <Text style={styles.charCount}>{newPost.content.length}/280</Text>
                    </View>

                    {/* Image Upload Section */}
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Images (Optional)</Text>

                        {newPost.image && newPost.image.length > 0 && (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.imagePreviewScroll}
                            >
                                {newPost.image.map((uri, index) => (
                                    <View key={index} style={styles.imagePreviewContainer}>
                                        <Image source={{ uri }} style={styles.imagePreview} />
                                        <TouchableOpacity
                                            style={styles.removeImageBtn}
                                            onPress={() => removeImage(index)}
                                        >
                                            <Ionicons name="close-circle" size={24} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        )}

                        {(!newPost.image || newPost.image.length < 4) && (
                            <TouchableOpacity
                                style={styles.imagePickerBtn}
                                onPress={pickImage}
                            >
                                <Ionicons name="image-outline" size={24} color="#3b82f6" />
                                <Text style={styles.imagePickerText}>
                                    Add Images ({newPost.image?.length || 0}/4)
                                </Text>
                            </TouchableOpacity>
                        )}
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
                            activeOpacity={1}
                            style={styles.optionItem}
                            onPress={() => setNewPost({ ...newPost, is_urgent: !newPost.is_urgent })}
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
                                newPost.is_urgent && styles.toggleActive
                            ]}>
                                {newPost.is_urgent && <Ionicons name="checkmark" size={16} color="white" />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.optionItem}
                            onPress={() => setNewPost({ ...newPost, is_anonymous: !newPost.is_anonymous })}
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
                                newPost.is_anonymous && styles.toggleActive
                            ]}>
                                {newPost.is_anonymous && <Ionicons name="checkmark" size={16} color="white" />}
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
                        <TouchableOpacity style={styles.crisisBtn} onPress={emergencyResource}>
                            <Text style={styles.crisisBtnText}>View Crisis Resources</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    cancelBtn: {
        padding: 4,
        color: colors.primary
    },
    cancelBtnText: {
        fontSize: 16,
        color: '#6b7280',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    submitBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    submitBtnDisabled: {
        backgroundColor: colors.textTertiary
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
        backgroundColor: colors.item,
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
        color: colors.text,
        marginBottom: 8,
    },
    required: {
        color: '#ef4444',
    },
    titleInput: {
        backgroundColor: colors.inputBackground,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.text,
    },
    contentInput: {
        backgroundColor: colors.inputBackground,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.text,
        height: 120,
    },
    charCount: {
        fontSize: 12,
        color: colors.textTertiary,
        textAlign: 'right',
        marginTop: 4,
    },
    imagePreviewScroll: {
        marginBottom: 12,
    },
    imagePreviewContainer: {
        position: 'relative',
        marginRight: 12,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: colors.surface,
    },
    removeImageBtn: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    imagePickerBtn: {
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: '#3b82f6',
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    imagePickerText: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '500',
        marginLeft: 8,
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
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: colors.border,
        minWidth: 120,
    },
    categoryOptionSelected: {
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
        color: colors.textTertiary,
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
        color: colors.text,
        marginBottom: 16,
    },
    optionItem: {
        backgroundColor: colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
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
        color: colors.text,
    },
    optionDescription: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
    },
    toggle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.inputBackground,
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