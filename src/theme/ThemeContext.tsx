import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { UserTheme, ThemeScoringInputs } from './types';
import { defaultTheme } from './themes';
import { generateThemeVariants, applyAccentOverride } from './scoring';

interface ThemeContextValue {
  theme: UserTheme;
  variants: [UserTheme, UserTheme, UserTheme] | null;
  generateVariants: (inputs: ThemeScoringInputs) => void;
  selectVariant: (theme: UserTheme) => void;
  setAccentColor: (hexColor: string) => void;
  resetAccent: () => void;
  isThemeReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  variants: null,
  generateVariants: () => {},
  selectVariant:    () => {},
  setAccentColor:   () => {},
  resetAccent:      () => {},
  isThemeReady: false,
});

interface ThemeProviderProps {
  children: React.ReactNode;
  persistedTheme?: UserTheme | null;
  onThemeChange?: (theme: UserTheme) => void;
}

export const ThemeProvider = ({
  children,
  persistedTheme,
  onThemeChange,
}: ThemeProviderProps) => {
  const [theme, setThemeState]     = useState<UserTheme>(persistedTheme ?? defaultTheme);
  const [variants, setVariants]    = useState<[UserTheme, UserTheme, UserTheme] | null>(null);
  const [isThemeReady, setIsReady] = useState<boolean>(!!persistedTheme);

  useEffect(() => {
    if (persistedTheme) {
      setThemeState(persistedTheme);
      setIsReady(true);
    }
  }, [persistedTheme]);

  const persistTheme = useCallback((t: UserTheme) => {
    setThemeState(t);
    onThemeChange?.(t);
  }, [onThemeChange]);

  const generateVariants = useCallback((inputs: ThemeScoringInputs) => {
    const [bold, balanced, soft] = generateThemeVariants(inputs);
    setVariants([bold, balanced, soft]);
  }, []);

  const selectVariant = useCallback((selected: UserTheme) => {
    setIsReady(true);
    persistTheme(selected);
  }, [persistTheme]);

  const setAccentColor = useCallback((hexColor: string) => {
    persistTheme(applyAccentOverride(theme, hexColor));
  }, [theme, persistTheme]);

  const resetAccent = useCallback(() => {
    persistTheme({
      ...theme,
      palette: {
        ...theme.palette,
        accentOverride:  undefined,
        accentEffective: theme.palette.accent,
      },
    });
  }, [theme, persistTheme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      variants,
      generateVariants,
      selectVariant,
      setAccentColor,
      resetAccent,
      isThemeReady,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme   = () => useContext(ThemeContext);
export const usePalette = () => useTheme().theme.palette;
export const useSpacing = () => useTheme().theme.spacing;
export const useShape   = () => useTheme().theme.shape;
