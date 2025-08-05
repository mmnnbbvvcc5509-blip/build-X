import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

// Contexts
import { ChatContext } from '../context/ChatContext';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const ChatScreen = ({ navigation }) => {
  const { getCurrentConversation, sendMessage, isLoading } = useContext(ChatContext);
  const { colors, isDarkMode } = useContext(ThemeContext);
  const { credits } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const flatListRef = useRef(null);

  const currentConversation = getCurrentConversation();
  const messages = currentConversation?.messages || [];

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
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

    if (message.trim() || attachments.length > 0) {
      sendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAttachments([...attachments, { type: 'image', uri: result.assets[0].uri }]);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.type === 'success') {
      setAttachments([...attachments, { type: 'document', uri: result.uri, name: result.name }]);
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const renderAttachment = (attachment, index) => {
    if (attachment.type === 'image') {
      return (
        <View style={styles.attachmentContainer} key={index}>
          <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />
          <TouchableOpacity
            style={styles.removeAttachment}
            onPress={() => removeAttachment(index)}
          >
            <Ionicons name="close-circle" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={[styles.attachmentContainer, { backgroundColor: colors.card }]} key={index}>
          <Ionicons name="document-outline" size={24} color={colors.text} />
          <Text style={[styles.attachmentName, { color: colors.text }]} numberOfLines={1}>
            {attachment.name}
          </Text>
          <TouchableOpacity
            style={styles.removeAttachment}
            onPress={() => removeAttachment(index)}
          >
            <Ionicons name="close-circle" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderMessage = ({ item, index }) => {
    const isUser = item.role === 'user';
    const showAvatar = index === 0 || messages[index - 1].role !== item.role;

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer,
        ]}
      >
        {!isUser && showAvatar && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>BX</Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser
              ? [styles.userBubble, { backgroundColor: colors.chatBubbleUser }]
              : [styles.botBubble, { backgroundColor: colors.chatBubbleBot }],
          ]}
        >
          {item.attachments && item.attachments.length > 0 && (
            <View style={styles.messageAttachments}>
              {item.attachments.map((attachment, attachIndex) => (
                <View key={attachIndex}>
                  {attachment.type === 'image' ? (
                    <Image source={{ uri: attachment.uri }} style={styles.messageImage} />
                  ) : (
                    <View style={styles.documentPreview}>
                      <Ionicons name="document" size={24} color={isUser ? colors.chatTextUser : colors.chatTextBot} />
                      <Text
                        style={[
                          styles.documentName,
                          { color: isUser ? colors.chatTextUser : colors.chatTextBot },
                        ]}
                        numberOfLines={1}
                      >
                        {attachment.name}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
          <Text
            style={[
              styles.messageText,
              { color: isUser ? colors.chatTextUser : colors.chatTextBot },
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.messageTime,
              { color: isUser ? 'rgba(255, 255, 255, 0.7)' : colors.secondary },
            ]}
          >
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isLoading && (
          <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Build X يكتب...
            </Text>
          </View>
        )}

        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
          {attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              {attachments.map((attachment, index) => renderAttachment(attachment, index))}
            </View>
          )}

          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
              <Ionicons name="image-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachButton} onPress={pickDocument}>
              <Ionicons name="document-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { color: colors.text, backgroundColor: colors.background }]}
              placeholder="اكتب رسالة..."
              placeholderTextColor={colors.secondary}
              value={message}
              onChangeText={setMessage}
              multiline
              textAlign="right"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: message.trim() || attachments.length > 0 ? colors.primary : colors.secondary },
              ]}
              onPress={handleSend}
              disabled={!(message.trim() || attachments.length > 0)}
            >
              <Ionicons name="send" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    maxWidth: '100%',
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  botBubble: {
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  messageAttachments: {
    marginBottom: 8,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 8,
  },
  documentName: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  attachmentContainer: {
    position: 'relative',
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  attachmentImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  attachmentName: {
    maxWidth: 100,
    padding: 8,
  },
  removeAttachment: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    maxHeight: 120,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
});

export default ChatScreen;