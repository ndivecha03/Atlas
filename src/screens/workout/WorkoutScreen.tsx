import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { usePalette, useSpacing, useShape } from '../../theme/ThemeContext';
import { EXERCISES, WORKOUT_TEMPLATES, Exercise } from '../../data/exercises';

// ─── Types ────────────────────────────────────
interface LoggedSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

interface ActiveExercise {
  exercise: Exercise;
  sets: LoggedSet[];
}

// ─── Rest Timer ───────────────────────────────
const RestTimer = ({ seconds, onDone }: { seconds: number; onDone: () => void }) => {
  const palette  = usePalette();
  const shape    = useShape();
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    if (time <= 0) { onDone(); return; }
    const t = setTimeout(() => setTime(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [time]);

  const pct = time / seconds;
  const mins = Math.floor(time / 60);
  const secs = time % 60;

  return (
    <View style={{ alignItems: 'center', padding: 20 }}>
      <Text style={{ color: palette.textMuted, fontSize: 13, fontWeight: '600', letterSpacing: 1.5, marginBottom: 12 }}>
        REST
      </Text>
      <Text style={{ color: palette.accentEffective, fontSize: 52, fontWeight: '700' }}>
        {mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`}
      </Text>
      <View style={{ width: 200, height: 4, backgroundColor: palette.border, borderRadius: 2, marginTop: 16 }}>
        <View style={{ width: `${pct * 100}%`, height: 4, backgroundColor: palette.accentEffective, borderRadius: 2 }} />
      </View>
      <TouchableOpacity
        onPress={onDone}
        style={{ marginTop: 20, paddingHorizontal: 24, paddingVertical: 10, borderRadius: shape.buttonRadius, borderWidth: 1, borderColor: palette.border }}
      >
        <Text style={{ color: palette.textMuted, fontSize: 14 }}>Skip rest</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Set Row ──────────────────────────────────
const SetRow = ({
  set,
  exerciseName,
  onComplete,
}: {
  set: LoggedSet;
  exerciseName: string;
  onComplete: (weight: number, reps: number) => void;
}) => {
  const palette = usePalette();
  const shape   = useShape();
  const [weight, setWeight] = useState(set.weightKg.toString());
  const [reps,   setReps]   = useState(set.reps.toString());

  const inputStyle = {
    backgroundColor: palette.statBackground,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: shape.inputRadius,
    padding: 10,
    fontSize: 18,
    fontWeight: '700' as const,
    color: palette.text,
    textAlign: 'center' as const,
    width: 80,
  };

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      gap: 12,
      opacity: set.completed ? 0.5 : 1,
    }}>
      <Text style={{ color: palette.textMuted, fontSize: 14, width: 32, textAlign: 'center' }}>
        {set.setNumber}
      </Text>
      <View style={{ flex: 1, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            editable={!set.completed}
            style={inputStyle}
          />
          <Text style={{ color: palette.textMuted, fontSize: 10, marginTop: 3 }}>kg</Text>
        </View>
        <Text style={{ color: palette.textMuted, fontSize: 18 }}>×</Text>
        <View style={{ alignItems: 'center' }}>
          <TextInput
            value={reps}
            onChangeText={setReps}
            keyboardType="number-pad"
            editable={!set.completed}
            style={inputStyle}
          />
          <Text style={{ color: palette.textMuted, fontSize: 10, marginTop: 3 }}>reps</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onComplete(parseFloat(weight) || 0, parseInt(reps) || 0)}
        disabled={set.completed}
        style={{
          backgroundColor: set.completed ? palette.success : palette.accentEffective,
          borderRadius: shape.buttonRadius,
          paddingHorizontal: 16,
          paddingVertical: 10,
          minWidth: 64,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: set.completed ? '#fff' : palette.textOnAccent, fontWeight: '700', fontSize: 13 }}>
          {set.completed ? '✓' : 'Done'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Exercise Card ────────────────────────────
const ExerciseCard = ({
  activeExercise,
  onSetComplete,
  isExpanded,
  onToggle,
}: {
  activeExercise: ActiveExercise;
  onSetComplete: (setIndex: number, weight: number, reps: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const palette = usePalette();
  const shape   = useShape();
  const spacing = useSpacing();

  const completedSets = activeExercise.sets.filter(s => s.completed).length;
  const allDone       = completedSets === activeExercise.sets.length;

  return (
    <View style={{
      backgroundColor: palette.surface,
      borderRadius: shape.cardRadius,
      borderWidth: 1,
      borderColor: allDone ? palette.success : isExpanded ? palette.accentEffective : palette.border,
      marginBottom: spacing.cardGap,
      overflow: 'hidden',
    }}>
      <TouchableOpacity
        onPress={onToggle}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: spacing.cardPadding,
        }}
      >
        <View>
          <Text style={{ color: palette.text, fontSize: 16, fontWeight: '600' }}>
            {activeExercise.exercise.name}
          </Text>
          <Text style={{ color: palette.textMuted, fontSize: 13, marginTop: 2 }}>
            {completedSets} / {activeExercise.sets.length} sets
            {allDone ? ' · Complete' : ''}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {allDone && (
            <View style={{ backgroundColor: palette.success, borderRadius: shape.badgeRadius, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>DONE</Text>
            </View>
          )}
          <Text style={{ color: palette.textMuted, fontSize: 18 }}>
            {isExpanded ? '∧' : '∨'}
          </Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={{ paddingHorizontal: spacing.cardPadding, paddingBottom: spacing.cardPadding }}>
          <View style={{ flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: palette.border }}>
            <Text style={{ color: palette.textMuted, fontSize: 12, width: 32, textAlign: 'center' }}>SET</Text>
            <Text style={{ color: palette.textMuted, fontSize: 12, flex: 1, textAlign: 'center' }}>WEIGHT × REPS</Text>
            <Text style={{ color: palette.textMuted, fontSize: 12, width: 64, textAlign: 'center' }}>LOG</Text>
          </View>
          {activeExercise.sets.map((set, i) => (
            <SetRow
              key={i}
              set={set}
              exerciseName={activeExercise.exercise.name}
              onComplete={(w, r) => onSetComplete(i, w, r)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// ─── Session Summary ──────────────────────────
const SessionSummary = ({
  exercises,
  duration,
  onDone,
}: {
  exercises: ActiveExercise[];
  duration: number;
  onDone: () => void;
}) => {
  const palette = usePalette();
  const spacing = useSpacing();
  const shape   = useShape();

  const totalSets    = exercises.reduce((n, e) => n + e.sets.filter(s => s.completed).length, 0);
  const totalVolume  = exercises.reduce((n, e) => n + e.sets.filter(s => s.completed).reduce((v, s) => v + s.weightKg * s.reps, 0), 0);
  const mins         = Math.floor(duration / 60);

  return (
    <View style={{ flex: 1, backgroundColor: palette.background, padding: spacing.screenPadding, paddingTop: 80 }}>
      <Text style={{ color: palette.accentEffective, fontSize: 13, fontWeight: '600', letterSpacing: 2, marginBottom: 16 }}>
        SESSION COMPLETE
      </Text>
      <Text style={{ color: palette.text, fontSize: 36, fontWeight: '700', marginBottom: 32 }}>
        Great work.
      </Text>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
        {[
          { value: `${mins}m`,             label: 'Duration'     },
          { value: totalSets.toString(),   label: 'Sets logged'  },
          { value: `${Math.round(totalVolume)}kg`, label: 'Total volume' },
        ].map((s, i) => (
          <View key={i} style={{
            flex: 1, backgroundColor: palette.statBackground,
            borderRadius: shape.cardRadius, padding: 14, alignItems: 'center',
          }}>
            <Text style={{ color: palette.accentEffective, fontSize: 22, fontWeight: '700' }}>{s.value}</Text>
            <Text style={{ color: palette.textMuted, fontSize: 12, marginTop: 4 }}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={{ color: palette.textMuted, fontSize: 13, fontWeight: '600', letterSpacing: 1.5, marginBottom: 12 }}>
        EXERCISES
      </Text>
      {exercises.map((e, i) => {
        const done = e.sets.filter(s => s.completed);
        if (done.length === 0) return null;
        return (
          <View key={i} style={{
            backgroundColor: palette.surface, borderRadius: shape.cardRadius,
            borderWidth: 1, borderColor: palette.border, padding: 14, marginBottom: 8,
            flexDirection: 'row', justifyContent: 'space-between',
          }}>
            <Text style={{ color: palette.text, fontSize: 14, fontWeight: '600' }}>{e.exercise.name}</Text>
            <Text style={{ color: palette.textMuted, fontSize: 13 }}>
              {done.length} sets · {Math.round(done.reduce((v, s) => v + s.weightKg * s.reps, 0))}kg
            </Text>
          </View>
        );
      })}

      <TouchableOpacity
        onPress={onDone}
        style={{
          backgroundColor: palette.accentEffective, borderRadius: shape.buttonRadius,
          padding: 16, alignItems: 'center', marginTop: 24,
        }}
      >
        <Text style={{ color: palette.textOnAccent, fontSize: 16, fontWeight: '700' }}>
          Back to dashboard
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Main Workout Screen ──────────────────────
export const WorkoutScreen = () => {
  const palette = usePalette();
  const spacing = useSpacing();
  const shape   = useShape();

  const [phase, setPhase]         = useState<'list' | 'active' | 'rest' | 'summary'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<typeof WORKOUT_TEMPLATES[0] | null>(null);
  const [activeExercises,  setActiveExercises]  = useState<ActiveExercise[]>([]);
  const [expandedIndex,    setExpandedIndex]    = useState<number>(0);
  const [lastSetInfo,      setLastSetInfo]       = useState<{ restSeconds: number } | null>(null);
  const [sessionStart,     setSessionStart]      = useState<number>(0);
  const [duration,         setDuration]          = useState<number>(0);

  // Session timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (phase === 'active') {
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - sessionStart) / 1000));
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, sessionStart]);

  const startWorkout = (template: typeof WORKOUT_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    const exercises: ActiveExercise[] = template.exercises
      .map(id => EXERCISES.find(e => e.id === id))
      .filter(Boolean)
      .map(ex => ({
        exercise: ex!,
        sets: Array.from({ length: ex!.defaultSets }, (_, i) => ({
          setNumber:  i + 1,
          weightKg:   ex!.defaultWeightKg,
          reps:       ex!.defaultReps,
          completed:  false,
        })),
      }));
    setActiveExercises(exercises);
    setExpandedIndex(0);
    setSessionStart(Date.now());
    setPhase('active');
  };

  const handleSetComplete = (exerciseIndex: number, setIndex: number, weight: number, reps: number) => {
    setActiveExercises(prev => {
      const updated = [...prev];
      updated[exerciseIndex] = {
        ...updated[exerciseIndex],
        sets: updated[exerciseIndex].sets.map((s, i) =>
          i === setIndex ? { ...s, weightKg: weight, reps, completed: true } : s
        ),
      };
      return updated;
    });
    // Auto-advance to next exercise when all sets done
    const ex = activeExercises[exerciseIndex];
    const remainingSets = ex.sets.filter((s, i) => i !== setIndex && !s.completed).length;
    if (remainingSets === 0 && exerciseIndex < activeExercises.length - 1) {
      setTimeout(() => setExpandedIndex(exerciseIndex + 1), 300);
    }
    // Start rest timer
    setLastSetInfo({ restSeconds: 90 });
    setPhase('rest');
  };

  const finishWorkout = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('summary');
  };

  const allComplete = activeExercises.length > 0 &&
    activeExercises.every(e => e.sets.every(s => s.completed));

  const mins = Math.floor(duration / 60);
  const secs = duration % 60;

  // ── Summary ──
  if (phase === 'summary') {
    return (
      <SessionSummary
        exercises={activeExercises}
        duration={duration}
        onDone={() => { setPhase('list'); setSelectedTemplate(null); }}
      />
    );
  }

  // ── Active session ──
  if (phase === 'active' || phase === 'rest') {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: palette.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Session header */}
        <View style={{
          backgroundColor: palette.surface,
          borderBottomWidth: 1,
          borderBottomColor: palette.border,
          padding: spacing.screenPadding,
          paddingTop: 52,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <View>
            <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '600' }}>ACTIVE SESSION</Text>
            <Text style={{ color: palette.text, fontSize: 18, fontWeight: '700', marginTop: 2 }}>
              {selectedTemplate?.name}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: palette.accentEffective, fontSize: 22, fontWeight: '700' }}>
              {mins}:{secs.toString().padStart(2, '0')}
            </Text>
            <TouchableOpacity onPress={finishWorkout}>
              <Text style={{ color: palette.danger, fontSize: 13, fontWeight: '600', marginTop: 4 }}>
                Finish
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rest timer modal */}
        {phase === 'rest' && lastSetInfo && (
          <View style={{
            backgroundColor: palette.surface,
            borderBottomWidth: 1,
            borderBottomColor: palette.border,
          }}>
            <RestTimer
              seconds={lastSetInfo.restSeconds}
              onDone={() => setPhase('active')}
            />
          </View>
        )}

        <ScrollView
          contentContainerStyle={{ padding: spacing.screenPadding, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {activeExercises.map((ae, i) => (
            <ExerciseCard
              key={i}
              activeExercise={ae}
              onSetComplete={(setIndex, w, r) => handleSetComplete(i, setIndex, w, r)}
              isExpanded={expandedIndex === i}
              onToggle={() => setExpandedIndex(expandedIndex === i ? -1 : i)}
            />
          ))}

          {allComplete && (
            <TouchableOpacity
              onPress={finishWorkout}
              style={{
                backgroundColor: palette.success,
                borderRadius: shape.buttonRadius,
                padding: 16,
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                Complete workout
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ── Workout list ──
  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.screenPadding, paddingTop: 60, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: palette.accentEffective, fontSize: 13, fontWeight: '600', letterSpacing: 2, marginBottom: 12 }}>
          ATLAS
        </Text>
        <Text style={{ color: palette.text, fontSize: 32, fontWeight: '700', marginBottom: 4 }}>
          Workouts
        </Text>
        <Text style={{ color: palette.textMuted, fontSize: 15, marginBottom: 32 }}>
          Choose a session to start logging.
        </Text>

        <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 14 }}>
          TODAY'S PLAN
        </Text>
        {WORKOUT_TEMPLATES.slice(0, 1).map(template => (
          <TouchableOpacity
            key={template.id}
            onPress={() => startWorkout(template)}
            style={{
              backgroundColor: palette.accentEffective,
              borderRadius: shape.cardRadius,
              padding: spacing.cardPadding + 4,
              marginBottom: spacing.sectionGap,
            }}
          >
            <Text style={{ color: palette.textOnAccent, fontSize: 12, fontWeight: '700', letterSpacing: 1.5 }}>
              RECOMMENDED
            </Text>
            <Text style={{ color: palette.textOnAccent, fontSize: 22, fontWeight: '700', marginTop: 6 }}>
              {template.name}
            </Text>
            <Text style={{ color: palette.textOnAccent, opacity: 0.8, fontSize: 14, marginTop: 4 }}>
              {template.exercises.length} exercises · ~{template.estimatedMinutes} min · {template.level}
            </Text>
            <View style={{
              marginTop: 16, backgroundColor: 'rgba(0,0,0,0.15)',
              borderRadius: shape.buttonRadius, paddingVertical: 10, alignItems: 'center',
            }}>
              <Text style={{ color: palette.textOnAccent, fontSize: 15, fontWeight: '700' }}>
                Start session
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 14 }}>
          ALL WORKOUTS
        </Text>
        {WORKOUT_TEMPLATES.map(template => (
          <TouchableOpacity
            key={template.id}
            onPress={() => startWorkout(template)}
            style={{
              backgroundColor: palette.surface,
              borderRadius: shape.cardRadius,
              borderWidth: 1,
              borderColor: palette.border,
              padding: spacing.cardPadding,
              marginBottom: spacing.cardGap,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text style={{ color: palette.text, fontSize: 16, fontWeight: '600' }}>
                {template.name}
              </Text>
              <Text style={{ color: palette.textMuted, fontSize: 13, marginTop: 3 }}>
                {template.exercises.length} exercises · ~{template.estimatedMinutes} min
              </Text>
            </View>
            <Text style={{ color: palette.accentEffective, fontSize: 22 }}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
