import { User, UserPreferences } from './auth';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export interface UserStats {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  activeDays: string[];
  lessonsCompleted: number;
  testsCompleted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalStudyTimeMinutes: number;
  weeklyActivity: { day: string; minutes: number }[];
}

export interface UserService {
  getUser(userId: string): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<User>;
  updatePreferences(userId: string, prefs: Partial<UserPreferences>): Promise<User>;
  getAchievements(userId: string): Promise<Achievement[]>;
  getStats(userId: string): Promise<UserStats>;
}
