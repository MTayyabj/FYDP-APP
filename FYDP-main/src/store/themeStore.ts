import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../constants/themes';
import { themes, defaultTheme } from '../constants/themes';

interface ThemeState {
  currentTheme: string;
  theme: Theme;
  setTheme: (name: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      currentTheme: defaultTheme,
      theme: themes[defaultTheme],
      setTheme: (name) => set({ currentTheme: name, theme: themes[name] || themes[defaultTheme] }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ currentTheme: state.currentTheme }),
    }
  )
);
