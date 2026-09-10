import { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { AppText } from '../../src/components/common/AppText';
import { AppCard } from '../../src/components/common/AppCard';
import { Avatar } from '../../src/components/common/Avatar';
import { spacing, radius, shadows } from '../../src/constants/typography';
import { chatbotService } from '../../src/services';
import { ChatMessage } from '../../src/types/chatbot';
import { ArrowLeft, Send, Sparkles, Bot } from 'lucide-react-native';

export default function ChatbotScreen() {
  const { theme } = useThemeStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const loadHistory = useCallback(async () => {
    try {
      const [history, prompts] = await Promise.all([
        chatbotService.getConversationHistory(),
        Promise.resolve(chatbotService.getSuggestedPrompts()),
      ]);
      setMessages(history);
      setSuggestedPrompts(prompts);
    } catch {
      // empty
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleSend = async (message?: string) => {
    const text = (message || input).trim();
    if (!text || sending) return;

    setInput('');
    setSending(true);

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const aiMsg = await chatbotService.sendMessage(text);
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: 'msg_' + Date.now(),
        role: 'assistant',
        content: 'Sorry, I had trouble responding. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
    setSending(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={[styles.botAvatar, { backgroundColor: theme.colors.primaryLight }]}>
            <Bot size={20} color={theme.colors.primary} />
          </View>
          <View>
            <AppText variant="headingS">Lumi AI</AppText>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: theme.colors.success }]} />
              <AppText variant="caption" style={{ color: theme.colors.textSecondary }}>Online</AppText>
            </View>
          </View>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[styles.messageRow, msg.role === 'user' && styles.messageRowUser]}
            >
              {msg.role === 'assistant' && (
                <View style={[styles.msgAvatar, { backgroundColor: theme.colors.primaryLight }]}>
                  <Sparkles size={16} color={theme.colors.primary} />
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  msg.role === 'user'
                    ? { backgroundColor: theme.colors.primary }
                    : { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                ]}
              >
                <AppText
                  variant="bodySmall"
                  style={{
                    color: msg.role === 'user' ? '#FFFFFF' : theme.colors.text,
                    lineHeight: 20,
                  }}
                >
                  {msg.content}
                </AppText>
                <AppText
                  variant="caption"
                  style={{
                    color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : theme.colors.textMuted,
                    fontSize: 10,
                    marginTop: 4,
                    alignSelf: 'flex-end',
                  }}
                >
                  {formatTime(msg.timestamp)}
                </AppText>
              </View>
            </View>
          ))}

          {sending && (
            <View style={styles.messageRow}>
              <View style={[styles.msgAvatar, { backgroundColor: theme.colors.primaryLight }]}>
                <Sparkles size={16} color={theme.colors.primary} />
              </View>
              <View style={[styles.messageBubble, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                <View style={styles.typingDots}>
                  {[0, 1, 2].map((i) => (
                    <View
                      key={i}
                      style={[styles.typingDot, { backgroundColor: theme.colors.textMuted }]}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Suggested Prompts */}
          {messages.length <= 1 && suggestedPrompts.length > 0 && !sending && (
            <View style={styles.promptsContainer}>
              <AppText variant="caption" style={{ color: theme.colors.textSecondary, marginBottom: spacing.sm }}>
                Try asking:
              </AppText>
              {suggestedPrompts.map((prompt) => (
                <TouchableOpacity
                  key={prompt}
                  onPress={() => handleSend(prompt)}
                  activeOpacity={0.7}
                >
                  <AppCard padding="sm" style={[styles.promptCard, { borderColor: theme.colors.border }]}>
                    <AppText variant="bodySmall" style={{ color: theme.colors.primary }}>{prompt}</AppText>
                  </AppCard>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={[styles.inputBar, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
          <TextInput
            style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.surface }]}
            value={input}
            onChangeText={setInput}
            placeholder="Ask Lumi anything..."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={() => handleSend()}
            disabled={!input.trim() || sending}
            activeOpacity={0.7}
            style={[styles.sendBtn, { backgroundColor: !input.trim() || sending ? theme.colors.textMuted : theme.colors.primary }]}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, borderBottomWidth: 1 },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  botAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  chatContent: { paddingHorizontal: spacing.xxl, paddingVertical: spacing.lg, gap: spacing.md },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, maxWidth: '85%' },
  messageRowUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  messageBubble: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.lg, borderWidth: 1, maxWidth: '100%' },
  typingDots: { flexDirection: 'row', gap: 4, paddingVertical: 4 },
  typingDot: { width: 8, height: 8, borderRadius: 4 },
  promptsContainer: { marginTop: spacing.lg, gap: spacing.sm },
  promptCard: { borderWidth: 1 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm, borderTopWidth: 1 },
  input: { flex: 1, minHeight: 44, maxHeight: 100, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontSize: 15, fontFamily: 'Poppins-Regular' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
