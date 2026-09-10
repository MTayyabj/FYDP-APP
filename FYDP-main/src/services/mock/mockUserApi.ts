import { UserService } from '../../types/user';
import { User, UserPreferences } from '../../types/auth';
import { Achievement, UserStats } from '../../types/user';
import { mockUsers, mockCurrentUser, mockAchievements, mockStats } from '../../mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockUserApi: UserService = {
  async getUser(userId: string): Promise<User> {
    await delay(400);
    const user = mockUsers.find((u) => u.id === userId) || mockCurrentUser;
    return user;
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    await delay(500);
    const user = mockUsers.find((u) => u.id === userId) || mockCurrentUser;
    return { ...user, ...updates };
  },

  async updatePreferences(_userId: string, prefs: Partial<UserPreferences>): Promise<User> {
    await delay(400);
    return { ...mockCurrentUser, preferences: { ...mockCurrentUser.preferences, ...prefs } };
  },

  async getAchievements(_userId: string): Promise<Achievement[]> {
    await delay(400);
    return mockAchievements;
  },

  async getStats(_userId: string): Promise<UserStats> {
    await delay(400);
    return mockStats;
  },
};
