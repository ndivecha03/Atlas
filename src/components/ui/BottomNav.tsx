import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { usePalette, useShape } from '../../theme/ThemeContext';

export type NavTab = 'dashboard' | 'workout' | 'atlas' | 'progress' | 'profile';

interface Props {
  activeTab: NavTab;
  onTabPress: (tab: NavTab) => void;
}

const TABS: { key: NavTab; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Home',     icon: '⊞' },
  { key: 'workout',   label: 'Workout',  icon: '↑' },
  { key: 'atlas',     label: 'Atlas',    icon: '◈' },
  { key: 'progress',  label: 'Progress', icon: '▲' },
  { key: 'profile',   label: 'Profile',  icon: '◎' },
];

export const BottomNav = ({ activeTab, onTabPress }: Props) => {
  const palette = usePalette();
  const shape   = useShape();

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: palette.surface,
      borderTopWidth: 1,
      borderTopColor: palette.border,
      paddingBottom: 8,
      paddingTop: 4,
      alignItems: 'flex-end',
    }}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const isAtlas  = tab.key === 'atlas';

        if (isAtlas) {
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabPress(tab.key)}
              style={{
                flex: 1,
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <View style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: isActive ? palette.text : palette.accentEffective,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 4,
              }}>
                <Text style={{
                  fontSize: 22,
                  color: isActive ? palette.background : palette.textOnAccent,
                }}>
                  {tab.icon}
                </Text>
              </View>
              <Text style={{
                fontSize: 11,
                fontWeight: '700',
                color: isActive ? palette.accentEffective : palette.textMuted,
              }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 6,
            }}
          >
            <Text style={{
              fontSize: 20,
              color: isActive ? palette.accentEffective : palette.textMuted,
              marginBottom: 4,
            }}>
              {tab.icon}
            </Text>
            <Text style={{
              fontSize: 11,
              fontWeight: isActive ? '700' : '400',
              color: isActive ? palette.accentEffective : palette.textMuted,
            }}>
              {tab.label}
            </Text>
            {isActive && (
              <View style={{
                position: 'absolute',
                bottom: 0,
                width: 20,
                height: 2,
                backgroundColor: palette.accentEffective,
                borderRadius: 1,
              }} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
