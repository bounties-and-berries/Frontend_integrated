import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { mockUsers } from '@/data/mockData';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Plus, Search, Users, CreditCard as Edit, Trash2, Upload, Eye } from 'lucide-react-native';

const roleFilters = ['All', 'Student', 'Faculty'];

export default function AdminUsers() {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [users, setUsers] = useState(mockUsers);
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All' || 
                       user.role.toLowerCase() === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    router.push('/(admin)/add-user' as any);
  };

  const handleUploadExcel = () => {
    Alert.alert(
      'Upload Excel File',
      'Select an Excel file to bulk import users. The file should contain columns: Name, Email, Role, Department, Year (for students), Subject (for faculty).',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Select File', 
          onPress: () => {
            // Simulate file selection and processing
            Alert.alert(
              'Processing...',
              'Excel file is being processed. This may take a few moments.',
              [
                { 
                  text: 'OK', 
                  onPress: () => {
                    setTimeout(() => {
                      Alert.alert('Success', '25 users have been successfully imported from the Excel file!');
                    }, 2000);
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleViewUser = (userId: string) => {
    router.push(`/(admin)/user-details?id=${userId}` as any);
  };

  const handleEditUser = (userId: string) => {
    Alert.alert('Edit User', `Edit user ${userId} - Feature coming soon.`);
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
          onPress: () => {
            setUsers(prev => prev.filter(user => user.id !== userId));
            Alert.alert('Success', 'User deleted successfully!');
          }
        }
      ]
    );
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
      {/* Top Menu Bar */}
      <TopMenuBar 
        title="User Management"
        subtitle="Manage students and faculty"
      />

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
          onPress={handleUploadExcel}
        >
          <Upload size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Upload Excel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddUser}
        >
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Add User</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
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

      {/* Role Filter */}
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

      {/* Users List */}
      <ScrollView 
        style={styles.usersList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.usersContainer}>
          {filteredUsers.length === 0 ? (
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
            filteredUsers.map((user) => (
              <AnimatedCard key={user.id} style={styles.userCard}>
                <View style={styles.userContent}>
                  <View style={styles.userLeft}>
                    <Image
                      source={{ uri: user.profileImage }}
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
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  userActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});