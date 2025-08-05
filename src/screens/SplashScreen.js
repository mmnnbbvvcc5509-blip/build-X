import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const SplashScreen = () => {
  const { colors, isDarkMode } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        {/* Replace with your actual logo */}
        <Text style={[styles.logo, { color: colors.primary }]}>Build X</Text>
      </View>
      <Text style={[styles.welcomeText, { color: colors.text }]}>
        مرحباً بك في Build X
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 24,
    textAlign: 'center',
  },
});

export default SplashScreen;