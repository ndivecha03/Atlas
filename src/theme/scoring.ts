import { ThemeScoringInputs, ThemeFamily, UserTheme } from './types';
import { THEME_REGISTRY, getTheme } from './themes';

interface DimensionScores {
  intensity: number;
  structure: number;
  warmth: number;
  density: number;
  boldness: number;
}

function scoreDimensions(inputs: ThemeScoringInputs): DimensionScores {
  let intensity = 50, structure = 50, warmth = 50, density = 50, boldness = 50;

  const trainingWeights: Record<string, Partial<DimensionScores>> = {
    powerlifting:  { intensity: +35, structure: +30, density: +20, boldness: +25 },
    strength:      { intensity: +25, structure: +20, density: +10, boldness: +15 },
    hypertrophy:   { intensity: +20, structure: +15, density: +15, boldness: +20 },
    hiit:          { intensity: +30, warmth: +10,    density:  -5, boldness: +10 },
    crossTraining: { intensity: +15, structure:  -5, density: +10               },
    endurance:     { intensity: +10, structure: -10, warmth:   -5, density:  +5 },
    weightLoss:    { intensity:  -5, warmth:     +5, density:  +5, boldness: -10 },
    yoga:          { intensity: -25, structure: -20, warmth:  +20, density: -20, boldness: -20 },
    wellness:      { intensity: -20, structure: -15, warmth:  +25, density: -15, boldness: -25 },
  };

  const tw = trainingWeights[inputs.trainingType] ?? {};
  intensity += tw.intensity ?? 0;
  structure += tw.structure ?? 0;
  warmth    += tw.warmth    ?? 0;
  density   += tw.density   ?? 0;
  boldness  += tw.boldness  ?? 0;

  if (inputs.experienceLevel === 'advanced') { density += 15; boldness += 10; }
  if (inputs.experienceLevel === 'beginner') { density -= 15; boldness -= 15; structure -= 10; }

  if (inputs.age < 25) { boldness += 10; intensity += 5; }
  if (inputs.age > 40) { boldness  -= 8; density   -= 5; warmth += 8; }
  if (inputs.age > 55) { boldness -= 10; density  -= 10; warmth += 10; }

  if (inputs.genderIdentity === 'male')      { warmth -= 8; boldness += 5; }
  if (inputs.genderIdentity === 'female')    { warmth += 8; boldness -= 5; }
  if (inputs.genderIdentity === 'nonBinary') { boldness += 5; }

  if (inputs.primaryGoal === 'increaseStrength') { structure += 10; intensity += 10; }
  if (inputs.primaryGoal === 'loseWeight')       { warmth    +=  5; density   +=  5; }
  if (inputs.primaryGoal === 'flexibility')      { boldness  -= 15; warmth    += 10; }
  if (inputs.primaryGoal === 'buildMuscle')      { intensity += 10; boldness  += 10; }
  if (inputs.primaryGoal === 'generalWellness')  { warmth    += 15; boldness  -= 15; }

  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  return {
    intensity: clamp(intensity),
    structure: clamp(structure),
    warmth:    clamp(warmth),
    density:   clamp(density),
    boldness:  clamp(boldness),
  };
}

interface FamilyProfile {
  intensity: number;
  structure: number;
  warmth: number;
  density: number;
  boldness: number;
}

const FAMILY_PROFILES: Record<ThemeFamily, FamilyProfile> = {
  titan:  { intensity: 90, structure: 85, warmth: 15, density: 80, boldness: 90 },
  iron:   { intensity: 75, structure: 70, warmth: 20, density: 70, boldness: 80 },
  forge:  { intensity: 70, structure: 60, warmth: 45, density: 65, boldness: 75 },
  void:   { intensity: 65, structure: 50, warmth: 25, density: 70, boldness: 85 },
  ember:  { intensity: 75, structure: 35, warmth: 55, density: 50, boldness: 70 },
  chrome: { intensity: 60, structure: 65, warmth: 20, density: 65, boldness: 60 },
  alpine: { intensity: 45, structure: 30, warmth: 50, density: 50, boldness: 30 },
  mist:   { intensity: 30, structure: 30, warmth: 55, density: 55, boldness: 20 },
  bloom:  { intensity: 25, structure: 20, warmth: 75, density: 35, boldness: 15 },
  dusk:   { intensity: 15, structure: 10, warmth: 70, density: 20, boldness: 10 },
};

function selectFamily(scores: DimensionScores): ThemeFamily {
  let bestFamily: ThemeFamily = 'alpine';
  let bestDistance = Infinity;
  for (const [family, profile] of Object.entries(FAMILY_PROFILES) as [ThemeFamily, FamilyProfile][]) {
    const distance = Math.sqrt(
      Math.pow(scores.intensity - profile.intensity, 2) +
      Math.pow(scores.structure - profile.structure, 2) +
      Math.pow(scores.warmth    - profile.warmth,    2) +
      Math.pow(scores.density   - profile.density,   2) +
      Math.pow(scores.boldness  - profile.boldness,  2),
    );
    if (distance < bestDistance) { bestDistance = distance; bestFamily = family; }
  }
  return bestFamily;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function validateAccent(accentHex: string, backgroundHex: string) {
  const ratio = contrastRatio(accentHex, backgroundHex);
  return { passes: ratio >= 4.5, ratio };
}

export function enforceContrast(
  accentHex: string,
  backgroundHex: string,
  targetRatio = 4.5,
): string {
  if (contrastRatio(accentHex, backgroundHex) >= targetRatio) return accentHex;
  const [br, bg, bb] = hexToRgb(backgroundHex);
  const shiftDark = relativeLuminance(br, bg, bb) > 0.5;
  let [r, g, b] = hexToRgb(accentHex);
  for (let i = 0; i < 100; i++) {
    r = shiftDark ? Math.max(0, r - 3) : Math.min(255, r + 3);
    g = shiftDark ? Math.max(0, g - 3) : Math.min(255, g + 3);
    b = shiftDark ? Math.max(0, b - 3) : Math.min(255, b + 3);
    const candidate = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    if (contrastRatio(candidate, backgroundHex) >= targetRatio) return candidate;
  }
  return shiftDark ? '#000000' : '#ffffff';
}

export function generateThemeVariants(
  inputs: ThemeScoringInputs,
): [UserTheme, UserTheme, UserTheme] {
  const scores = scoreDimensions(inputs);
  const family = selectFamily(scores);
  const now    = new Date().toISOString();
  return [
    { ...getTheme(family, 'bold'),     generatedAt: now },
    { ...getTheme(family, 'balanced'), generatedAt: now },
    { ...getTheme(family, 'soft'),     generatedAt: now },
  ];
}

export function applyAccentOverride(theme: UserTheme, accentHex: string): UserTheme {
  const safeAccent = enforceContrast(accentHex, theme.palette.background);
  return {
    ...theme,
    palette: {
      ...theme.palette,
      accentOverride:   accentHex,
      accentEffective:  safeAccent,
    },
  };
}