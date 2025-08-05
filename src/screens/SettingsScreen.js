import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Contexts
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { ChatContext } from '../context/ChatContext';

const SettingsScreen = () => {
  const { userInfo, logout, credits, addCredits } = useContext(AuthContext);
  const { colors, isDarkMode, themeMode, setTheme } = useContext(ThemeContext);
  const { clearAllConversations } = useContext(ChatContext);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تسجيل الخروج', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const handleClearChats = () => {
    Alert.alert(
      'مسح جميع المحادثات',
      'هل أنت متأكد من رغبتك في مسح جميع المحادثات؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'مسح', onPress: clearAllConversations, style: 'destructive' },
      ]
    );
  };

  const handleSubscribe = (plan) => {
    // In a real app, this would handle payment processing
    // For now, we'll just simulate adding credits
    let creditsToAdd = 0;
    
    switch (plan) {
      case 'basic':
        creditsToAdd = 100;
        break;
      case 'pro':
        creditsToAdd = 250;
        break;
      case 'premium':
        creditsToAdd = 500;
        break;
    }
    
    addCredits(creditsToAdd);
    setShowSubscriptionModal(false);
    
    Alert.alert(
      'تمت الترقية بنجاح',
      `تمت إضافة ${creditsToAdd} رصيد إلى حسابك.`,
      [{ text: 'حسناً' }]
    );
  };

  const handleWatchAd = () => {
    // In a real app, this would show an ad
    // For now, we'll just simulate adding credits
    setTimeout(() => {
      addCredits(5);
      Alert.alert(
        'تمت مشاهدة الإعلان',
        'تمت إضافة 5 رصيد إلى حسابك.',
        [{ text: 'حسناً' }]
      );
    }, 2000);
  };

  const renderThemeModal = () => (
    <Modal
      visible={showThemeModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowThemeModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowThemeModal(false)}
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.card },
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            اختر المظهر
          </Text>
          
          <TouchableOpacity
            style={[
              styles.themeOption,
              themeMode === 'system' && { backgroundColor: colors.border },
            ]}
            onPress={() => {
              setTheme('system');
              setShowThemeModal(false);
            }}
          >
            <Text style={[styles.themeOptionText, { color: colors.text }]}>
              اتباع النظام
            </Text>
            {themeMode === 'system' && (
              <Ionicons name="checkmark" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.themeOption,
              themeMode === 'light' && { backgroundColor: colors.border },
            ]}
            onPress={() => {
              setTheme('light');
              setShowThemeModal(false);
            }}
          >
            <Text style={[styles.themeOptionText, { color: colors.text }]}>
              الوضع الفاتح
            </Text>
            {themeMode === 'light' && (
              <Ionicons name="checkmark" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.themeOption,
              themeMode === 'dark' && { backgroundColor: colors.border },
            ]}
            onPress={() => {
              setTheme('dark');
              setShowThemeModal(false);
            }}
          >
            <Text style={[styles.themeOptionText, { color: colors.text }]}>
              الوضع الداكن
            </Text>
            {themeMode === 'dark' && (
              <Ionicons name="checkmark" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowThemeModal(false)}
          >
            <Text style={[styles.closeButtonText, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>
              إغلاق
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderSubscriptionModal = () => (
    <Modal
      visible={showSubscriptionModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSubscriptionModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowSubscriptionModal(false)}
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.card },
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            اختر خطة الاشتراك
          </Text>
          
          <TouchableOpacity
            style={[styles.subscriptionOption, { borderColor: colors.border }]}
            onPress={() => handleSubscribe('basic')}
          >
            <Text style={[styles.subscriptionTitle, { color: colors.text }]}>
              النسخة المحسنة
            </Text>
            <Text style={[styles.subscriptionPrice, { color: colors.primary }]}>
              $7.99 / شهرياً
            </Text>
            <Text style={[styles.subscriptionFeatures, { color: colors.secondary }]}>
              • 100 رصيد شهرياً
              {'\n'}• دعم الصور والملفات
              {'\n'}• حفظ سجل المحادثات
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.subscriptionOption,
              { borderColor: colors.primary, backgroundColor: 'rgba(0, 0, 0, 0.05)' },
            ]}
            onPress={() => handleSubscribe('pro')}
          >
            <View style={styles.popularTag}>
              <Text style={styles.popularTagText}>الأكثر شعبية</Text>
            </View>
            <Text style={[styles.subscriptionTitle, { color: colors.text }]}>
              النسخة PRO
            </Text>
            <Text style={[styles.subscriptionPrice, { color: colors.primary }]}>
              $14.99 / شهرياً
            </Text>
            <Text style={[styles.subscriptionFeatures, { color: colors.secondary }]}>
              • 250 رصيد شهرياً
              {'\n'}• دعم الصور والملفات
              {'\n'}• حفظ سجل المحادثات
              {'\n'}• أولوية الاستجابة
              {'\n'}• تصدير المحادثات
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.subscriptionOption, { borderColor: colors.border }]}
            onPress={() => handleSubscribe('premium')}
          >
            <Text style={[styles.subscriptionTitle, { color: colors.text }]}>
              النسخة فائقة القوة
            </Text>
            <Text style={[styles.subscriptionPrice, { color: colors.primary }]}>
              $29.99 / شهرياً
            </Text>
            <Text style={[styles.subscriptionFeatures, { color: colors.secondary }]}>
              • 500 رصيد شهرياً
              {'\n'}• دعم الصور والملفات
              {'\n'}• حفظ سجل المحادثات
              {'\n'}• أولوية الاستجابة
              {'\n'}• تصدير المحادثات
              {'\n'}• دعم فني مخصص
              {'\n'}• ميزات حصرية
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowSubscriptionModal(false)}
          >
            <Text style={[styles.closeButtonText, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>
              إغلاق
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>الإعدادات</Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>
                {userInfo?.name?.charAt(0) || 'G'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {userInfo?.name || 'ضيف'}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.secondary }]}>
                {userInfo?.email || 'مستخدم ضيف'}
              </Text>
            </View>
          </View>

          <View style={styles.creditsSection}>
            <Text style={[styles.creditsTitle, { color: colors.text }]}>
              الرصيد المتبقي
            </Text>
            <View style={styles.creditsRow}>
              <Text style={[styles.creditsValue, { color: colors.primary }]}>
                {credits}
              </Text>
              <Ionicons name="diamond-outline" size={24} color={colors.primary} />
            </View>
            <TouchableOpacity
              style={[styles.upgradeButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowSubscriptionModal(true)}
            >
              <Text style={[styles.upgradeButtonText, { color: isDarkMode ? colors.text : '#FFFFFF' }]}>
                ترقية الحساب
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.watchAdButton, { borderColor: colors.border }]}
              onPress={handleWatchAd}
            >
              <Text style={[styles.watchAdButtonText, { color: colors.text }]}>
                مشاهدة إعلان للحصول على 5 رصيد
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            عام
          </Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowThemeModal(true)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={24} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                المظهر
              </Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, { color: colors.secondary }]}>
                {themeMode === 'system'
                  ? 'اتباع النظام'
                  : themeMode === 'light'
                  ? 'الوضع الفاتح'
                  : 'الوضع الداكن'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleClearChats}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="trash-outline" size={24} color={colors.error} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                مسح جميع المحادثات
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleLogout}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="log-out-outline" size={24} color={colors.error} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                تسجيل الخروج
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            حول
          </Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={24} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                عن التطبيق
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                سياسة الخصوصية
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="document-text-outline" size={24} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                شروط الاستخدام
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.versionText, { color: colors.secondary }]}>
          Build X v1.0.0
        </Text>
      </ScrollView>

      {renderThemeModal()}
      {renderSubscriptionModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  creditsSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  creditsTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  creditsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  upgradeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  watchAdButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  watchAdButtonText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    marginRight: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  themeOptionText: {
    fontSize: 16,
  },
  closeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  subscriptionOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 16,
    position: 'relative',
  },
  popularTag: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  popularTagText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subscriptionPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subscriptionFeatures: {
    fontSize: 14,
    lineHeight: 22,
  },
});

export default SettingsScreen;