import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { useLearningStore } from '../../src/store/learningStore';
import { useAuthStore } from '../../src/store/authStore';
import { AppText } from '../../src/components/common/AppText';
import { AppCard } from '../../src/components/common/AppCard';
import { ProgressBar } from '../../src/components/common/ProgressBar';
import { StateView } from '../../src/components/common/StateView';
import { Skeleton } from '../../src/components/common/Skeleton';
import { spacing, radius, shadows } from '../../src/constants/typography';
import { courseService } from '../../src/services';
import { Course } from '../../src/types/course';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Code, Calculator, BookOpen, FlaskConical, Atom, ChevronRight, Cpu } from 'lucide-react-native';

const iconMap: Record<string, typeof Code> = {
  Code, Calculator, BookOpen, FlaskConical, Atom, Cpu,
};

export default function LearnScreen() {
  const { theme } = useThemeStore();
  const { courses, setCourses, setCurrentCourse, isLoadingCourses, setLoadingCourses } = useLearningStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const loadCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      const data = await courseService.getCourses();
      setCourses(data);
    } catch {
      // show error state
    }
    setLoadingCourses(false);
  }, [setCourses, setLoadingCourses]);

  useEffect(() => {
    if (courses.length === 0) loadCourses();
  }, [courses.length, loadCourses]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const handleCoursePress = (course: Course) => {
    setCurrentCourse(course);
    router.push('/(tabs)/learn/[courseId]');
  };

  if (isLoadingCourses && courses.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <AppText variant="headingL">My Courses</AppText>
        </View>
        <View style={{ paddingHorizontal: spacing.xxl, gap: spacing.lg }}>
          {[1, 2, 3].map((i) => (
            <View key={i}>
              <Skeleton width="100%" height={120} radius={radius.lg} />
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (courses.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StateView
          type="empty"
          character={user?.character}
          title="No courses yet"
          message="Start your learning journey by exploring available courses."
        />
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
        <View style={styles.header}>
          <AppText variant="headingL">My Courses</AppText>
          <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary, marginTop: spacing.xs }}>
            {courses.length} courses in progress
          </AppText>
        </View>

        {courses.map((course) => {
          const Icon = iconMap[course.icon] || BookOpen;
          const completedLevels = course.levels.filter(l => l.progress === 100).length;
          return (
            <TouchableOpacity
              key={course.id}
              onPress={() => handleCoursePress(course)}
              activeOpacity={0.8}
            >
              <AppCard padding="none" style={[styles.courseCard, shadows.small]}>
                <View style={[styles.courseCardTop, { backgroundColor: course.color }]}>
                  <View style={styles.courseHeader}>
                    <View style={[styles.courseIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                      <Icon size={24} color="#FFFFFF" />
                    </View>
                    <View style={styles.courseInfo}>
                      <AppText variant="headingS" style={{ color: '#FFFFFF' }}>{course.title}</AppText>
                      <AppText variant="caption" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        {completedLevels} / {course.levels.length} levels completed
                      </AppText>
                    </View>
                    <ChevronRight size={22} color="rgba(255,255,255,0.6)" />
                  </View>
                </View>
                <View style={styles.courseBody}>
                  <View style={styles.courseProgress}>
                    <View style={styles.progressRow}>
                      <AppText variant="caption" style={{ color: theme.colors.textSecondary }}>{course.progress}% complete</AppText>
                      <AppText variant="caption" style={{ color: theme.colors.textMuted, fontWeight: '600' }}>{course.progress} / 100</AppText>
                    </View>
                    <ProgressBar progress={course.progress} height={8} color={course.color} style={{ marginTop: spacing.xs }} />
                  </View>
                </View>
              </AppCard>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.xxl, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  scrollContent: { paddingHorizontal: spacing.xxl },
  courseCard: { marginBottom: spacing.lg, overflow: 'hidden' },
  courseCardTop: { padding: spacing.lg },
  courseHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  courseIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  courseInfo: { flex: 1 },
  courseBody: { padding: spacing.lg },
  courseProgress: {},
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
