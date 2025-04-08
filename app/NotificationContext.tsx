import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

// Define a type for valid Ionicons names
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// Define notification types
export interface Notification {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon?: IoniconName; // Updated to be a valid Ionicon name
}

// Define notification input type (for adding notifications)
export type NotificationInput = Omit<Notification, 'id' | 'timestamp' | 'read'>;

// Define environmental data interface
interface EnvData {
  temperature?: string;
  humidity?: string;
  intensity?: string;
  pH?: string;
  loading?: boolean;
  error?: string | null;
}

// Define context interface
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: NotificationInput) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getFormattedTime: (timestamp: string) => string;
  getUnreadCount: () => number;
  checkEnvironmentalConditions: (envData: EnvData) => void;
}

// Create the context with a default value
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider props interface
interface NotificationProviderProps {
  children: ReactNode;
}

// Custom hook to use the notification context
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Load notifications from storage when app starts
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const storedNotifications = await SecureStore.getItemAsync('notifications');
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };
    
    loadNotifications();
  }, []);
  
  // Save notifications to storage whenever they change
  useEffect(() => {
    const saveNotifications = async () => {
      try {
        await SecureStore.setItemAsync('notifications', JSON.stringify(notifications));
      } catch (error) {
        console.error('Error saving notifications:', error);
      }
    };
    
    saveNotifications();
  }, [notifications]);
  
  // Add a new notification
  const addNotification = (notification: NotificationInput): string => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    return newNotification.id;
  };
  
  // Mark a notification as read
  const markAsRead = (id: string): void => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = (): void => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
  };
  
  // Delete a notification
  const deleteNotification = (id: string): void => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notif => notif.id !== id)
    );
  };
  
  // Clear all notifications
  const clearAllNotifications = (): void => {
    setNotifications([]);
  };
  
  // Get formatted time (e.g., "2h ago", "1d ago")
  const getFormattedTime = (timestamp: string): string => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return notifTime.toLocaleDateString();
  };
  
  // Get unread count
  const getUnreadCount = (): number => {
    return notifications.filter(notif => !notif.read).length;
  };
  
  // Environment monitoring notifications
  const checkEnvironmentalConditions = (envData: EnvData): void => {
    // Temperature check (assuming optimal range is 18-24°C for mushrooms)
    if (envData.temperature && Number(envData.temperature) > 27) {
      addNotification({
        type: 'warning',
        title: 'High Temperature Alert',
        message: `Current temperature is ${envData.temperature}°C, which is above optimal range.`,
        icon: 'thermometer-outline'
      });
    } else if (envData.temperature && Number(envData.temperature) < 15) {
      addNotification({
        type: 'warning',
        title: 'Low Temperature Alert',
        message: `Current temperature is ${envData.temperature}°C, which is below optimal range.`,
        icon: 'thermometer-outline'
      });
    }
    
    // Humidity check (assuming optimal range is 80-95% for mushrooms)
    if (envData.humidity && Number(envData.humidity) < 75) {
      addNotification({
        type: 'warning',
        title: 'Low Humidity Alert',
        message: `Current humidity is ${envData.humidity}%, which is below optimal range.`,
        icon: 'water-outline'
      });
    }
    
    // pH check (assuming optimal range is 5.5-6.5 for mushrooms)
    if (envData.pH && (Number(envData.pH) < 5 || Number(envData.pH) > 7)) {
      addNotification({
        type: 'warning',
        title: 'pH Level Alert',
        message: `Current pH is ${envData.pH}, which is outside optimal range.`,
        icon: 'flask-outline'
      });
    }
  };
  
  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications,
      getFormattedTime,
      getUnreadCount,
      checkEnvironmentalConditions
    }}>
      {children}
    </NotificationContext.Provider>
  );
};