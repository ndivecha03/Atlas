import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { usePalette, useSpacing, useShape } from '../../theme/ThemeContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ─── Helpers ──────────────────────────────────
const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const palette = usePalette();
  const shape   = useShape();
  const spacing = useSpacing();
  return (
    <View style={{
      backgroundColor: palette.surface,
      borderRadius: shape.cardRadius,
      borderWidth: 1,
      borderColor: palette.border,
      padding: spacing.cardPadding,
      marginBottom: spacing.cardGap + 4,
    }}>
      <Text style={{
        color: palette.textMuted, fontSize: 12,
        fontWeight: '700', letterSpacing: 1.5, marginBottom: 16,
      }}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
};

// ─── Consistency Calendar ─────────────────────
const ConsistencyCalendar = () => {
  const palette = usePalette();
  const shape   = useShape();

  const DAYS = ['M','T','W','T','F','S','S'];
  const NUM_WEEKS = 12;

  // Seed a realistic workout pattern
  const grid = Array.from({ length: NUM_WEEKS }, (_, wi) =>
    Array.from({ length: 7 }, (_, di) => {
      const isWeekend = di >= 5;
      const prob      = isWeekend ? 0.2 : 0.72;
      return Math.random() < prob;
    })
  );

  const flatDays     = grid.flat();
  const totalSessions = flatDays.filter(Boolean).length;
  const streak = (() => {
    let s = 0;
    for (let i = flatDays.length - 1; i >= 0; i--) {
      if (flatDays[i]) s++; else break;
    }
    return s;
  })();
  const avgPerWeek = (totalSessions / NUM_WEEKS).toFixed(1);

  return (
    <View>
      {/* Stats */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
        {[
          { v: `${streak}`,       l: 'Streak',    u: 'days'     },
          { v: `${totalSessions}`, l: `${NUM_WEEKS} weeks`, u: 'sessions' },
          { v: avgPerWeek,        l: 'Average',   u: '/week'    },
        ].map((s, i) => (
          <View key={i} style={{
            flex: 1, backgroundColor: palette.statBackground,
            borderRadius: shape.cardRadius, padding: 12, alignItems: 'center',
          }}>
            <Text style={{ color: palette.accentEffective, fontSize: 22, fontWeight: '700' }}>{s.v}</Text>
            <Text style={{ color: palette.text, fontSize: 11, fontWeight: '600', marginTop: 2 }}>{s.u}</Text>
            <Text style={{ color: palette.textMuted, fontSize: 10, marginTop: 1 }}>{s.l}</Text>
          </View>
        ))}
      </View>

      {/* Day labels */}
      <View style={{ flexDirection: 'row', marginBottom: 6 }}>
        {DAYS.map((d, i) => (
          <Text key={i} style={{
            flex: 1, textAlign: 'center',
            color: palette.textMuted, fontSize: 10, fontWeight: '600',
          }}>{d}</Text>
        ))}
      </View>

      {/* Grid */}
      {grid.map((week, wi) => (
        <View key={wi} style={{ flexDirection: 'row', marginBottom: 5 }}>
          {week.map((worked, di) => (
            <View key={di} style={{ flex: 1, paddingHorizontal: 2 }}>
              <View style={{
                aspectRatio: 1,
                borderRadius: 4,
                backgroundColor: worked ? palette.accentEffective : palette.statBackground,
                opacity: worked ? 1 : 0.35,
              }} />
            </View>
          ))}
        </View>
      ))}
      <Text style={{ color: palette.textMuted, fontSize: 11, marginTop: 8, textAlign: 'right' }}>
        Last {NUM_WEEKS} weeks
      </Text>
    </View>
  );
};

// ─── Mini Line Chart (pure RN, no deps) ───────
const LineChart = ({
  data, color, height = 100,
}: {
  data: number[];
  color: string;
  height?: number;
}) => {
  const palette = usePalette();
  const width   = SCREEN_WIDTH - 96;
  const min     = Math.min(...data) * 0.98;
  const max     = Math.max(...data) * 1.02;

  const toX = (i: number) => (i / (data.length - 1)) * width;
  const toY = (v: number) => height - ((v - min) / (max - min)) * height;

  const points = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ');

  return (
    <View style={{ height: height + 8 }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {[0, 0.5, 1].map((t, i) => (
          <line key={i}
            x1={0} y1={t * height} x2={width} y2={t * height}
            stroke={palette.border} strokeWidth={0.5} strokeDasharray="4 4"
          />
        ))}
        <path d={points} fill="none" stroke={color} strokeWidth={2.5}
          strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => (
          i === data.length - 1 && (
            <circle key={i} cx={toX(i)} cy={toY(v)} r={4}
              fill={color} stroke={palette.surface} strokeWidth={2} />
          )
        ))}
      </svg>
    </View>
  );
};

