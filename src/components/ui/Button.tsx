import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { usePalette, useShape } from '../../theme/ThemeContext';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
}

export const Button = ({ label, onPress, variant = 'primary', disabled = false }: ButtonProps) => {
  const palette = usePalette();
  const shape   = useShape();

  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: isPrimary ? palette.accentEffective : 'transparent',
        borderWidth: isPrimary ? 0 : 1.5,
        borderColor: palette.accentEffective,
        borderRadius: shape.buttonRadius,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: 'center',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Text style={{
        color: isPrimary ? palette.textOnAccent : palette.accentEffective,
        fontSize: 16,
        fontWeight: '600',
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
