import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { useLearningStore } from '../../src/store/learningStore';
import { AppText } from '../../src/components/common/AppText';
import { AppCard } from '../../src/components/common/AppCard';
import { ProgressBar } from '../../src/components/common/ProgressBar';
import { Skeleton } from '../../src/components/common/Skeleton';
import { StateView } from '../../src/components/common/StateView';
import { spacing, radius, shadows } from '../../src/constants/typography';
import { courseService } from '../../src/services';
import { Course, CourseLevel } from '../../src/types/course';
import { ArrowLeft, Lock, CheckCircle, Play, FileText, Award, ChevronRight, BookOpen } from 'lucide-react-native';

export default function CourseDetailScreen() {
  const { theme } = useThemeStore();
  const { currentCourse, setCurrentCourse } = useLearningStore();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(currentCourse);
  const [loading, setLoading] = useState(!currentCourse);
  const [refreshing, setRefreshing] = useState(false);

  const loadCourse = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const data = await courseService.getCourse(courseId);
      setCourse(data);
      setCurrentCourse(data);
    } catch {
      setCourse(null);
    }
    setLoading(false);
  }, [courseId, setCurrentCourse]);

  useEffect(() => {
    if (!course && courseId) loadCourse();
  }, [course, courseId, loadCourse]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourse();
    setRefreshing(false);
  };

  const handleLevelPress = (level: CourseLevel) => {
    if (level.isLocked) return;
    const lessonId = `lesson_${level.order}`;
    router.push(`/lesson/${lessonId}`);
  };

  const handleTestPress = (level: CourseLevel) => {
    if (level.isLocked || !level.testAvailable) return;
    router.push(`/test/${level.id}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={{ paddingHorizontal: spacing.xxl, gap: spacing.lg, paddingTop: spacing.xl }}>
          <Skeleton width="100%" height={120} radius={radius.xl} />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width="100%" height={80} radius={radius.lg} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StateView
          type="error"
          title="Course not found"
          message="This course may have been removed."
        />
      </SafeAreaView>
    );
  }

  const completedLevels = course.levels.filter((l) => l.progress === 100).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <AppText variant="headingS">Course Details</AppText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {/* Course Header */}
        <View style={[styles.courseHeader, { backgroundColor: course.color }, shadows.medium]}>
          <View style={styles.courseHeaderTop}>
            <View style={[styles.courseIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <BookOpen size={28} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="headingM" style={{ color: '#FFFFFF' }}>{course.title}</AppText>
              <AppText variant="caption" style={{ color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                {course.levels.length} levels · {completedLevels} completed
              </AppText>
            </View>
          </View>
          <AppText variant="bodySmall" style={{ color: 'rgba(255,255,255,0.9)', marginTop: spacing.md }}>
            {course.description}
          </AppText>
          <View style={styles.courseProgressWrap}>
            <ProgressBar progress={course.progress} height={8} color="#FFFFFF" trackColor="rgba(255,255,255,0.3)" />
            <AppText variant="caption" style={{ color: 'rgba(255,255,255,0.8)', marginTop: spacing.xs }}>
              {course.progress}% complete
            </AppText>
          </View>
        </View>

        {/* Learning Path */}
        <View style={styles.sectionHeader}>
          <AppText variant="headingS">Learning Path</AppText>
        </View>

        {course.levels.map((level, index) => (
          <View key={level.id} style={styles.levelContainer}>
            {/* Connector line */}
            {index < course.levels.length - 1 && (
              <View style={[styles.connector, { backgroundColor: level.progress === 100 ? theme.colors.success : theme.colors.border }]} />
            )}
            <AppCard padding="none" style={[styles.levelCard, shadows.small, level.isLocked && { opacity: 0.6 }]}>
              <View style={styles.levelCardContent}>
                {/* Status icon */}
                <View style={[
                  styles.levelStatusIcon,
                  {
                    backgroundColor: level.progress === 100
                      ? theme.colors.success + '20'
                      : level.isLocked
                        ? theme.colors.border
                        : theme.colors.primaryLight,
                  },
                ]}>
                  {level.progress === 100 ? (
                    <CheckCircle size={24} color={theme.colors.success} />
                  ) : level.isLocked ? (
                    <Lock size={20} color={theme.colors.textMuted} />
                  ) : (
                    <View style={[styles.levelNumber, { backgroundColor: theme.colors.primary }]}>
                      <AppText variant="headingS" style={{ color: '#FFFFFF', fontSize: 16 }}>{level.order}</AppText>
                    </View>
                  )}
                </View>

                {/* Level info */}
                <View style={{ flex: 1 }}>
                  <View style={styles.levelTitleRow}>
                    <AppText variant="headingS" style={{ fontSize: 16 }}>{level.title}</AppText>
                    <View style={[styles.xpBadge, { backgroundColor: theme.colors.primaryLight }]}>
                      <AppText variant="caption" style={{ color: theme.colors.primaryDark, fontWeight: '700' }}>+{level.xpReward} XP</AppText>
                    </View>
                  </View>
                  <AppText variant="caption" style={{ color: theme.colors.textSecondary, marginTop: 2 }}>
                    {level.description}
                  </AppText>
                  {!level.isLocked && level.progress < 100 && (
                    <ProgressBar progress={level.progress} height={6} style={{ marginTop: spacing.sm }} />
                  )}
                </View>
              </View>

              {/* Actions */}
              {!level.isLocked && (
                <View style={[styles.levelActions, { borderTopColor: theme.colors.border }]}>
                  <TouchableOpacity
                    onPress={() => handleLevelPress(level)}
                    activeOpacity={0.7}
                    style={styles.levelActionBtn}
                  >
                    <FileText size={16} color={theme.colors.primary} />
                    <AppText variant="label" style={{ color: theme.colors.primary, marginLeft: spacing.xs }}>
                      {level.progress > 0 ? 'Continue' : 'Start Lesson'}
                    </AppText>
                  </TouchableOpacity>
                  {level.testAvailable && (
                    <TouchableOpacity
                      onPress={() => handleTestPress(level)}
                      activeOpacity={0.7}
                      style={[styles.levelActionBtn, { borderLeftWidth: 1, borderLeftColor: theme.colors.border }]}
                    >
                      <Award size={16} color={theme.colors.warning} />
                      <AppText variant="label" style={{ color: theme.colors.warning, marginLeft: spacing.xs }}>
                        {level.testCompleted ? `Test (${level.testBestScore}%)` : 'Take Test'}
                      </AppText>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </AppCard>
          </View>
        ))}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  backBtn: { padding: spacing.xs },
  scrollContent: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxl },
  courseHeader: { borderRadius: radius.xl, padding: spacing.xl },
  courseHeaderTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  courseIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  courseProgressWrap: { marginTop: spacing.lg },
  sectionHeader: { marginTop: spacing.xxl, marginBottom: spacing.md },
  levelContainer: { position: 'relative', marginBottom: spacing.md },
  connector: { position: 'absolute', left: 28, top: 48, width: 2, height: '100%', zIndex: 0 },
  levelCard: { overflow: 'hidden', zIndex: 1 },
  levelCardContent: { flexDirection: 'row', alignItems: 'flex-start', padding: spacing.lg, gap: spacing.md },
  levelStatusIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  levelNumber: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  levelTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.round },
  levelActions: { flexDirection: 'row', borderTopWidth: 1 },
  levelActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md },
});
