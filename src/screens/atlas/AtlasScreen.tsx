import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import { usePalette, useSpacing, useShape } from '../../theme/ThemeContext';
import { sendMessage, resolveAction, loadChatHistory, Message, ChatAction } from '../../api/chat';

// ─── Action Card ──────────────────────────────
const ActionCard = ({
  action, status, onAccept, onDecline,
}: {
  action: ChatAction;
  status?: string;
  onAccept: () => void;
  onDecline: () => void;
}) => {
  const palette = usePalette();
  const shape   = useShape();
  const isPending  = !status || status === 'pending';
  const isAccepted = status === 'accepted';

  return (
    <View style={{
      backgroundColor: palette.statBackground,
      borderRadius: shape.cardRadius,
      borderWidth: 1.5,
      borderColor: isAccepted ? palette.success : palette.accentEffective,
      padding: 14,
      marginTop: 10,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <View style={{
          backgroundColor: isAccepted ? palette.success : palette.accentEffective,
          borderRadius: shape.badgeRadius,
          paddingHorizontal: 8, paddingVertical: 3,
        }}>
          <Text style={{ color: palette.textOnAccent, fontSize: 10, fontWeight: '700' }}>
            {isAccepted ? 'ACCEPTED' : status === 'declined' ? 'DECLINED' : 'PROPOSED CHANGE'}
          </Text>
        </View>
        <Text style={{ color: palette.textMuted, fontSize: 11 }}>{action.type}</Text>
      </View>
      <Text style={{ color: palette.text, fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
        {action.title}
      </Text>
      <Text style={{ color: palette.textMuted, fontSize: 13, lineHeight: 20 }}>
        {action.description}
      </Text>
      {isPending && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <TouchableOpacity
            onPress={onAccept}
            style={{
              flex: 1, backgroundColor: palette.accentEffective,
              borderRadius: shape.buttonRadius, paddingVertical: 10, alignItems: 'center',
            }}
          >
            <Text style={{ color: palette.textOnAccent, fontSize: 14, fontWeight: '700' }}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDecline}
            style={{
              flex: 1, backgroundColor: palette.surface,
              borderRadius: shape.buttonRadius, paddingVertical: 10, alignItems: 'center',
              borderWidth: 1, borderColor: palette.border,
            }}
          >
            <Text style={{ color: palette.textMuted, fontSize: 14, fontWeight: '600' }}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ─── Message Bubble ───────────────────────────
const MessageBubble = ({
  message, onActionAccept, onActionDecline,
}: {
  message: Message;
  onActionAccept: (msg: Message) => void;
  onActionDecline: (msg: Message) => void;
}) => {
  const palette = usePalette();
  const shape   = useShape();
  const isUser  = message.role === 'user';

  return (
    <View style={{ alignItems: isUser ? 'flex-end' : 'flex-start', marginBottom: 14 }}>
      {!isUser && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <View style={{
            width: 20, height: 20, borderRadius: 10,
            backgroundColor: palette.accentEffective,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: palette.textOnAccent, fontSize: 10, fontWeight: '700' }}>A</Text>
          </View>
          <Text style={{ color: palette.textMuted, fontSize: 11, fontWeight: '600' }}>Atlas AI</Text>
        </View>
      )}
      <View style={{
        maxWidth: '82%',
        backgroundColor: isUser ? palette.accentEffective : palette.surface,
        borderRadius: shape.cardRadius,
        borderWidth: isUser ? 0 : 1,
        borderColor: palette.border,
        padding: 12,
      }}>
        <Text style={{ color: isUser ? palette.textOnAccent : palette.text, fontSize: 15, lineHeight: 22 }}>
          {message.content}
        </Text>
      </View>
      {message.action && (
        <View style={{ maxWidth: '90%', width: '90%' }}>
          <ActionCard
            action={message.action}
            status={message.actionStatus}
            onAccept={() => onActionAccept(message)}
            onDecline={() => onActionDecline(message)}
          />
        </View>
      )}
      <Text style={{ color: palette.textMuted, fontSize: 10, marginTop: 4 }}>
        {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

// ─── Suggestion chips ─────────────────────────
const SUGGESTIONS = [
  "How's my progress this month?",
  "My knee is sore, can we modify today?",
  "I want to focus more on strength",
  "What should I eat before training?",
  "Can I train tomorrow instead of today?",
];

// ─── Main screen ──────────────────────────────
interface Props {
  userId: string;
  userName: string;
}

export const AtlasScreen = ({ userId, userName }: Props) => {
  const palette   = usePalette();
  const spacing   = useSpacing();
  const shape     = useShape();
  const scrollRef = useRef<ScrollView>(null);

  const [messages,        setMessages]        = useState<Message[]>([]);
  const [input,           setInput]           = useState('');
  const [loading,         setLoading]         = useState(false);
  const [loadingHistory,  setLoadingHistory]  = useState(true);

  useEffect(() => {
    loadChatHistory(userId)
      .then(history => {
        if (history.length === 0) {
          setMessages([{
            id:        'welcome',
            role:      'assistant',
            content:   `Hey ${userName}! I'm Atlas, your AI personal trainer. I know your training history and I'm here to help you hit your goals. Ask me anything — about your program, recovery, nutrition, or if you need to adjust your schedule.`,
            createdAt: new Date(),
          }]);
        } else {
          setMessages(history);
        }
      })
      .finally(() => setLoadingHistory(false));
  }, [userId]);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(), role: 'user', content, createdAt: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await sendMessage(userId, content);
      setMessages(prev => [...prev, {
        id:           (Date.now() + 1).toString(),
        role:         'assistant',
        content:      response.message,
        action:       response.action,
        actionStatus: response.action ? 'pending' : undefined,
        createdAt:    new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id:        (Date.now() + 1).toString(),
        role:      'assistant',
        content:   "Sorry, I'm having trouble connecting right now. Make sure the Atlas server is running on port 3001.",
        createdAt: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (msg: Message) => {
    if (!msg.action) return;
    await resolveAction(userId, msg.id, 'accepted', msg.action).catch(console.warn);
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, actionStatus: 'accepted' as const } : m));
    setMessages(prev => [...prev, {
      id:        Date.now().toString(),
      role:      'assistant',
      content:   `Done — "${msg.action!.title}" has been applied to your plan.`,
      createdAt: new Date(),
    }]);
  };

  const handleDecline = async (msg: Message) => {
    if (!msg.action) return;
    await resolveAction(userId, msg.id, 'declined', msg.action).catch(console.warn);
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, actionStatus: 'declined' as const } : m));
    setMessages(prev => [...prev, {
      id:        Date.now().toString(),
      role:      'assistant',
      content:   "No problem — I'll keep your current plan as is.",
      createdAt: new Date(),
    }]);
  };

  if (loadingHistory) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={palette.accentEffective} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: palette.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Header */}
      <View style={{
        backgroundColor: palette.surface,
        borderBottomWidth: 1, borderBottomColor: palette.border,
        padding: spacing.screenPadding, paddingTop: 52,
        flexDirection: 'row', alignItems: 'center', gap: 12,
      }}>
        <View style={{
          width: 38, height: 38, borderRadius: 19,
          backgroundColor: palette.accentEffective,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ color: palette.textOnAccent, fontSize: 16, fontWeight: '700' }}>A</Text>
        </View>
        <View>
          <Text style={{ color: palette.text, fontSize: 17, fontWeight: '700' }}>Atlas AI</Text>
          <Text style={{ color: palette.success, fontSize: 12 }}>Your personal trainer · online</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: spacing.screenPadding, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onActionAccept={handleAccept}
            onActionDecline={handleDecline}
          />
        ))}
        {loading && (
          <View style={{ alignItems: 'flex-start', marginBottom: 12 }}>
            <View style={{
              backgroundColor: palette.surface, borderRadius: shape.cardRadius,
              borderWidth: 1, borderColor: palette.border,
              padding: 14, flexDirection: 'row', gap: 8, alignItems: 'center',
            }}>
              <ActivityIndicator color={palette.accentEffective} size="small" />
              <Text style={{ color: palette.textMuted, fontSize: 14 }}>Atlas is thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Suggestion chips */}
      {messages.length <= 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.screenPadding, paddingBottom: 8, gap: 8 }}
        >
          {SUGGESTIONS.map((s, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleSend(s)}
              style={{
                backgroundColor: palette.surface, borderRadius: shape.badgeRadius,
                borderWidth: 1, borderColor: palette.border,
                paddingHorizontal: 14, paddingVertical: 8,
              }}
            >
              <Text style={{ color: palette.text, fontSize: 13 }}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input bar */}
      <View style={{
        flexDirection: 'row', padding: spacing.screenPadding, paddingTop: 10,
        gap: 10, borderTopWidth: 1, borderTopColor: palette.border,
        backgroundColor: palette.surface,
      }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Message Atlas..."
          placeholderTextColor={palette.textMuted}
          multiline
          style={{
            flex: 1, backgroundColor: palette.statBackground,
            borderRadius: shape.inputRadius, borderWidth: 1,
            borderColor: palette.border, padding: 12,
            fontSize: 15, color: palette.text, maxHeight: 100,
          }}
        />
        <TouchableOpacity
          onPress={() => handleSend()}
          disabled={!input.trim() || loading}
          style={{
            backgroundColor: input.trim() && !loading ? palette.accentEffective : palette.border,
            borderRadius: shape.buttonRadius, width: 44,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ color: palette.textOnAccent, fontSize: 18, fontWeight: '700' }}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
