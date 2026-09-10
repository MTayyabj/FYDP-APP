import { FriendService } from '../../types/friend';
import { Friend, FriendRequest } from '../../types/friend';
import { User } from '../../types/auth';
import { mockFriends, mockFriendRequests, mockUsers } from '../../mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockFriendApi: FriendService = {
  async getFriends(): Promise<Friend[]> {
    await delay(500);
    return mockFriends;
  },

  async getFriendRequests(): Promise<FriendRequest[]> {
    await delay(400);
    return mockFriendRequests;
  },

  async sendFriendRequest(_userId: string): Promise<void> {
    await delay(400);
  },

  async acceptFriendRequest(requestId: string): Promise<void> {
    await delay(400);
  },

  async rejectFriendRequest(requestId: string): Promise<void> {
    await delay(300);
  },

  async removeFriend(_friendId: string): Promise<void> {
    await delay(300);
  },

  async searchUsers(query: string): Promise<User[]> {
    await delay(400);
    if (!query.trim()) return mockUsers.slice(1, 5);
    return mockUsers.filter(
      (u) =>
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.displayName.toLowerCase().includes(query.toLowerCase())
    );
  },

  async getSocialFriends(provider: 'facebook' | 'google'): Promise<User[]> {
    await delay(600);
    return mockUsers.slice(1, 5).map((u) => ({
      ...u,
      bio: `Connected via ${provider}`,
    }));
  },
};