// ─── Body Composition ─────────────────────────
const BodyCompositionSection = () => {
  const palette = usePalette();
  const shape   = useShape();

  const weeks      = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10'];
  const weightData = [84.2, 83.8, 83.5, 83.1, 82.9, 82.4, 82.1, 81.8, 81.5, 81.2];
  const fatData    = [22.1, 21.8, 21.6, 21.2, 21.0, 20.7, 20.4, 20.1, 19.9, 19.7];

  const weightDelta = (weightData[0] - weightData[weightData.length - 1]).toFixed(1);
  const fatDelta    = (fatData[0]    - fatData[fatData.length - 1]).toFixed(1);

  return (
    <>
      {/* Weight chart */}
      <View style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: palette.textMuted, fontSize: 13 }}>Body weight</Text>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Text style={{ color: palette.success, fontSize: 13, fontWeight: '600' }}>↓ {weightDelta}kg</Text>
            <Text style={{ color: palette.accentEffective, fontSize: 16, fontWeight: '700' }}>
              {weightData[weightData.length - 1]}kg
            </Text>
          </View>
        </View>
        <LineChart data={weightData} color={palette.accentEffective} />
      </View>

      <View style={{ height: 1, backgroundColor: palette.border, marginVertical: 16 }} />

      {/* Body fat chart */}
      <View style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: palette.textMuted, fontSize: 13 }}>Body fat</Text>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Text style={{ color: palette.success, fontSize: 13, fontWeight: '600' }}>↓ {fatDelta}%</Text>
            <Text style={{ color: palette.accentEffective, fontSize: 16, fontWeight: '700' }}>
              {fatData[fatData.length - 1]}%
            </Text>
          </View>
        </View>
        <LineChart data={fatData} color={palette.danger} height={80} />
      </View>

      {/* X labels */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        {weeks.filter((_, i) => i % 2 === 0).map((w, i) => (
          <Text key={i} style={{ color: palette.textMuted, fontSize: 10 }}>{w}</Text>
        ))}
      </View>

      {/* Measurement table */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 }}>
          MEASUREMENTS
        </Text>
        {[
          { label: 'Chest',  value: '102cm', change: '+1.5cm', positive: true  },
          { label: 'Waist',  value: '84cm',  change: '-2.0cm', positive: true  },
          { label: 'Arms',   value: '36cm',  change: '+0.5cm', positive: true  },
          { label: 'Thighs', value: '58cm',  change: '+1.0cm', positive: true  },
          { label: 'Hips',   value: '94cm',  change: '-1.0cm', positive: true  },
        ].map((m, i, arr) => (
          <View key={i} style={{
            flexDirection: 'row', justifyContent: 'space-between',
            alignItems: 'center', paddingVertical: 10,
            borderBottomWidth: i < arr.length - 1 ? 1 : 0,
            borderBottomColor: palette.border,
          }}>
            <Text style={{ color: palette.textMuted, fontSize: 14 }}>{m.label}</Text>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <Text style={{ color: m.positive ? palette.success : palette.danger, fontSize: 13 }}>
                {m.change}
              </Text>
              <Text style={{ color: palette.text, fontSize: 14, fontWeight: '600', width: 56, textAlign: 'right' }}>
                {m.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

// ─── Volume Bar Chart ─────────────────────────
const VolumeSection = () => {
  const palette = usePalette();
  const shape   = useShape();

  const weeks  = ['W1','W2','W3','W4','W5','W6','W7','W8'];
  const volume = [12400, 14200, 13800, 15600, 14900, 16200, 15800, 17100];
  const maxVol = Math.max(...volume);
  const thisWeek = volume[volume.length - 1];
  const lastWeek = volume[volume.length - 2];
  const delta    = ((thisWeek - lastWeek) / lastWeek * 100).toFixed(1);

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <View>
          <Text style={{ color: palette.textMuted, fontSize: 13 }}>This week</Text>
          <Text style={{ color: palette.accentEffective, fontSize: 24, fontWeight: '700', marginTop: 2 }}>
            {thisWeek.toLocaleString()}kg
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: palette.textMuted, fontSize: 13 }}>vs last week</Text>
          <Text style={{ color: palette.success, fontSize: 18, fontWeight: '700', marginTop: 2 }}>
            ↑ {delta}%
          </Text>
        </View>
      </View>

      {/* Bars */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 120, marginBottom: 8 }}>
        {volume.map((v, i) => {
          const isLatest = i === volume.length - 1;
          return (
            <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
              <Text style={{ color: palette.textMuted, fontSize: 9, marginBottom: 3 }}>
                {isLatest ? `${Math.round(v/1000)}k` : ''}
              </Text>
              <View style={{
                width: '100%',
                height: `${(v / maxVol) * 85}%`,
                backgroundColor: isLatest ? palette.accentEffective : palette.statBackground,
                borderRadius: shape.cardRadius / 2,
                borderWidth: 1,
                borderColor: isLatest ? palette.accentEffective : palette.border,
              }} />
            </View>
          );
        })}
      </View>

      {/* X labels */}
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {weeks.map((w, i) => (
          <Text key={i} style={{
            flex: 1, textAlign: 'center',
            color: i === weeks.length - 1 ? palette.accentEffective : palette.textMuted,
            fontSize: 10, fontWeight: i === weeks.length - 1 ? '700' : '400',
          }}>{w}</Text>
        ))}
      </View>

      {/* Split breakdown */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: palette.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 }}>
          THIS WEEK BY MUSCLE GROUP
        </Text>
        {[
          { label: 'Back',      value: 4800, pct: 0.28 },
          { label: 'Chest',     value: 3900, pct: 0.23 },
          { label: 'Legs',      value: 5200, pct: 0.30 },
          { label: 'Shoulders', value: 1800, pct: 0.11 },
          { label: 'Arms',      value: 1400, pct: 0.08 },
        ].map((m, i) => (
          <View key={i} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ color: palette.text, fontSize: 13 }}>{m.label}</Text>
              <Text style={{ color: palette.textMuted, fontSize: 13 }}>
                {m.value.toLocaleString()}kg · {Math.round(m.pct * 100)}%
              </Text>
            </View>
            <View style={{ height: 5, backgroundColor: palette.statBackground, borderRadius: 3 }}>
              <View style={{
                height: 5, width: `${m.pct * 100}%`,
                backgroundColor: palette.accentEffective, borderRadius: 3,
              }} />
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

// ─── Strength Section ─────────────────────────
const StrengthSection = () => {
  const palette = usePalette();
  const shape   = useShape();

  const lifts = [
    { name: 'Back squat',     current: '112kg', start: '95kg',  trend: '+17kg', weeks: 12, plateaued: false },
    { name: 'Bench press',    current: '95kg',  start: '90kg',  trend: '+0kg',  weeks: 3,  plateaued: true  },
    { name: 'Deadlift',       current: '148kg', start: '120kg', trend: '+28kg', weeks: 12, plateaued: false },
    { name: 'Overhead press', current: '72kg',  start: '65kg',  trend: '+7kg',  weeks: 8,  plateaued: false },
    { name: 'Barbell row',    current: '100kg', start: '88kg',  trend: '+12kg', weeks: 10, plateaued: false },
  ];

  const alerts = [
    { exercise: 'Bench press',    severity: 'warn',   msg: 'No progress in 3 weeks — try deload or technique work' },
    { exercise: 'Deadlift',       severity: 'good',   msg: 'Strong upward trend — up 5kg last 4 weeks' },
    { exercise: 'Overhead press', severity: 'notice', msg: 'Progress slowing — consider rep range variation' },
    { exercise: 'Squat',          severity: 'good',   msg: 'Consistent weekly improvements — keep current program' },
  ];

  const severityColor = (s: string) =>
    s === 'good' ? palette.success : s === 'warn' ? palette.danger : palette.accentEffective;

  return (
    <>
      {/* 1RM table */}
      {lifts.map((l, i) => (
        <View key={i} style={{
          flexDirection: 'row', alignItems: 'center',
          paddingVertical: 12,
          borderBottomWidth: i < lifts.length - 1 ? 1 : 0,
          borderBottomColor: palette.border,
          gap: 10,
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: palette.text, fontSize: 14, fontWeight: '600' }}>{l.name}</Text>
            <Text style={{ color: palette.textMuted, fontSize: 12, marginTop: 2 }}>
              Started at {l.start} · {l.weeks} weeks
            </Text>
          </View>
          <Text style={{
            fontSize: 12, fontWeight: '600',
            color: l.plateaued ? palette.danger : palette.success,
          }}>
            {l.plateaued ? 'Plateau' : l.trend}
          </Text>
          <Text style={{
            color: palette.accentEffective, fontSize: 18,
            fontWeight: '700', minWidth: 60, textAlign: 'right',
          }}>
            {l.current}
          </Text>
        </View>
      ))}

      {/* Alerts */}
      <Text style={{
        color: palette.textMuted, fontSize: 12,
        fontWeight: '700', letterSpacing: 1.5,
        marginTop: 24, marginBottom: 12,
      }}>
        ATLAS INSIGHTS
      </Text>
      {alerts.map((a, i) => (
        <View key={i} style={{
          backgroundColor: palette.surface,
          borderRadius: shape.cardRadius,
          borderWidth: 1, borderColor: palette.border,
          borderLeftWidth: 3, borderLeftColor: severityColor(a.severity),
          padding: 12, marginBottom: 8,
          flexDirection: 'row', gap: 10, alignItems: 'flex-start',
        }}>
          <Text style={{ color: severityColor(a.severity), fontSize: 14 }}>
            {a.severity === 'good' ? '↑' : a.severity === 'warn' ? '⚠' : '→'}
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: palette.text, fontSize: 13, fontWeight: '600' }}>{a.exercise}</Text>
            <Text style={{ color: palette.textMuted, fontSize: 12, marginTop: 3, lineHeight: 18 }}>{a.msg}</Text>
          </View>
        </View>
      ))}
    </>
  );
};

