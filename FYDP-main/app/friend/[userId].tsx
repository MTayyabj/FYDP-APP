import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { AppText } from '../../src/components/common/AppText';
import { AppCard } from '../../src/components/common/AppCard';
import { Avatar } from '../../src/components/common/Avatar';
import { Badge } from '../../src/components/common/Badge';
import { AppButton } from '../../src/components/common/AppButton';
import { Skeleton } from '../../src/components/common/Skeleton';
import { spacing, radius, shadows } from '../../src/constants/typography';
import { userService, friendService } from '../../src/services';
import { User } from '../../src/types/auth';
import { ArrowLeft, MessageCircle, UserMinus, Flame, Zap, BookOpen, Trophy } from 'lucide-react-native';

export default function FriendProfileScreen() {
  const { theme } = useThemeStore();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [friendUser, setFriendUser] = useState<User | null>(null);
  const [stats, setStats] = useState<{ totalXP: number; level: number; currentStreak: number; lessonsCompleted: number; testsCompleted: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [userData, statsData, friends] = await Promise.all([
        userService.getUser(userId),
        userService.getStats(userId),
        friendService.getFriends(),
      ]);
      setFriendUser(userData);
      setStats(statsData);
      setIsFriend(friends.some((f) => f.userId === userId));
    } catch {
      setFriendUser(null);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleRemoveFriend = async () => {
    if (!userId) return;
    try {
      await friendService.removeFriend(userId);
      router.back();
    } catch {
      // error
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={{ paddingHorizontal: spacing.xxl, gap: spacing.lg, paddingTop: spacing.xl }}>
          <Skeleton width="100%" height={200} radius={radius.xl} />
          <Skeleton width="100%" height={80} radius={radius.lg} />
        </View>
      </SafeAreaView>
    );
  }

  if (!friendUser) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorState}>
          <AppText variant="headingM">User not found</AppText>
          <AppButton title="Go Back" onPress={() => router.back()} variant="primary" style={{ marginTop: spacing.lg }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <AppText variant="headingS">Friend Profile</AppText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {/* Profile Header */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, shadows.small]}>
          <View style={[styles.avatarRing, { borderColor: theme.colors.primary }]}>
            <Avatar name={friendUser.displayName} size={80} showOnlineStatus isOnline={friendUser.isOnline} />
          </View>
          <AppText variant="headingL" style={{ marginTop: spacing.md }}>{friendUser.displayName}</AppText>
          <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary }}>@{friendUser.username}</AppText>
          {friendUser.bio && (
            <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, maxWidth: 280 }}>
              {friendUser.bio}
            </AppText>
          )}
          <View style={styles.headerBadges}>
            <Badge type="streak" value={`${friendUser.streak} days`} size="md" />
            <Badge type="level" value={`Level ${friendUser.level}`} size="md" />
            <Badge type="xp" value={`${friendUser.xp} XP`} size="md" />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatBox icon={Flame} label="Streak" value={`${friendUser.streak}`} color="#F97316" />
          <StatBox icon={Zap} label="Total XP" value={`${stats?.totalXP || friendUser.xp}`} color="#FBBF24" />
          <StatBox icon={BookOpen} label="Lessons" value={`${stats?.lessonsCompleted || 0}`} color={theme.colors.primary} />
          <StatBox icon={Trophy} label="Tests" value={`${stats?.testsCompleted || 0}`} color={theme.colors.success} />
        </View>

        {/* Learning Interests */}
        <View style={styles.sectionHeader}>
          <AppText variant="headingS">Learning Interests</AppText>
        </View>
        <View style={styles.interestsRow}>
          {friendUser.preferences.learningTopics.map((topic) => (
            <View key={topic} style={[styles.interestTag, { backgroundColor: theme.colors.primaryLight }]}>
              <AppText variant="label" style={{ color: theme.colors.primaryDark, textTransform: 'capitalize' }}>
                {topic.replace('_', ' ')}
              </AppText>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={{ marginTop: spacing.xxl, gap: spacing.md }}>
          {isFriend ? (
            <>
              <AppButton
                title="Send Message"
                onPress={() => router.push('/chatbot')}
                variant="primary"
                size="lg"
                fullWidth
                icon={<MessageCircle size={20} color="#FFFFFF" />}
              />
              <AppButton
                title="Remove Friend"
                onPress={handleRemoveFriend}
                variant="outline"
                size="lg"
                fullWidth
                icon={<UserMinus size={20} color={theme.colors.error} />}
              />
            </>
          ) : (
            <AppButton
              title="Send Friend Request"
              onPress={async () => { await friendService.sendFriendRequest(friendUser.id); }}
              variant="primary"
              size="lg"
              fullWidth
            />
          )}
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ icon: Icon, label, value, color }: { icon: typeof Flame; label: string; value: string; color: string }) {
  const { theme } = useThemeStore();
  return (
    <View style={[styles.statBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={[styles.statBoxIcon, { backgroundColor: color + '20' }]}>
        <Icon size={18} color={color} />
      </View>
      <AppText variant="headingS" style={{ fontSize: 18 }}>{value}</AppText>
      <AppText variant="caption" style={{ color: theme.colors.textMuted }}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  scrollContent: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxl },
  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  profileCard: { alignItems: 'center', padding: spacing.xl, borderRadius: radius.xl, borderWidth: 1 },
  avatarRing: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  headerBadges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap', justifyContent: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
  statBox: { width: '48%', flexGrow: 1, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center', gap: spacing.xs },
  statBoxIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { marginTop: spacing.xxl, marginBottom: spacing.md },
  interestsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  interestTag: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.round },
});
