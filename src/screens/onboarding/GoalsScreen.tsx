import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { usePalette, useSpacing } from '../../theme/ThemeContext';
import { OptionCard } from '../../components/ui/OptionCard';
import { Button } from '../../components/ui/Button';
import { FitnessGoal } from '../../theme/types';

interface Props {
  onNext: (goal: FitnessGoal) => void;
  onBack: () => void;
}

const GOAL_OPTIONS: { label: string; description: string; value: FitnessGoal }[] = [
  { label: 'Build muscle',        description: 'Increase size and definition',           value: 'buildMuscle'       },
  { label: 'Lose weight',         description: 'Reduce body fat, improve composition',   value: 'loseWeight'        },
  { label: 'Improve endurance',   description: 'Run further, last longer',               value: 'improveEndurance'  },
  { label: 'Increase strength',   description: 'Lift heavier, get stronger',             value: 'increaseStrength'  },
  { label: 'Flexibility',         description: 'Move better, reduce injury risk',        value: 'flexibility'       },
  { label: 'General wellness',    description: 'Feel better, stay consistent',           value: 'generalWellness'   },
];

export const GoalsScreen = ({ onNext, onBack }: Props) => {
  const palette = usePalette();
  const spacing = useSpacing();

  const [goal, setGoal] = useState<FitnessGoal | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.screenPadding, paddingTop: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 13, color: palette.accentEffective, fontWeight: '600', letterSpacing: 2, marginBottom: 12 }}>
          STEP 3 OF 4
        </Text>
        <Text style={{ fontSize: 32, color: palette.text, fontWeight: '700', marginBottom: 8 }}>
          What's your main goal?
        </Text>
        <Text style={{ fontSize: 16, color: palette.textMuted, marginBottom: 40, lineHeight: 24 }}>
          Your goal shapes everything — your plan, your metrics, and which stats Atlas puts front and center.
        </Text>

        {GOAL_OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={goal === opt.value}
            onPress={() => setGoal(opt.value)}
          />
        ))}

        <View style={{ marginTop: 32, gap: 12, marginBottom: 40 }}>
          <Button
            label="Generate my Atlas"
            onPress={() => onNext(goal!)}
            disabled={goal === null}
          />
          <Button label="Back" onPress={onBack} variant="outline" />
        </View>
      </ScrollView>
    </View>
  );
};
