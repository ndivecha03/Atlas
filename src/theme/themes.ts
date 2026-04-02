import { UserTheme, ThemeFamily, ThemeVariant } from './types';

type VariantMap    = Record<ThemeVariant, UserTheme>;
type ThemeRegistry = Record<ThemeFamily, VariantMap>;

const baseSpacing = {
  compact: { screenPadding: 16, cardPadding: 12, cardGap: 8,  sectionGap: 20, widgetPadding: 10 },
  default: { screenPadding: 20, cardPadding: 16, cardGap: 12, sectionGap: 28, widgetPadding: 14 },
  airy:    { screenPadding: 24, cardPadding: 20, cardGap: 16, sectionGap: 36, widgetPadding: 18 },
};

const baseShape = {
  sharp:   { cardRadius: 4,  buttonRadius: 4,  badgeRadius: 4,  inputRadius: 4  },
  rounded: { cardRadius: 12, buttonRadius: 10, badgeRadius: 20, inputRadius: 8  },
  pill:    { cardRadius: 20, buttonRadius: 24, badgeRadius: 24, inputRadius: 16 },
};

const iron: VariantMap = {
  bold: {
    family: 'iron', variant: 'bold', darkMode: true, motion: 'snappy',
    palette: { background: '#08080f', surface: '#13131f', surfaceAlt: '#1a1a2a', accent: '#c8ff00', accentEffective: '#c8ff00', text: '#ffffff', textMuted: '#888870', textOnAccent: '#0a0a0a', border: '#2a2a3a', statBackground: '#1e1e30', danger: '#ff4444', success: '#44ff88' },
    typography: { headingFont: 'SpaceGrotesk_700Bold', bodyFont: 'SpaceGrotesk_400Regular', headingWeight: '700', scale: 'compact' },
    spacing: baseSpacing.compact, shape: baseShape.sharp,
    widgetOrder: ['strength','volume','consistency','recovery'], generatedAt: '',
  },
  balanced: {
    family: 'iron', variant: 'balanced', darkMode: true, motion: 'snappy',
    palette: { background: '#0f0f18', surface: '#1a1a28', surfaceAlt: '#222235', accent: '#a0d400', accentEffective: '#a0d400', text: '#f0f0ff', textMuted: '#7070a0', textOnAccent: '#0a0a0a', border: '#2a2a40', statBackground: '#1e1e30', danger: '#ff5555', success: '#55ff99' },
    typography: { headingFont: 'SpaceGrotesk_700Bold', bodyFont: 'Inter_400Regular', headingWeight: '700', scale: 'compact' },
    spacing: baseSpacing.compact, shape: baseShape.rounded,
    widgetOrder: ['strength','volume','consistency','recovery'], generatedAt: '',
  },
  soft: {
    family: 'iron', variant: 'soft', darkMode: false, motion: 'fluid',
    palette: { background: '#f5f5f0', surface: '#ffffff', surfaceAlt: '#eeeee8', accent: '#4a7000', accentEffective: '#4a7000', text: '#1a1a10', textMuted: '#707060', textOnAccent: '#ffffff', border: '#d0d0c0', statBackground: '#eaeae0', danger: '#cc3333', success: '#338833' },
    typography: { headingFont: 'SpaceGrotesk_700Bold', bodyFont: 'Inter_400Regular', headingWeight: '700', scale: 'default' },
    spacing: baseSpacing.default, shape: baseShape.rounded,
    widgetOrder: ['strength','volume','consistency','recovery'], generatedAt: '',
  },
};

