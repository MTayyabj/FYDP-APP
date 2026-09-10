export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  card: string;
  cardElevated: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  tabbar: string;
  tabbarActive: string;
  tabbarInactive: string;
  overlay: string;
}

export interface Theme {
  name: string;
  displayName: string;
  isDark: boolean;
  colors: ThemeColors;
}

export const themes: Record<string, Theme> = {
  ocean: {
    name: 'ocean',
    displayName: 'Ocean',
    isDark: false,
    colors: {
      primary: '#0EA5E9',
      primaryLight: '#7DD3FC',
      primaryDark: '#0369A1',
      secondary: '#06B6D4',
      secondaryLight: '#67E8F9',
      accent: '#F59E0B',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      background: '#F0F9FF',
      surface: '#FFFFFF',
      card: '#FFFFFF',
      cardElevated: '#FFFFFF',
      text: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#94A3B8',
      border: '#E0F2FE',
      borderLight: '#F0F9FF',
      tabbar: '#FFFFFF',
      tabbarActive: '#0EA5E9',
      tabbarInactive: '#94A3B8',
      overlay: 'rgba(15,23,42,0.5)',
    },
  },
  forest: {
    name: 'forest',
    displayName: 'Forest',
    isDark: false,
    colors: {
      primary: '#16A34A',
      primaryLight: '#86EFAC',
      primaryDark: '#15803D',
      secondary: '#65A30D',
      secondaryLight: '#D9F99D',
      accent: '#EAB308',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      card: '#FFFFFF',
      cardElevated: '#FFFFFF',
      text: '#1A2E1A',
      textSecondary: '#4D6B4D',
      textMuted: '#9CAE9C',
      border: '#DCFCE7',
      borderLight: '#F0FDF4',
      tabbar: '#FFFFFF',
      tabbarActive: '#16A34A',
      tabbarInactive: '#9CAE9C',
      overlay: 'rgba(26,46,26,0.5)',
    },
  },
  sunset: {
    name: 'sunset',
    displayName: 'Sunset',
    isDark: false,
    colors: {
      primary: '#F97316',
      primaryLight: '#FDBA74',
      primaryDark: '#C2410C',
      secondary: '#EC4899',
      secondaryLight: '#F9A8D4',
      accent: '#FBBF24',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      background: '#FFF7ED',
      surface: '#FFFFFF',
      card: '#FFFFFF',
      cardElevated: '#FFFFFF',
      text: '#1C1917',
      textSecondary: '#57534E',
      textMuted: '#A8A29E',
      border: '#FED7AA',
      borderLight: '#FFF7ED',
      tabbar: '#FFFFFF',
      tabbarActive: '#F97316',
      tabbarInactive: '#A8A29E',
      overlay: 'rgba(28,25,23,0.5)',
    },
  },
  lavender: {
    name: 'lavender',
    displayName: 'Lavender',
    isDark: false,
    colors: {
      primary: '#8B5CF6',
      primaryLight: '#C4B5FD',
      primaryDark: '#6D28D9',
      secondary: '#D946EF',
      secondaryLight: '#F0ABFC',
      accent: '#FBBF24',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      background: '#FAF5FF',
      surface: '#FFFFFF',
      card: '#FFFFFF',
      cardElevated: '#FFFFFF',
      text: '#1E1B4B',
      textSecondary: '#5B21B6',
      textMuted: '#A5B4FC',
      border: '#EDE9FE',
      borderLight: '#FAF5FF',
      tabbar: '#FFFFFF',
      tabbarActive: '#8B5CF6',
      tabbarInactive: '#A5B4FC',
      overlay: 'rgba(30,27,75,0.5)',
    },
  },
  midnight: {
    name: 'midnight',
    displayName: 'Midnight',
    isDark: true,
    colors: {
      primary: '#3B82F6',
      primaryLight: '#60A5FA',
      primaryDark: '#1D4ED8',
      secondary: '#8B5CF6',
      secondaryLight: '#A78BFA',
      accent: '#FBBF24',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      background: '#0F172A',
      surface: '#1E293B',
      card: '#1E293B',
      cardElevated: '#334155',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
      border: '#334155',
      borderLight: '#1E293B',
      tabbar: '#0F172A',
      tabbarActive: '#3B82F6',
      tabbarInactive: '#64748B',
      overlay: 'rgba(0,0,0,0.7)',
    },
  },
};

export const themeNames = Object.keys(themes);
export const defaultTheme = 'ocean';
export type ThemeName = keyof typeof themes;
