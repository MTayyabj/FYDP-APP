import { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { usePreferencesStore } from '../../src/store/preferencesStore';
import { useAuthStore } from '../../src/store/authStore';
import { AppText } from '../../src/components/common/AppText';
import { AppButton } from '../../src/components/common/AppButton';
import { Character } from '../../src/components/common/Character';
import { spacing, radius } from '../../src/constants/typography';
import { config, learningTopics } from '../../src/constants/config';
import { mockCurrentUser } from '../../src/mockData';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Check, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const steps = ['topics', 'level', 'goal', 'difficulty', 'welcome'];

export default function OnboardingScreen() {
  const { theme } = useThemeStore();
  const { setTopics, setLevel, setDailyGoal, setContentDifficulty, selectedTopics, selectedLevel, dailyGoal, contentDifficulty } = usePreferencesStore();
  const { setOnboardingComplete } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goToStep = (step: number) => {
    setCurrentStep(step);
    scrollRef.current?.scrollTo({ x: step * width, animated: true });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    } else {
      setOnboardingComplete(true);
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) goToStep(currentStep - 1);
  };

  const toggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setTopics(selectedTopics.filter((t) => t !== topicId));
    } else {
      setTopics([...selectedTopics, topicId]);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return selectedTopics.length > 0;
    return true;
  };

  const renderTopicIcon = (iconName: string) => {
    const icons: Record<string, typeof Check> = {
      Calculator: require('../../../src/components/common/Character').Character ? Check : Check,
    };
    return icons[iconName] || Check;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        {currentStep > 0 ? (
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
        <View style={styles.progressContainer}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  backgroundColor: i <= currentStep ? theme.colors.primary : theme.colors.border,
                  flex: i === currentStep ? 2 : 1,
                },
              ]}
            />
          ))}
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Step 1: Topics */}
        <View style={styles.step}>
          <View style={styles.stepContent}>
            <Character character={mockCurrentUser.character} size={100} expression="excited" />
            <AppText variant="headingL" style={{ textAlign: 'center', marginTop: spacing.lg }}>What do you want to learn?</AppText>
            <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: spacing.xs }}>
              Pick one or more topics that interest you
            </AppText>
            <View style={styles.topicsGrid}>
              {learningTopics.map((topic) => {
                const selected = selectedTopics.includes(topic.id);
                return (
                  <TouchableOpacity
                    key={topic.id}
                    onPress={() => toggleTopic(topic.id)}
                    activeOpacity={0.7}
                    style={[
                      styles.topicCard,
                      {
                        backgroundColor: selected ? theme.colors.primaryLight : theme.colors.card,
                        borderColor: selected ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    {selected && (
                      <View style={[styles.checkIcon, { backgroundColor: theme.colors.primary }]}>
                        <Check size={14} color="#FFFFFF" />
                      </View>
                    )}
                    <AppText variant="headingS" style={{ fontSize: 15 }}>{topic.label}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Step 2: Level */}
        <View style={styles.step}>
          <View style={styles.stepContent}>
            <Character character={mockCurrentUser.character} size={100} expression="happy" />
            <AppText variant="headingL" style={{ textAlign: 'center', marginTop: spacing.lg }}>What's your current level?</AppText>
            <View style={styles.levelOptions}>
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
                const selected = selectedLevel === level;
                return (
                  <TouchableOpacity
                    key={level}
                    onPress={() => setLevel(level)}
                    activeOpacity={0.7}
                    style={[
                      styles.levelCard,
                      {
                        backgroundColor: selected ? theme.colors.primary : theme.colors.card,
                        borderColor: selected ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <AppText
                      variant="headingM"
                      style={{ color: selected ? '#FFFFFF' : theme.colors.text, textTransform: 'capitalize' }}
                    >
                      {level}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Step 3: Daily Goal */}
        <View style={styles.step}>
          <View style={styles.stepContent}>
            <View style={[styles.iconWrap, { backgroundColor: theme.colors.primaryLight }]}>
              <Clock size={40} color={theme.colors.primary} />
            </View>
            <AppText variant="headingL" style={{ textAlign: 'center', marginTop: spacing.lg }}>What's your daily goal?</AppText>
            <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
              How many minutes do you want to learn each day?
            </AppText>
            <View style={styles.goalOptions}>
              {config.dailyGoalOptions.map((minutes) => {
                const selected = dailyGoal === minutes;
                return (
                  <TouchableOpacity
                    key={minutes}
                    onPress={() => setDailyGoal(minutes)}
                    activeOpacity={0.7}
                    style={[
                      styles.goalCard,
                      { backgroundColor: selected ? theme.colors.primary : theme.colors.card, borderColor: selected ? theme.colors.primary : theme.colors.border },
                    ]}
                  >
                    <AppText variant="headingM" style={{ color: selected ? '#FFFFFF' : theme.colors.text }}>
                      {minutes}
                    </AppText>
                    <AppText variant="caption" style={{ color: selected ? 'rgba(255,255,255,0.8)' : theme.colors.textMuted }}>
                      min/day
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Step 4: Content Difficulty */}
        <View style={styles.step}>
          <View style={styles.stepContent}>
            <Character character={mockCurrentUser.character} size={100} expression="thinking" />
            <AppText variant="headingL" style={{ textAlign: 'center', marginTop: spacing.lg }}>Content difficulty</AppText>
            <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
              How should AI-generated content be explained to you?
            </AppText>
            <View style={styles.difficultyOptions}>
              {([
                { id: 'easy', title: 'Easy', desc: 'Simple vocabulary and explanations' },
                { id: 'medium', title: 'Medium', desc: 'Normal educational language' },
                { id: 'advanced', title: 'Advanced', desc: 'Technical/academic explanations' },
              ] as const).map((opt) => {
                const selected = contentDifficulty === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setContentDifficulty(opt.id)}
                    activeOpacity={0.7}
                    style={[
                      styles.difficultyCard,
                      { backgroundColor: selected ? theme.colors.primaryLight : theme.colors.card, borderColor: selected ? theme.colors.primary : theme.colors.border },
                    ]}
                  >
                    <View style={[styles.radio, { borderColor: selected ? theme.colors.primary : theme.colors.textMuted }]}>
                      {selected && <View style={[styles.radioFill, { backgroundColor: theme.colors.primary }]} />}
                    </View>
                    <View>
                      <AppText variant="headingS">{opt.title}</AppText>
                      <AppText variant="caption" style={{ color: theme.colors.textSecondary }}>{opt.desc}</AppText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Step 5: Welcome/Ready */}
        <View style={styles.step}>
          <View style={styles.stepContent}>
            <Character character={mockCurrentUser.character} size={140} expression="excited" />
            <AppText variant="headingXL" style={{ textAlign: 'center', marginTop: spacing.xl }}>
              You're all set!
            </AppText>
            <AppText variant="body" style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, maxWidth: 300 }}>
              Your personalized learning journey is ready. Let's start learning and earn your first XP!
            </AppText>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title={currentStep === steps.length - 1 ? 'Start Learning' : 'Continue'}
          onPress={handleNext}
          disabled={!canProceed()}
          fullWidth
          size="lg"
          icon={currentStep < steps.length - 1 ? <ArrowRight size={20} color="#FFFFFF" /> : undefined}
        />
        {currentStep < steps.length - 1 && (
          <TouchableOpacity onPress={() => { setOnboardingComplete(true); router.replace('/(tabs)'); }} style={styles.skipBtn}>
            <AppText variant="bodySmall" style={{ color: theme.colors.textMuted }}>Skip for now</AppText>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  backBtn: { padding: spacing.sm },
  progressContainer: { flex: 1, flexDirection: 'row', gap: 4, marginHorizontal: spacing.md },
  progressDot: { height: 4, borderRadius: 2 },
  scrollView: { flex: 1 },
  step: { width, paddingHorizontal: spacing.xxl },
  stepContent: { flex: 1, alignItems: 'center', paddingTop: spacing.xxxl },
  topicsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xl, justifyContent: 'center' },
  topicCard: { width: 140, paddingVertical: spacing.lg, paddingHorizontal: spacing.md, borderRadius: radius.lg, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkIcon: { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  levelOptions: { gap: spacing.md, marginTop: spacing.xxl, width: '100%' },
  levelCard: { paddingVertical: spacing.xl, borderRadius: radius.lg, borderWidth: 2, alignItems: 'center' },
  iconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  goalOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xxl, justifyContent: 'center' },
  goalCard: { width: 130, paddingVertical: spacing.xl, borderRadius: radius.lg, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  difficultyOptions: { gap: spacing.md, marginTop: spacing.xl, width: '100%' },
  difficultyCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg, paddingHorizontal: spacing.lg, borderRadius: radius.lg, borderWidth: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioFill: { width: 12, height: 12, borderRadius: 6 },
  footer: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxl, gap: spacing.md },
  skipBtn: { alignItems: 'center', paddingVertical: spacing.sm },
});
