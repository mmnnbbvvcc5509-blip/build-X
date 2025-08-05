import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Contexts
import { ChatContext } from '../context/ChatContext';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

// Screens
import ChatScreen from './ChatScreen';

const Stack = createStackNavigator();

const ChatListContent = () => {
  const { conversations, createNewConversation, setCurrentConversationId, deleteConversation } = useContext(ChatContext);
  const { colors } = useContext(ThemeContext);
  const { credits } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleCreateChat = () => {
    if (credits <= 0) {
      Alert.alert(
        'رصيد غير كافي',
        'لقد استنفدت رصيدك المجاني. يرجى الترقية للاستمرار.',
        [
          { text: 'ترقية', onPress: () => navigation.navigate('Settings') },
          { text: 'إلغاء', style: 'cancel' },
        ]
      );
      return;
    }
    
    const newChatId = createNewConversation();
    setCurrentConversationId(newChatId);
    navigation.navigate('ChatScreen');
  };

  const handleSelectChat = (chatId) => {
    setCurrentConversationId(chatId);
    navigation.navigate('ChatScreen');
  };

  const handleDeleteChat = (chatId) => {
    Alert.alert(
      'حذف المحادثة',
      'هل أنت متأكد من رغبتك في حذف هذه المحادثة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف', onPress: () => deleteConversation(chatId), style: 'destructive' },
      ]
    );
  };

  const renderChatItem = ({ item }) => {
    const lastMessage = item.messages[item.messages.length - 1];
    const previewText = lastMessage ? lastMessage.content.substring(0, 50) + (lastMessage.content.length > 50 ? '...' : '') : '';
    
    return (
      <TouchableOpacity
        style={[styles.chatItem, { backgroundColor: colors.card }]}
        onPress={() => handleSelectChat(item.id)}
      >
        <View style={styles.chatInfo}>
          <Text style={[styles.chatTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.chatPreview, { color: colors.secondary }]} numberOfLines={2}>
            {previewText}
          </Text>
          <Text style={[styles.chatDate, { color: colors.secondary }]}>
            {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteChat(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>المحادثات</Text>
        <View style={styles.creditsContainer}>
          <Text style={[styles.creditsText, { color: colors.text }]}>
            الرصيد: {credits}
          </Text>
          <Ionicons name="diamond-outline" size={20} color={colors.text} />
        </View>
      </View>

      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={80} color={colors.secondary} />
          <Text style={[styles.emptyText, { color: colors.secondary }]}>
            لا توجد محادثات
          </Text>
          <Text style={[styles.emptySubText, { color: colors.secondary }]}>
            ابدأ محادثة جديدة مع Build X
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.newChatButton, { backgroundColor: colors.primary }]}
        onPress={handleCreateChat}
      >
        <Ionicons name="add" size={30} color={colors.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const ChatListScreen = () => {
  const { colors } = useContext(ThemeContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatList"
        component={ChatListContent}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerTitle: 'Build X',
          headerTintColor: colors.text,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditsText: {
    fontSize: 16,
    marginRight: 5,
  },
  listContent: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  chatPreview: {
    fontSize: 14,
    marginBottom: 6,
  },
  chatDate: {
    fontSize: 12,
  },
  deleteButton: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    textAlign: 'center',
  },
  newChatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default ChatListScreen;