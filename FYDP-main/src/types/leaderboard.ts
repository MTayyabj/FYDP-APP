import { User } from './auth';

export interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
  level: number;
  previousRank?: number;
}

export type LeaderboardTab = 'global' | 'friends' | 'weekly' | 'monthly';

export interface LeaderboardService {
  getLeaderboard(tab: LeaderboardTab): Promise<LeaderboardEntry[]>;
}
