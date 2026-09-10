import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, SignupData } from '../types/auth';
import { authService } from '../services';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnboardingComplete: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  setOnboardingComplete: (complete: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isOnboardingComplete: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const session = await authService.login(email, password);
          set({
            user: session.user,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: unknown) {
          const message = (err as { message?: string })?.message || 'Login failed.';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      signup: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const session = await authService.signup(data);
          set({
            user: session.user,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            isAuthenticated: true,
            isOnboardingComplete: false,
            isLoading: false,
          });
        } catch (err: unknown) {
          const message = (err as { message?: string })?.message || 'Signup failed.';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const session = await authService.loginWithGoogle();
          set({
            user: session.user,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: unknown) {
          const message = (err as { message?: string })?.message || 'Google login failed.';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      loginWithFacebook: async () => {
        set({ isLoading: true, error: null });
        try {
          const session = await authService.loginWithFacebook();
          set({
            user: session.user,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: unknown) {
          const message = (err as { message?: string })?.message || 'Facebook login failed.';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        await authService.logout();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isOnboardingComplete: false,
          isLoading: false,
        });
      },

      setOnboardingComplete: (complete) => set({ isOnboardingComplete: complete }),
      updateUser: (updates) =>
        set((state) => (state.user ? { user: { ...state.user, ...updates } } : {})),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isOnboardingComplete: state.isOnboardingComplete,
      }),
    }
  )
);
