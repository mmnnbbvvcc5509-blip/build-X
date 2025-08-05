import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [credits, setCredits] = useState(20); // Default $20 free credits

  const login = async (userData) => {
    setIsLoading(true);
    try {
      // In a real app, you would validate credentials with a server
      // For now, we'll just store the user data locally
      await AsyncStorage.setItem('userToken', 'dummy-auth-token');
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      setUserToken('dummy-auth-token');
      setUserInfo(userData);
    } catch (error) {
      console.log('Login error:', error);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      setUserToken(null);
      setUserInfo(null);
    } catch (error) {
      console.log('Logout error:', error);
    }
    setIsLoading(false);
  };

  const loginAsGuest = async () => {
    setIsLoading(true);
    try {
      const guestUser = {
        id: 'guest-' + Date.now(),
        name: 'Guest User',
        email: '',
        isGuest: true
      };
      await AsyncStorage.setItem('userToken', 'guest-token');
      await AsyncStorage.setItem('userInfo', JSON.stringify(guestUser));
      setUserToken('guest-token');
      setUserInfo(guestUser);
    } catch (error) {
      console.log('Guest login error:', error);
    }
    setIsLoading(false);
  };

  const googleLogin = async () => {
    // In a real app, you would implement Google OAuth
    // For now, we'll simulate a successful login
    const mockGoogleUser = {
      id: 'google-' + Date.now(),
      name: 'Google User',
      email: 'user@gmail.com',
      isGuest: false
    };
    login(mockGoogleUser);
  };

  const appleLogin = async () => {
    // In a real app, you would implement Apple Sign In
    // For now, we'll simulate a successful login
    const mockAppleUser = {
      id: 'apple-' + Date.now(),
      name: 'Apple User',
      email: 'user@icloud.com',
      isGuest: false
    };
    login(mockAppleUser);
  };

  const emailLogin = async (email) => {
    // In a real app, you would implement email authentication
    // For now, we'll simulate a successful login
    const mockEmailUser = {
      id: 'email-' + Date.now(),
      name: email.split('@')[0],
      email: email,
      isGuest: false
    };
    login(mockEmailUser);
  };

  const decreaseCredits = (amount = 1) => {
    setCredits(prev => Math.max(0, prev - amount));
  };

  const addCredits = (amount) => {
    setCredits(prev => prev + amount);
  };

  const isAuthenticated = () => {
    return userToken !== null;
  };

  const isGuest = () => {
    return userInfo?.isGuest === true;
  };

  // Check if the user is logged in when the app starts
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        const savedCredits = await AsyncStorage.getItem('credits');
        
        if (token) {
          setUserToken(token);
          if (userInfoStr) {
            setUserInfo(JSON.parse(userInfoStr));
          }
          if (savedCredits) {
            setCredits(parseInt(savedCredits, 10));
          }
        }
      } catch (error) {
        console.log('Error restoring token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Save credits whenever they change
  useEffect(() => {
    const saveCredits = async () => {
      try {
        await AsyncStorage.setItem('credits', credits.toString());
      } catch (error) {
        console.log('Error saving credits:', error);
      }
    };

    saveCredits();
  }, [credits]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userInfo,
        credits,
        login,
        logout,
        loginAsGuest,
        googleLogin,
        appleLogin,
        emailLogin,
        decreaseCredits,
        addCredits,
        isAuthenticated,
        isGuest
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};