export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  bio?: string;
  level: number;
  xp: number;
  streak: number;
  longestStreak: number;
  friendsCount: number;
  preferences: UserPreferences;
  character: CharacterConfig;
  isOnline?: boolean;
  createdAt: string;
}

export interface UserPreferences {
  learningTopics: string[];
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  dailyGoalMinutes: number;
  contentDifficulty: 'easy' | 'medium' | 'advanced';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  profileVisibility: 'public' | 'private';
  friendRequestsEnabled: boolean;
  showOnlineStatus: boolean;
}

export interface CharacterConfig {
  characterId: string;
  outfit: string;
  accessory: string;
  background: string;
  expression: string;
}

export interface SignupData {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthService {
  login(email: string, password: string): Promise<AuthSession>;
  signup(data: SignupData): Promise<AuthSession>;
  verifyEmail(token: string): Promise<void>;
  resendVerificationEmail(email: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  loginWithGoogle(): Promise<AuthSession>;
  loginWithFacebook(): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
