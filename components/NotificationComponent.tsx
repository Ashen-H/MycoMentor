import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications, Notification } from '../app/NotificationContext';
import { useTheme } from '../app/ThemeContext';

// Define a type for valid Ionicons names
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface NotificationComponentProps {
  isVisible: boolean;
  onClose: () => void;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({ isVisible, onClose }) => {
  const { 
    notifications, 
    markAsRead, 
    deleteNotification, 
    clearAllNotifications, 
    getFormattedTime 
  } = useNotifications();
  const { colors } = useTheme();
  
  if (!isVisible) return null;
  
  // Get icon based on notification type (with proper typing)
  const getNotificationIcon = (notification: Notification): IoniconName => {
    if (notification.icon) {
      // Make sure icon is a valid Ionicon name
      return notification.icon as IoniconName;
    }
    
    switch (notification.type) {
      case 'warning':
        return 'warning-outline';
      case 'success':
        return 'checkmark-circle-outline';
      case 'info':
        return 'information-circle-outline';
      default:
        return 'notifications-outline';
    }
  };
  
  // Get color based on notification type
  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'warning':
        return '#FFA500';
      case 'success':
        return '#4CAF50';
      case 'info':
        return '#2196F3';
      default:
        return colors.text;
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <View style={[styles.notificationPanel, { backgroundColor: colors.cardBackground }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
          <View style={styles.headerActions}>
            {notifications.length > 0 && (
              <TouchableOpacity onPress={clearAllNotifications} style={styles.clearButton}>
                <Text style={[styles.clearText, { color: colors.primary }]}>Clear All</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView style={styles.notificationList}>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <TouchableOpacity 
                key={notification.id}
                style={[
                  styles.notificationItem, 
                  { backgroundColor: notification.read ? colors.cardBackground : 'rgba(0,0,0,0.05)' }
                ]}
                onPress={() => markAsRead(notification.id)}
              >
                <View 
                  style={[
                    styles.iconContainer, 
                    { backgroundColor: `${getNotificationColor(notification.type)}20` }
                  ]}
                >
                  <Ionicons 
                    name={getNotificationIcon(notification)} 
                    size={24} 
                    color={getNotificationColor(notification.type)} 
                  />
                </View>
                <View style={styles.content}>
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    {notification.title}
                  </Text>
                  <Text style={[styles.message, { color: colors.text || '#333' }]}>
                    {notification.message}
                  </Text>
                  <Text style={[styles.timestamp, { color: colors.placeholder || '#777' }]}>
                    {getFormattedTime(notification.timestamp)}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteNotification(notification.id)}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.placeholder || '#777'} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={50} color={colors.placeholder || '#777'} />
              <Text style={[styles.emptyText, { color: colors.text || '#333' }]}>
                No notifications yet
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  notificationPanel: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    marginRight: 16,
  },
  clearText: {
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
  },
  notificationList: {
    maxHeight: '100%',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
  },
});

export default NotificationComponent;