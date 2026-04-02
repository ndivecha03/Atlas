const express          = require('express');
const Anthropic        = require('@anthropic-ai/sdk').default;
const { createClient } = require('@supabase/supabase-js');

const router    = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase  = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const VALID_ACTION_TYPES = new Set(['UPDATE_PLAN', 'UPDATE_GOAL', 'ADD_NOTE', 'SWAP_EXERCISE', 'SCHEDULE_REST']);
const MAX_MESSAGE_LENGTH = 2000;

async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' });
  req.authUserId = user.id;
  next();
}

function buildSystemPrompt(ctx) {
  return `You are Atlas, a world-class AI personal trainer coaching ${ctx.name}, a ${ctx.age}-year-old ${ctx.genderIdentity} who trains ${ctx.trainingType} at ${ctx.experienceLevel} level. Their primary goal is ${ctx.primaryGoal}.

You remember everything from past conversations and have full context of their training history.

YOUR PERSONALITY:
- Warm, encouraging, and direct — like a great personal trainer who genuinely cares
- Evidence-based — cite sports science when relevant but keep it accessible
- Honest — if something won't work, say so kindly
- Proactive — notice patterns and bring them up before the user asks

YOUR CAPABILITIES:
You can propose changes by ending your message with this exact format:

<action>
{
  "type": "UPDATE_PLAN",
  "title": "Short title",
  "description": "Plain English explanation",
  "payload": {}
}
</action>

Valid types: UPDATE_PLAN, UPDATE_GOAL, ADD_NOTE, SWAP_EXERCISE, SCHEDULE_REST.
Only include an action when the user clearly wants a program change. For questions or advice, just reply naturally.

CURRENT STATS:
- Recent workouts: ${ctx.recentWorkouts}
- Current plan: ${ctx.currentPlan}
- Active notes: ${ctx.activeNotes}

Keep replies under 150 words unless asked for detail. No markdown headers. Plain paragraphs only.`;
}

function parseResponse(raw) {
  const actionMatch = raw.match(/<action>([\s\S]*?)<\/action>/);
  if (!actionMatch) return { message: raw.trim(), action: null };
  const message = raw.replace(/<action>[\s\S]*?<\/action>/, '').trim();
  try {
    return { message, action: JSON.parse(actionMatch[1].trim()) };
  } catch {
    return { message, action: null };
  }
}

async function loadHistory(userId) {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('user_id', userId)
    .gte('created_at', since)
    .order('created_at', { ascending: true })
    .limit(50);
  if (error || !data) return [];
  return data;
}

async function saveMessage(userId, role, content, actionType, actionPayload) {
  await supabase.from('chat_messages').insert({
    user_id:        userId,
    role,
    content,
    action_type:    actionType  || null,
    action_payload: actionPayload || null,
    action_status:  actionType ? 'pending' : null,
  });
}

async function loadUserContext(userId) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (!profile) return null;
  const { data: notes } = await supabase
    .from('user_notes')
    .select('content')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);
  return {
    name:            profile.name,
    age:             profile.age,
    genderIdentity:  profile.gender_identity,
    trainingType:    profile.training_type,
    experienceLevel: profile.experience_level,
    primaryGoal:     profile.primary_goal,
    recentWorkouts:  'Upper body strength (2 days ago), Lower body power (4 days ago)',
    currentPlan:     'Push/pull/legs split, 4 days per week',
    activeNotes:     notes?.map(n => n.content).join('; ') || 'None',
  };
}

router.post('/', requireAuth, async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) return res.status(400).json({ error: 'userId and message are required' });
  if (userId !== req.authUserId) return res.status(403).json({ error: 'Forbidden' });
  if (typeof message !== 'string' || message.trim().length === 0) return res.status(400).json({ error: 'message must be a non-empty string' });
  if (message.length > MAX_MESSAGE_LENGTH) return res.status(400).json({ error: `message must be under ${MAX_MESSAGE_LENGTH} characters` });
  try {
    const [userContext, history] = await Promise.all([
      loadUserContext(userId),
      loadHistory(userId),
    ]);
    if (!userContext) return res.status(404).json({ error: 'User profile not found' });
    await saveMessage(userId, 'user', message);
    const response = await anthropic.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system:     buildSystemPrompt(userContext),
      messages:   [...history, { role: 'user', content: message }],
    });
    const rawText = response.content[0].type === 'text' ? response.content[0].text : '';
    const parsed  = parseResponse(rawText);
    await saveMessage(userId, 'assistant', parsed.message, parsed.action?.type, parsed.action?.payload);
    res.json({ message: parsed.message, action: parsed.action });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get response from Atlas AI' });
  }
});

router.post('/action', requireAuth, async (req, res) => {
  const { userId, messageId, status, action } = req.body;
  if (!userId || !status || !action) return res.status(400).json({ error: 'Missing required fields' });
  if (userId !== req.authUserId) return res.status(403).json({ error: 'Forbidden' });
  if (!['accepted', 'declined'].includes(status)) return res.status(400).json({ error: 'status must be accepted or declined' });
  if (action.type && !VALID_ACTION_TYPES.has(action.type)) return res.status(400).json({ error: 'Invalid action type' });
  try {
    if (status === 'accepted') {
      if (action.type === 'ADD_NOTE' || action.type === 'SCHEDULE_REST') {
        await supabase.from('user_notes').insert({
          user_id: userId, note_type: action.type, content: action.description,
        });
      } else {
        await supabase.from('plan_overrides').insert({
          user_id: userId, override_type: action.type, payload: action.payload,
        });
      }
    }
    if (messageId) {
      await supabase.from('chat_messages').update({ action_status: status }).eq('id', messageId);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Action error:', error);
    res.status(500).json({ error: 'Failed to process action' });
  }
});

module.exports = { chatRouter: router };