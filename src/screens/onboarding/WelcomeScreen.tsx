import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { usePalette, useSpacing, useShape } from '../../theme/ThemeContext';
import { OptionCard } from '../../components/ui/OptionCard';
import { Button } from '../../components/ui/Button';
import { GenderIdentity } from '../../theme/types';

interface WelcomeData {
  name: string;
  age: string;
  genderIdentity: GenderIdentity | null;
}

interface Props {
  onNext: (data: WelcomeData) => void;
}

const GENDER_OPTIONS: { label: string; value: GenderIdentity }[] = [
  { label: 'Male',               value: 'male'            },
  { label: 'Female',             value: 'female'          },
  { label: 'Non-binary',         value: 'nonBinary'       },
  { label: 'Prefer not to say',  value: 'preferNotToSay'  },
];

export const WelcomeScreen = ({ onNext }: Props) => {
  const palette = usePalette();
  const spacing = useSpacing();
  const shape   = useShape();

  const [name,           setName]           = useState('');
  const [age,            setAge]            = useState('');
  const [genderIdentity, setGenderIdentity] = useState<GenderIdentity | null>(null);

  const canProceed = name.trim().length > 0 && age.trim().length > 0 && genderIdentity !== null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: palette.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: spacing.screenPadding, paddingTop: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={{ fontSize: 13, color: palette.accentEffective, fontWeight: '600', letterSpacing: 2, marginBottom: 12 }}>
          ATLAS
        </Text>
        <Text style={{ fontSize: 32, color: palette.text, fontWeight: '700', marginBottom: 8 }}>
          Let's get to know you
        </Text>
        <Text style={{ fontSize: 16, color: palette.textMuted, marginBottom: 40, lineHeight: 24 }}>
          Your answers shape everything — your training plan, your dashboard, even how the app looks.
        </Text>

        {/* Name */}
        <Text style={{ fontSize: 14, color: palette.textMuted, fontWeight: '600', marginBottom: 8 }}>
          YOUR NAME
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="First name"
          placeholderTextColor={palette.textMuted}
          style={{
            backgroundColor: palette.surface,
            borderWidth: 1.5,
            borderColor: name ? palette.accentEffective : palette.border,
            borderRadius: shape.inputRadius,
            padding: 14,
            fontSize: 16,
            color: palette.text,
            marginBottom: 24,
          }}
        />

        {/* Age */}
        <Text style={{ fontSize: 14, color: palette.textMuted, fontWeight: '600', marginBottom: 8 }}>
          YOUR AGE
        </Text>
        <TextInput
          value={age}
          onChangeText={setAge}
          placeholder="e.g. 28"
          placeholderTextColor={palette.textMuted}
          keyboardType="numeric"
          maxLength={3}
          style={{
            backgroundColor: palette.surface,
            borderWidth: 1.5,
            borderColor: age ? palette.accentEffective : palette.border,
            borderRadius: shape.inputRadius,
            padding: 14,
            fontSize: 16,
            color: palette.text,
            marginBottom: 24,
          }}
        />

        {/* Gender */}
        <Text style={{ fontSize: 14, color: palette.textMuted, fontWeight: '600', marginBottom: 12 }}>
          GENDER IDENTITY
        </Text>
        {GENDER_OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={genderIdentity === opt.value}
            onPress={() => setGenderIdentity(opt.value)}
          />
        ))}

        {/* Next */}
        <View style={{ marginTop: 32, marginBottom: 40 }}>
          <Button
            label="Continue"
            onPress={() => onNext({ name, age, genderIdentity: genderIdentity! })}
            disabled={!canProceed}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};