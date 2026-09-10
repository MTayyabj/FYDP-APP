import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../types/auth';
import { config } from '../constants/config';

interface PreferencesState {
  preferences: UserPreferences;
  selectedTopics: string[];
  selectedLevel: 'beginner' | 'intermediate' | 'advanced';
  dailyGoal: number;
  contentDifficulty: 'easy' | 'medium' | 'advanced';

  setTopics: (topics: string[]) => void;
  setLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  setDailyGoal: (minutes: number) => void;
  setContentDifficulty: (level: 'easy' | 'medium' | 'advanced') => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetOnboarding: () => void;
}

const defaultPreferences: UserPreferences = {
  learningTopics: [],
  currentLevel: 'beginner',
  dailyGoalMinutes: config.dailyGoalOptions[1],
  contentDifficulty: 'medium',
  notificationsEnabled: true,
  soundEnabled: true,
  animationsEnabled: true,
  profileVisibility: 'public',
  friendRequestsEnabled: true,
  showOnlineStatus: true,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      selectedTopics: [],
      selectedLevel: 'beginner',
      dailyGoal: config.dailyGoalOptions[1],
      contentDifficulty: 'medium',

      setTopics: (topics) =>
        set((state) => ({
          selectedTopics: topics,
          preferences: { ...state.preferences, learningTopics: topics },
        })),
      setLevel: (level) =>
        set((state) => ({
          selectedLevel: level,
          preferences: { ...state.preferences, currentLevel: level },
        })),
      setDailyGoal: (minutes) =>
        set((state) => ({
          dailyGoal: minutes,
          preferences: { ...state.preferences, dailyGoalMinutes: minutes },
        })),
      setContentDifficulty: (difficulty) =>
        set((state) => ({
          contentDifficulty: difficulty,
          preferences: { ...state.preferences, contentDifficulty: difficulty },
        })),
      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),
      resetOnboarding: () =>
        set({
          preferences: defaultPreferences,
          selectedTopics: [],
          selectedLevel: 'beginner',
          dailyGoal: config.dailyGoalOptions[1],
          contentDifficulty: 'medium',
        }),
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
