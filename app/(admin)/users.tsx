import { Image } from 'expo-image';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { bulkCreateUsers, getAllUsers, deleteUser, buyBerries } from '@/utils/api';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Plus, Search, Users, CreditCard as Edit, Trash2, Upload, Eye } from 'lucide-react-native';
import { useResponsive } from '@/hooks/useResponsive';

const roleFilters = ['All', 'Student', 'Faculty'];

export default function AdminUsers() {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { isMobile } = useResponsive();

  const styles = getStyles(theme, isMobile);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers({
        role: selectedRole !== 'All' ? selectedRole.toLowerCase() : undefined,
        search: searchQuery || undefined
      });
      
      let usersList = [];
      if (Array.isArray(data)) {
        usersList = data;
      } else if (data && Array.isArray(data.results)) {
        usersList = data.results;
      } else if (data && Array.isArray(data.data)) {
        usersList = data.data;
      }
      
      setUsers(usersList);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole, searchQuery]);

  const handleAddUser = () => {
    router.push('/(admin)/add-user' as any);
  };

  const handleUploadExcel = async () => {
    if (Platform.OS !== 'web') {
      Alert.alert('Upload Excel', 'Bulk user upload is currently only available on web browser.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Create a file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.xlsx,.xls,.csv';

      // Handle file selection
      fileInput.onchange = async (event: any) => {
        const file = event.target.files[0];
        if (!file) {
          setLoading(false);
          return;
        }

        try {
          const result = await bulkCreateUsers(file);
          Alert.alert(
            'Success',
            `${result.count || 'Multiple'} users have been successfully imported!`,
            [{ text: 'OK', onPress: fetchUsers }]
          );
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Failed to upload users');
        } finally {
          setLoading(false);
        }
      };

      // Trigger file selection
      fileInput.click();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload users');
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    try {
      // Create CSV content for the template
      if (Platform.OS !== 'web') {
        Alert.alert('Download Template', 'CSV template download is only available on web browser.');
        return;
      }
      const csvContent = `name,email,mobile,role,college_id,department,year\nJohn Doe,john.doe@example.com,1234567890,student,12345,Computer Science,2\nJane Smith,jane.smith@example.com,0987654321,faculty,54321,Mathematics,`;

      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      // Create a temporary link element
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      // Set link attributes for download
      link.setAttribute('href', url);
      link.setAttribute('download', 'user_template.csv');

      // Trigger download
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading template:', error);
      Alert.alert('Error', 'Failed to download template. Please try again.');
    }
  };

  const handleViewUser = (userId: string) => {
    router.push(`/(admin)/user-details?id=${userId}` as any);
  };

  const handleEditUser = (userId: string) => {
    router.push({
      pathname: '/(admin)/edit-user',
      params: { id: userId }
    } as any);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(userId);
              setUsers(prev => prev.filter(user => user.id !== userId));
              Alert.alert('Success', 'User deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user');
            }
          }
        }
      ]
    );
  };

  const handleBuyBerries = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (Platform.OS === 'web') {
      const amount = window.prompt(`Enter berry amount to grant to ${user.name}:`, '10');
      if (amount && !isNaN(parseInt(amount))) {
        try {
          setLoading(true);
          await buyBerries(userId, parseInt(amount));
          Alert.alert('Success', `Successfully granted ${amount} berries to ${user.name}`);
          fetchUsers();
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Failed to grant berries');
        } finally {
          setLoading(false);
        }
      }
      return;
    }

    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Grant Berries',
        `Enter the number of berries to grant to ${user.name}:`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Grant', 
            onPress: async (amount) => {
              if (amount && !isNaN(parseInt(amount))) {
                try {
                  setLoading(true);
                  await buyBerries(userId, parseInt(amount));
                  Alert.alert('Success', `Successfully granted ${amount} berries`);
                  fetchUsers();
                } catch (error: any) {
                  Alert.alert('Error', error.message || 'Failed to grant berries');
                } finally {
                  setLoading(false);
                }
              }
            }
          }
        ],
        'plain-text',
        '10'
      );
    } else {
      // For web or Android (Alert.prompt is iOS only)
      Alert.alert(
        'Grant Berries',
        'Bulk berry granting is coming soon for this platform. Please use individual user edit for now.',
        [{ text: 'OK' }]
      );
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return theme.colors.primary;
      case 'faculty':
        return theme.colors.secondary;
      case 'admin':
        return theme.colors.accent;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopMenuBar
        title="User Management"
        subtitle="Manage students and faculty"
      />

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
          onPress={handleUploadExcel}
          disabled={loading}
        >
          <Upload size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>
            {loading ? 'Uploading...' : 'Upload Excel'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddUser}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Add User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.accent }]}
          onPress={handleDownloadTemplate}
        >
          <Upload size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Download Template</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search users..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterButtons}>
            {roleFilters.map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selectedRole === role
                      ? theme.colors.primary
                      : theme.colors.surface,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => setSelectedRole(role)}
              >
                <Text style={[
                  styles.filterButtonText,
                  {
                    color: selectedRole === role
                      ? '#FFFFFF'
                      : theme.colors.textSecondary
                  }
                ]}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.usersList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.usersContainer}>
          {users.length === 0 ? (
            <AnimatedCard style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <Users size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                  No Users Found
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                  Try adjusting your search or filters.
                </Text>
              </View>
            </AnimatedCard>
          ) : (
            users.map((user) => (
              <AnimatedCard key={user.id} style={styles.userCard}>
                <View style={styles.userContent}>
                  <View style={styles.userLeft}>
                    <Image
                      source={user.profileImage ? { uri: user.profileImage } : require('@/assets/images/default-avatar.png')}
                      style={styles.userImage}
                    />
                    <View style={styles.userInfo}>
                      <Text style={[styles.userName, { color: theme.colors.text }]}>
                        {user.name}
                      </Text>
                      <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
                        {user.email}
                      </Text>
                      <View style={styles.userMeta}>
                        <View style={[
                          styles.roleTag,
                          { backgroundColor: getRoleColor(user.role) + '20' }
                        ]}>
                          <Text style={[
                            styles.roleTagText,
                            { color: getRoleColor(user.role) }
                          ]}>
                            {(user.role || 'user').charAt(0).toUpperCase() + (user.role || 'user').slice(1)}
                          </Text>
                        </View>
                        {user.role === 'student' && (
                          <Text style={[styles.userDepartment, { color: theme.colors.textSecondary }]}>
                            {(user as any).department}
                          </Text>
                        )}
                        {user.role === 'faculty' && (
                          <Text style={[styles.userDepartment, { color: theme.colors.textSecondary }]}>
                            {(user as any).department}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  <View style={styles.userActions}>
                    <TouchableOpacity
                      style={[styles.userActionButton, { backgroundColor: theme.colors.accent + '20' }]}
                      onPress={() => handleBuyBerries(user.id)}
                    >
                      <Plus size={16} color={theme.colors.accent} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.userActionButton, { backgroundColor: theme.colors.primary + '20' }]}
                      onPress={() => handleViewUser(user.id)}
                    >
                      <Eye size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.userActionButton, { backgroundColor: theme.colors.secondary + '20' }]}
                      onPress={() => handleEditUser(user.id)}
                    >
                      <Edit size={16} color={theme.colors.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.userActionButton, { backgroundColor: theme.colors.error + '20' }]}
                      onPress={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 size={16} color={theme.colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </AnimatedCard>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any, isMobile: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: isMobile ? 0 : 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    minHeight: 44,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 44,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  usersList: {
    flex: 1,
  },
  usersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
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
  userCard: {
    marginBottom: 0,
  },
  userContent: {
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'flex-start' : 'center',
    justifyContent: 'space-between',
    gap: isMobile ? 16 : 0,
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  roleTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleTagText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  userDepartment: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: isMobile ? 'flex-end' : 'center',
  },
  userActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44, // Ensure touch target size
    minHeight: 44, // Ensure touch target size
  },
});