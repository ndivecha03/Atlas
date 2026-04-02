import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { usePalette, useSpacing, useShape } from '../../theme/ThemeContext';
import { Button } from '../../components/ui/Button';
import { signIn, signUp } from '../../api/auth';

interface Props {
  onAuthSuccess: (userId: string, isNewUser: boolean) => void;
}

export const AuthScreen = ({ onAuthSuccess }: Props) => {
  const palette = usePalette();
  const spacing = useSpacing();
  const shape   = useShape();

  const [mode,     setMode]     = useState<'signin' | 'signup'>('signup');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const data = await signUp(email, password);
        if (data.user) onAuthSuccess(data.user.id, true);
      } else {
        const data = await signIn(email, password);
        if (data.user) onAuthSuccess(data.user.id, false);
      }
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: palette.surface,
    borderWidth: 1.5,
    borderColor: palette.border,
    borderRadius: shape.inputRadius,
    padding: 14,
    fontSize: 16,
    color: palette.text,
    marginBottom: 14,
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: palette.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: spacing.screenPadding, paddingTop: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={{ fontSize: 13, color: palette.accentEffective, fontWeight: '600', letterSpacing: 2, marginBottom: 12 }}>
          ATLAS
        </Text>
        <Text style={{ fontSize: 36, color: palette.text, fontWeight: '700', marginBottom: 8 }}>
          {mode === 'signup' ? 'Create account' : 'Welcome back'}
        </Text>
        <Text style={{ fontSize: 16, color: palette.textMuted, marginBottom: 40, lineHeight: 24 }}>
          {mode === 'signup'
            ? 'Your personalized training platform.'
            : 'Sign in to continue your training.'}
        </Text>

        {/* Inputs */}
        <Text style={{ fontSize: 13, color: palette.textMuted, fontWeight: '600', marginBottom: 8 }}>
          EMAIL
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={palette.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          style={inputStyle}
        />

        <Text style={{ fontSize: 13, color: palette.textMuted, fontWeight: '600', marginBottom: 8 }}>
          PASSWORD
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Min. 6 characters"
          placeholderTextColor={palette.textMuted}
          secureTextEntry
          style={inputStyle}
        />

        {/* Error */}
        {error ? (
          <Text style={{ color: palette.danger, fontSize: 14, marginBottom: 16 }}>
            {error}
          </Text>
        ) : null}

        {/* Submit */}
        <View style={{ marginTop: 8, marginBottom: 24 }}>
          {loading ? (
            <ActivityIndicator color={palette.accentEffective} size="large" />
          ) : (
            <Button
              label={mode === 'signup' ? 'Create account' : 'Sign in'}
              onPress={handleSubmit}
            />
          )}
        </View>

        {/* Toggle mode */}
        <TouchableOpacity onPress={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); }}>
          <Text style={{ color: palette.textMuted, fontSize: 14, textAlign: 'center' }}>
            {mode === 'signup'
              ? 'Already have an account? '
              : 'Don\'t have an account? '}
            <Text style={{ color: palette.accentEffective, fontWeight: '600' }}>
              {mode === 'signup' ? 'Sign in' : 'Sign up'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

