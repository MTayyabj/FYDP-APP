import { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { useLearningStore } from '../../src/store/learningStore';
import { AppText } from '../../src/components/common/AppText';
import { AppButton } from '../../src/components/common/AppButton';
import { ProgressBar } from '../../src/components/common/ProgressBar';
import { LoadingSpinner } from '../../src/components/common/Skeleton';
import { spacing, radius } from '../../src/constants/typography';
import { testService } from '../../src/services';
import { Test } from '../../src/types/test';
import { Question } from '../../src/types/lesson';
import { X, Check, ChevronRight, Clock, AlertCircle } from 'lucide-react-native';

export default function TestScreen() {
  const { theme } = useThemeStore();
  const { setCurrentTestResult } = useLearningStore();
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<unknown>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fillBlankInput, setFillBlankInput] = useState('');
  const startTimeRef = useRef<number>(Date.now());

  const loadTest = useCallback(async () => {
    if (!levelId) return;
    try {
      const data = await testService.getTest(levelId);
      setTest(data);
    } catch {
      setTest(null);
    }
    setLoading(false);
  }, [levelId]);

  useEffect(() => {
    loadTest();
  }, [loadTest]);

  const handleNext = async () => {
    if (!test) return;
    const question = test.questions[currentIdx];
    const answer = question.type === 'fill_blank' ? fillBlankInput : selectedAnswer;
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    if (currentIdx < test.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setFillBlankInput('');
    } else {
      setSubmitting(true);
      try {
        const result = await testService.submitTest(test.id, newAnswers);
        setCurrentTestResult(result);
        router.replace('/test-result');
      } catch {
        setSubmitting(false);
      }
    }
  };

  const handleSkip = () => {
    if (!test) return;
    if (currentIdx < test.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setFillBlankInput('');
    } else {
      handleNext();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading test..." />
      </SafeAreaView>
    );
  }

  if (!test) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorState}>
          <AppText variant="headingM">Test not found</AppText>
          <AppButton title="Go Back" onPress={() => router.back()} variant="primary" style={{ marginTop: spacing.lg }} />
        </View>
      </SafeAreaView>
    );
  }

  const question = test.questions[currentIdx];
  const progress = ((currentIdx + 1) / test.questions.length) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <X size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginHorizontal: spacing.md }}>
          <ProgressBar progress={progress} height={8} />
        </View>
        <View style={[styles.timer, { backgroundColor: theme.colors.primaryLight }]}>
          <Clock size={14} color={theme.colors.primary} />
          <AppText variant="caption" style={{ color: theme.colors.primary, marginLeft: spacing.xs, fontWeight: '700' }}>
            {test.timeLimitMinutes}m
          </AppText>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.questionHeader}>
          <AppText variant="caption" style={{ color: theme.colors.primary, fontWeight: '700' }}>
            Question {currentIdx + 1} of {test.questions.length}
          </AppText>
          <View style={[styles.pointsBadge, { backgroundColor: theme.colors.primaryLight }]}>
            <AppText variant="caption" style={{ color: theme.colors.primaryDark, fontWeight: '700' }}>
              {question.points} pts
            </AppText>
          </View>
        </View>

        <AppText variant="headingM" style={{ marginTop: spacing.sm }}>
          {question.question}
        </AppText>

        <View style={{ marginTop: spacing.lg }}>
          {question.type === 'multiple_choice' && (
            <View style={{ gap: spacing.sm }}>
              {question.options.map((option) => {
                const isSelected = selectedAnswer === option;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setSelectedAnswer(option)}
                    activeOpacity={0.7}
                    style={[
                      styles.optionCard,
                      {
                        backgroundColor: isSelected ? theme.colors.primaryLight : theme.colors.card,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <AppText variant="body" style={{ flex: 1 }}>{option}</AppText>
                    {isSelected && <Check size={20} color={theme.colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {question.type === 'true_false' && (
            <View style={styles.trueFalseRow}>
              {[{ label: 'True', value: true }, { label: 'False', value: false }].map((opt) => {
                const isSelected = selectedAnswer === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    onPress={() => setSelectedAnswer(opt.value)}
                    activeOpacity={0.7}
                    style={[
                      styles.tfCard,
                      {
                        backgroundColor: isSelected ? theme.colors.primaryLight : theme.colors.card,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <AppText variant="headingM">{opt.label}</AppText>
                    {isSelected && <Check size={20} color={theme.colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {question.type === 'fill_blank' && (
            <TextInput
              style={[
                styles.fillBlankInput,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text },
              ]}
              value={fillBlankInput}
              onChangeText={setFillBlankInput}
              placeholder="Type your answer..."
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}

          {question.type === 'matching' && (
            <View style={{ gap: spacing.sm }}>
              <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary }}>
                Matching questions: select the correct pair for each item.
              </AppText>
              {question.pairs.map((pair) => (
                <View key={pair.id} style={[styles.matchingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                  <AppText variant="bodySmall" style={{ flex: 1 }}>{pair.left}</AppText>
                  <AppText variant="bodySmall" style={{ color: theme.colors.textMuted }}>→</AppText>
                  <AppText variant="bodySmall" style={{ flex: 1, textAlign: 'right' }}>{pair.right}</AppText>
                </View>
              ))}
            </View>
          )}

          {question.type === 'ordering' && (
            <View style={{ gap: spacing.sm }}>
              <AppText variant="bodySmall" style={{ color: theme.colors.textSecondary }}>
                Arrange in the correct order (top to bottom).
              </AppText>
              {question.items.map((item, index) => (
                <View key={item} style={[styles.orderingItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                  <AppText variant="caption" style={{ color: theme.colors.textMuted }}>{index + 1}.</AppText>
                  <AppText variant="body" style={{ flex: 1 }}>{item}</AppText>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.testActions}>
          <AppButton
            title="Skip"
            onPress={handleSkip}
            variant="outline"
            size="md"
            style={{ flex: 1 }}
          />
          <AppButton
            title={currentIdx < test.questions.length - 1 ? 'Next' : 'Submit Test'}
            onPress={handleNext}
            variant="primary"
            size="md"
            loading={submitting}
            disabled={question.type !== 'fill_blank' && selectedAnswer === null && question.type !== 'matching' && question.type !== 'ordering'}
            style={{ flex: 1 }}
            icon={<ChevronRight size={18} color="#FFFFFF" />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  timer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.round },
  scrollContent: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxl },
  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pointsBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.round },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 2, gap: spacing.sm },
  trueFalseRow: { flexDirection: 'row', gap: spacing.md },
  tfCard: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.xl, borderRadius: radius.lg, borderWidth: 2 },
  fillBlankInput: { borderWidth: 2, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontSize: 16, fontFamily: 'Poppins-Regular' },
  matchingRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: radius.md, borderWidth: 1, gap: spacing.md },
  orderingItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md },
  testActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xxl },
});
