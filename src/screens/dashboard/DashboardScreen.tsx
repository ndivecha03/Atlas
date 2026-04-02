import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme, usePalette, useSpacing, useShape } from '../../theme/ThemeContext';

// ─── Stat Widget ─────────────────────────────
const StatWidget = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) => {
  const palette = usePalette();
  const shape   = useShape();
  const spacing = useSpacing();

  return (
    <View style={{
      flex: 1,
      backgroundColor: palette.statBackground,
      borderRadius: shape.cardRadius,
      padding: spacing.widgetPadding,
      alignItems: 'center',
    }}>
      <Text style={{ color: palette.accentEffective, fontSize: 22, fontWeight: '700' }}>
        {value}
      </Text>
      <Text style={{ color: palette.text, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
        {label}
      </Text>
      {sub && (
        <Text style={{ color: palette.textMuted, fontSize: 11, marginTop: 2 }}>
          {sub}
        </Text>
      )}
    </View>
  );
};

// ─── Section Header ───────────────────────────
const SectionHeader = ({ title }: { title: string }) => {
  const palette = usePalette();
  return (
    <Text style={{
      color: palette.textMuted,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1.5,
      marginBottom: 12,
      marginTop: 8,
    }}>
      {title.toUpperCase()}
    </Text>
  );
};

// ─── Progress Bar ─────────────────────────────
const ProgressBar = ({
  label,
  value,
  max,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  unit?: string;
}) => {
  const palette = usePalette();
  const shape   = useShape();
  const pct     = Math.min(value / max, 1);

  return (
    <View style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ color: palette.text, fontSize: 14 }}>{label}</Text>
        <Text style={{ color: palette.accentEffective, fontSize: 14, fontWeight: '600' }}>
          {value}{unit ?? ''}
        </Text>
      </View>
      <View style={{ height: 6, backgroundColor: palette.border, borderRadius: 3 }}>
        <View style={{
          height: 6,
          width: `${pct * 100}%`,
          backgroundColor: palette.accentEffective,
          borderRadius: 3,
        }} />
      </View>
    </View>
  );
};

