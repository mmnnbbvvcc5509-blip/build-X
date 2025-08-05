import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Contexts
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { isLoading, userToken } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background }
      }}
    >
      {userToken ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;