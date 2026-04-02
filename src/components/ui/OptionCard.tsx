import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { usePalette, useShape } from '../../theme/ThemeContext';

interface OptionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

export const OptionCard = ({ label, description, selected, onPress }: OptionCardProps) => {
  const palette = usePalette();
  const shape   = useShape();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: selected ? palette.accentEffective : palette.surface,
        borderWidth: 1.5,
        borderColor: selected ? palette.accentEffective : palette.border,
        borderRadius: shape.cardRadius,
        padding: 16,
        marginBottom: 10,
      }}
    >
      <Text style={{
        color: selected ? palette.textOnAccent : palette.text,
        fontSize: 16,
        fontWeight: '600',
      }}>
        {label}
      </Text>
      {description && (
        <Text style={{
          color: selected ? palette.textOnAccent : palette.textMuted,
          fontSize: 13,
          marginTop: 4,
        }}>
          {description}
        </Text>
      )}
    </TouchableOpacity>
  );
};
