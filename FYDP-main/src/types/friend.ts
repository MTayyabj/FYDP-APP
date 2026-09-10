import { User } from './auth';

export type FriendStatus = 'friend' | 'pending_incoming' | 'pending_outgoing' | 'none';

export interface Friend {
  id: string;
  userId: string;
  user: User;
  status: FriendStatus;
  since?: string;
  mutualFriends: number;
}

export interface FriendRequest {
  id: string;
  fromUser: User;
  toUserId: string;
  createdAt: string;
}

export interface FriendService {
  getFriends(): Promise<Friend[]>;
  getFriendRequests(): Promise<FriendRequest[]>;
  sendFriendRequest(userId: string): Promise<void>;
  acceptFriendRequest(requestId: string): Promise<void>;
  rejectFriendRequest(requestId: string): Promise<void>;
  removeFriend(friendId: string): Promise<void>;
  searchUsers(query: string): Promise<User[]>;
  getSocialFriends(provider: 'facebook' | 'google'): Promise<User[]>;
}
