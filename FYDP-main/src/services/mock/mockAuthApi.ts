import { AuthService, AuthSession, SignupData } from '../../types/auth';
import { mockCurrentUser } from '../../mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAuthApi: AuthService = {
  async login(email: string, password: string): Promise<AuthSession> {
    await delay(800);
    if (email === 'demo@example.com' && password === 'demo123') {
      return {
        user: mockCurrentUser,
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      };
    }
    if (!email || !password) {
      throw { success: false, message: 'Please enter your email and password.', code: 'MISSING_CREDENTIALS' };
    }
    throw { success: false, message: 'Invalid email or password.', code: 'INVALID_CREDENTIALS' };
  },

  async signup(data: SignupData): Promise<AuthSession> {
    await delay(1000);
    if (!data.email || !data.password || !data.username) {
      throw { success: false, message: 'All fields are required.', code: 'MISSING_FIELDS' };
    }
    const newUser = { ...mockCurrentUser, username: data.username, displayName: data.fullName, email: data.email, level: 1, xp: 0, streak: 0 };
    return {
      user: newUser,
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
    };
  },

  async verifyEmail(token: string): Promise<void> {
    await delay(600);
    if (!token) throw { success: false, message: 'Invalid verification token.', code: 'INVALID_TOKEN' };
  },

  async resendVerificationEmail(email: string): Promise<void> {
    await delay(500);
    if (!email) throw { success: false, message: 'Email is required.', code: 'MISSING_EMAIL' };
  },

  async forgotPassword(email: string): Promise<void> {
    await delay(500);
    if (!email) throw { success: false, message: 'Email is required.', code: 'MISSING_EMAIL' };
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await delay(600);
    if (!token || !password) throw { success: false, message: 'Invalid reset token or password.', code: 'INVALID_RESET' };
  },

  async loginWithGoogle(): Promise<AuthSession> {
    await delay(800);
    return {
      user: mockCurrentUser,
      accessToken: 'mock_google_token_' + Date.now(),
      refreshToken: 'mock_google_refresh_' + Date.now(),
    };
  },

  async loginWithFacebook(): Promise<AuthSession> {
    await delay(800);
    return {
      user: mockCurrentUser,
      accessToken: 'mock_fb_token_' + Date.now(),
      refreshToken: 'mock_fb_refresh_' + Date.now(),
    };
  },

  async logout(): Promise<void> {
    await delay(200);
  },

  async getCurrentUser(): Promise<typeof mockCurrentUser | null> {
    await delay(200);
    return mockCurrentUser;
  },
};
