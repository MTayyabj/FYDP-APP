import { TestService } from '../../types/test';
import { Test, TestResult } from '../../types/test';
import { mockTests } from '../../mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockTestApi: TestService = {
  async getTest(levelId: string): Promise<Test> {
    await delay(500);
    const test = Object.values(mockTests).find((t) => t.levelId === levelId) || mockTests.test_level_1;
    return test;
  },

  async submitTest(testId: string, answers: Record<string, unknown>): Promise<TestResult> {
    await delay(800);
    const test = mockTests[testId] || mockTests.test_level_1;
    const total = test.questions.length;
    let correct = 0;
    test.questions.forEach((q) => {
      const ans = answers[q.id];
      if (q.type === 'multiple_choice' && ans === q.correctAnswer) correct++;
      else if (q.type === 'true_false' && ans === q.correctAnswer) correct++;
      else if (q.type === 'fill_blank' && typeof ans === 'string' && (ans.trim().toLowerCase() === q.correctAnswer.toLowerCase() || (q.acceptableAnswers?.some(a => a.toLowerCase() === ans.trim().toLowerCase())))) correct++;
    });
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = accuracy >= test.passThreshold;
    return {
      testId,
      score: correct,
      correctAnswers: correct,
      incorrectAnswers: total - correct,
      totalQuestions: total,
      accuracy,
      xpEarned: correct * 15,
      timeTakenSeconds: 420,
      passed,
      areasForImprovement: passed ? [] : ['Review loops and iteration', 'Practice variable naming conventions'],
    };
  },
};
