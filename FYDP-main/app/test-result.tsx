import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useThemeStore } from '../src/store/themeStore';
import { useAuthStore } from '../src/store/authStore';
import { useLearningStore } from '../src/store/learningStore';
import { AppText } from '../src/components/common/AppText';
import { AppButton } from '../src/components/common/AppButton';
import { Character } from '../src/components/common/Character';
import { AppCard } from '../src/components/common/AppCard';
import { ProgressBar } from '../src/components/common/ProgressBar';
import { spacing, radius, shadows } from '../src/constants/typography';
import { Check, X, Zap, TrendingUp, AlertCircle, Home, BookOpen } from 'lucide-react-native';

export default function TestResultScreen() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { currentTestResult, addXP } = useLearningStore();

  if (!currentTestResult) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorState}>
          <AppText variant="headingM">No test results found</AppText>
          <AppButton title="Go Home" onPress={() => router.replace('/(tabs)')} variant="primary" style={{ marginTop: spacing.lg }} />
        </View>
      </SafeAreaView>
    );
  }

  const result = currentTestResult;
  const passedColor = result.passed ? theme.colors.success : theme.colors.error;

  const handleClaim = () => {
    addXP(result.xpEarned);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Result Hero */}
        <View style={[styles.heroCard, { backgroundColor: passedColor }, shadows.large]}>
          <Character
            character={user?.character || { characterId: 'lumi_default', outfit: 'outfit_default', accessory: 'none', background: 'bg_default', expression: 'happy' }}
            size={100}
            expression={result.passed ? 'proud' : 'sad'}
          />
          <AppText variant="headingXL" style={{ color: '#FFFFFF', marginTop: spacing.md }}>
            {result.passed ? 'Passed!' : 'Keep Trying!'}
          </AppText>
          <AppText variant="body" style={{ color: 'rgba(255,255,255,0.9)', marginTop: spacing.xs }}>
            {result.passed ? 'Great job on completing the test' : 'You\'ll get it next time'}
          </AppText>
        </View>

        {/* Score Circle */}
        <View style={styles.scoreSection}>
          <View style={[styles.scoreCircle, { borderColor: passedColor }]}>
            <AppText variant="headingXL" style={{ color: passedColor }}>{result.accuracy}%</AppText>
            <AppText variant="caption" style={{ color: theme.colors.textSecondary }}>Accuracy</AppText>
          </View>
        </View>

        {/* XP Earned */}
        <View style={[styles.xpBanner, { backgroundColor: theme.colors.primaryLight }]}>
          <Zap size={24} color={theme.colors.primary} />
          <AppText variant="headingM" style={{ color: theme.colors.primaryDark, marginLeft: spacing.sm }}>
            +{result.xpEarned} XP earned
          </AppText>
        </View>

        {/* Stats Breakdown */}
        <View style={styles.statsGrid}>
          <StatBox icon={Check} label="Correct" value={result.correctAnswers} color={theme.colors.success} />
          <StatBox icon={X} label="Incorrect" value={result.incorrectAnswers} color={theme.colors.error} />
          <StatBox icon={TrendingUp} label="Score" value={result.score} color={theme.colors.primary} />
          <StatBox icon={BookOpen} label="Total" value={result.totalQuestions} color={theme.colors.warning} />
        </View>

        {/* Areas for Improvement */}
        {!result.passed && result.areasForImprovement.length > 0 && (
          <AppCard padding="md" style={{ marginTop: spacing.lg }}>
            <View style={styles.improvementHeader}>
              <AlertCircle size={20} color={theme.colors.warning} />
              <AppText variant="headingS" style={{ marginLeft: spacing.xs }}>Areas for Improvement</AppText>
            </View>
            {result.areasForImprovement.map((area, i) => (
              <View key={i} style={styles.improvementItem}>
                <View style={[styles.bullet, { backgroundColor: theme.colors.warning }]} />
                <AppText variant="bodySmall" style={{ flex: 1 }}>{area}</AppText>
              </View>
            ))}
          </AppCard>
        )}

        {/* Actions */}
        <AppButton
          title="Claim Reward & Continue"
          onPress={handleClaim}
          variant="primary"
          size="lg"
          fullWidth
          style={{ marginTop: spacing.xxl }}
        />
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.7}
          style={styles.homeBtn}
        >
          <Home size={18} color={theme.colors.textSecondary} />
          <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary, marginLeft: spacing.xs }}>
            Back to Home
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ icon: Icon, label, value, color }: { icon: typeof Check; label: string; value: number; color: string }) {
  const { theme } = useThemeStore();
  return (
    <View style={[styles.statBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={[styles.statBoxIcon, { backgroundColor: color + '20' }]}>
        <Icon size={16} color={color} />
      </View>
      <AppText variant="headingM" style={{ fontSize: 20 }}>{value}</AppText>
      <AppText variant="caption" style={{ color: theme.colors.textMuted }}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xxl, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroCard: { borderRadius: radius.xl, padding: spacing.xxl, alignItems: 'center' },
  scoreSection: { alignItems: 'center', marginTop: spacing.xl },
  scoreCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  xpBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.lg, borderRadius: radius.lg, marginTop: spacing.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
  statBox: { width: '48%', flexGrow: 1, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center', gap: spacing.xs },
  statBoxIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  improvementHeader: { flexDirection: 'row', alignItems: 'center' },
  improvementItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  bullet: { width: 6, height: 6, borderRadius: 3 },
  homeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.lg },
});
