import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo, decreaseCredits, credits } = useContext(AuthContext);

  // Load conversations from storage when user changes
  useEffect(() => {
    if (userInfo) {
      loadConversations();
    } else {
      setConversations([]);
      setCurrentConversationId(null);
    }
  }, [userInfo]);

  // Save conversations to storage when they change
  useEffect(() => {
    if (userInfo && conversations.length > 0) {
      saveConversations();
    }
  }, [conversations]);

  const loadConversations = async () => {
    try {
      const userId = userInfo?.id || 'guest';
      const savedConversations = await AsyncStorage.getItem(`conversations_${userId}`);
      if (savedConversations) {
        setConversations(JSON.parse(savedConversations));
      }
    } catch (error) {
      console.log('Error loading conversations:', error);
    }
  };

  const saveConversations = async () => {
    try {
      const userId = userInfo?.id || 'guest';
      await AsyncStorage.setItem(`conversations_${userId}`, JSON.stringify(conversations));
    } catch (error) {
      console.log('Error saving conversations:', error);
    }
  };

  const createNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'مرحبا انا وكيل Build X كيف يمكنني مساعدتك اليوم؟ يمكنني أنشاء التطبيقات و تصميم المواقع ونشرها أذا أردت.',
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    return newConversation.id;
  };

  const getCurrentConversation = () => {
    return conversations.find(conv => conv.id === currentConversationId) || null;
  };

  const sendMessage = async (content, attachments = []) => {
    if (!content && attachments.length === 0) return;
    if (credits <= 0) return;

    // If no current conversation, create one
    if (!currentConversationId) {
      createNewConversation();
    }

    setIsLoading(true);

    // Add user message to conversation
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      attachments,
      timestamp: new Date().toISOString(),
    };

    // Update conversations with user message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === currentConversationId 
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              updatedAt: new Date().toISOString(),
              title: content.length > 30 ? content.substring(0, 30) + '...' : content,
            }
          : conv
      )
    );

    try {
      // Simulate API call to Open All Hands
      // In a real app, you would make an API call to the Open All Hands service
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate AI response
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(content),
        timestamp: new Date().toISOString(),
      };

      // Update conversations with AI response
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversationId 
            ? {
                ...conv,
                messages: [...conv.messages, aiResponse],
                updatedAt: new Date().toISOString(),
              }
            : conv
        )
      );

      // Decrease credits for each interaction
      decreaseCredits(1);
    } catch (error) {
      console.log('Error sending message:', error);
      
      // Add error message to conversation
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'عذراً، حدث خطأ أثناء معالجة رسالتك. يرجى المحاولة مرة أخرى.',
        isError: true,
        timestamp: new Date().toISOString(),
      };

      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversationId 
            ? {
                ...conv,
                messages: [...conv.messages, errorMessage],
                updatedAt: new Date().toISOString(),
              }
            : conv
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Simple function to generate AI responses (in a real app, this would be replaced with actual API calls)
  const generateAIResponse = (userMessage) => {
    const responses = [
      "يمكنني مساعدتك في إنشاء تطبيق لمشروعك. هل يمكنك إخباري بالمزيد عن متطلباتك؟",
      "بالتأكيد! يمكنني تصميم موقع ويب لك. ما هي الميزات التي ترغب في تضمينها؟",
      "أنا هنا لمساعدتك في تطوير برمجيات عالية الجودة. ما هو المشروع الذي تعمل عليه؟",
      "يمكنني كتابة التعليمات البرمجية لتطبيقك. ما هي لغة البرمجة التي تفضلها؟",
      "سأساعدك في بناء واجهة المستخدم لتطبيقك. هل لديك أي تصميمات مرجعية؟",
      "يمكنني مساعدتك في تحسين أداء تطبيقك الحالي. ما هي المشكلات التي تواجهها؟",
      "أنا قادر على مساعدتك في تطوير واجهات برمجة التطبيقات (APIs). ما هي احتياجاتك؟",
      "يمكنني مساعدتك في اختيار التقنيات المناسبة لمشروعك. ما هو هدف مشروعك؟",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const deleteConversation = (conversationId) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
    }
  };

  const clearAllConversations = () => {
    setConversations([]);
    setCurrentConversationId(null);
  };

  const renameConversation = (conversationId, newTitle) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, title: newTitle }
          : conv
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversationId,
        isLoading,
        setCurrentConversationId,
        createNewConversation,
        getCurrentConversation,
        sendMessage,
        deleteConversation,
        clearAllConversations,
        renameConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};