const ember: VariantMap = {
  bold: {
    family: 'ember', variant: 'bold', darkMode: true, motion: 'snappy',
    palette: { background: '#100608', surface: '#1e0e10', surfaceAlt: '#2a1418', accent: '#ff5c35', accentEffective: '#ff5c35', text: '#fff0ee', textMuted: '#cc8070', textOnAccent: '#1a0404', border: '#3a1820', statBackground: '#260e12', danger: '#ff2222', success: '#44dd88' },
    typography: { headingFont: 'Syne_700Bold', bodyFont: 'DMSans_400Regular', headingWeight: '700', scale: 'compact' },
    spacing: baseSpacing.compact, shape: baseShape.rounded,
    widgetOrder: ['cardio','consistency','hrv','strength','recovery'], generatedAt: '',
  },
  balanced: {
    family: 'ember', variant: 'balanced', darkMode: true, motion: 'fluid',
    palette: { background: '#140a08', surface: '#221210', surfaceAlt: '#2e1a16', accent: '#ff7a50', accentEffective: '#ff7a50', text: '#fff4f0', textMuted: '#b08070', textOnAccent: '#1a0800', border: '#3e2018', statBackground: '#2a1410', danger: '#ff3333', success: '#55ee88' },
    typography: { headingFont: 'Syne_700Bold', bodyFont: 'DMSans_400Regular', headingWeight: '700', scale: 'default' },
    spacing: baseSpacing.default, shape: baseShape.rounded,
    widgetOrder: ['cardio','consistency','hrv','strength','recovery'], generatedAt: '',
  },
  soft: {
    family: 'ember', variant: 'soft', darkMode: false, motion: 'fluid',
    palette: { background: '#fff5f2', surface: '#ffffff', surfaceAlt: '#ffeeea', accent: '#cc3d1e', accentEffective: '#cc3d1e', text: '#2a100a', textMuted: '#aa6050', textOnAccent: '#ffffff', border: '#f0ccc0', statBackground: '#fde8e0', danger: '#cc2222', success: '#2a8844' },
    typography: { headingFont: 'Syne_700Bold', bodyFont: 'DMSans_400Regular', headingWeight: '700', scale: 'airy' },
    spacing: baseSpacing.airy, shape: baseShape.pill,
    widgetOrder: ['cardio','consistency','hrv','strength','recovery'], generatedAt: '',
  },
};

const bloom: VariantMap = {
  bold: {
    family: 'bloom', variant: 'bold', darkMode: false, motion: 'fluid',
    palette: { background: '#fff0eb', surface: '#ffffff', surfaceAlt: '#ffe8e0', accent: '#d94535', accentEffective: '#d94535', text: '#2d1510', textMuted: '#a06050', textOnAccent: '#ffffff', border: '#f5c8be', statBackground: '#fce4de', danger: '#cc2222', success: '#2a7744' },
    typography: { headingFont: 'PlayfairDisplay_700Bold', bodyFont: 'Nunito_400Regular', headingWeight: '700', scale: 'default' },
    spacing: baseSpacing.default, shape: baseShape.pill,
    widgetOrder: ['consistency','bodyComposition','recovery','nutrition'], generatedAt: '',
  },
  balanced: {
    family: 'bloom', variant: 'balanced', darkMode: false, motion: 'fluid',
    palette: { background: '#fff8f5', surface: '#ffffff', surfaceAlt: '#fff0eb', accent: '#e8604c', accentEffective: '#e8604c', text: '#2d1f1a', textMuted: '#c08070', textOnAccent: '#ffffff', border: '#f8d8d0', statBackground: '#fef0ec', danger: '#dd3333', success: '#338844' },
    typography: { headingFont: 'PlayfairDisplay_400Regular', bodyFont: 'Nunito_400Regular', headingWeight: '400', scale: 'airy' },
    spacing: baseSpacing.airy, shape: baseShape.pill,
    widgetOrder: ['consistency','bodyComposition','recovery','nutrition'], generatedAt: '',
  },
  soft: {
    family: 'bloom', variant: 'soft', darkMode: false, motion: 'minimal',
    palette: { background: '#fffcfa', surface: '#ffffff', surfaceAlt: '#fff8f5', accent: '#b84535', accentEffective: '#b84535', text: '#3a2820', textMuted: '#c09080', textOnAccent: '#ffffff', border: '#f5e8e4', statBackground: '#fff5f2', danger: '#bb3333', success: '#448844' },
    typography: { headingFont: 'PlayfairDisplay_400Regular', bodyFont: 'Nunito_400Regular', headingWeight: '400', scale: 'airy' },
    spacing: baseSpacing.airy, shape: baseShape.pill,
    widgetOrder: ['consistency','recovery','bodyComposition','nutrition'], generatedAt: '',
  },
};

