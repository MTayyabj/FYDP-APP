export const config = {
  appName: 'Luminara',
  appTagline: 'Learn. Play. Grow.',
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  mockEnabled: true,
  demoEmail: 'demo@example.com',
  demoPassword: 'demo123',
  dailyGoalOptions: [5, 10, 15, 30],
  passThreshold: 70,
  gemCurrency: 'Gems',
  streakMilestones: [7, 14, 30, 50, 100],
};

export const learningTopics = [
  { id: 'mathematics', label: 'Mathematics', icon: 'Calculator' },
  { id: 'programming', label: 'Programming', icon: 'Code' },
  { id: 'english', label: 'English', icon: 'BookOpen' },
  { id: 'science', label: 'Science', icon: 'FlaskConical' },
  { id: 'physics', label: 'Physics', icon: 'Atom' },
  { id: 'computer_science', label: 'Computer Science', icon: 'Cpu' },
];

export const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const contentDifficultyLabels: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  advanced: 'Advanced',
};
