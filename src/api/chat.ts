import { supabase } from './supabase';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? 'http://localhost:3001';

export interface ChatAction {
  type:        string;
  title:       string;
  description: string;
  payload?:    Record<string, unknown>;
}

export interface Message {
  id:           string;
  role:         'user' | 'assistant';
  content:      string;
  action?:      ChatAction;
  actionStatus?: 'pending' | 'accepted' | 'declined';
  createdAt:    Date;
}

export async function sendMessage(
  userId: string,
  message: string,
): Promise<{ message: string; action: ChatAction | null }> {
  const res = await fetch(`${SERVER_URL}/chat`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ userId, message }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}

export async function resolveAction(
  userId:    string,
  messageId: string,
  status:    'accepted' | 'declined',
  action:    ChatAction,
): Promise<void> {
  const res = await fetch(`${SERVER_URL}/chat/action`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ userId, messageId, status, action }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
}

export async function loadChatHistory(userId: string): Promise<Message[]> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, role, content, action_type, action_payload, action_status, created_at')
    .eq('user_id', userId)
    .gte('created_at', since)
    .order('created_at', { ascending: true })
    .limit(50);

  if (error || !data) return [];

  return data.map((row): Message => {
    const action: ChatAction | undefined =
      row.action_type
        ? {
            type:        row.action_type,
            title:       row.action_payload?.title       ?? row.action_type,
            description: row.action_payload?.description ?? '',
            payload:     row.action_payload?.payload,
          }
        : undefined;

    return {
      id:           row.id,
      role:         row.role as 'user' | 'assistant',
      content:      row.content,
      action,
      actionStatus: row.action_status ?? undefined,
      createdAt:    new Date(row.created_at),
    };
  });
}