const void_theme: VariantMap = {
  bold: {
    family: 'void', variant: 'bold', darkMode: true, motion: 'snappy',
    palette: { background: '#060612', surface: '#0e0e22', surfaceAlt: '#141430', accent: '#a78bfa', accentEffective: '#a78bfa', text: '#eeeeff', textMuted: '#7060b0', textOnAccent: '#0a0418', border: '#1e1e40', statBackground: '#12122a', danger: '#ff4466', success: '#44ffaa' },
    typography: { headingFont: 'PlusJakartaSans_700Bold', bodyFont: 'Manrope_400Regular', headingWeight: '700', scale: 'compact' },
    spacing: baseSpacing.compact, shape: baseShape.rounded,
    widgetOrder: ['volume','strength','bodyComposition','consistency','recovery'], generatedAt: '',
  },
  balanced: {
    family: 'void', variant: 'balanced', darkMode: true, motion: 'fluid',
    palette: { background: '#0a0a1a', surface: '#12122a', surfaceAlt: '#1a1a38', accent: '#8b6ef0', accentEffective: '#8b6ef0', text: '#e8e0ff', textMuted: '#6050a0', textOnAccent: '#ffffff', border: '#201e44', statBackground: '#161630', danger: '#ff5577', success: '#55ffaa' },
    typography: { headingFont: 'PlusJakartaSans_600SemiBold', bodyFont: 'Manrope_400Regular', headingWeight: '600', scale: 'default' },
    spacing: baseSpacing.default, shape: baseShape.rounded,
    widgetOrder: ['volume','strength','bodyComposition','consistency','recovery'], generatedAt: '',
  },
  soft: {
    family: 'void', variant: 'soft', darkMode: false, motion: 'fluid',
    palette: { background: '#f5f0ff', surface: '#ffffff', surfaceAlt: '#eee8ff', accent: '#6040c0', accentEffective: '#6040c0', text: '#1a1030', textMuted: '#806090', textOnAccent: '#ffffff', border: '#ddd0ff', statBackground: '#ede8ff', danger: '#cc3355', success: '#338855' },
    typography: { headingFont: 'PlusJakartaSans_600SemiBold', bodyFont: 'Manrope_400Regular', headingWeight: '600', scale: 'default' },
    spacing: baseSpacing.default, shape: baseShape.rounded,
    widgetOrder: ['volume','strength','bodyComposition','consistency'], generatedAt: '',
  },
};

const alpine: VariantMap = {
  bold: {
    family: 'alpine', variant: 'bold', darkMode: false, motion: 'fluid',
    palette: { background: '#eef5f0', surface: '#ffffff', surfaceAlt: '#e4f0e8', accent: '#1a7a50', accentEffective: '#1a7a50', text: '#102018', textMuted: '#508060', textOnAccent: '#ffffff', border: '#c0ddc8', statBackground: '#e0f0e8', danger: '#cc3333', success: '#1a7a50' },
    typography: { headingFont: 'Outfit_700Bold', bodyFont: 'SourceSans3_400Regular', headingWeight: '700', scale: 'default' },
    spacing: baseSpacing.default, shape: baseShape.rounded,
    widgetOrder: ['cardio','consistency','recovery','hrv','strength'], generatedAt: '',
  },
  balanced: {
    family: 'alpine', variant: 'balanced', darkMode: false, motion: 'fluid',
    palette: { background: '#f4f9f6', surface: '#ffffff', surfaceAlt: '#ebf5ef', accent: '#2d9e6b', accentEffective: '#2d9e6b', text: '#1a3028', textMuted: '#508060', textOnAccent: '#ffffff', border: '#c8e0d4', statBackground: '#e8f5ef', danger: '#cc3333', success: '#2d9e6b' },
    typography: { headingFont: 'Outfit_600SemiBold', bodyFont: 'SourceSans3_400Regular', headingWeight: '600', scale: 'default' },
    spacing: baseSpacing.default, shape: baseShape.rounded,
    widgetOrder: ['cardio','consistency','recovery','hrv'], generatedAt: '',
  },
  soft: {
    family: 'alpine', variant: 'soft', darkMode: false, motion: 'minimal',
    palette: { background: '#f8fcfa', surface: '#ffffff', surfaceAlt: '#f0f8f4', accent: '#3a8860', accentEffective: '#3a8860', text: '#1e3028', textMuted: '#608070', textOnAccent: '#ffffff', border: '#d8eee0', statBackground: '#f0f8f4', danger: '#cc4444', success: '#3a8860' },
    typography: { headingFont: 'Outfit_400Regular', bodyFont: 'SourceSans3_400Regular', headingWeight: '400', scale: 'airy' },
    spacing: baseSpacing.airy, shape: baseShape.pill,
    widgetOrder: ['cardio','consistency','recovery'], generatedAt: '',
  },
};

