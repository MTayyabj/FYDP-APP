import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useThemeStore } from '../../src/store/themeStore';
import { useAuthStore } from '../../src/store/authStore';
import { useLearningStore } from '../../src/store/learningStore';
import { AppText } from '../../src/components/common/AppText';
import { AppButton } from '../../src/components/common/AppButton';
import { ProgressBar } from '../../src/components/common/ProgressBar';
import { LoadingSpinner } from '../../src/components/common/Skeleton';
import { Character } from '../../src/components/common/Character';
import { spacing, radius, shadows } from '../../src/constants/typography';
import { lessonService } from '../../src/services';
import { Lesson, Question, LessonContent } from '../../src/types/lesson';
import { ArrowLeft, Check, X, Lightbulb, Code, ChevronRight } from 'lucide-react-native';

type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching' | 'ordering' | 'code';

export default function LessonScreen() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { completeLesson, addXP } = useLearningStore();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<'content' | 'questions' | 'complete'>('content');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<unknown>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [fillBlankInput, setFillBlankInput] = useState('');

  const loadLesson = useCallback(async () => {
    if (!lessonId) return;
    try {
      const data = await lessonService.getLesson(lessonId);
      setLesson(data);
    } catch {
      setLesson(null);
    }
    setLoading(false);
  }, [lessonId]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  const checkAnswer = (question: Question, answer: unknown): boolean => {
    if (question.type === 'multiple_choice') return answer === question.correctAnswer;
    if (question.type === 'true_false') return answer === question.correctAnswer;
    if (question.type === 'fill_blank') {
      if (typeof answer !== 'string') return false;
      const normalized = answer.trim().toLowerCase();
      if (normalized === question.correctAnswer.toLowerCase()) return true;
      return question.acceptableAnswers?.some((a) => a.toLowerCase() === normalized) ?? false;
    }
    if (question.type === 'ordering') {
      if (!Array.isArray(answer)) return false;
      return answer.every((val, i) => val === question.correctOrder[i]);
    }
    if (question.type === 'matching') {
      if (!Array.isArray(answer)) return false;
      return answer.every((pair: { id: string; right: string }) => {
        const correct = question.pairs.find((p) => p.id === pair.id);
        return correct?.right === pair.right;
      });
    }
    return false;
  };

  const handleSubmitAnswer = () => {
    if (!lesson) return;
    const question = lesson.questions[currentQuestionIdx];
    let answer: unknown = selectedAnswer;

    if (question.type === 'fill_blank') {
      answer = fillBlankInput;
    }

    const correct = checkAnswer(question, answer);
    setIsCorrect(correct);
    setShowExplanation(true);
    setAnswers((prev) => ({ ...prev, [question.id]: answer }));
  };

  const handleNextQuestion = () => {
    if (!lesson) return;
    setShowExplanation(false);
    setSelectedAnswer(null);
    setFillBlankInput('');

    if (currentQuestionIdx < lesson.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setPhase('complete');
    }
  };

  const handleFinish = async () => {
    if (!lesson) return;
    try {
      await lessonService.submitLesson(lesson.id, answers);
      addXP(lesson.xpReward);
      completeLesson(lesson.id);
      router.back();
    } catch {
      router.back();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading lesson..." />
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorState}>
          <AppText variant="headingM">Lesson not found</AppText>
          <AppButton title="Go Back" onPress={() => router.back()} variant="primary" style={{ marginTop: spacing.lg }} />
        </View>
      </SafeAreaView>
    );
  }

  const totalSteps = lesson.content.length + lesson.questions.length;
  const currentStep = phase === 'content'
    ? 1
    : phase === 'questions'
      ? lesson.content.length + currentQuestionIdx + 1
      : totalSteps;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with progress */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <X size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginHorizontal: spacing.md }}>
          <ProgressBar progress={progress} height={8} />
        </View>
        <AppText variant="caption" style={{ color: theme.colors.textSecondary }}>
          {currentStep}/{totalSteps}
        </AppText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {phase === 'content' && (
          <LessonContentView
            lesson={lesson}
            onStartQuestions={() => setPhase('questions')}
          />
        )}

        {phase === 'questions' && (
          <QuestionView
            question={lesson.questions[currentQuestionIdx]}
            questionNumber={currentQuestionIdx + 1}
            totalQuestions={lesson.questions.length}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            fillBlankInput={fillBlankInput}
            setFillBlankInput={setFillBlankInput}
            showExplanation={showExplanation}
            isCorrect={isCorrect}
            onSubmit={handleSubmitAnswer}
            onNext={handleNextQuestion}
            theme={theme}
          />
        )}

        {phase === 'complete' && (
          <View style={styles.completeContainer}>
            <View style={[styles.completeCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, shadows.medium]}>
              <Character
                character={user?.character || { characterId: 'lumi_default', outfit: 'outfit_default', accessory: 'none', background: 'bg_default', expression: 'happy' }}
                size={120}
                expression="proud"
              />
              <AppText variant="headingL" style={{ marginTop: spacing.lg }}>Lesson Complete!</AppText>
              <AppText variant="body" style={{ color: theme.colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
                You finished "{lesson.title}"
              </AppText>
              <View style={[styles.xpReward, { backgroundColor: theme.colors.primaryLight }]}>
                <AppText variant="headingM" style={{ color: theme.colors.primaryDark }}>+{lesson.xpReward} XP</AppText>
              </View>
              <AppButton
                title="Claim Reward"
                onPress={handleFinish}
                variant="primary"
                size="lg"
                fullWidth
                style={{ marginTop: spacing.xl }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function LessonContentView({ lesson, onStartQuestions }: { lesson: Lesson; onStartQuestions: () => void }) {
  const { theme } = useThemeStore();
  const [contentIdx, setContentIdx] = useState(0);
  const isLastContent = contentIdx === lesson.content.length - 1;

  const renderContent = (item: LessonContent) => {
    if (item.type === 'code') {
      return (
        <View style={[styles.codeBlock, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.codeHeader}>
            <Code size={14} color={theme.colors.textMuted} />
            <AppText variant="caption" style={{ color: theme.colors.textMuted, marginLeft: spacing.xs }}>
              {item.language || 'code'}
            </AppText>
          </View>
          <AppText variant="bodySmall" style={{ fontFamily: 'monospace', color: theme.colors.text, fontSize: 13 }}>
            {item.content}
          </AppText>
        </View>
      );
    }

    if (item.type === 'tip') {
      return (
        <View style={[styles.tipBlock, { backgroundColor: theme.colors.warning + '15', borderColor: theme.colors.warning + '40' }]}>
          <View style={styles.tipHeader}>
            <Lightbulb size={18} color={theme.colors.warning} />
            <AppText variant="label" style={{ color: theme.colors.warning, marginLeft: spacing.xs }}>Tip</AppText>
          </View>
          <AppText variant="bodySmall" style={{ color: theme.colors.text, marginTop: spacing.xs }}>
            {item.content}
          </AppText>
        </View>
      );
    }

    return (
      <AppText variant="body" style={{ color: theme.colors.text, lineHeight: 26 }}>
        {item.content}
      </AppText>
    );
  };

  return (
    <View>
      <AppText variant="headingL">{lesson.title}</AppText>
      <View style={styles.contentBody}>
        {renderContent(lesson.content[contentIdx])}
      </View>

      {isLastContent ? (
        <AppButton
          title="Start Practice Questions"
          onPress={onStartQuestions}
          variant="primary"
          size="lg"
          fullWidth
          icon={<ChevronRight size={20} color="#FFFFFF" />}
          style={{ marginTop: spacing.xl }}
        />
      ) : (
        <AppButton
          title="Continue"
          onPress={() => setContentIdx(contentIdx + 1)}
          variant="primary"
          size="lg"
          fullWidth
          icon={<ChevronRight size={20} color="#FFFFFF" />}
          style={{ marginTop: spacing.xl }}
        />
      )}

      <View style={styles.contentDots}>
        {lesson.content.map((_, i) => (
          <View
            key={i}
            style={[
              styles.contentDot,
              { backgroundColor: i <= contentIdx ? theme.colors.primary : theme.colors.border },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function QuestionView({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  setSelectedAnswer,
  fillBlankInput,
  setFillBlankInput,
  showExplanation,
  isCorrect,
  onSubmit,
  onNext,
  theme,
}: {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: unknown;
  setSelectedAnswer: (val: unknown) => void;
  fillBlankInput: string;
  setFillBlankInput: (val: string) => void;
  showExplanation: boolean;
  isCorrect: boolean;
  onSubmit: () => void;
  onNext: () => void;
  theme: ReturnType<typeof useThemeStore.getState>['theme'];
}) {
  const [orderingItems, setOrderingItems] = useState<string[]>([]);
  const [matchingLeft, setMatchingLeft] = useState<string | null>(null);
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (question.type === 'ordering') {
      setOrderingItems([...question.items].sort(() => Math.random() - 0.5));
    }
    if (question.type === 'matching') {
      setMatchingAnswers({});
      setMatchingLeft(null);
    }
  }, [question]);

  const canSubmit = (): boolean => {
    if (question.type === 'fill_blank') return fillBlankInput.trim().length > 0;
    if (question.type === 'matching') return Object.keys(matchingAnswers).length === question.pairs.length;
    if (question.type === 'ordering') return orderingItems.length > 0;
    return selectedAnswer !== null;
  };

  const moveOrderingItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= orderingItems.length) return;
    const newItems = [...orderingItems];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setOrderingItems(newItems);
  };

  const handleMatchingRight = (right: string) => {
    if (!matchingLeft) return;
    setMatchingAnswers((prev) => ({ ...prev, [matchingLeft]: right }));
    setMatchingLeft(null);
  };

  const handleSubmit = () => {
    if (question.type === 'ordering') {
      setSelectedAnswer(orderingItems.map((item) => question.items.indexOf(item)));
    } else if (question.type === 'matching') {
      const result = question.pairs.map((p) => ({ id: p.id, right: matchingAnswers[p.id] || '' }));
      setSelectedAnswer(result);
    }
    onSubmit();
  };

  const renderQuestion = () => {
    if (question.type === 'multiple_choice') {
      return (
        <View style={{ gap: spacing.sm }}>
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = showExplanation && option === question.correctAnswer;
            const isWrongSelection = showExplanation && isSelected && !isCorrect;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => !showExplanation && setSelectedAnswer(option)}
                activeOpacity={0.7}
                disabled={showExplanation}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: isCorrectOption
                      ? theme.colors.success + '15'
                      : isWrongSelection
                        ? theme.colors.error + '15'
                        : isSelected
                          ? theme.colors.primaryLight
                          : theme.colors.card,
                    borderColor: isCorrectOption
                      ? theme.colors.success
                      : isWrongSelection
                        ? theme.colors.error
                        : isSelected
                          ? theme.colors.primary
                          : theme.colors.border,
                  },
                ]}
              >
                <AppText variant="body" style={{ flex: 1, color: isCorrectOption || isWrongSelection ? theme.colors.text : theme.colors.text }}>
                  {option}
                </AppText>
                {isCorrectOption && <Check size={20} color={theme.colors.success} />}
                {isWrongSelection && <X size={20} color={theme.colors.error} />}
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    if (question.type === 'true_false') {
      return (
        <View style={styles.trueFalseRow}>
          {[{ label: 'True', value: true }, { label: 'False', value: false }].map((opt) => {
            const isSelected = selectedAnswer === opt.value;
            const isCorrectOption = showExplanation && opt.value === question.correctAnswer;
            const isWrongSelection = showExplanation && isSelected && !isCorrect;
            return (
              <TouchableOpacity
                key={opt.label}
                onPress={() => !showExplanation && setSelectedAnswer(opt.value)}
                activeOpacity={0.7}
                disabled={showExplanation}
                style={[
                  styles.tfCard,
                  {
                    backgroundColor: isCorrectOption
                      ? theme.colors.success + '15'
                      : isWrongSelection
                        ? theme.colors.error + '15'
                        : isSelected
                          ? theme.colors.primaryLight
                          : theme.colors.card,
                    borderColor: isCorrectOption
                      ? theme.colors.success
                      : isWrongSelection
                        ? theme.colors.error
                        : isSelected
                          ? theme.colors.primary
                          : theme.colors.border,
                  },
                ]}
              >
                <AppText variant="headingM">{opt.label}</AppText>
                {isCorrectOption && <Check size={20} color={theme.colors.success} />}
                {isWrongSelection && <X size={20} color={theme.colors.error} />}
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    if (question.type === 'fill_blank') {
      return (
        <View>
          <AppText variant="body" style={{ color: theme.colors.text, lineHeight: 26 }}>
            {question.question}
          </AppText>
          <TextInput
            style={[
              styles.fillBlankInput,
              {
                backgroundColor: theme.colors.surface,
                borderColor: showExplanation
                  ? isCorrect
                    ? theme.colors.success
                    : theme.colors.error
                  : theme.colors.border,
                color: theme.colors.text,
              },
            ]}
            value={fillBlankInput}
            onChangeText={setFillBlankInput}
            placeholder="Type your answer..."
            placeholderTextColor={theme.colors.textMuted}
            editable={!showExplanation}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      );
    }

    if (question.type === 'ordering') {
      return (
        <View style={{ gap: spacing.sm }}>
          {orderingItems.map((item, index) => (
            <View
              key={item}
              style={[styles.orderingItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            >
              <AppText variant="body" style={{ flex: 1 }}>{item}</AppText>
              <View style={styles.orderArrows}>
                <TouchableOpacity onPress={() => moveOrderingItem(index, 'up')} disabled={index === 0 || showExplanation}>
                  <ChevronRight size={18} color={index === 0 ? theme.colors.textMuted : theme.colors.primary} style={{ transform: [{ rotate: '-90deg' }] }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => moveOrderingItem(index, 'down')} disabled={index === orderingItems.length - 1 || showExplanation}>
                  <ChevronRight size={18} color={index === orderingItems.length - 1 ? theme.colors.textMuted : theme.colors.primary} style={{ transform: [{ rotate: '90deg' }] }} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      );
    }

    if (question.type === 'matching') {
      const shuffledRights = [...question.pairs].sort(() => Math.random() - 0.5).map((p) => p.right);
      return (
        <View>
          <View style={styles.matchingContainer}>
            <View style={{ flex: 1, gap: spacing.sm }}>
              {question.pairs.map((pair) => {
                const matched = matchingAnswers[pair.id];
                return (
                  <TouchableOpacity
                    key={pair.id}
                    onPress={() => !showExplanation && setMatchingLeft(pair.id)}
                    disabled={!!matched || showExplanation}
                    style={[
                      styles.matchingLeft,
                      {
                        backgroundColor: matched ? theme.colors.success + '15' : matchingLeft === pair.id ? theme.colors.primaryLight : theme.colors.card,
                        borderColor: matched ? theme.colors.success : matchingLeft === pair.id ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <AppText variant="bodySmall">{pair.left}</AppText>
                    {matched && <Check size={16} color={theme.colors.success} />}
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{ flex: 1, gap: spacing.sm }}>
              {shuffledRights.map((right) => {
                const used = Object.values(matchingAnswers).includes(right);
                return (
                  <TouchableOpacity
                    key={right}
                    onPress={() => !showExplanation && handleMatchingRight(right)}
                    disabled={used || !matchingLeft || showExplanation}
                    style={[
                      styles.matchingRight,
                      {
                        backgroundColor: used ? theme.colors.success + '15' : matchingLeft ? theme.colors.primaryLight : theme.colors.card,
                        borderColor: used ? theme.colors.success : theme.colors.border,
                        opacity: used || !matchingLeft ? 0.5 : 1,
                      },
                    ]}
                  >
                    <AppText variant="bodySmall">{right}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View>
      <View style={styles.questionHeader}>
        <AppText variant="caption" style={{ color: theme.colors.primary, fontWeight: '700' }}>
          Question {questionNumber} of {totalQuestions}
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
        {renderQuestion()}
      </View>

      {/* Explanation */}
      {showExplanation && (
        <View style={[styles.explanationCard, { backgroundColor: isCorrect ? theme.colors.success + '15' : theme.colors.error + '15', borderColor: isCorrect ? theme.colors.success : theme.colors.error }]}>
          <View style={styles.explanationHeader}>
            {isCorrect ? <Check size={20} color={theme.colors.success} /> : <X size={20} color={theme.colors.error} />}
            <AppText variant="headingS" style={{ color: isCorrect ? theme.colors.success : theme.colors.error, marginLeft: spacing.xs }}>
              {isCorrect ? 'Correct!' : 'Not quite'}
            </AppText>
          </View>
          {question.explanation && (
            <AppText variant="bodySmall" style={{ color: theme.colors.text, marginTop: spacing.xs }}>
              {question.explanation}
            </AppText>
          )}
        </View>
      )}

      {/* Submit / Next button */}
      {!showExplanation ? (
        <AppButton
          title="Check Answer"
          onPress={handleSubmit}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canSubmit()}
          style={{ marginTop: spacing.xl }}
        />
      ) : (
        <AppButton
          title={questionNumber < totalQuestions ? 'Next Question' : 'Finish'}
          onPress={onNext}
          variant="primary"
          size="lg"
          fullWidth
          icon={<ChevronRight size={20} color="#FFFFFF" />}
          style={{ marginTop: spacing.xl }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  scrollContent: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxl },
  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  contentBody: { marginTop: spacing.lg },
  codeBlock: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg, marginTop: spacing.md },
  codeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  tipBlock: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg, marginTop: spacing.md },
  tipHeader: { flexDirection: 'row', alignItems: 'center' },
  contentDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.xl },
  contentDot: { width: 8, height: 8, borderRadius: 4 },
  completeContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl },
  completeCard: { width: '100%', alignItems: 'center', padding: spacing.xxl, borderRadius: radius.xl, borderWidth: 1 },
  xpReward: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: radius.lg, marginTop: spacing.lg },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pointsBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.round },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 2, gap: spacing.sm },
  trueFalseRow: { flexDirection: 'row', gap: spacing.md },
  tfCard: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.xl, borderRadius: radius.lg, borderWidth: 2 },
  fillBlankInput: { borderWidth: 2, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontSize: 16, fontFamily: 'Poppins-Regular', marginTop: spacing.md },
  orderingItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1 },
  orderArrows: { flexDirection: 'row', gap: spacing.xs },
  matchingContainer: { flexDirection: 'row', gap: spacing.md },
  matchingLeft: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md, borderRadius: radius.md, borderWidth: 2 },
  matchingRight: { padding: spacing.md, borderRadius: radius.md, borderWidth: 2, alignItems: 'center' },
  explanationCard: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg, marginTop: spacing.lg },
  explanationHeader: { flexDirection: 'row', alignItems: 'center' },
});
