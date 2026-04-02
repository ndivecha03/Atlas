import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { usePalette, useSpacing, useShape, useTheme } from '../../theme/ThemeContext';

interface Props {
  onBack: () => void;
}

const PRESET_ACCENTS = [
  '#c8ff00', '#ff5c35', '#a78bfa', '#38bdf8',
  '#ffd700', '#2d9e6b', '#f97316', '#e8604c',
  '#9b59b6', '#ff4466', '#00d4aa', '#ff8c00',
];

export const SettingsScreen = ({ onBack }: Props) => {
  const palette  = usePalette();
  const spacing  = useSpacing();
  const shape    = useShape();
  const { theme, setAccentColor, resetAccent } = useTheme();

  const [customHex, setCustomHex] = useState('');
  const [hexError,  setHexError]  = useState('');

  const isValidHex = (hex: string) => /^#[0-9A-Fa-f]{6}$/.test(hex);

  const handleCustomHex = () => {
    const val = customHex.startsWith('#') ? customHex : `#${customHex}`;
    if (!isValidHex(val)) {
      setHexError('Enter a valid 6-digit hex color, e.g. #ff5500');
      return;
    }
    setHexError('');
    setAccentColor(val);
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.screenPadding, paddingTop: 60, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 24 }}>
          <Text style={{ color: palette.accentEffective, fontSize: 14, fontWeight: '600' }}>
            ← Back
          </Text>
        </TouchableOpacity>

        <Text style={{ color: palette.accentEffective, fontSize: 13, fontWeight: '600', letterSpacing: 2, marginBottom: 12 }}>
          APPEARANCE
        </Text>
        <Text style={{ color: palette.text, fontSize: 28, fontWeight: '700', marginBottom: 4 }}>
          Accent color
        </Text>
        <Text style={{ color: palette.textMuted, fontSize: 15, marginBottom: 32, lineHeight: 22 }}>
          Choose a color that represents you. Atlas will automatically ensure it's readable against your theme.
        </Text>

        {/* Current accent preview */}
        <View style={{
          backgroundColor: palette.surface,
          borderRadius: shape.cardRadius,
          borderWidth: 1,
          borderColor: palette.border,
          padding: spacing.cardPadding,
          marginBottom: 28,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        }}>
          <View style={{
            width: 48,
            height: 48,
            borderRadius: shape.cardRadius,
            backgroundColor: palette.accentEffective,
          }} />
          <View>
            <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '600' }}>CURRENT ACCENT</Text>
            <Text style={{ color: palette.text, fontSize: 18, fontWeight: '700', marginTop: 2 }}>
              {palette.accentOverride ?? palette.accent}
            </Text>
            {palette.accentOverride && palette.accentOverride !== palette.accentEffective && (
              <Text style={{ color: palette.textMuted, fontSize: 11, marginTop: 2 }}>
                Auto-adjusted for readability → {palette.accentEffective}
              </Text>
            )}
          </View>
        </View>

        {/* Preset swatches */}
        <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 14 }}>
          PRESETS
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
          {PRESET_ACCENTS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setAccentColor(color)}
              style={{
                width: 44,
                height: 44,
                borderRadius: shape.cardRadius,
                backgroundColor: color,
                borderWidth: palette.accentEffective === color ? 3 : 1,
                borderColor: palette.accentEffective === color ? palette.text : palette.border,
              }}
            />
          ))}
        </View>

        {/* Custom hex input */}
        <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 }}>
          CUSTOM HEX CODE
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 8 }}>
          <TextInput
            value={customHex}
            onChangeText={(t) => { setCustomHex(t); setHexError(''); }}
            placeholder="#ff5500"
            placeholderTextColor={palette.textMuted}
            style={{
              flex: 1,
              backgroundColor: palette.surface,
              borderWidth: 1.5,
              borderColor: hexError ? palette.danger : palette.border,
              borderRadius: shape.inputRadius,
              padding: 12,
              fontSize: 16,
              color: palette.text,
              fontFamily: 'monospace',
            }}
          />
          <TouchableOpacity
            onPress={handleCustomHex}
            style={{
              backgroundColor: palette.accentEffective,
              borderRadius: shape.buttonRadius,
              paddingHorizontal: 18,
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: palette.textOnAccent, fontWeight: '700', fontSize: 14 }}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>
        {hexError ? (
          <Text style={{ color: palette.danger, fontSize: 13, marginBottom: 12 }}>{hexError}</Text>
        ) : null}

        {/* Reset */}
        {palette.accentOverride && (
          <TouchableOpacity
            onPress={resetAccent}
            style={{ marginTop: 16, alignItems: 'center' }}
          >
            <Text style={{ color: palette.textMuted, fontSize: 14 }}>
              Reset to generated accent
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

