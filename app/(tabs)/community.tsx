import Avatar from '@/components/Avatar';
import CategoryList from '@/components/CategoryList';
import CreatePostModal from '@/components/CreatePostModal';
import DiscussionView, { Comment, LikesProps } from '@/components/DiscussionView';
import ErrorMessage from '@/components/ErrorMessage';
import { useGetAll } from '@/hooks/useCrud';
import { formatThreadTime } from '@/utils';
import { initialDiscussions as rawInitialDiscussions } from '@/utils/communityUtilis';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import {
    FlatList,

    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

interface Author {
    id: string;
    name: string;
    avatar?: string;
}

// interface Comment {
//     id: string;
//     content: string;
//     author: Author;
//     timestamp: string;
//     likes: number;
//     isLiked: boolean;
// }

interface Discussion {
    id: string;
    title: string;
    content: string;
    author: string;
    category_id: number;
    created_at: string;
    // likes: number;
    // isLiked: boolean;
    views: number;
    is_urgent?: boolean;
    is_annoymous?: boolean;
    article_comments?: Comment[];
    article_likes?: LikesProps[];
}

interface Category {
    id: number;
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

interface CommunityProps {
    initialDiscussions: Discussion[];
    count: number;
}

const sanitizeDiscussions = (discussions: any[]): Discussion[] => {
    return discussions.map(discussion => ({
        ...discussion,
        author: {
            ...discussion.author,
            id: discussion.author.id ?? "",
        },
        comments: discussion.comments
            ? discussion.comments.map((comment: any) => ({
                ...comment,
                author: {
                    ...comment.author,
                    id: comment.author.id ?? "",
                },
            }))
            : [],
    }));
};

const initialDiscussions: Discussion[] = sanitizeDiscussions(rawInitialDiscussions);

const Community: React.FC<CommunityProps> = () => {
    let count = initialDiscussions.length;
    const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
    const [activeCategory, setActiveCategory] = useState<number>(0);
    const [commentCount, setCommentCount] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [discussion, setDiscussion] = useState<Discussion>({} as Discussion);
    const [showDiscussionView, setShowDiscussionView] = useState<boolean>(false);
    const [views, setViews] = useState<number>(0);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [showGuidelines, setShowGuidelines] = useState<boolean>(false);
    const flatListRef = useRef<FlatList>(null);

    const categories: Category[] = [
        { id: 0, name: "All Topics", icon: "people-outline", color: "#3b82f6" },
        { id: 1, name: "Anxiety", icon: "heart-outline", color: "#8b5cf6" },
        { id: 2, name: "Depression", icon: "chatbubble-outline", color: "#6366f1" },
        { id: 3, name: "Relationships", icon: "heart", color: "#ec4899" },
        { id: 4, name: "Career & Work", icon: "briefcase-outline", color: "#10b981" },
        { id: 5, name: "Family", icon: "home-outline", color: "#f97316" },
        { id: 6, name: "Self-Care", icon: "star-outline", color: "#eab308" },
        { id: 7, name: "Personal Growth", icon: "trending-up-outline", color: "#14b8a6" },
    ];

    const { data, isLoading, error, refetch } = useGetAll('article', { orderBy: 'created_at', ascending: false }, "*, article_comments!article_id(*), article_likes!discussion_id(*)");

    // if (error) {
    //     refetch();
    // }


    // Filter discussions based on category and search term
    // const filteredDiscussions = useMemo(() => {
    //     // return initialDiscussions.filter(discussion => {
    //     return data?.result.filter(discussion => {
    //         const matchesCategory = activeCategory === 0 || discussion.category === activeCategory;
    //         const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
    //         return matchesCategory && matchesSearch;
    //     });
    // }, [activeCategory, searchTerm]);
    const filteredDiscussions = useMemo(() => {
        if (!data?.result) return [];
        return data.result.filter(discussion => {
            const matchesCategory = activeCategory === 0 || discussion.category_id === activeCategory;
            const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [data?.result, activeCategory, searchTerm]);


    const getCategoryIcon = (categoryId: number): keyof typeof Ionicons.glyphMap => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.icon : "chatbubble-outline";
    };

    const getCategoryColor = (categoryId: number): string => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.color : "#6b7280";
    };

    const handleLikes = async (userId: string, discussionId: string): Promise<void> => {
        console.log('Like pressed', userId, discussionId);
    };

    const handleDiscussionPress = (selectedDiscussion: Discussion) => {
        setDiscussion(selectedDiscussion);
        setShowDiscussionView(true);
        setViews(prev => prev + 1);
        // setCommentCount(selectedDiscussion.comments?.length || 0);
    };

    // Render individual discussion item
    const renderDiscussionItem = ({ item }: { item: Discussion }) => (
        <TouchableOpacity
            style={styles.discussionCard}
            onPress={() => handleDiscussionPress(item)}
        >
            <View style={styles.discussionHeader}>
                <View style={styles.authorInfo}>
                    <Avatar annoymous={item?.is_annoymous} author={item.author} />
                    {/* <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {!item?.is_annoymous ? item.author.charAt(0).toUpperCase() : "A"}
                        </Text>
                    </View> */}
                    <View>
                        <Text style={styles.authorName}>{!item?.is_annoymous ? item.author : "Annoymous"}</Text>
                        <Text style={styles.timestamp}>{formatThreadTime(item.created_at)}</Text>
                    </View>
                </View>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category_id) }]}>
                    <Ionicons
                        name={getCategoryIcon(item.category_id)}
                        size={12}
                        color="white"
                    />
                </View>
            </View>

            <Text style={styles.discussionTitle}>{item.title}</Text>
            <Text style={styles.discussionContent} numberOfLines={2}>
                {item.content}
            </Text>

            <View style={styles.discussionFooter}>
                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <Ionicons name="heart-outline" size={16} color="#6b7280" />
                        <Text style={styles.statText}>{item.article_likes?.length || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
                        <Text style={styles.statText}>{item.article_comments?.length || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="eye-outline" size={16} color="#6b7280" />
                        <Text style={styles.statText}>{item.views}</Text>
                    </View>
                </View>
                {item.is_urgent && (
                    <View style={styles.urgentBadge}>
                        <Text style={styles.urgentText}>Urgent</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    // Header component for FlatList
    const ListHeaderComponent = () => (
        <>
            {/* Categories - Show/Hide based on filter button */}
            {showCategories && (
                <CategoryList
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    setShowCategories={setShowCategories}
                />
            )}

            {/* Search Bar */}
            {/* <View style={styles.searchCard}>
                <View style={styles.searchWrapper}>
                    <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search discussions..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        placeholderTextColor="#9ca3af"
                    />
                </View>
            </View> */}

            {/* Quick Stats */}
            <View style={styles.quickStats}>
                <Text style={styles.discussionCount}>
                    {(filteredDiscussions?.length ?? 0)} {(filteredDiscussions?.length === 1 ? 'thread' : 'threads')}
                </Text>
                <TouchableOpacity
                    style={styles.statsToggle}
                    onPress={() => setShowGuidelines(!showGuidelines)}
                >
                    <Text style={styles.statsToggleText}>
                        {showGuidelines ? 'Hide Info' : 'Community Info'}
                    </Text>
                    <Ionicons
                        name={showGuidelines ? "chevron-up" : "chevron-down"}
                        size={16}
                        color="#6b7280"
                    />
                </TouchableOpacity>
            </View>

            {/* Collapsible Guidelines and Stats */}
            {showGuidelines && (
                <>
                    {/* Featured Section */}
                    <View style={styles.featuredSection}>
                        <Text style={styles.featuredTitle}>Welcome to our support community</Text>
                        <Text style={styles.featuredText}>
                            Connect with others, share experiences, and find support on your mental health journey.
                        </Text>
                        <TouchableOpacity style={styles.guidelinesBtn}>
                            <Text style={styles.guidelinesBtnText}>Community Guidelines</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Community Stats */}
                    {/* <CommunityStats count={count} /> */}
                    {error && <ErrorMessage errorMessage={error.message ?? String(error)} fn={refetch} />
                    }
                    {
                        isLoading && <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
                    }
                </>
            )}
        </>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            {!showDiscussionView && <View style={styles.header}>
                <Text style={styles.title}>Community</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.filterBtn}
                        onPress={() => setShowCategories(!showCategories)}
                    >
                        <Ionicons name="funnel-outline" size={24} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.createPostBtn}
                        onPress={() => setIsCreatePostOpen(true)}
                    >
                        <Text style={styles.createPostBtnText}>Post</Text>
                    </TouchableOpacity>
                </View>
            </View>}
            {/* Main Content - Discussion List or Single Discussion View */}
            {showDiscussionView ? (
                <DiscussionView
                    discussion={discussion}
                    setShowDiscussionView={setShowDiscussionView}
                    categories={categories}
                    getCategoryIcon={getCategoryIcon}
                    getCategoryColor={getCategoryColor}
                    setCommentCount={setCommentCount}
                    commentCount={commentCount}
                    views={views}
                    handleLikes={handleLikes}
                />
            ) : (
                <FlatList
                    ref={flatListRef}
                    style={styles.content}
                    data={filteredDiscussions}
                    renderItem={renderDiscussionItem}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={ListHeaderComponent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContainer}
                    initialNumToRender={10}
                    maxToRenderPerBatch={5}
                    windowSize={10}
                />
            )}

            {/* Create Post Modal */}
            <CreatePostModal
                visible={isCreatePostOpen}
                onClose={() => setIsCreatePostOpen(false)}
                categories={categories}
            />
        </SafeAreaView>
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
        paddingVertical: 12,
        // borderBottomWidth: 1,
        // borderBottomColor: '#e5e7eb',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2d3748',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    createPostBtn: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    createPostBtnText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 14,
    },
    filterBtn: {
        padding: 8,
    },
    content: {
        flex: 1,
    },
    flatListContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    searchCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginVertical: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    searchWrapper: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
    searchInput: {
        flex: 1,
        paddingLeft: 44,
        paddingRight: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        fontSize: 14,
        color: '#374151',
    },
    quickStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
        marginBottom: 12,
    },
    discussionCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    statsToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 8,
    },
    statsToggleText: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    featuredSection: {
        backgroundColor: '#3b82f6',
        borderRadius: 12,
        padding: 24,
        marginBottom: 16,
    },
    featuredTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
        marginBottom: 8,
    },
    featuredText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    guidelinesBtn: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    guidelinesBtnText: {
        color: '#3b82f6',
        fontWeight: '500',
        fontSize: 14,
    },
    discussionCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
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
        marginBottom: 12,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    authorName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    timestamp: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    discussionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 8,
        lineHeight: 22,
    },
    discussionContent: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
        marginBottom: 12,
    },
    discussionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stats: {
        flexDirection: 'row',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    urgentBadge: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    urgentText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default Community;