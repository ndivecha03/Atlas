import { supabase } from './supabase';
import { UserTheme } from '../theme/types';

// ─── Auth ─────────────────────────────────────

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// ─── Profile ──────────────────────────────────

export interface ProfileData {
  name: string;
  age: number;
  gender_identity: string;
  training_type: string;
  experience_level: string;
  primary_goal: string;
}

export async function saveProfile(userId: string, profile: ProfileData) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profile });
  if (error) throw error;
}

export async function loadProfile(userId: string): Promise<ProfileData | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

// ─── Theme ────────────────────────────────────

export async function saveTheme(userId: string, theme: UserTheme) {
  const { error } = await supabase
    .from('user_themes')
    .upsert({ id: userId, theme_data: theme, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function loadTheme(userId: string): Promise<UserTheme | null> {
  const { data, error } = await supabase
    .from('user_themes')
    .select('theme_data')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data.theme_data as UserTheme;
}