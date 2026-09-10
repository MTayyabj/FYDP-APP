import { LeaderboardService } from '../../types/leaderboard';
import { LeaderboardEntry, LeaderboardTab } from '../../types/leaderboard';
import { mockLeaderboard } from '../../mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockLeaderboardApi: LeaderboardService = {
  async getLeaderboard(tab: LeaderboardTab): Promise<LeaderboardEntry[]> {
    await delay(600);
    if (tab === 'friends') {
      return mockLeaderboard.filter((e) => e.user.id !== 'user_007');
    }
    return mockLeaderboard;
  },
};