const chrome: VariantMap = {
  bold: {
    family: 'chrome', variant: 'bold', darkMode: true, motion: 'snappy',
    palette: { background: '#080c12', surface: '#101620', surfaceAlt: '#161e2c', accent: '#38bdf8', accentEffective: '#38bdf8', text: '#e8f4ff', textMuted: '#507090', textOnAccent: '#040c18', border: '#1c2c3e', statBackground: '#0e1828', danger: '#ff4444', success: '#44ddaa' },
    typography: { headingFont: 'Barlow_700Bold', bodyFont: 'IBMPlexSans_400Regular', headingWeight: '700', scale: 'compact' },
    spacing: baseSpacing.compact, shape: baseShape.sharp,
    widgetOrder: ['strength','cardio','volume','consistency','recovery'], generatedAt: '',
  },
  balanced: {
    family: 'chrome', variant: 'balanced', darkMode: true, motion: 'snappy',
    palette: { background: '#0c1018', surface: '#141c28', surfaceAlt: '#1c2638', accent: '#60c8f8', accentEffective: '#60c8f8', text: '#ecf4ff', textMuted: '#608090', textOnAccent: '#040c18', border: '#20303f', statBackground: '#131e2c', danger: '#ff5555', success: '#44ddaa' },
    typography: { headingFont: 'Barlow_600SemiBold', bodyFont: 'IBMPlexSans_400Regular', headingWeight: '600', scale: 'default' },
    spacing: baseSpacing.default, shape: baseShape.rounded,
    widgetOrder: ['strength','cardio','volume','consistency'], generatedAt: '',
  },
  soft: {
    family: 'chrome', variant: 'soft', darkMode: false, motion: 'fluid',
    palette: { background: '#f0f6ff', surface: '#ffffff', surfaceAlt: '#e8f2ff', accent: '#1878c0', accentEffective: '#1878c0', text: '#101828', textMuted: '#507090', textOnAccent: '#ffffff', border: '#c8dff5', statBackground: '#e4f0ff', danger: '#cc3333', success: '#228855' },
    typography: { headingFont: 'Barlow_600SemiBold', bodyFont: 'IBMPlexSans_400Regular', headingWeight: '600', scale: 'default' },
    spacing: baseSpacing.default, shape: baseShape.rounded,
    widgetOrder: ['strength','cardio','volume','consistency'], generatedAt: '',
  },
};

const dusk: VariantMap = {
  bold: {
    family: 'dusk', variant: 'bold', darkMode: false, motion: 'minimal',
    palette: { background: '#fdf4ff', surface: '#ffffff', surfaceAlt: '#f8ecff', accent: '#8b34aa', accentEffective: '#8b34aa', text: '#2a1035', textMuted: '#906090', textOnAccent: '#ffffff', border: '#e8d0f8', statBackground: '#f5e8ff', danger: '#cc3355', success: '#338855' },
    typography: { headingFont: 'CormorantGaramond_700Bold', bodyFont: 'Lato_400Regular', headingWeight: '700', scale: 'airy' },
    spacing: baseSpacing.airy, shape: baseShape.pill,
    widgetOrder: ['consistency','recovery','hrv','sleep'], generatedAt: '',
  },
  balanced: {
    family: 'dusk', variant: 'balanced', darkMode: false, motion: 'minimal',
    palette: { background: '#fdf6ff', surface: '#ffffff', surfaceAlt: '#f5eeff', accent: '#9b59b6', accentEffective: '#9b59b6', text: '#2d1a35', textMuted: '#806090', textOnAccent: '#ffffff', border: '#eed8ff', statBackground: '#f5eeff', danger: '#cc3366', success: '#33885f' },
    typography: { headingFont: 'CormorantGaramond_600SemiBold', bodyFont: 'Lato_400Regular', headingWeight: '600', scale: 'airy' },
    spacing: baseSpacing.airy, shape: baseShape.pill,
    widgetOrder: ['consistency','recovery','sleep','hrv'], generatedAt: '',
  },
  soft: {
    family: 'dusk', variant: 'soft', darkMode: false, motion: 'minimal',
    palette: { background: '#fefaff', surface: '#ffffff', surfaceAlt: '#faf4ff', accent: '#7a44a0', accentEffective: '#7a44a0', text: '#301840', textMuted: '#9080a0', textOnAccent: '#ffffff', border: '#f0e0ff', statBackground: '#faf4ff', danger: '#bb4466', success: '#448866' },
    typography: { headingFont: 'CormorantGaramond_400Regular', bodyFont: 'Lato_400Regular', headingWeight: '400', scale: 'airy' },
    spacing: baseSpacing.airy, shape: baseShape.pill,
    widgetOrder: ['consistency','recovery','sleep'], generatedAt: '',
  },
};