// ─── Main ─────────────────────────────────────
type Tab = 'overview' | 'body' | 'strength';

export const ProgressScreen = () => {
  const palette = usePalette();
  const spacing = useSpacing();
  const shape   = useShape();
  const [tab, setTab] = useState<Tab>('overview');

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview',  label: 'Overview'  },
    { key: 'body',      label: 'Body'      },
    { key: 'strength',  label: 'Strength'  },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.screenPadding, paddingTop: 60, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={{ color: palette.accentEffective, fontSize: 13, fontWeight: '600', letterSpacing: 2, marginBottom: 12 }}>
          ATLAS
        </Text>
        <Text style={{ color: palette.text, fontSize: 32, fontWeight: '700', marginBottom: 20 }}>
          Progress
        </Text>

        {/* Tab switcher */}
        <View style={{
          flexDirection: 'row', backgroundColor: palette.statBackground,
          borderRadius: shape.cardRadius, padding: 4, marginBottom: 24,
        }}>
          {TABS.map(t => (
            <TouchableOpacity
              key={t.key}
              onPress={() => setTab(t.key)}
              style={{
                flex: 1, paddingVertical: 9, alignItems: 'center',
                borderRadius: shape.cardRadius - 4,
                backgroundColor: tab === t.key ? palette.accentEffective : 'transparent',
              }}
            >
              <Text style={{
                fontSize: 13, fontWeight: '600',
                color: tab === t.key ? palette.textOnAccent : palette.textMuted,
              }}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'overview' && (
          <>
            <SectionCard title="Consistency">
              <ConsistencyCalendar />
            </SectionCard>
            <SectionCard title="Weekly volume">
              <VolumeSection />
            </SectionCard>
          </>
        )}

        {tab === 'body' && (
          <SectionCard title="Body composition">
            <BodyCompositionSection />
          </SectionCard>
        )}

        {tab === 'strength' && (
          <SectionCard title="Estimated 1RM">
            <StrengthSection />
          </SectionCard>
        )}
      </ScrollView>
    </View>
  );
};

