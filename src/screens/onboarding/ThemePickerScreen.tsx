import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { usePalette, useSpacing, useTheme } from '../../theme/ThemeContext';
import { Button } from '../../components/ui/Button';
import { UserTheme } from '../../theme/types';

interface Props {
  variants: [UserTheme, UserTheme, UserTheme];
  onSelect: (theme: UserTheme) => void;
  onBack: () => void;
}

const VARIANT_LABELS = ['Bold', 'Balanced', 'Soft'];
const VARIANT_DESCRIPTIONS = [
  'High contrast, striking, made to stand out',
  'The signature look Atlas designed for you',
  'Clean, light, easy on the eyes',
];

export const ThemePickerScreen = ({ variants, onSelect, onBack }: Props) => {
  const palette = usePalette();
  const spacing = useSpacing();
  const [selected, setSelected] = useState<number>(1);

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.screenPadding, paddingTop: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 13, color: palette.accentEffective, fontWeight: '600', letterSpacing: 2, marginBottom: 12 }}>
          STEP 4 OF 4
        </Text>
        <Text style={{ fontSize: 32, color: palette.text, fontWeight: '700', marginBottom: 8 }}>
          Your Atlas identity
        </Text>
        <Text style={{ fontSize: 16, color: palette.textMuted, marginBottom: 12, lineHeight: 24 }}>
          Based on your profile, we generated three versions of your personal theme. Pick the one that feels like you.
        </Text>
        <Text style={{ fontSize: 14, color: palette.accentEffective, marginBottom: 32 }}>
          Theme family: {variants[0].family.charAt(0).toUpperCase() + variants[0].family.slice(1)}
        </Text>

        {/* Variant cards */}
        {variants.map((variant, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setSelected(i)}
            style={{
              backgroundColor: variant.palette.background,
              borderWidth: selected === i ? 2 : 1,
              borderColor: selected === i ? variant.palette.accentEffective : variant.palette.border,
              borderRadius: variant.shape.cardRadius,
              padding: 20,
              marginBottom: 16,
            }}
          >
            {/* Variant header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ color: variant.palette.text, fontSize: 18, fontWeight: '700' }}>
                {VARIANT_LABELS[i]}
              </Text>
              {selected === i && (
                <View style={{ backgroundColor: variant.palette.accentEffective, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ color: variant.palette.textOnAccent, fontSize: 11, fontWeight: '700' }}>
                    SELECTED
                  </Text>
                </View>
              )}
            </View>

            <Text style={{ color: variant.palette.textMuted, fontSize: 13, marginBottom: 16 }}>
              {VARIANT_DESCRIPTIONS[i]}
            </Text>

            {/* Color swatches */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              {[
                variant.palette.background,
                variant.palette.surface,
                variant.palette.accentEffective,
                variant.palette.text,
                variant.palette.textMuted,
              ].map((color, j) => (
                <View key={j} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: color, borderWidth: 1, borderColor: variant.palette.border }} />
              ))}
            </View>

            {/* Stat preview */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {['Strength', 'Volume', 'Streak'].map((label, j) => (
                <View key={j} style={{ flex: 1, backgroundColor: variant.palette.statBackground, borderRadius: variant.shape.cardRadius, padding: 10, alignItems: 'center' }}>
                  <Text style={{ color: variant.palette.accentEffective, fontSize: 16, fontWeight: '700' }}>
                    {['↑12%', '18', '7d'][j]}
                  </Text>
                  <Text style={{ color: variant.palette.textMuted, fontSize: 10, marginTop: 2 }}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ marginTop: 8, gap: 12, marginBottom: 40 }}>
          <Button
            label="This is my Atlas"
            onPress={() => onSelect(variants[selected])}
          />
          <Button label="Back" onPress={onBack} variant="outline" />
        </View>
      </ScrollView>
    </View>
  );
};

