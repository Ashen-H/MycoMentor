import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Define theme colors
export interface ThemeColors {
  background: string;
  text: string;
  cardBackground: string;
  primary: string;
  secondary: string;
  border: string;
  headerBackground: string;
  tabBarBackground: string;
  tabBarText: string;
  inputBackground: string;
  inputText: string;
  placeholder: string;
  dangerText: string;
  sectionTitle: string;
  versionText: string;
}

// Define light theme colors
export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  text: '#333333',
  cardBackground: '#F5F5F5',
  primary: '#6DA77F',
  secondary: '#7FB77E',
  border: '#EEEEEE',
  headerBackground: '#FFFFFF',
  tabBarBackground: '#6DA77F',
  tabBarText: '#FFFFFF',
  inputBackground: '#F5F5F5',
  inputText: '#333333',
  placeholder: '#666666',
  dangerText: '#D32F2F',
  sectionTitle: '#6DA77F',
  versionText: '#999999'
};

// Define dark theme colors
export const darkColors: ThemeColors = {
  background: '#121212',
  text: '#FFFFFF',
  cardBackground: '#222222',
  primary: '#6DA77F',
  secondary: '#7FB77E',
  border: '#333333',
  headerBackground: '#1E1E1E',
  tabBarBackground: '#1E1E1E',
  tabBarText: '#FFFFFF',
  inputBackground: '#333333',
  inputText: '#FFFFFF',
  placeholder: '#AAAAAA',
  dangerText: '#FF6B6B',
  sectionTitle: '#6DA77F',
  versionText: '#777777'
};

// Create the context interface
interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setIsDark: (isDark: boolean) => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
  setIsDark: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check device theme
  const deviceTheme = useColorScheme();
  
  // State for dark mode
  const [isDark, setIsDark] = useState(false);
  
  // Load theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync('isDarkMode');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'true');
        } else {
          // Use system default if no saved preference
          setIsDark(deviceTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    
    loadTheme();
  }, [deviceTheme]);
  
  // Save theme preference when changed
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await SecureStore.setItemAsync('isDarkMode', isDark.toString());
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    };
    
    saveTheme();
  }, [isDark]);
  
  // Get colors based on theme
  const colors = isDark ? darkColors : lightColors;
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };
  
  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);