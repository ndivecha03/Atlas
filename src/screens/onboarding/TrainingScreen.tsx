import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { usePalette, useSpacing } from '../../theme/ThemeContext';
import { OptionCard } from '../../components/ui/OptionCard';
import { Button } from '../../components/ui/Button';
import { TrainingType, ExperienceLevel } from '../../theme/types';

interface TrainingData {
  trainingType: TrainingType | null;
  experienceLevel: ExperienceLevel | null;
}

interface Props {
  onNext: (data: TrainingData) => void;
  onBack: () => void;
}

const TRAINING_OPTIONS: { label: string; description: string; value: TrainingType }[] = [
  { label: 'Strength training',  description: 'Barbells, powerlifting, heavy lifting',  value: 'strength'      },
  { label: 'Bodybuilding',       description: 'Hypertrophy, aesthetics, muscle mass',    value: 'hypertrophy'   },
  { label: 'Powerlifting',       description: 'Squat, bench, deadlift competition',      value: 'powerlifting'  },
  { label: 'HIIT',               description: 'High intensity intervals, circuits',      value: 'hiit'          },
  { label: 'Endurance',          description: 'Running, cycling, swimming',              value: 'endurance'     },
  { label: 'Yoga',               description: 'Flexibility, mindfulness, mobility',      value: 'yoga'          },
  { label: 'Cross-training',     description: 'Mix of strength and cardio',              value: 'crossTraining' },
  { label: 'Weight loss',        description: 'Cardio-focused, calorie burn',            value: 'weightLoss'    },
  { label: 'General wellness',   description: 'Stay active, feel good',                  value: 'wellness'      },
];

const EXPERIENCE_OPTIONS: { label: string; description: string; value: ExperienceLevel }[] = [
  { label: 'Beginner',      description: 'Less than 1 year of consistent training',  value: 'beginner'      },
  { label: 'Intermediate',  description: '1–3 years of consistent training',         value: 'intermediate'  },
  { label: 'Advanced',      description: '3+ years, I know what I\'m doing',        value: 'advanced'      },
];

export const TrainingScreen = ({ onNext, onBack }: Props) => {
  const palette = usePalette();
  const spacing = useSpacing();

  const [trainingType,    setTrainingType]    = useState<TrainingType | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);

  const canProceed = trainingType !== null && experienceLevel !== null;

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.screenPadding, paddingTop: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={{ fontSize: 13, color: palette.accentEffective, fontWeight: '600', letterSpacing: 2, marginBottom: 12 }}>
          STEP 2 OF 4
        </Text>
        <Text style={{ fontSize: 32, color: palette.text, fontWeight: '700', marginBottom: 8 }}>
          How do you train?
        </Text>
        <Text style={{ fontSize: 16, color: palette.textMuted, marginBottom: 40, lineHeight: 24 }}>
          This determines your program structure and the intensity of your Atlas experience.
        </Text>

        {/* Training type */}
        <Text style={{ fontSize: 14, color: palette.textMuted, fontWeight: '600', marginBottom: 12 }}>
          PRIMARY TRAINING STYLE
        </Text>
        {TRAINING_OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={trainingType === opt.value}
            onPress={() => setTrainingType(opt.value)}
          />
        ))}

        {/* Experience */}
        <Text style={{ fontSize: 14, color: palette.textMuted, fontWeight: '600', marginBottom: 12, marginTop: 32 }}>
          EXPERIENCE LEVEL
        </Text>
        {EXPERIENCE_OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={experienceLevel === opt.value}
            onPress={() => setExperienceLevel(opt.value)}
          />
        ))}

        {/* Navigation */}
        <View style={{ marginTop: 32, gap: 12, marginBottom: 40 }}>
          <Button
            label="Continue"
            onPress={() => onNext({ trainingType, experienceLevel })}
            disabled={!canProceed}
          />
          <Button label="Back" onPress={onBack} variant="outline" />
        </View>
      </ScrollView>
    </View>
  );
};
