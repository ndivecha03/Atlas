// ─────────────────────────────────────────────
// Atlas — UserTheme type definitions
// Every component reads from this shape.
// Never hardcode a color, font, or spacing value
// anywhere in the app — always read from theme.
// ─────────────────────────────────────────────

export type ThemeFamily =
  | 'iron'    // Strength · Male · Experienced
  | 'ember'   // HIIT · Any · Intermediate
  | 'bloom'   // Wellness · Female · Beginner
  | 'void'    // Bodybuilding · Any · Advanced
  | 'alpine'  // Endurance · Any · Intermediate
  | 'chrome'  // Cross-training · Male · Any
  | 'dusk'    // Yoga · Female · Beginner–Inter
  | 'forge'   // Strength · Female · Experienced
  | 'mist'    // Weight loss · Any · Beginner
  | 'titan';  // Powerlifting · Any · Advanced

export type ThemeVariant = 'bold' | 'balanced' | 'soft';

export type DensityScale = 'compact' | 'default' | 'airy';
export type CornerStyle = 'sharp' | 'rounded' | 'pill';
export type MotionStyle = 'snappy' | 'fluid' | 'minimal';
export type DashboardWidget =
  | 'strength'
  | 'volume'
  | 'consistency'
  | 'recovery'
  | 'cardio'
  | 'bodyComposition'
  | 'nutrition'
  | 'sleep'
  | 'hrv';

export interface ThemePalette {
  background: string;      // Page background
  surface: string;         // Card / panel background
  surfaceAlt: string;      // Slightly elevated surface
  accent: string;          // Primary action color (generated)
  accentOverride?: string; // User-chosen override (settings)
  accentEffective: string; // Resolved accent (override ?? generated), always WCAG AA
  text: string;            // Primary text
  textMuted: string;       // Secondary / caption text
  textOnAccent: string;    // Text rendered on accent-colored backgrounds
  border: string;          // Subtle borders
  statBackground: string;  // Stat widget fill
  danger: string;          // Errors, warnings
  success: string;         // Positive indicators
}

export interface ThemeTypography {
  headingFont: string;       // expo-font key for heading
  bodyFont: string;          // expo-font key for body
  headingWeight: '400' | '600' | '700';
  scale: DensityScale;       // Affects line heights + font sizes
}

export interface ThemeSpacing {
  screenPadding: number;
  cardPadding: number;
  cardGap: number;
  sectionGap: number;
  widgetPadding: number;
}

export interface ThemeShape {
  cardRadius: number;
  buttonRadius: number;
  badgeRadius: number;
  inputRadius: number;
}

export interface UserTheme {
  family: ThemeFamily;
  variant: ThemeVariant;
  palette: ThemePalette;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  shape: ThemeShape;
  motion: MotionStyle;
  darkMode: boolean;
  widgetOrder: DashboardWidget[];
  // Metadata
  generatedAt: string;       // ISO timestamp
  lastRegenAt?: string;      // Set after 30 sessions trigger re-score
}

// ─── Scoring inputs (from onboarding) ────────
export type TrainingType =
  | 'strength'
  | 'hypertrophy'
  | 'powerlifting'
  | 'hiit'
  | 'endurance'
  | 'yoga'
  | 'crossTraining'
  | 'weightLoss'
  | 'wellness';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type FitnessGoal =
  | 'buildMuscle'
  | 'loseWeight'
  | 'improveEndurance'
  | 'increaseStrength'
  | 'flexibility'
  | 'generalWellness';

export type GenderIdentity =
  | 'male'
  | 'female'
  | 'nonBinary'
  | 'preferNotToSay';

export interface ThemeScoringInputs {
  age: number;
  genderIdentity: GenderIdentity;
  trainingType: TrainingType;
  experienceLevel: ExperienceLevel;
  primaryGoal: FitnessGoal;
}