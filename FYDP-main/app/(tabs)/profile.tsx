import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { useAuthStore } from '../../src/store/authStore';
import { useLearningStore } from '../../src/store/learningStore';
import { AppText } from '../../src/components/common/AppText';
import { AppCard } from '../../src/components/common/AppCard';
import { Avatar } from '../../src/components/common/Avatar';
import { Badge } from '../../src/components/common/Badge';
import { Character } from '../../src/components/common/Character';
import { ProgressBar } from '../../src/components/common/ProgressBar';
import { Skeleton } from '../../src/components/common/Skeleton';
import { spacing, radius, shadows } from '../../src/constants/typography';
import { userService } from '../../src/services';
import { Achievement, UserStats } from '../../src/types/user';
import { Settings, Edit3, Flame, Zap, Trophy, BookOpen, Target, Star, Award, Footprints, Users } from 'lucide-react-native';

const achievementIcons: Record<string, typeof Star> = {
  Footprints, Flame, Target, Star, Trophy, Users, Award,
};

export default function ProfileScreen() {
  const { theme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { stats, setStats } = useLearningStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, achData] = await Promise.all([
        userService.getStats(user?.id || 'user_001'),
        userService.getAchievements(user?.id || 'user_001'),
      ]);
      setStats(statsData);
      setAchievements(achData);
    } catch {
      // empty state
    }
    setLoading(false);
  }, [user?.id, setStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const xpForCurrentLevel = stats ? stats.totalXP : user?.xp || 0;
  const xpForNextLevel = (user?.level || 1) * 300;
  const levelProgress = Math.min((xpForCurrentLevel % xpForNextLevel) / xpForNextLevel * 100, 100);

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  if (loading && !stats) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={{ paddingHorizontal: spacing.xxl, gap: spacing.lg, paddingTop: spacing.xl }}>
          <Skeleton width="100%" height={200} radius={radius.xl} />
          <Skeleton width="100%" height={120} radius={radius.lg} />
          <Skeleton width="100%" height={120} radius={radius.lg} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {/* Header with actions */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.push('/settings')} activeOpacity={0.7}>
            <Settings size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/edit-profile')}
            activeOpacity={0.7}
            style={[styles.editBtn, { backgroundColor: theme.colors.primaryLight }]}
          >
            <Edit3 size={18} color={theme.colors.primary} />
            <AppText variant="label" style={{ color: theme.colors.primary, marginLeft: spacing.xs }}>Edit</AppText>
          </TouchableOpacity>
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatarRing, { borderColor: theme.colors.primary }]}>
            <Avatar name={user?.displayName || 'User'} size={88} showOnlineStatus isOnline={user?.isOnline} />
          </View>
          <AppText variant="headingL" style={{ marginTop: spacing.md }}>{user?.displayName || 'Learner'}</AppText>
          <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary }}>@{user?.username || 'user'}</AppText>
          {user?.bio && (
            <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, maxWidth: 280 }}>
              {user.bio}
            </AppText>
          )}
          <View style={styles.headerBadges}>
            <Badge type="streak" value={`${user?.streak || 0} days`} size="md" />
            <Badge type="level" value={`Level ${user?.level || 1}`} size="md" />
            <Badge type="gems" value="1250" size="md" />
          </View>
        </View>

        {/* Level Progress */}
        <AppCard padding="md" style={{ marginTop: spacing.lg }}>
          <View style={styles.levelHeader}>
            <AppText variant="headingS">Level {user?.level || 1}</AppText>
            <AppText variant="caption" style={{ color: theme.colors.textSecondary }}>
              {xpForCurrentLevel % xpForNextLevel} / {xpForNextLevel} XP to Level {(user?.level || 1) + 1}
            </AppText>
          </View>
          <ProgressBar progress={levelProgress} height={10} style={{ marginTop: spacing.sm }} />
        </AppCard>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard icon={Flame} label="Streak" value={`${user?.streak || 0}`} color="#F97316" />
          <StatCard icon={Zap} label="Total XP" value={`${xpForCurrentLevel}`} color="#FBBF24" />
          <StatCard icon={BookOpen} label="Lessons" value={`${stats?.lessonsCompleted || 0}`} color={theme.colors.primary} />
          <StatCard icon={Target} label="Accuracy" value={`${stats ? Math.round(stats.correctAnswers / (stats.correctAnswers + stats.incorrectAnswers) * 100) : 0}%`} color={theme.colors.success} />
        </View>

        {/* Weekly Activity */}
        <View style={styles.sectionHeader}>
          <AppText variant="headingS">Weekly Activity</AppText>
        </View>
        <AppCard padding="md">
          <View style={styles.activityChart}>
            {stats?.weeklyActivity.map((day) => {
              const maxMin = Math.max(...stats.weeklyActivity.map((d) => d.minutes), 1);
              const heightPct = (day.minutes / maxMin) * 100;
              return (
                <View key={day.day} style={styles.activityBarCol}>
                  <View style={styles.activityBarTrack}>
                    <View
                      style={[
                        styles.activityBarFill,
                        {
                          height: `${Math.max(heightPct, day.minutes > 0 ? 10 : 2)}%`,
                          backgroundColor: day.minutes > 0 ? theme.colors.primary : theme.colors.border,
                        },
                      ]}
                    />
                  </View>
                  <AppText variant="caption" style={{ color: theme.colors.textMuted, fontSize: 11 }}>{day.day}</AppText>
                </View>
              );
            })}
          </View>
        </AppCard>

        {/* Character Preview */}
        <View style={styles.sectionHeader}>
          <AppText variant="headingS">My Character</AppText>
          <TouchableOpacity onPress={() => router.push('/character-customize')}>
            <AppText variant="label" style={{ color: theme.colors.primary }}>Customize</AppText>
          </TouchableOpacity>
        </View>
        <View style={[styles.characterCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, shadows.small]}>
          <Character
            character={user?.character || { characterId: 'lumi_default', outfit: 'outfit_default', accessory: 'none', background: 'bg_default', expression: 'happy' }}
            size={100}
            expression="proud"
          />
          <View style={{ flex: 1 }}>
            <AppText variant="headingS">Lumi</AppText>
            <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary, marginTop: spacing.xs }}>
              Your learning companion
            </AppText>
            <TouchableOpacity
              onPress={() => router.push('/character-customize')}
              activeOpacity={0.7}
              style={[styles.customizeBtn, { backgroundColor: theme.colors.primary }]}
            >
              <AppText variant="label" style={{ color: '#FFFFFF' }}>Customize</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.sectionHeader}>
          <AppText variant="headingS">Achievements</AppText>
          <AppText variant="caption" style={{ color: theme.colors.textMuted }}>
            {unlockedAchievements.length}/{achievements.length}
          </AppText>
        </View>
        <View style={styles.achievementsGrid}>
          {achievements.map((ach) => {
            const Icon = achievementIcons[ach.icon] || Star;
            return (
              <View
                key={ach.id}
                style={[
                  styles.achievementCard,
                  {
                    backgroundColor: ach.unlocked ? theme.colors.card : theme.colors.surface,
                    borderColor: ach.unlocked ? theme.colors.primary : theme.colors.border,
                    opacity: ach.unlocked ? 1 : 0.6,
                  },
                ]}
              >
                <View style={[styles.achievementIcon, { backgroundColor: ach.unlocked ? theme.colors.primaryLight : theme.colors.border }]}>
                  <Icon size={20} color={ach.unlocked ? theme.colors.primary : theme.colors.textMuted} />
                </View>
                <AppText variant="label" style={{ fontSize: 12, textAlign: 'center', marginTop: spacing.xs }} numberOfLines={2}>
                  {ach.title}
                </AppText>
                {!ach.unlocked && ach.progress !== undefined && ach.target !== undefined && (
                  <View style={{ width: '100%', marginTop: spacing.xs }}>
                    <ProgressBar progress={(ach.progress / ach.target) * 100} height={4} />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Logout */}
        <AppCard padding="md" style={{ marginTop: spacing.xxl }}>
          <TouchableOpacity onPress={() => logout()} activeOpacity={0.7} style={styles.logoutRow}>
            <AppText variant="body" style={{ color: theme.colors.error }}>Log Out</AppText>
          </TouchableOpacity>
        </AppCard>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Flame; label: string; value: string; color: string }) {
  const { theme } = useThemeStore();
  return (
    <AppCard padding="sm" style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Icon size={18} color={color} />
      </View>
      <AppText variant="headingS" style={{ fontSize: 18, marginTop: spacing.xs }}>{value}</AppText>
      <AppText variant="caption" style={{ color: theme.colors.textMuted }}>{label}</AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xxl, paddingTop: spacing.lg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  editBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.round },
  profileHeader: { alignItems: 'center', paddingVertical: spacing.lg },
  avatarRing: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  headerBadges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap', justifyContent: 'center' },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
  statCard: { width: '48%', flexGrow: 1, alignItems: 'flex-start' },
  statIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xxl, marginBottom: spacing.md },
  activityChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, gap: spacing.xs },
  activityBarCol: { flex: 1, alignItems: 'center', gap: spacing.xs },
  activityBarTrack: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  activityBarFill: { width: '100%', borderRadius: 4 },
  characterCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, gap: spacing.lg },
  customizeBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.md, marginTop: spacing.md, alignSelf: 'flex-start' },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  achievementCard: { width: '31%', flexGrow: 1, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center' },
  achievementIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  logoutRow: { alignItems: 'center', paddingVertical: spacing.xs },
});
