import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { mockNotifications } from '@/data/mockData';
import AnimatedCard from '@/components/AnimatedCard';
import TopMenuBar from '@/components/TopMenuBar';
import { Bell, CircleCheck as CheckCircle, Info, TriangleAlert as AlertTriangle, Circle as XCircle, Clock } from 'lucide-react-native';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return XCircle;
    default:
      return Info;
  }
};

const getNotificationColor = (type: string, theme: any) => {
  switch (type) {
    case 'success':
      return theme.colors.success;
    case 'warning':
      return theme.colors.warning;
    case 'error':
      return theme.colors.error;
    default:
      return theme.colors.primary;
  }
};

export default function FacultyNotifications() {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(
    mockNotifications.filter(n => n.userId === '2')
  );

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, flex: 1 }]}>
      <TopMenuBar 
        title="Notifications"
        subtitle={`${unreadCount} unread notifications`}
        showBackButton={true}
      />

      {/* Mark All Button - moved to content area */}
      {unreadCount > 0 && (
        <View style={styles.markAllContainer}>
          <TouchableOpacity
            style={[styles.markAllButton, { backgroundColor: theme.colors.primary }]}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllButtonText}>Mark All Read</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications List */}
      <ScrollView 
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.notificationsContainer}>
          {notifications.length === 0 ? (
            <AnimatedCard style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <Bell size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyTitle, { color: theme.colors.text, marginTop: 16 }]}>
                  No Notifications
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary, marginTop: 8 }]}>
                  You're all caught up! Check back later for updates.
                </Text>
              </View>
            </AnimatedCard>
          ) : (
            notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              const iconColor = getNotificationColor(notification.type, theme);
              
              const dynamicCardStyle: ViewStyle = {
                backgroundColor: notification.read 
                  ? theme.colors.card 
                  : theme.colors.primary + '05',
                borderColor: notification.read
                  ? theme.colors.border
                  : theme.colors.primary + '20',
                borderWidth: notification.read ? 0 : 1,
              };
              
              return (
                <AnimatedCard 
                  key={notification.id} 
                  style={StyleSheet.flatten([styles.notificationCard, dynamicCardStyle])}
                  onPress={() => markAsRead(notification.id)}
                >
                  <View style={styles.notificationContent}>
                    <View style={[
                      styles.notificationIcon,
                      { backgroundColor: iconColor + '20' }
                    ]}>
                      <IconComponent size={20} color={iconColor} />
                    </View>
                    
                    <View style={styles.notificationInfo}>
                      <View style={styles.notificationHeader}>
                        <Text style={[
                          styles.notificationTitle, 
                          { 
                            color: theme.colors.text,
                            fontFamily: notification.read ? 'Inter-Medium' : 'Inter-SemiBold'
                          }
                        ]}>
                          {notification.title}
                        </Text>
                        {!notification.read && (
                          <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
                        )}
                      </View>
                      
                      <Text style={[
                        styles.notificationMessage, 
                        { color: theme.colors.textSecondary, marginTop: 6, marginBottom: 4 }
                      ]} numberOfLines={3}>
                        {notification.message}
                      </Text>
                      
                      <View style={styles.notificationMeta}>
                        <Clock size={12} color={theme.colors.textSecondary} />
                        <Text style={[styles.notificationDate, { color: theme.colors.textSecondary, marginLeft: 6 }]}>
                          {new Date(notification.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </AnimatedCard>
              );
            })
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
  markAllContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'flex-end',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  markAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  markAllButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  notificationsList: {
    flex: 1,
  },
  notificationsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContent: {
    alignItems: 'center',
    marginVertical: 8,
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
  notificationCard: {
    marginBottom: 12,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 6,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationInfo: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 3,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTitle: {
    fontSize: 16,
    flex: 1,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  notificationDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});