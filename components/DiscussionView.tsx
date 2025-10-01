import { useCheckAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Avatar from './Avatar';

interface Author {
    id: string;
    name: string;
    avatar?: string;
}

export interface LikesProps {
    created_at?: string;
    user_id: string;
    discussion_id?: string;
    id: string;
}
export interface Comment {
    id: string;
    content: string;
    author: string;
    created_at: string;
    // likes: number;
    // isLiked: boolean;
    article_likes: LikesProps[];
}

interface Discussion {
    id: string;
    title: string;
    content: string;
    author: string;
    category_id: number;
    created_at: string;
    // likes: number;
    // isLiked: boolean;
    is_annoymous?: boolean
    views: number;
    is_urgent?: boolean;
    article_comments?: Comment[];
    article_likes?: LikesProps[];
}

interface Category {
    id: number;
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

interface DiscussionViewProps {
    discussion: Discussion;
    setShowDiscussionView: (show: boolean) => void;
    categories: Category[];
    getCategoryIcon: (categoryId: number) => keyof typeof Ionicons.glyphMap;
    getCategoryColor: (categoryId: number) => string;
    setCommentCount: (count: number) => void;
    commentCount: number;
    views: number;
    handleLikes: (userId: string, discussionId: string) => Promise<void>;
}

const DiscussionView: React.FC<DiscussionViewProps> = ({
    discussion,
    setShowDiscussionView,
    categories,
    getCategoryIcon,
    getCategoryColor,
    setCommentCount,
    commentCount,
    views,
    handleLikes,
}) => {
    console.log(discussion, "discussion in view")
    const [comments, setComments] = useState<Comment[]>(discussion.article_comments || []);
    const [newComment, setNewComment] = useState<string>('');
    // const [isLiked, setIsLiked] = useState<boolean>(discussion.isLiked || false);
    // const [likes, setLikes] = useState<number>(discussion.likes || 0);
    const { session } = useCheckAuth()
    const userId = session?.user?.id!

    const formatTime = (timestamp: string): string => {
        const now = new Date();
        const postTime = new Date(timestamp);
        const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;

        const diffInWeeks = Math.floor(diffInDays / 7);
        return `${diffInWeeks}w ago`;
    };

    // const handleLikePress = (): void => {
    //     setIsLiked(!isLiked);
    //     setLikes(isLiked ? likes - 1 : likes + 1);
    //     handleLikes(discussion.author.id, discussion.id);
    // };

    // const handleAddComment = (): void => {
    //     Keyboard.dismiss()
    //     if (newComment.trim()) {
    //         const comment: Comment = {
    //             id: Date.now().toString(),
    //             content: newComment,
    //             author: {
    //                 id: 'current-user',
    //                 name: 'Current User', // Replace with actual user
    //                 avatar: 'https://via.placeholder.com/32',
    //             },
    //             timestamp: new Date().toISOString(),
    //             likes: 0,
    //             isLiked: false,
    //         };

    //         setComments([...comments, comment]);
    //         setCommentCount(comments.length + 1);
    //         setNewComment('');
    //     }
    // };

    // const handleCommentLike = (commentId: string): void => {
    //     setComments(comments.map(comment =>
    //         comment.id === commentId
    //             ? {
    //                 ...comment,
    //                 isLiked: !comment.isLiked,
    //                 likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
    //             }
    //             : comment
    //     ));
    // };

    const renderComment = (comment: Comment) => (
        <View key={comment.id} style={styles.commentCard}>
            <View style={styles.commentHeader}>
                {/* <Image
                    source={{ uri: comment.author.avatar }}
                    style={styles.commentAvatar}
                /> */}
                <Avatar annoymous={false} author={comment.author} />
                <View style={styles.commentAuthorInfo}>
                    <Text style={styles.commentAuthorName}>{comment.author}</Text>
                    <Text style={styles.commentTime}>{formatTime(comment.created_at)}</Text>
                </View>

                {/* <TouchableOpacity
                    style={styles.commentLikeBtn}
                // onPress={() => handleCommentLike(comment.id)}
                >
                    <Ionicons
                        name={comment.article_likes.length > 0 ? "heart" : "heart-outline"}
                        size={16}
                        color={comment.article_likes.length > 0 ? "#ef4444" : "#6b7280"}
                    />
                    <Text style={styles.commentLikes}>{comment.article_likes.length}</Text>
                </TouchableOpacity> */}
            </View>

            <Text style={styles.commentContent}>{comment.content}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => setShowDiscussionView(false)}
                >
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Discussion</Text>

                <TouchableOpacity style={styles.moreBtn}>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#6b7280" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Discussion Content */}
                <View style={styles.discussionCard}>
                    {/* Author Info */}
                    <View style={styles.discussionHeader}>
                        <View style={styles.authorInfo}>
                            {/* <Image
                                source={{ uri: discussion.author?.avatar || 'https://via.placeholder.com/40' }}
                                style={styles.authorAvatar}
                            /> */}
                            <Avatar annoymous={discussion?.is_annoymous} author={discussion.author} />
                            {/* <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {!discussion?.is_annoymous ? discussion.author.charAt(0).toUpperCase() : "A"}
                                </Text>
                            </View> */}
                            <View style={styles.authorDetails}>
                                <Text style={styles.authorName}>{discussion.author}</Text>
                                <Text style={styles.postTime}>{formatTime(discussion.created_at)}</Text>
                            </View>
                        </View>

                        <View style={[
                            styles.categoryBadge,
                            { backgroundColor: `${getCategoryColor(discussion.category_id)}20` }
                        ]}>
                            <Ionicons
                                name={getCategoryIcon(discussion.category_id)}
                                size={14}
                                color={getCategoryColor(discussion.category_id)}
                            />
                            <Text style={[
                                styles.categoryText,
                                { color: getCategoryColor(discussion.category_id) }
                            ]}>
                                {discussion.category_id}
                            </Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.discussionTitle}>{discussion.title}</Text>

                    {/* Content */}
                    <Text style={styles.discussionContent}>{discussion.content}</Text>

                    {/* Stats */}
                    <View style={styles.discussionStats}>
                        <TouchableOpacity
                            style={styles.statButton}
                        // onPress={handleLikePress}
                        >
                            <Ionicons
                                name={discussion?.article_likes?.some(like => like.user_id === userId) ? "heart" : "heart-outline"}
                                size={20}
                                color={discussion?.article_likes?.some(like => like.user_id === userId) ? "#ef4444" : "#6b7280"}
                            />
                            <Text style={[
                                styles.statText,
                                false && styles.statTextLiked
                            ]}>
                                {discussion?.article_likes?.length || 0}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.statButton}>
                            <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
                            <Text style={styles.statText}>{comments.length}</Text>
                        </View>

                        <View style={styles.statButton}>
                            <Ionicons name="eye-outline" size={20} color="#6b7280" />
                            <Text style={styles.statText}>{discussion?.views}</Text>
                        </View>
                    </View>
                </View>

                {/* Comments Section */}
                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>
                        Comments ({comments.length})
                    </Text>

                    {comments.length === 0 ? (
                        <View style={styles.noComments}>
                            <Ionicons name="chatbubbles-outline" size={32} color="#d1d5db" />
                            <Text style={styles.noCommentsText}>No comments yet</Text>
                            <Text style={styles.noCommentsSubtext}>Be the first to share your thoughts</Text>
                        </View>
                    ) : (
                        <View style={styles.commentsList}>
                            {discussion.article_comments?.map(renderComment)}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Add a thoughtful comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                    maxLength={500}
                    placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                    style={[
                        styles.sendBtn,
                        !newComment.trim() && styles.sendBtnDisabled
                    ]}
                    // onPress={handleAddComment}
                    disabled={!newComment.trim()}
                >
                    <Ionicons
                        name="send"
                        size={20}
                        color={newComment.trim() ? "#3b82f6" : "#d1d5db"}
                    />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        // backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 5,
        // paddingVertical: 12,
        // borderBottomWidth: 1,
        // borderBottomColor: '#e5e7eb',
        // elevation: 2,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.1,
        // shadowRadius: 3,
        marginBottom: 5,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    moreBtn: {
        padding: 4,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    discussionCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginTop: 16,
        // elevation: 1,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.1,
        // shadowRadius: 3,
        borderColor: "#DEE2E6",
        borderWidth: 1,
    },
    discussionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    authorAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    authorDetails: {
        flex: 1,
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    postTime: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        marginLeft: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 6,
        textTransform: 'capitalize',
    },
    discussionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        lineHeight: 28,
    },
    discussionContent: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
        marginBottom: 20,
    },
    discussionStats: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    statButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    statText: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 6,
        fontWeight: '500',
    },
    statTextLiked: {
        color: '#ef4444',
    },
    commentsSection: {
        // backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        marginBottom: 16,
        // elevation: 1,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.1,
        // shadowRadius: 3,
        // borderColor: "#DEE2E6",
        // borderWidth: 1,
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    noComments: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    noCommentsText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#6b7280',
        marginTop: 12,
    },
    noCommentsSubtext: {
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 4,
    },
    commentsList: {
        gap: 16,
    },
    commentCard: {
        padding: 16,
        backgroundColor: '#f9fafb',
        borderRadius: 12,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    commentAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
    },
    commentAuthorInfo: {
        flex: 1,
    },
    commentAuthorName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    commentTime: {
        fontSize: 12,
        color: '#6b7280',
    },
    commentLikeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentLikes: {
        fontSize: 12,
        color: '#6b7280',
        marginLeft: 4,
    },
    commentContent: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    commentInputContainer: {
        // backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        maxHeight: 100,
        fontSize: 14,
        backgroundColor: '#fff',
        color: '#374151',
    },
    sendBtn: {
        marginLeft: 12,
        padding: 8,
    },
    sendBtnDisabled: {
        opacity: 0.5,
    },
});

export default DiscussionView;