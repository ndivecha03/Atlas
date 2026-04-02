import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { usePalette, useSpacing, useShape, useTheme } from '../../theme/ThemeContext';
import { signOut } from '../../api/auth';

interface Props {
  userName: string;
  userEmail?: string;
  onEditTheme: () => void;
}

// ─── Reusable row ─────────────────────────────
const Row = ({
  label, value, onPress, danger, last, rightEl,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
  rightEl?: React.ReactNode;
}) => {
  const palette = usePalette();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.6 : 1}
      style={{
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', padding: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: palette.border,
      }}
    >
      <Text style={{ color: danger ? palette.danger : palette.text, fontSize: 15 }}>
        {label}
      </Text>
      {rightEl ?? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {value && <Text style={{ color: palette.textMuted, fontSize: 14 }}>{value}</Text>}
          {onPress && <Text style={{ color: palette.textMuted, fontSize: 16 }}>›</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─── Card wrapper ─────────────────────────────
const Card = ({ children }: { children: React.ReactNode }) => {
  const palette = usePalette();
  const shape   = useShape();
  return (
    <View style={{
      backgroundColor: palette.surface,
      borderRadius: shape.cardRadius,
      borderWidth: 1,
      borderColor: palette.border,
      marginBottom: 16,
      overflow: 'hidden',
    }}>
      {children}
    </View>
  );
};

// ─── Section label ────────────────────────────
const Label = ({ title }: { title: string }) => {
  const palette = usePalette();
  return (
    <Text style={{
      color: palette.textMuted, fontSize: 12,
      fontWeight: '700', letterSpacing: 1.5,
      marginBottom: 8, marginTop: 4, paddingHorizontal: 2,
    }}>
      {title}
    </Text>
  );
};

// ─── Subscription tier card ───────────────────
const TierCard = ({
  name, price, description, features, isCurrent, isHighlighted, onUpgrade,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  isCurrent: boolean;
  isHighlighted: boolean;
  onUpgrade?: () => void;
}) => {
  const palette = usePalette();
  const shape   = useShape();
  const spacing = useSpacing();

  return (
    <View style={{
      backgroundColor: isHighlighted ? palette.accentEffective : palette.surface,
      borderRadius: shape.cardRadius,
      borderWidth: isCurrent ? 2 : 1,
      borderColor: isCurrent
        ? palette.accentEffective
        : isHighlighted
        ? palette.accentEffective
        : palette.border,
      padding: spacing.cardPadding,
      marginBottom: 12,
    }}>
      {/* Header row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <Text style={{
              color: isHighlighted ? palette.textOnAccent : palette.text,
              fontSize: 17, fontWeight: '700',
            }}>
              {name}
            </Text>
            {isCurrent && (
              <View style={{
                backgroundColor: isHighlighted ? 'rgba(0,0,0,0.15)' : palette.statBackground,
                borderRadius: shape.badgeRadius,
                paddingHorizontal: 8, paddingVertical: 3,
              }}>
                <Text style={{
                  color: isHighlighted ? palette.textOnAccent : palette.accentEffective,
                  fontSize: 10, fontWeight: '700',
                }}>
                  CURRENT
                </Text>
              </View>
            )}
          </View>
          <Text style={{
            color: isHighlighted ? palette.textOnAccent : palette.textMuted,
            fontSize: 13, opacity: 0.85,
          }}>
            {description}
          </Text>
        </View>
        <Text style={{
          color: isHighlighted ? palette.textOnAccent : palette.accentEffective,
          fontSize: 17, fontWeight: '700', marginLeft: 12,
        }}>
          {price}
        </Text>
      </View>

      {/* Features */}
      <View style={{ marginTop: 10, marginBottom: isHighlighted && !isCurrent ? 14 : 0 }}>
        {features.map((f, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 8, marginBottom: 5 }}>
            <Text style={{ color: isHighlighted ? palette.textOnAccent : palette.success, fontSize: 13 }}>✓</Text>
            <Text style={{
              color: isHighlighted ? palette.textOnAccent : palette.textMuted,
              fontSize: 13, flex: 1, lineHeight: 19, opacity: isHighlighted ? 0.9 : 1,
            }}>
              {f}
            </Text>
          </View>
        ))}
      </View>

      {/* Upgrade button */}
      {!isCurrent && onUpgrade && (
        <TouchableOpacity
          onPress={onUpgrade}
          style={{
            backgroundColor: isHighlighted ? 'rgba(0,0,0,0.15)' : palette.accentEffective,
            borderRadius: shape.buttonRadius,
            paddingVertical: 11,
            alignItems: 'center',
            marginTop: isHighlighted ? 0 : 12,
          }}
        >
          <Text style={{
            color: palette.textOnAccent,
            fontSize: 14, fontWeight: '700',
          }}>
            Upgrade to {name}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── Wearable row ─────────────────────────────
const WearableRow = ({
  name, description, status, last,
}: {
  name: string;
  description: string;
  status: 'connected' | 'available' | 'soon';
  last?: boolean;
}) => {
  const palette  = usePalette();
  const [on, setOn] = useState(status === 'connected');
  const statusColor = status === 'connected'
    ? palette.success : status === 'available'
    ? palette.accentEffective : palette.textMuted;
  const statusLabel = status === 'connected'
    ? 'Connected' : status === 'available'
    ? 'Available' : 'Coming soon';

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      padding: 14, gap: 12,
      borderBottomWidth: last ? 0 : 1,
      borderBottomColor: palette.border,
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: palette.text, fontSize: 15, fontWeight: '600' }}>{name}</Text>
        <Text style={{ color: palette.textMuted, fontSize: 12, marginTop: 2 }}>{description}</Text>
      </View>
      <Text style={{ color: statusColor, fontSize: 12, fontWeight: '600' }}>{statusLabel}</Text>
      {status !== 'soon' && (
        <Switch
          value={on}
          onValueChange={setOn}
          trackColor={{ false: palette.border, true: palette.accentEffective }}
          thumbColor={palette.surface}
        />
      )}
    </View>
  );
};

// ─── Main ─────────────────────────────────────
export const ProfileScreen = ({ userName, userEmail, onEditTheme }: Props) => {
  const palette    = usePalette();
  const spacing    = useSpacing();
  const shape      = useShape();
  const { theme }  = useTheme();
  const [showTiers, setShowTiers] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.screenPadding, paddingTop: 60, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={{ color: palette.accentEffective, fontSize: 13, fontWeight: '600', letterSpacing: 2, marginBottom: 16 }}>
          ATLAS
        </Text>

        {/* Avatar + name */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <View style={{
            width: 60, height: 60, borderRadius: 30,
            backgroundColor: palette.accentEffective,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: palette.textOnAccent, fontSize: 24, fontWeight: '700' }}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: palette.text, fontSize: 22, fontWeight: '700' }}>{userName}</Text>
            {userEmail && (
              <Text style={{ color: palette.textMuted, fontSize: 14, marginTop: 2 }}>{userEmail}</Text>
            )}
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6,
            }}>
              <View style={{
                backgroundColor: palette.statBackground,
                borderRadius: shape.badgeRadius,
                paddingHorizontal: 10, paddingVertical: 4,
                borderWidth: 1, borderColor: palette.border,
              }}>
                <Text style={{ color: palette.accentEffective, fontSize: 11, fontWeight: '700' }}>
                  CORE · FREE
                </Text>
              </View>
              <View style={{
                backgroundColor: palette.statBackground,
                borderRadius: shape.badgeRadius,
                paddingHorizontal: 10, paddingVertical: 4,
                borderWidth: 1, borderColor: palette.border,
              }}>
                <Text style={{ color: palette.textMuted, fontSize: 11, fontWeight: '600' }}>
                  {theme.family.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Subscription */}
        <Label title="Subscription" />
        {!showTiers ? (
          <Card>
            <Row label="Current plan" value="Core — Free" />
            <Row
              label="Upgrade plan"
              onPress={() => setShowTiers(true)}
              last
            />
          </Card>
        ) : (
          <>
            <TierCard
              name="Core"
              price="Free"
              description="Everything you need to get started"
              isCurrent={true}
              isHighlighted={false}
              features={[
                'Workout logging + exercise library',
                'Rule-based AI training plan',
                'Basic progress tracking',
                'Offline support',
                'Atlas AI chat (basic)',
              ]}
            />
            <TierCard
              name="Athlete"
              price="$9.99/mo"
              description="For serious, data-driven training"
              isCurrent={false}
              isHighlighted={true}
              onUpgrade={() => {}}
              features={[
                'Everything in Core',
                'Diet + nutrition tracking',
                'Advanced analytics + plateau detection',
                'ML-adapted training plans',
                'Wearable sync (Apple Health, Oura)',
                'Nearby restaurant finder',
                'Atlas AI chat (full context)',
              ]}
            />
            <TierCard
              name="Elite"
              price="$24.99/mo"
              description="Human + AI coaching combined"
              isCurrent={false}
              isHighlighted={false}
              onUpgrade={() => {}}
              features={[
                'Everything in Athlete',
                'Certified Personal Trainer matching',
                'Video coaching sessions',
                'Trainer reviews and adjusts your AI plan',
                'Priority Atlas AI responses',
              ]}
            />
            <TouchableOpacity onPress={() => setShowTiers(false)} style={{ alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ color: palette.textMuted, fontSize: 14 }}>Collapse</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Appearance */}
        <Label title="Appearance" />
        <Card>
          <Row
            label="Theme"
            value={`${theme.family.charAt(0).toUpperCase() + theme.family.slice(1)} · ${theme.variant}`}
            onPress={onEditTheme}
          />
          <Row label="Mode"    value={theme.darkMode ? 'Dark' : 'Light'} />
          <Row label="Density" value={theme.typography.scale.charAt(0).toUpperCase() + theme.typography.scale.slice(1)} last />
        </Card>

        {/* Wearables */}
        <Label title="Connected devices" />
        <Card>
          <WearableRow
            name="Apple Health"
            description="Steps, heart rate, sleep, HRV"
            status="available"
          />
          <WearableRow
            name="Oura Ring"
            description="Sleep score, readiness, HRV trends"
            status="available"
          />
          <WearableRow
            name="Google Health Connect"
            description="Fitbit, Samsung, Garmin via Android"
            status="soon"
          />
          <WearableRow
            name="Garmin"
            description="Direct Garmin Health API"
            status="soon"
            last
          />
        </Card>

        {/* Location */}
        <Label title="Location features" />
        <Card>
          <Row label="Nearby gyms"      value="Enabled" />
          <Row label="Running routes"   value="Enabled" />
          <Row label="Restaurant finder" value="Athlete+" last />
        </Card>

        {/* Notifications */}
        <Label title="Notifications" />
        <Card>
          {[
            { label: 'Workout reminders',  defaultVal: true  },
            { label: 'Rest day alerts',    defaultVal: true  },
            { label: 'Progress summaries', defaultVal: true  },
            { label: 'Atlas AI messages',  defaultVal: true  },
            { label: 'Streak reminders',   defaultVal: false },
          ].map((n, i, arr) => {
            const [val, setVal] = useState(n.defaultVal);
            return (
              <Row
                key={i}
                label={n.label}
                last={i === arr.length - 1}
                rightEl={
                  <Switch
                    value={val}
                    onValueChange={setVal}
                    trackColor={{ false: palette.border, true: palette.accentEffective }}
                    thumbColor={palette.surface}
                  />
                }
              />
            );
          })}
        </Card>

        {/* Account */}
        <Label title="Account" />
        <Card>
          <Row label="Edit profile"          onPress={() => {}} />
          <Row label="Privacy policy"        onPress={() => {}} />
          <Row label="Terms of service"      onPress={() => {}} />
          <Row label="Delete account"        onPress={() => {}} danger />
          <Row label="Sign out"              onPress={signOut} danger last />
        </Card>

        <Text style={{ color: palette.textMuted, fontSize: 12, textAlign: 'center', marginTop: 8 }}>
          Atlas v1.0.0 · Made with care
        </Text>
      </ScrollView>
    </View>
  );
};
