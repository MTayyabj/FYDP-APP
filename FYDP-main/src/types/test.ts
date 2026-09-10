export interface Test {
  id: string;
  levelId: string;
  title: string;
  description: string;
  questionCount: number;
  passThreshold: number;
  timeLimitMinutes?: number;
  questions: import('./lesson').Question[];
}

export interface TestResult {
  testId: string;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  accuracy: number;
  xpEarned: number;
  timeTakenSeconds: number;
  passed: boolean;
  areasForImprovement: string[];
}

export interface TestService {
  getTest(levelId: string): Promise<Test>;
  submitTest(testId: string, answers: Record<string, unknown>): Promise<TestResult>;
}
