import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../src/store/themeStore';
import { useAuthStore } from '../../src/store/authStore';
import { AppText } from '../../src/components/common/AppText';
import { AppCard } from '../../src/components/common/AppCard';
import { Avatar } from '../../src/components/common/Avatar';
import { Skeleton } from '../../src/components/common/Skeleton';
import { Badge } from '../../src/components/common/Badge';
import { spacing, radius, shadows } from '../../src/constants/typography';
import { leaderboardService } from '../../src/services';
import { LeaderboardEntry, LeaderboardTab } from '../../src/types/leaderboard';
import { Crown, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

const tabs: { id: LeaderboardTab; label: string }[] = [
  { id: 'global', label: 'Global' },
  { id: 'friends', label: 'Friends' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
];

export default function LeaderboardScreen() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('global');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeaderboard = useCallback(async (tab: LeaderboardTab) => {
    setLoading(true);
    try {
      const data = await leaderboardService.getLeaderboard(tab);
      setEntries(data);
    } catch {
      setEntries([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLeaderboard(activeTab);
  }, [activeTab, loadLeaderboard]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboard(activeTab);
    setRefreshing(false);
  };

  const top3 = entries.slice(0, 3);
  const restEntries = entries.slice(3);
  const myEntry = entries.find((e) => e.user.id === user?.id);

  const rankIcon = (entry: LeaderboardEntry) => {
    if (!entry.previousRank) return <Minus size={14} color={theme.colors.textMuted} />;
    if (entry.rank < entry.previousRank) return <TrendingUp size={14} color={theme.colors.success} />;
    if (entry.rank > entry.previousRank) return <TrendingDown size={14} color={theme.colors.error} />;
    return <Minus size={14} color={theme.colors.textMuted} />;
  };

  const podiumColors = ['#FBBF24', '#94A3B8', '#CD7F32'];
  const podiumHeights = [80, 64, 52];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        <View style={styles.header}>
          <AppText variant="headingL">Leaderboard</AppText>
          <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary, marginTop: spacing.xs }}>
            Compete with learners worldwide
          </AppText>
        </View>

        {/* Tab Switcher */}
        <View style={[styles.tabSwitcher, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
              style={[
                styles.tab,
                activeTab === tab.id && { backgroundColor: theme.colors.primary },
              ]}
            >
              <AppText
                variant="label"
                style={{ color: activeTab === tab.id ? '#FFFFFF' : theme.colors.textSecondary }}
              >
                {tab.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} width="100%" height={64} radius={radius.lg} />
            ))}
          </View>
        ) : (
          <>
            {/* Podium - Top 3 */}
            {top3.length === 3 && (
              <View style={styles.podiumContainer}>
                {[1, 0, 2].map((index) => {
                  const entry = top3[index];
                  if (!entry) return null;
                  return (
                    <View key={entry.user.id} style={styles.podiumColumn}>
                      <View style={[styles.podiumCrown, { backgroundColor: podiumColors[index] }]}>
                        {index === 0 && <Crown size={20} color="#FFFFFF" />}
                        <AppText variant="headingS" style={{ color: '#FFFFFF' }}>{index + 1}</AppText>
                      </View>
                      <Avatar
                        name={entry.user.displayName}
                        size={index === 0 ? 60 : 48}
                        showOnlineStatus
                        isOnline={entry.user.isOnline}
                      />
                      <AppText variant="label" style={{ marginTop: spacing.xs, textAlign: 'center' }} numberOfLines={1}>
                        {entry.user.displayName.split(' ')[0]}
                      </AppText>
                      <AppText variant="caption" style={{ color: theme.colors.primary }}>
                        {entry.xp} XP
                      </AppText>
                      <View
                        style={[
                          styles.podiumBase,
                          {
                            backgroundColor: podiumColors[index],
                            height: podiumHeights[index],
                          },
                        ]}
                      />
                    </View>
                  );
                })}
              </View>
            )}

            {/* My Rank Card */}
            {myEntry && (
              <View style={[styles.myRankCard, { backgroundColor: theme.colors.primary }, shadows.medium]}>
                <AppText variant="headingM" style={{ color: '#FFFFFF' }}>#{myEntry.rank}</AppText>
                <Avatar name={myEntry.user.displayName} size={40} />
                <View style={{ flex: 1 }}>
                  <AppText variant="headingS" style={{ color: '#FFFFFF' }}>You</AppText>
                  <AppText variant="caption" style={{ color: 'rgba(255,255,255,0.8)' }}>{myEntry.xp} XP · Level {myEntry.level}</AppText>
                </View>
                {rankIcon(myEntry)}
              </View>
            )}

            {/* Rest of the leaderboard */}
            <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
              {restEntries.map((entry) => (
                <AppCard key={entry.user.id} padding="none" style={styles.rankCard}>
                  <View style={styles.rankCardContent}>
                    <View style={[styles.rankNumber, { backgroundColor: theme.colors.primaryLight }]}>
                      <AppText variant="headingS" style={{ color: theme.colors.primaryDark }}>{entry.rank}</AppText>
                    </View>
                    <Avatar
                      name={entry.user.displayName}
                      size={44}
                      showOnlineStatus
                      isOnline={entry.user.isOnline}
                    />
                    <View style={{ flex: 1 }}>
                      <AppText variant="headingS" style={{ fontSize: 16 }}>{entry.user.displayName}</AppText>
                      <View style={styles.rankBadges}>
                        <Badge type="level" value={`Lvl ${entry.level}`} size="sm" />
                        <Badge type="xp" value={`${entry.xp} XP`} size="sm" />
                      </View>
                    </View>
                    {rankIcon(entry)}
                  </View>
                </AppCard>
              ))}
            </View>
          </>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xxl, paddingTop: spacing.lg },
  header: { marginBottom: spacing.lg },
  tabSwitcher: { flexDirection: 'row', padding: 4, borderRadius: radius.lg, borderWidth: 1, gap: 2 },
  tab: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: radius.md },
  podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: spacing.md, marginTop: spacing.xl, marginBottom: spacing.xl },
  podiumColumn: { alignItems: 'center', flex: 1 },
  podiumCrown: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  podiumBase: { width: '100%', marginTop: spacing.xs, borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md },
  myRankCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderRadius: radius.lg, gap: spacing.md },
  rankCard: { padding: spacing.md },
  rankCardContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rankNumber: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rankBadges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
});