const forge: VariantMap = {
  bold: {
    family: 'forge', variant: 'bold', darkMode: true, motion: 'snappy',
    palette: { background: '#120800', surface: '#1e1000', surfaceAlt: '#2c1800', accent: '#ff7a28', accentEffective: '#ff7a28', text: '#fff8f0', textMuted: '#c08050', textOnAccent: '#1a0800', border: '#3a1c00', statBackground: '#261200', danger: '#ff3333', success: '#44dd88' },
    typography: { headingFont: 'Lexend_700Bold', bodyFont: 'WorkSans_400Regular', headingWeight: '700', scale: 'compact' },
    spacing: baseSpacing.compact, shape: baseShape.rounded,
    widgetOrder: ['strength','volume','bodyComposition','consistency','recovery'], generatedAt: '',
  },
  balanced: {
    family: 'forge', variant: 'balanced', darkMode: true, motion: 'fluid',
    palette: { background: '#1a0e06', surface: '#281606', surfaceAlt: '#381e08', accent: '#f97316', accentEffective: '#f97316', text: '#fff4ee', textMuted: '#b07040', textOnAccent: '#1a0800', border: '#401a00', statBackground: '#2e1400', danger: '#ff4444', success: '#55dd88' },
    typography: { headingFont: 'Lexend_600SemiBold', bodyFont: 'WorkSans_400Regular', headingWeight: '600', scale: 'default' },
    spacing: baseSpacing.default, shape: baseShape.rounded,
    widgetOrder: ['strength','volume','bodyComposition','consistency'], generatedAt: '',
  },
  soft: {
    family: 'forge', variant: 'soft', darkMode: false, motion: 'fluid',
    palette: { background: '#fff8f2', surface: '#ffffff', surfaceAlt: '#fff0e4', accent: '#c05010', accentEffective: '#c05010', text: '#2a1408', textMuted: '#b07040', textOnAccent: '#ffffff', border: '#ffd8b8', statBackground: '#fff0e0', danger: '#cc3333', success: '#338844' },
    typography: { headingFont: 'Lexend_600SemiBold', bodyFont: 'WorkSans_400Regular', headingWeight: '600', scale: 'default' },
    spacing: baseSpacing.default, shape: baseShape.rounded,
    widgetOrder: ['strength','volume','bodyComposition','consistency'], generatedAt: '',
  },
};

