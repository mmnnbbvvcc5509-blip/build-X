import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

// Define theme colors
const lightTheme = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#000000',
  secondary: '#333333',
  accent: '#666666',
  card: '#F5F5F5',
  border: '#E0E0E0',
  error: '#FF3B30',
  success: '#34C759',
  chatBubbleUser: '#000000',
  chatBubbleBot: '#F0F0F0',
  chatTextUser: '#FFFFFF',
  chatTextBot: '#000000',
};

const darkTheme = {
  background: '#121212',
  text: '#FFFFFF',
  primary: '#FFFFFF',
  secondary: '#CCCCCC',
  accent: '#999999',
  card: '#1E1E1E',
  border: '#333333',
  error: '#FF453A',
  success: '#30D158',
  chatBubbleUser: '#FFFFFF',
  chatBubbleBot: '#2C2C2E',
  chatTextUser: '#000000',
  chatTextBot: '#FFFFFF',
};

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', or 'system'
  const [colors, setColors] = useState(deviceTheme === 'dark' ? darkTheme : lightTheme);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Update colors when theme mode changes
  useEffect(() => {
    const applyTheme = () => {
      if (themeMode === 'system') {
        setColors(deviceTheme === 'dark' ? darkTheme : lightTheme);
      } else if (themeMode === 'dark') {
        setColors(darkTheme);
      } else {
        setColors(lightTheme);
      }
    };

    applyTheme();
  }, [themeMode, deviceTheme]);

  // Save theme preference when it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('themeMode', themeMode);
      } catch (error) {
        console.log('Error saving theme:', error);
      }
    };

    saveTheme();
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const setTheme = (mode) => {
    if (['light', 'dark', 'system'].includes(mode)) {
      setThemeMode(mode);
    }
  };

  const isDarkMode = themeMode === 'dark' || (themeMode === 'system' && deviceTheme === 'dark');

  return (
    <ThemeContext.Provider
      value={{
        colors,
        themeMode,
        isDarkMode,
        toggleTheme,
        setTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};