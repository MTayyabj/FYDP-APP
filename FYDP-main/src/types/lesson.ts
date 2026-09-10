export interface LessonContent {
  type: 'text' | 'code' | 'image' | 'tip';
  content: string;
  language?: string;
  caption?: string;
}

export interface Lesson {
  id: string;
  levelId: string;
  title: string;
  content: LessonContent[];
  questions: Question[];
  xpReward: number;
}

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'matching'
  | 'ordering'
  | 'code';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  explanation?: string;
  points: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: string[];
  correctAnswer: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  correctAnswer: boolean;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill_blank';
  correctAnswer: string;
  acceptableAnswers?: string[];
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: MatchingPair[];
}

export interface OrderingQuestion extends BaseQuestion {
  type: 'ordering';
  items: string[];
  correctOrder: number[];
}

export interface CodeQuestion extends BaseQuestion {
  type: 'code';
  codeTemplate: string;
  correctAnswer: string;
  language: string;
}

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | MatchingQuestion
  | OrderingQuestion
  | CodeQuestion;

export interface LessonService {
  getLesson(lessonId: string): Promise<Lesson>;
  getLessonsByLevel(levelId: string): Promise<Lesson[]>;
  submitLesson(lessonId: string, answers: Record<string, unknown>): Promise<{ xpEarned: number }>;
}
