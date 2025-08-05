import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Contexts
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const LoginScreen = () => {
  const { googleLogin, appleLogin, loginAsGuest, emailLogin } = useContext(AuthContext);
  const { colors, isDarkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handleEmailLogin = () => {
    if (email.trim()) {
      emailLogin(email);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            {/* Replace with your actual logo */}
            <Text style={[styles.logo, { color: colors.primary }]}>Build X</Text>
          </View>

          <Text style={[styles.welcomeText, { color: colors.text }]}>
            مرحباً بك في Build X
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#000000' }]}
              onPress={googleLogin}
            >
              <Ionicons name="logo-google" size={24} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>متابعة باستخدام Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#000000' }]}
              onPress={appleLogin}
            >
              <Ionicons name="logo-apple" size={24} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>متابعة باستخدام Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.card }]}
              onPress={() => setShowEmailInput(true)}
            >
              <Ionicons name="mail-outline" size={24} color={colors.text} />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>
                متابعة باستخدام البريد الإلكتروني
              </Text>
            </TouchableOpacity>

            {showEmailInput && (
              <View style={styles.emailContainer}>
                <TextInput
                  style={[
                    styles.emailInput,
                    {
                      backgroundColor: colors.card,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="أدخل بريدك الإلكتروني"
                  placeholderTextColor={colors.secondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={[styles.emailButton, { backgroundColor: colors.primary }]}
                  onPress={handleEmailLogin}
                >
                  <Text style={[styles.emailButtonText, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>
                    إرسال
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[styles.guestButton, { borderColor: colors.border }]}
              onPress={loginAsGuest}
            >
              <Text style={[styles.guestButtonText, { color: colors.text }]}>
                الدخول كضيف
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: colors.secondary }]}>
              شروط الخدمة
            </Text>
            <Text style={[styles.termsText, { color: colors.secondary }]}>
              سياسة الخصوصية
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  emailContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  emailInput: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'right',
  },
  emailButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  emailButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  termsText: {
    fontSize: 14,
  },
});

export default LoginScreen;