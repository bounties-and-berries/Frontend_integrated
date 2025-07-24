import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Faculty } from '@/types';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Rss, Calendar, User, Heart, MessageCircle, Share, Pin, Plus, X, Camera } from 'lucide-react-native';

// Mock feed data (same as student feeds)
const mockFeeds = [
  {
    id: '1',
    title: 'New Library Hours Announced',
    content: 'Starting next week, the library will be open 24/7 during exam season. Students can access study rooms and resources at any time. Please bring your student ID for entry after 10 PM.',
    author: 'Dr. Sarah Wilson',
    authorRole: 'Admin',
    authorImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    date: '2024-03-01T10:30:00Z',
    likes: 45,
    comments: 12,
    isPinned: true,
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    title: 'Cultural Fest Registration Open',
    content: 'Get ready for the biggest cultural event of the year! Registration is now open for various competitions including dance, music, drama, and art. Prizes worth $5000 to be won!',
    author: 'Prof. Robert Smith',
    authorRole: 'Faculty',
    authorImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    date: '2024-02-28T14:15:00Z',
    likes: 89,
    comments: 23,
    isPinned: false,
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function FacultyFeeds() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const faculty = user as Faculty;
  const [feeds, setFeeds] = useState(mockFeeds);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    isPinned: false,
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLike = (feedId: string) => {
    setLikedPosts(prev => 
      prev.includes(feedId) 
        ? prev.filter(id => id !== feedId)
        : [...prev, feedId]
    );
    
    setFeeds(prev => 
      prev.map(feed => 
        feed.id === feedId 
          ? { 
              ...feed, 
              likes: likedPosts.includes(feedId) 
                ? feed.likes - 1 
                : feed.likes + 1 
            }
          : feed
      )
    );
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    const post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: faculty?.name || 'Faculty',
      authorRole: 'Faculty',
      authorImage: faculty?.profileImage || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isPinned: newPost.isPinned,
    };

    setFeeds(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', isPinned: false });
    setShowCreateModal(false);
    Alert.alert('Success', 'Post created successfully!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return theme.colors.error;
      case 'faculty':
        return theme.colors.secondary;
      default:
        return theme.colors.primary;
    }
  };

  const sortedFeeds = [...feeds].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar 
        title="Feeds"
        subtitle="View and create college announcements"
      />

      {/* Create Post Button */}
      <View style={styles.createButtonContainer}>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.feedsContainer}>
          {sortedFeeds.length === 0 ? (
            <AnimatedCard style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <Rss size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                  No Posts Yet
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                  Create your first post to share with students.
                </Text>
              </View>
            </AnimatedCard>
          ) : (
            sortedFeeds.map((feed) => (
              <AnimatedCard key={feed.id} style={styles.feedCard}>
                <View style={styles.feedContent}>
                  {/* Feed Header */}
                  <View style={styles.feedHeader}>
                    <View style={styles.authorInfo}>
                      <Image
                        source={{ uri: feed.authorImage }}
                        style={styles.authorImage}
                      />
                      <View style={styles.authorDetails}>
                        <View style={styles.authorNameRow}>
                          <Text style={[styles.authorName, { color: theme.colors.text }]}>
                            {feed.author}
                          </Text>
                          {feed.isPinned && (
                            <Pin size={14} color={theme.colors.accent} />
                          )}
                        </View>
                        <View style={styles.authorMeta}>
                          <View style={[
                            styles.roleTag,
                            { backgroundColor: getRoleColor(feed.authorRole) + '20' }
                          ]}>
                            <Text style={[
                              styles.roleText,
                              { color: getRoleColor(feed.authorRole) }
                            ]}>
                              {feed.authorRole}
                            </Text>
                          </View>
                          <Text style={[styles.feedDate, { color: theme.colors.textSecondary }]}>
                            {formatDate(feed.date)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Feed Title */}
                  <Text style={[styles.feedTitle, { color: theme.colors.text }]}>
                    {feed.title}
                  </Text>

                  {/* Feed Content */}
                  <Text style={[styles.feedText, { color: theme.colors.textSecondary }]}>
                    {feed.content}
                  </Text>

                  {/* Feed Image */}
                  {feed.image && (
                    <Image
                      source={{ uri: feed.image }}
                      style={styles.feedImage}
                    />
                  )}

                  {/* Feed Actions */}
                  <View style={styles.feedActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleLike(feed.id)}
                    >
                      <Heart 
                        size={20} 
                        color={likedPosts.includes(feed.id) ? theme.colors.error : theme.colors.textSecondary}
                        fill={likedPosts.includes(feed.id) ? theme.colors.error : 'none'}
                      />
                      <Text style={[
                        styles.actionText,
                        { 
                          color: likedPosts.includes(feed.id) 
                            ? theme.colors.error 
                            : theme.colors.textSecondary 
                        }
                      ]}>
                        {feed.likes}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                      <MessageCircle size={20} color={theme.colors.textSecondary} />
                      <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
                        {feed.comments}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                      <Share size={20} color={theme.colors.textSecondary} />
                      <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
                        Share
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </AnimatedCard>
            ))
          )}
        </View>
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.createModal, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Create New Post
              </Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Post Title *
                </Text>
                <TextInput
                  style={[styles.titleInput, { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }]}
                  placeholder="Enter post title..."
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newPost.title}
                  onChangeText={(text) => setNewPost({...newPost, title: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Content *
                </Text>
                <TextInput
                  style={[styles.contentInput, { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }]}
                  placeholder="What would you like to share with students?"
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  value={newPost.content}
                  onChangeText={(text) => setNewPost({...newPost, content: text})}
                />
              </View>

              <TouchableOpacity
                style={[styles.imageUploadButton, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border 
                }]}
                onPress={() => Alert.alert('Image Upload', 'Image upload functionality will be available soon.')}
              >
                <Camera size={20} color={theme.colors.primary} />
                <Text style={[styles.imageUploadText, { color: theme.colors.primary }]}>
                  Add Image (Optional)
                </Text>
              </TouchableOpacity>

              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.pinOption}
                  onPress={() => setNewPost({...newPost, isPinned: !newPost.isPinned})}
                >
                  <View style={[
                    styles.checkbox,
                    { 
                      backgroundColor: newPost.isPinned ? theme.colors.accent : 'transparent',
                      borderColor: theme.colors.accent 
                    }
                  ]}>
                    {newPost.isPinned && <Pin size={12} color="#FFFFFF" />}
                  </View>
                  <Text style={[styles.pinText, { color: theme.colors.text }]}>
                    Pin this post
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.postButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleCreatePost}
              >
                <Text style={styles.postButtonText}>
                  Create Post
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
  },
  feedsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContent: {
    alignItems: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  feedCard: {
    marginBottom: 0,
  },
  feedContent: {
    gap: 12,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorDetails: {
    flex: 1,
    gap: 2,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  authorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  feedDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  feedTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 24,
  },
  feedText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  feedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  feedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  createModal: {
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  titleInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  contentInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 120,
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: 8,
    marginBottom: 20,
  },
  imageUploadText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  pinOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  postButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});