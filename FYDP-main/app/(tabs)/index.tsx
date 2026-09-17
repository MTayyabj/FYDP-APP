import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { useAuthStore } from '../../src/store/authStore';
import { useLearningStore } from '../../src/store/learningStore';
import { AppText } from '../../src/components/common/AppText';
import { AppCard } from '../../src/components/common/AppCard';
import { AppButton } from '../../src/components/common/AppButton';
import { Character } from '../../src/components/common/Character';
import { ProgressBar } from '../../src/components/common/ProgressBar';
import { Badge } from '../../src/components/common/Badge';
import { Avatar } from '../../src/components/common/Avatar';
import { spacing, radius, shadows } from '../../src/constants/typography';
import { courseService, userService } from '../../src/services';
import { Course } from '../../src/types/course';
import { UserStats } from '../../src/types/user';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Zap, MessageCircle, ShoppingBag, Play, BookOpen, ChevronRight, Award, Trophy } from 'lucide-react-native';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { courses, setCourses, stats, setStats } = useLearningStore();
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [courseData, statsData] = await Promise.all([
        courseService.getCourses(),
        userService.getStats(user?.id || 'user_001'),
      ]);
      setCourses(courseData);
      setStats(statsData);
    } catch {
      // use empty state
    }
  }, [user?.id, setCourses, setStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const currentCourse = courses[0];
  const dailyGoalMinutes = user?.preferences.dailyGoalMinutes || 15;
  const todayProgress = stats ? Math.min((stats.weeklyActivity[0]?.minutes || 8) / dailyGoalMinutes * 100, 100) : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary }}>{getGreeting()},</AppText>
            <AppText variant="headingL">{user?.displayName?.split(' ')[0] || 'Learner'}!</AppText>
          </View>
          <View style={styles.headerBadges}>
            <Badge type="streak" value={`${user?.streak || 0}`} size="sm" />
            <Badge type="gems" value="1250" size="sm" />
          </View>
        </View>

        {/* Character + Continue Learning Card */}
        {currentCourse && (
          <View style={[styles.continueCard, { backgroundColor: theme.colors.primary }, shadows.large]}>
            <View style={styles.continueCardContent}>
              <View style={styles.continueLeft}>
                <AppText variant="caption" style={{ color: 'rgba(255,255,255,0.8)' }}>CONTINUE LEARNING</AppText>
                <AppText variant="headingM" style={{ color: '#FFFFFF', marginTop: spacing.xs }}>{currentCourse.title}</AppText>
                <AppText variant="bodySmall" style={{ color: 'rgba(255,255,255,0.8)', marginTop: spacing.xs }}>
                  {currentCourse.levels.find(l => l.id === currentCourse.currentLevelId)?.title || 'Next Level'}
                </AppText>
                <View style={styles.continueProgress}>
                  <ProgressBar progress={currentCourse.progress} height={6} color="#FFFFFF" trackColor="rgba(255,255,255,0.3)" />
                  <AppText variant="caption" style={{ color: 'rgba(255,255,255,0.8)', marginTop: spacing.xs }}>{currentCourse.progress}% complete</AppText>
                </View>
                <TouchableOpacity
                  onPress={() => router.push('/lesson/lesson_4')}
                  activeOpacity={0.8}
                  style={[styles.continueBtn, { backgroundColor: '#FFFFFF' }]}
                >
                  <Play size={18} color={theme.colors.primary} />
                  <AppText variant="button" style={{ color: theme.colors.primary, marginLeft: spacing.xs }}>Continue</AppText>
                </TouchableOpacity>
              </View>
              <View style={styles.continueChar}>
                <Character character={user?.character || { characterId: 'lumi_default', outfit: 'outfit_default', accessory: 'none', background: 'bg_default', expression: 'happy' }} size={90} expression="excited" />
              </View>
            </View>
          </View>
        )}

        {/* Daily Goal */}
        <AppCard padding="md" style={{ marginTop: spacing.lg }}>
          <View style={styles.cardHeader}>
            <View style={styles.goalLeft}>
              <AppText variant="headingS">Daily Goal</AppText>
              <AppText variant="caption" style={{ color: theme.colors.textSecondary, marginTop: 2 }}>
                {stats?.weeklyActivity[0]?.minutes || 8} / {dailyGoalMinutes} min today
              </AppText>
            </View>
            <View style={[styles.goalIcon, { backgroundColor: theme.colors.primaryLight }]}>
              <Flame size={20} color={theme.colors.primary} />
            </View>
          </View>
          <ProgressBar progress={todayProgress} height={10} style={{ marginTop: spacing.md }} />
        </AppCard>

        {/* Streak Card */}
        <View style={[styles.streakCard, { backgroundColor: theme.colors.warning }, shadows.small]}>
          <Flame size={28} color="#FFFFFF" />
          <View>
            <AppText variant="headingM" style={{ color: '#FFFFFF' }}>{user?.streak || 0} day streak</AppText>
            <AppText variant="caption" style={{ color: 'rgba(255,255,255,0.9)' }}>Keep it going!</AppText>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/learn')}
            activeOpacity={0.7}
            style={[styles.quickAction, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, shadows.small]}
          >
            <View style={[styles.quickIcon, { backgroundColor: theme.colors.primaryLight }]}>
              <BookOpen size={22} color={theme.colors.primary} />
            </View>
            <AppText variant="label" style={{ marginTop: spacing.sm }}>Courses</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/chatbot')}
            activeOpacity={0.7}
            style={[styles.quickAction, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, shadows.small]}
          >
            <View style={[styles.quickIcon, { backgroundColor: '#EDE9FE' }]}>
              <MessageCircle size={22} color="#8B5CF6" />
            </View>
            <AppText variant="label" style={{ marginTop: spacing.sm }}>AI Tutor</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/shop')}
            activeOpacity={0.7}
            style={[styles.quickAction, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, shadows.small]}
          >
            <View style={[styles.quickIcon, { backgroundColor: '#ECFEFF' }]}>
              <ShoppingBag size={22} color="#06B6D4" />
            </View>
            <AppText variant="label" style={{ marginTop: spacing.sm }}>Shop</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/leaderboard')}
            activeOpacity={0.7}
            style={[styles.quickAction, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, shadows.small]}
          >
            <View style={[styles.quickIcon, { backgroundColor: '#FEF3C7' }]}>
              <Trophy size={22} color="#F59E0B" />
            </View>
            <AppText variant="label" style={{ marginTop: spacing.sm }}>Ranks</AppText>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <AppText variant="headingS">Recent Activity</AppText>
        </View>
        <AppCard padding="none" style={{ overflow: 'hidden' }}>
          {[
            { icon: Play, color: theme.colors.success, title: 'Completed: Loops & Iteration', subtitle: 'Python Programming · +80 XP', time: '2h ago' },
            { icon: Award, color: theme.colors.warning, title: 'Test passed: Level 3 Test', subtitle: 'Score: 90% · +120 XP', time: '5h ago' },
            { icon: Zap, color: theme.colors.primary, title: 'Earned: 7 Day Streak achievement', subtitle: 'Achievement unlocked!', time: '1d ago' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <View
                key={i}
                style={[
                  styles.activityItem,
                  { borderBottomColor: theme.colors.border },
                  i < 2 && { borderBottomWidth: 1 },
                ]}
              >
                <View style={[styles.activityIcon, { backgroundColor: item.color + '20' }]}>
                  <Icon size={18} color={item.color} />
                </View>
                <View style={styles.activityContent}>
                  <AppText variant="bodySmall" style={{ fontSize: 14 }}>{item.title}</AppText>
                  <AppText variant="caption" style={{ color: theme.colors.textMuted }}>{item.subtitle}</AppText>
                </View>
                <AppText variant="caption" style={{ color: theme.colors.textMuted }}>{item.time}</AppText>
              </View>
            );
          })}
        </AppCard>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xxl, paddingTop: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  headerBadges: { flexDirection: 'row', gap: spacing.sm },
  continueCard: { borderRadius: radius.xl, overflow: 'hidden' },
  continueCardContent: { flexDirection: 'row', padding: spacing.lg },
  continueLeft: { flex: 1 },
  continueChar: { alignItems: 'center', justifyContent: 'center' },
  continueProgress: { marginTop: spacing.md },
  continueBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.md, marginTop: spacing.lg, alignSelf: 'flex-start' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalLeft: { flex: 1 },
  goalIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  streakCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, marginTop: spacing.lg },
  quickActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  quickAction: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg, borderRadius: radius.lg, borderWidth: 1 },
  quickIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xxl, marginBottom: spacing.md },
  activityItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.md },
  activityIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  activityContent: { flex: 1 },
});