// ─── Workout Card ─────────────────────────────
const WorkoutCard = ({
  title,
  subtitle,
  tag,
  onPress,
}: {
  title: string;
  subtitle: string;
  tag: string;
  onPress: () => void;
}) => {
  const palette = usePalette();
  const shape   = useShape();
  const spacing = useSpacing();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: palette.surface,
        borderRadius: shape.cardRadius,
        padding: spacing.cardPadding,
        marginBottom: spacing.cardGap,
        borderWidth: 1,
        borderColor: palette.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: palette.text, fontSize: 16, fontWeight: '600' }}>
          {title}
        </Text>
        <Text style={{ color: palette.textMuted, fontSize: 13, marginTop: 3 }}>
          {subtitle}
        </Text>
      </View>
      <View style={{
        backgroundColor: palette.statBackground,
        borderRadius: shape.badgeRadius,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}>
        <Text style={{ color: palette.accentEffective, fontSize: 12, fontWeight: '700' }}>
          {tag}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Dashboard ───────────────────────────
interface Props {
  userName: string;
  onStartWorkout: () => void;
}

export const DashboardScreen = ({ userName, onStartWorkout }: Props) => {
  const { theme }  = useTheme();
  const palette    = usePalette();
  const spacing    = useSpacing();
  const shape      = useShape();

  const widgetOrder = theme.widgetOrder;

  // Placeholder data — will come from WatermelonDB once wired
  const stats = {
    strength:        { value: '↑12%',  label: 'Strength',    sub: 'vs last month' },
    volume:          { value: '18',    label: 'Sessions',     sub: 'this month'    },
    consistency:     { value: '86%',   label: 'Consistency',  sub: '7-day streak'  },
    recovery:        { value: 'Good',  label: 'Recovery',     sub: 'HRV normal'    },
    cardio:          { value: '4.2km', label: 'Avg run',      sub: 'this week'     },
    bodyComposition: { value: '-1.2%', label: 'Body fat',     sub: 'this month'    },
    nutrition:       { value: '2,140', label: 'Avg kcal',     sub: 'last 7 days'   },
    sleep:           { value: '7.4h',  label: 'Sleep',        sub: 'avg last week' },
    hrv:             { value: '62ms',  label: 'HRV',          sub: 'resting'       },
  };

  // Render top 4 widgets based on theme's personalised order
  const topWidgets = widgetOrder
    .slice(0, 4)
    .filter(key => stats[key as keyof typeof stats])
    .map(key => stats[key as keyof typeof stats]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.screenPadding,
          paddingTop: 60,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <View>
            <Text style={{ color: palette.textMuted, fontSize: 14 }}>
              {greeting()}
            </Text>
            <Text style={{ color: palette.text, fontSize: 28, fontWeight: '700', marginTop: 2 }}>
              {userName}
            </Text>
          </View>
          {/* Theme family badge */}
          <View style={{
            backgroundColor: palette.statBackground,
            borderRadius: shape.badgeRadius,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderWidth: 1,
            borderColor: palette.border,
          }}>
            <Text style={{ color: palette.accentEffective, fontSize: 12, fontWeight: '700' }}>
              {theme.family.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Today's plan card */}
        <TouchableOpacity
          onPress={onStartWorkout}
          style={{
            backgroundColor: palette.accentEffective,
            borderRadius: shape.cardRadius,
            padding: spacing.cardPadding + 4,
            marginBottom: spacing.sectionGap,
          }}
        >
          <Text style={{ color: palette.textOnAccent, fontSize: 12, fontWeight: '700', letterSpacing: 1.5 }}>
            TODAY'S PLAN
          </Text>
          <Text style={{ color: palette.textOnAccent, fontSize: 22, fontWeight: '700', marginTop: 6 }}>
            Upper body strength
          </Text>
          <Text style={{ color: palette.textOnAccent, opacity: 0.8, fontSize: 14, marginTop: 4 }}>
            6 exercises · ~52 min · Intermediate
          </Text>
          <View style={{
            marginTop: 16,
            backgroundColor: 'rgba(0,0,0,0.15)',
            borderRadius: shape.buttonRadius,
            paddingVertical: 10,
            alignItems: 'center',
          }}>
            <Text style={{ color: palette.textOnAccent, fontSize: 15, fontWeight: '700' }}>
              Start workout
            </Text>
          </View>
        </TouchableOpacity>

        {/* Personalised stat widgets */}
        <SectionHeader title="Your stats" />
        <View style={{ flexDirection: 'row', gap: spacing.cardGap, marginBottom: spacing.sectionGap }}>
          {topWidgets.slice(0, 2).map((w, i) => (
            <StatWidget key={i} value={w.value} label={w.label} sub={w.sub} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.cardGap, marginBottom: spacing.sectionGap }}>
          {topWidgets.slice(2, 4).map((w, i) => (
            <StatWidget key={i} value={w.value} label={w.label} sub={w.sub} />
          ))}
        </View>

        {/* Weekly progress */}
        <SectionHeader title="Weekly progress" />
        <View style={{
          backgroundColor: palette.surface,
          borderRadius: shape.cardRadius,
          padding: spacing.cardPadding,
          borderWidth: 1,
          borderColor: palette.border,
          marginBottom: spacing.sectionGap,
        }}>
          <ProgressBar label="Sessions completed" value={3} max={5} unit=" / 5" />
          <ProgressBar label="Volume target"       value={14200} max={18000} unit="kg" />
          <ProgressBar label="Cardio goal"         value={12} max={20} unit="km" />
        </View>

        {/* Recent workouts */}
        <SectionHeader title="Recent workouts" />
        <WorkoutCard
          title="Upper body strength"
          subtitle="Yesterday · 54 min"
          tag="Done"
          onPress={() => {}}
        />
        <WorkoutCard
          title="Lower body power"
          subtitle="2 days ago · 48 min"
          tag="Done"
          onPress={() => {}}
        />
        <WorkoutCard
          title="Active recovery"
          subtitle="3 days ago · 30 min"
          tag="Done"
          onPress={() => {}}
        />

        {/* Upcoming */}
        <SectionHeader title="Coming up" />
        <WorkoutCard
          title="Push day"
          subtitle="Tomorrow · Est. 50 min"
          tag="Next"
          onPress={() => {}}
        />
        <WorkoutCard
          title="Leg day"
          subtitle="In 2 days · Est. 55 min"
          tag="Scheduled"
          onPress={() => {}}
        />
      </ScrollView>
    </View>
  );
};
