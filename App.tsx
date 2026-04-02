import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import {
  UserTheme, ThemeScoringInputs,
  GenderIdentity, TrainingType, ExperienceLevel, FitnessGoal,
} from './src/theme/types';
import { WelcomeScreen }     from './src/screens/onboarding/WelcomeScreen';
import { TrainingScreen }    from './src/screens/onboarding/TrainingScreen';
import { GoalsScreen }       from './src/screens/onboarding/GoalsScreen';
import { ThemePickerScreen } from './src/screens/onboarding/ThemePickerScreen';
import { DashboardScreen }   from './src/screens/dashboard/DashboardScreen';
import { WorkoutScreen }     from './src/screens/workout/WorkoutScreen';
import { ProgressScreen }    from './src/screens/progress/ProgressScreen';
import { ProfileScreen }     from './src/screens/profile/ProfileScreen';
import { SettingsScreen }    from './src/screens/settings/SettingsScreen';
import { AuthScreen }        from './src/screens/auth/AuthScreen';
import { AtlasScreen }       from './src/screens/atlas/AtlasScreen';
import { BottomNav, NavTab } from './src/components/ui/BottomNav';
import {
  getSession, saveProfile, saveTheme,
  loadTheme, loadProfile, ProfileData,
} from './src/api/auth';
import { supabase } from './src/api/supabase';

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { generateVariants, selectVariant, variants, theme, isThemeReady } = useTheme();

  const [bootstrapping,  setBootstrapping]  = useState(true);
  const [userId,         setUserId]         = useState<string | null>(null);
  const [userName,       setUserName]       = useState('');
  const [userEmail,      setUserEmail]      = useState('');
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [step,           setStep]           = useState(0);
  const [welcomeData,    setWelcomeData]    = useState<{ name: string; age: string; genderIdentity: GenderIdentity } | null>(null);
  const [trainingData,   setTrainingData]   = useState<{ trainingType: TrainingType; experienceLevel: ExperienceLevel } | null>(null);
  const [selectedGoal,   setSelectedGoal]   = useState<FitnessGoal>('generalWellness');
  const [activeTab,      setActiveTab]      = useState<NavTab>('dashboard');
  const [showSettings,   setShowSettings]   = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        const session = await getSession();
        if (session?.user) {
          setUserId(session.user.id);
          setUserEmail(session.user.email ?? '');
          const profile = await loadProfile(session.user.id);
          if (profile) { setUserName(profile.name); setOnboardingDone(true); }
          const savedTheme = await loadTheme(session.user.id);
          if (savedTheme) selectVariant(savedTheme);
        }
      } catch (e) {
        console.warn('Bootstrap error:', e);
      } finally {
        setBootstrapping(false);
        await SplashScreen.hideAsync();
      }
    }
    bootstrap();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUserId(null);
        setOnboardingDone(false);
        setStep(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userId && isThemeReady) {
      saveTheme(userId, theme).catch(console.warn);
    }
  }, [theme, userId, isThemeReady]);

  // ── Loading ──
  if (bootstrapping) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.palette.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.palette.accentEffective} size="large" />
      </View>
    );
  }

  // ── Auth ──
  if (!userId) {
    return (
      <AuthScreen
        onAuthSuccess={(id, isNewUser) => {
          setUserId(id);
          supabase.auth.getSession().then(({ data }) => {
            if (data.session?.user?.email) setUserEmail(data.session.user.email);
          });
          if (!isNewUser) {
            loadProfile(id).then(profile => {
              if (profile) { setUserName(profile.name); setOnboardingDone(true); }
            });
            loadTheme(id).then(savedTheme => {
              if (savedTheme) selectVariant(savedTheme);
            });
          }
        }}
      />
    );
  }

  // ── Onboarding handlers ──
  const handleWelcome = (data: { name: string; age: string; genderIdentity: GenderIdentity }) => {
    setWelcomeData(data);
    setUserName(data.name);
    setStep(1);
  };

  const handleTraining = (data: { trainingType: TrainingType; experienceLevel: ExperienceLevel }) => {
    setTrainingData(data);
    setStep(2);
  };

  const handleGoals = (goal: FitnessGoal) => {
    if (!welcomeData || !trainingData) return;
    setSelectedGoal(goal);
    const inputs: ThemeScoringInputs = {
      age:             parseInt(welcomeData.age),
      genderIdentity:  welcomeData.genderIdentity,
      trainingType:    trainingData.trainingType,
      experienceLevel: trainingData.experienceLevel,
      primaryGoal:     goal,
    };
    generateVariants(inputs);
    setStep(3);
  };

  const handleThemeSelect = async (selected: UserTheme) => {
    selectVariant(selected);
    if (userId && welcomeData && trainingData) {
      const profile: ProfileData = {
        name:             welcomeData.name,
        age:              parseInt(welcomeData.age),
        gender_identity:  welcomeData.genderIdentity,
        training_type:    trainingData.trainingType,
        experience_level: trainingData.experienceLevel,
        primary_goal:     selectedGoal,
      };
      await saveProfile(userId, profile).catch(console.warn);
      await saveTheme(userId, selected).catch(console.warn);
    }
    setOnboardingDone(true);
  };

  // ── Onboarding flow ──
  if (!onboardingDone) {
    if (step === 0) return <WelcomeScreen onNext={handleWelcome} />;
    if (step === 1) return <TrainingScreen onNext={handleTraining} onBack={() => setStep(0)} />;
    if (step === 2) return <GoalsScreen onNext={handleGoals} onBack={() => setStep(1)} />;
    if (step === 3 && variants) return (
      <ThemePickerScreen
        variants={variants}
        onSelect={handleThemeSelect}
        onBack={() => setStep(2)}
      />
    );
  }

  // ── Settings overlay ──
  if (showSettings) {
    return <SettingsScreen onBack={() => setShowSettings(false)} />;
  }

  // ── Main app ──
  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return (
        <DashboardScreen
          userName={userName}
          onStartWorkout={() => setActiveTab('workout')}
        />
      );
      case 'workout':  return <WorkoutScreen />;
      case 'atlas':    return <AtlasScreen userId={userId!} userName={userName} />;
      case 'progress': return <ProgressScreen />;
      case 'profile':  return (
        <ProfileScreen
          userName={userName}
          userEmail={userEmail}
          onEditTheme={() => setShowSettings(true)}
        />
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.palette.background }}>
      <View style={{ flex: 1 }}>{renderTab()}</View>
      <BottomNav activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}

export default function App() {
  const [persistedTheme, setPersistedTheme] = useState<UserTheme | null>(null);

  return (
    <ThemeProvider
      persistedTheme={persistedTheme}
      onThemeChange={(t) => setPersistedTheme(t)}
    >
      <AppNavigator />
    </ThemeProvider>
  );
}