const mist: VariantMap = {
  bold: {
    family: 'mist', variant: 'bold', darkMode: false, motion: 'fluid',
    palette: { background: '#eef0ff', surface: '#ffffff', surfaceAlt: '#e6e8ff', accent: '#4f46e5', accentEffective: '#4f46e5', text: '#1e1e3a', textMuted: '#707090', textOnAccent: '#ffffff', border: '#d0d4ff', statBackground: '#e8eaff', danger: '#cc3333', success: '#228855' },
    typography: { headingFont: 'Nunito_700Bold', bodyFont: 'OpenSans_400Regular', headingWeight: '700', scale: 'default' },
    spacing: baseSpacing.default, shape: baseShape.pill,
    widgetOrder: ['bodyComposition','consistency','nutrition','cardio','recovery'], generatedAt: '',
  },
  balanced: {
    family: 'mist', variant: 'balanced', darkMode: false, motion: 'fluid',
    palette: { background: '#f0f4ff', surface: '#ffffff', surfaceAlt: '#eaecff', accent: '#6366f1', accentEffective: '#6366f1', text: '#1e1e3a', textMuted: '#707090', textOnAccent: '#ffffff', border: '#d8dcff', statBackground: '#eaeeff', danger: '#cc3333', success: '#338855' },
    typography: { headingFont: 'Nunito_600SemiBold', bodyFont: 'OpenSans_400Regular', headingWeight: '600', scale: 'airy' },
    spacing: baseSpacing.airy, shape: baseShape.pill,
    widgetOrder: ['bodyComposition','consistency','nutrition','cardio'], generatedAt: '',
  },
  soft: {
    family: 'mist', variant: 'soft', darkMode: false, motion: 'minimal',
    palette: { background: '#f8f9ff', surface: '#ffffff', surfaceAlt: '#f2f4ff', accent: '#5558d0', accentEffective: '#5558d0', text: '#22223a', textMuted: '#80809a', textOnAccent: '#ffffff', border: '#e0e4ff', statBackground: '#f4f6ff', danger: '#cc4444', success: '#448855' },
    typography: { headingFont: 'Nunito_400Regular', bodyFont: 'OpenSans_400Regular', headingWeight: '400', scale: 'airy' },
    spacing: baseSpacing.airy, shape: baseShape.pill,
    widgetOrder: ['bodyComposition','consistency','nutrition'], generatedAt: '',
  },
};

const titan: VariantMap = {
  bold: {
    family: 'titan', variant: 'bold', darkMode: true, motion: 'snappy',
    palette: { background: '#050505', surface: '#0f0f0f', surfaceAlt: '#1a1a1a', accent: '#ffd700', accentEffective: '#ffd700', text: '#ffffff', textMuted: '#909080', textOnAccent: '#080800', border: '#282820', statBackground: '#141410', danger: '#ff3333', success: '#33ff88' },
    typography: { headingFont: 'BebasNeue_400Regular', bodyFont: 'Roboto_400Regular', headingWeight: '400', scale: 'compact' },
    spacing: baseSpacing.compact, shape: baseShape.sharp,
    widgetOrder: ['strength','volume','consistency','recovery','bodyComposition'], generatedAt: '',
  },
  balanced: {
    family: 'titan', variant: 'balanced', darkMode: true, motion: 'snappy',
    palette: { background: '#080808', surface: '#141414', surfaceAlt: '#1e1e1e', accent: '#e6c200', accentEffective: '#e6c200', text: '#f8f8f8', textMuted: '#808070', textOnAccent: '#0a0800', border: '#2c2c20', statBackground: '#181810', danger: '#ff4444', success: '#44ff88' },
    typography: { headingFont: 'BebasNeue_400Regular', bodyFont: 'Roboto_400Regular', headingWeight: '400', scale: 'compact' },
    spacing: baseSpacing.compact, shape: baseShape.rounded,
    widgetOrder: ['strength','volume','consistency','recovery'], generatedAt: '',
  },
  soft: {
    family: 'titan', variant: 'soft', darkMode: false, motion: 'fluid',
    palette: { background: '#f8f8f0', surface: '#ffffff', surfaceAlt: '#f0f0e0', accent: '#806000', accentEffective: '#806000', text: '#1a1a10', textMuted: '#707060', textOnAccent: '#ffffff', border: '#d8d8c0', statBackground: '#eeeede', danger: '#cc3333', success: '#338833' },
    typography: { headingFont: 'BebasNeue_400Regular', bodyFont: 'Roboto_400Regular', headingWeight: '400', scale: 'default' },
    spacing: baseSpacing.default, shape: baseShape.rounded,
    widgetOrder: ['strength','volume','consistency'], generatedAt: '',
  },
};

export const THEME_REGISTRY: ThemeRegistry = {
  iron, ember, bloom, void: void_theme,
  alpine, chrome, dusk, forge, mist, titan,
};

export const getTheme = (family: ThemeFamily, variant: ThemeVariant): UserTheme =>
  THEME_REGISTRY[family][variant];

export const defaultTheme: UserTheme = THEME_REGISTRY.alpine.balanced;