import { User, CharacterConfig, UserPreferences } from '../types/auth';
import { Course } from '../types/course';
import { Lesson, Question } from '../types/lesson';
import { Test } from '../types/test';
import { Achievement, UserStats } from '../types/user';
import { Friend, FriendRequest } from '../types/friend';
import { LeaderboardEntry } from '../types/leaderboard';
import { ShopItem } from '../types/shop';
import { ChatMessage } from '../types/chatbot';

const defaultCharacter: CharacterConfig = {
  characterId: 'lumi_default',
  outfit: 'outfit_default',
  accessory: 'none',
  background: 'bg_default',
  expression: 'happy',
};

const defaultPreferences: UserPreferences = {
  learningTopics: ['programming', 'mathematics'],
  currentLevel: 'intermediate',
  dailyGoalMinutes: 15,
  contentDifficulty: 'medium',
  notificationsEnabled: true,
  soundEnabled: true,
  animationsEnabled: true,
  profileVisibility: 'public',
  friendRequestsEnabled: true,
  showOnlineStatus: true,
};

export const mockCurrentUser: User = {
  id: 'user_001',
  username: 'alex',
  displayName: 'Alex Rivera',
  email: 'demo@example.com',
  bio: 'Learning one day at a time!',
  level: 12,
  xp: 2450,
  streak: 12,
  longestStreak: 35,
  friendsCount: 8,
  preferences: defaultPreferences,
  character: defaultCharacter,
  isOnline: true,
  createdAt: '2025-01-15T10:00:00Z',
};

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: 'user_002',
    username: 'sarah',
    displayName: 'Sarah Chen',
    email: 'sarah@example.com',
    bio: 'Math enthusiast',
    level: 15,
    xp: 3200,
    streak: 24,
    longestStreak: 40,
    friendsCount: 12,
    preferences: { ...defaultPreferences, learningTopics: ['mathematics', 'physics'] },
    character: { ...defaultCharacter, characterId: 'lumi_blue', outfit: 'outfit_scholar' },
    isOnline: true,
    createdAt: '2024-12-01T10:00:00Z',
  },
  {
    id: 'user_003',
    username: 'ahmed',
    displayName: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    bio: 'Code is poetry',
    level: 14,
    xp: 2890,
    streak: 18,
    longestStreak: 28,
    friendsCount: 15,
    preferences: { ...defaultPreferences, learningTopics: ['programming', 'computer_science'] },
    character: { ...defaultCharacter, characterId: 'lumi_green', outfit: 'outfit_coder' },
    isOnline: false,
    createdAt: '2024-11-20T10:00:00Z',
  },
  {
    id: 'user_004',
    username: 'maya',
    displayName: 'Maya Johnson',
    email: 'maya@example.com',
    bio: 'Science lover',
    level: 10,
    xp: 1800,
    streak: 7,
    longestStreak: 15,
    friendsCount: 5,
    preferences: { ...defaultPreferences, learningTopics: ['science', 'physics'] },
    character: { ...defaultCharacter, characterId: 'lumi_pink', outfit: 'outfit_explorer' },
    isOnline: true,
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'user_005',
    username: 'kai',
    displayName: 'Kai Nakamura',
    email: 'kai@example.com',
    bio: 'On a learning streak!',
    level: 8,
    xp: 1200,
    streak: 30,
    longestStreak: 30,
    friendsCount: 3,
    preferences: { ...defaultPreferences, learningTopics: ['english', 'mathematics'] },
    character: { ...defaultCharacter, characterId: 'lumi_orange', outfit: 'outfit_adventurer' },
    isOnline: false,
    createdAt: '2025-03-10T10:00:00Z',
  },
  {
    id: 'user_006',
    username: 'luna',
    displayName: 'Luna Garcia',
    email: 'luna@example.com',
    bio: 'Curious mind',
    level: 11,
    xp: 2100,
    streak: 5,
    longestStreak: 20,
    friendsCount: 9,
    preferences: { ...defaultPreferences, learningTopics: ['science', 'programming'] },
    character: { ...defaultCharacter, characterId: 'lumi_purple', outfit: 'outfit_default' },
    isOnline: true,
    createdAt: '2025-01-05T10:00:00Z',
  },
  {
    id: 'user_007',
    username: 'oliver',
    displayName: 'Oliver Smith',
    email: 'oliver@example.com',
    bio: 'Just getting started',
    level: 5,
    xp: 600,
    streak: 2,
    longestStreak: 8,
    friendsCount: 2,
    preferences: { ...defaultPreferences, learningTopics: ['programming'] },
    character: { ...defaultCharacter, characterId: 'lumi_default', outfit: 'outfit_default' },
    isOnline: false,
    createdAt: '2025-08-01T10:00:00Z',
  },
  {
    id: 'user_008',
    username: 'zara',
    displayName: 'Zara Ahmed',
    email: 'zara@example.com',
    bio: 'Learning is living',
    level: 16,
    xp: 3500,
    streak: 45,
    longestStreak: 45,
    friendsCount: 20,
    preferences: { ...defaultPreferences, learningTopics: ['physics', 'mathematics', 'english'] },
    character: { ...defaultCharacter, characterId: 'lumi_teal', outfit: 'outfit_scholar', accessory: 'hat_01' },
    isOnline: true,
    createdAt: '2024-10-15T10:00:00Z',
  },
];

function makeQuestions(levelTitle: string): Question[] {
  return [
    {
      id: 'q1',
      type: 'multiple_choice',
      question: `Which keyword creates a function in ${levelTitle}?`,
      options: ['function', 'def', 'func', 'create'],
      correctAnswer: 'def',
      explanation: 'In Python, the "def" keyword is used to define a function.',
      points: 10,
    },
    {
      id: 'q2',
      type: 'true_false',
      question: 'A variable name can start with a number in Python.',
      correctAnswer: false,
      explanation: 'Variable names in Python cannot start with a number. They must start with a letter or underscore.',
      points: 10,
    },
    {
      id: 'q3',
      type: 'fill_blank',
      question: 'The ____ statement is used to iterate over a sequence in Python.',
      correctAnswer: 'for',
      acceptableAnswers: ['for', 'For'],
      explanation: 'The "for" loop is used to iterate over a sequence like a list, string, or range.',
      points: 10,
    },
    {
      id: 'q4',
      type: 'matching',
      question: 'Match each data type with its example.',
      pairs: [
        { id: 'p1', left: 'Integer', right: '42' },
        { id: 'p2', left: 'String', right: '"hello"' },
        { id: 'p3', left: 'Boolean', right: 'True' },
        { id: 'p4', left: 'List', right: '[1, 2, 3]' },
      ],
      explanation: 'Each data type serves a different purpose in Python programming.',
      points: 15,
    },
    {
      id: 'q5',
      type: 'ordering',
      question: 'Arrange these steps in the correct order to define and call a function.',
      items: ['Write "def" keyword', 'Add function name', 'Add parentheses and colon', 'Write function body', 'Call the function'],
      correctOrder: [0, 1, 2, 3, 4],
      explanation: 'Functions are defined with def, named, given parameters in parentheses, a body, then called.',
      points: 15,
    },
    {
      id: 'q6',
      type: 'multiple_choice',
      question: 'What will `len("hello")` return?',
      options: ['4', '5', '6', 'Error'],
      correctAnswer: '5',
      explanation: 'The string "hello" has 5 characters, so len() returns 5.',
      points: 10,
    },
  ];
}

const levelsData = [
  { title: 'Introduction', description: 'Get started with the basics' },
  { title: 'Variables', description: 'Learn about storing data' },
  { title: 'Conditions', description: 'Make decisions in code' },
  { title: 'Loops', description: 'Repeat actions efficiently' },
  { title: 'Functions', description: 'Organize code with functions' },
  { title: 'Objects', description: 'Work with data structures' },
  { title: 'Advanced Topics', description: 'Take your skills further' },
];

function makeLevels(courseId: string, completed: number): import('../types/course').CourseLevel[] {
  return levelsData.map((lvl, i) => {
    const order = i + 1;
    const isCompleted = order <= completed;
    const isLocked = order > completed + 1;
    return {
      id: `${courseId}_level_${order}`,
      courseId,
      title: lvl.title,
      description: lvl.description,
      order,
      xpReward: 50 + order * 10,
      isLocked,
      progress: isCompleted ? 100 : order === completed + 1 ? 40 : 0,
      testAvailable: order <= completed + 1,
      testCompleted: isCompleted,
      testBestScore: isCompleted ? 70 + Math.floor(Math.random() * 30) : undefined,
    };
  });
}

export const mockCourses: Course[] = [
  {
    id: 'course_python',
    title: 'Python Programming',
    description: 'Master Python from basics to advanced concepts',
    icon: 'Code',
    color: '#0EA5E9',
    progress: 60,
    currentLevelId: 'course_python_level_4',
    levels: makeLevels('course_python', 3),
  },
  {
    id: 'course_math',
    title: 'Mathematics',
    description: 'Build strong math foundations step by step',
    icon: 'Calculator',
    color: '#16A34A',
    progress: 40,
    currentLevelId: 'course_math_level_3',
    levels: makeLevels('course_math', 2),
  },
  {
    id: 'course_english',
    title: 'English Language',
    description: 'Improve your English skills interactively',
    icon: 'BookOpen',
    color: '#F97316',
    progress: 20,
    currentLevelId: 'course_english_level_2',
    levels: makeLevels('course_english', 1),
  },
  {
    id: 'course_science',
    title: 'Science',
    description: 'Explore the wonders of science',
    icon: 'FlaskConical',
    color: '#8B5CF6',
    progress: 0,
    currentLevelId: 'course_science_level_1',
    levels: makeLevels('course_science', 0),
  },
  {
    id: 'course_physics',
    title: 'Physics',
    description: 'Understand how the universe works',
    icon: 'Atom',
    color: '#EC4899',
    progress: 10,
    currentLevelId: 'course_physics_level_1',
    levels: makeLevels('course_physics', 0),
  },
];

export const mockLessons: Record<string, Lesson> = {
  lesson_1: {
    id: 'lesson_1',
    levelId: 'course_python_level_1',
    title: 'What is Python?',
    xpReward: 50,
    content: [
      { type: 'text', content: 'Python is a popular programming language created by Guido van Rossum. It was released in 1991.' },
      { type: 'tip', content: 'Python is known for its simple, readable syntax which makes it great for beginners!' },
      { type: 'text', content: 'Python is used for web development, data analysis, artificial intelligence, automation, and more.' },
      { type: 'code', language: 'python', content: 'print("Hello, World!")' },
      { type: 'text', content: 'This simple line of code displays "Hello, World!" on the screen. Let\'s learn more!' },
    ],
    questions: makeQuestions('Python'),
  },
  lesson_2: {
    id: 'lesson_2',
    levelId: 'course_python_level_2',
    title: 'Understanding Variables',
    xpReward: 60,
    content: [
      { type: 'text', content: 'A variable is a container used to store data values. Think of it as a labeled box.' },
      { type: 'code', language: 'python', content: 'name = "Alex"\nage = 25\nis_student = True' },
      { type: 'tip', content: 'Variable names should be descriptive and use snake_case (lowercase with underscores).' },
      { type: 'text', content: 'You can change a variable\'s value at any time by reassigning it.' },
    ],
    questions: makeQuestions('Variables'),
  },
  lesson_3: {
    id: 'lesson_3',
    levelId: 'course_python_level_3',
    title: 'Conditional Statements',
    xpReward: 70,
    content: [
      { type: 'text', content: 'Conditional statements allow your program to make decisions based on certain conditions.' },
      { type: 'code', language: 'python', content: 'if age >= 18:\n    print("Adult")\nelif age >= 13:\n    print("Teenager")\nelse:\n    print("Child")' },
      { type: 'tip', content: 'Indentation is very important in Python. Use 4 spaces for each indentation level.' },
    ],
    questions: makeQuestions('Conditions'),
  },
  lesson_4: {
    id: 'lesson_4',
    levelId: 'course_python_level_4',
    title: 'Loops and Iteration',
    xpReward: 80,
    content: [
      { type: 'text', content: 'Loops allow you to repeat a block of code multiple times.' },
      { type: 'code', language: 'python', content: 'for i in range(5):\n    print(i)\n\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1' },
      { type: 'tip', content: 'Use "for" when you know the number of iterations. Use "while" when a condition controls the loop.' },
    ],
    questions: makeQuestions('Loops'),
  },
};

export const mockTests: Record<string, Test> = {
  test_level_1: {
    id: 'test_level_1',
    levelId: 'course_python_level_1',
    title: 'Level 1 Test — Introduction',
    description: 'Test your knowledge of Python basics',
    questionCount: 10,
    passThreshold: 70,
    timeLimitMinutes: 10,
    questions: makeQuestions('Python Basics'),
  },
  test_level_4: {
    id: 'test_level_4',
    levelId: 'course_python_level_4',
    title: 'Level 4 Test — Loops',
    description: 'Test your knowledge of loops and iteration',
    questionCount: 10,
    passThreshold: 70,
    timeLimitMinutes: 15,
    questions: makeQuestions('Loops'),
  },
};

export const mockAchievements: Achievement[] = [
  { id: 'ach_1', title: 'First Steps', description: 'Complete your first lesson', icon: 'Footprints', unlocked: true, unlockedAt: '2025-01-16T10:00:00Z' },
  { id: 'ach_2', title: '7 Day Streak', description: 'Maintain a 7-day learning streak', icon: 'Flame', unlocked: true, unlockedAt: '2025-01-22T10:00:00Z' },
  { id: 'ach_3', title: '100 Questions', description: 'Answer 100 questions correctly', icon: 'Target', unlocked: true, unlockedAt: '2025-02-01T10:00:00Z' },
  { id: 'ach_4', title: 'Level 10', description: 'Reach level 10', icon: 'Star', unlocked: true, unlockedAt: '2025-02-15T10:00:00Z' },
  { id: 'ach_5', title: '14 Day Streak', description: 'Maintain a 14-day streak', icon: 'Flame', unlocked: false, progress: 12, target: 14 },
  { id: 'ach_6', title: 'Course Master', description: 'Complete an entire course', icon: 'Trophy', unlocked: false, progress: 60, target: 100 },
  { id: 'ach_7', title: 'Social Butterfly', description: 'Add 10 friends', icon: 'Users', unlocked: false, progress: 8, target: 10 },
  { id: 'ach_8', title: 'Perfect Score', description: 'Get 100% on a test', icon: 'Award', unlocked: false, progress: 90, target: 100 },
];

export const mockStats: UserStats = {
  totalXP: 2450,
  level: 12,
  currentStreak: 12,
  longestStreak: 35,
  activeDays: ['2025-09-01', '2025-09-02', '2025-09-03', '2025-09-04', '2025-09-05', '2025-09-06', '2025-09-07', '2025-09-08', '2025-09-09', '2025-09-10'],
  lessonsCompleted: 28,
  testsCompleted: 6,
  correctAnswers: 142,
  incorrectAnswers: 18,
  totalStudyTimeMinutes: 720,
  weeklyActivity: [
    { day: 'Mon', minutes: 15 },
    { day: 'Tue', minutes: 20 },
    { day: 'Wed', minutes: 10 },
    { day: 'Thu', minutes: 25 },
    { day: 'Fri', minutes: 15 },
    { day: 'Sat', minutes: 30 },
    { day: 'Sun', minutes: 0 },
  ],
};

export const mockFriends: Friend[] = [
  { id: 'friend_1', userId: 'user_002', user: mockUsers[1], status: 'friend', since: '2025-02-01T10:00:00Z', mutualFriends: 3 },
  { id: 'friend_2', userId: 'user_003', user: mockUsers[2], status: 'friend', since: '2025-02-15T10:00:00Z', mutualFriends: 5 },
  { id: 'friend_3', userId: 'user_004', user: mockUsers[3], status: 'friend', since: '2025-03-01T10:00:00Z', mutualFriends: 1 },
  { id: 'friend_4', userId: 'user_006', user: mockUsers[5], status: 'friend', since: '2025-03-10T10:00:00Z', mutualFriends: 2 },
];

export const mockFriendRequests: FriendRequest[] = [
  { id: 'req_1', fromUser: mockUsers[4], toUserId: 'user_001', createdAt: '2025-09-08T10:00:00Z' },
  { id: 'req_2', fromUser: mockUsers[6], toUserId: 'user_001', createdAt: '2025-09-09T10:00:00Z' },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, user: mockUsers[7], xp: 3500, level: 16, previousRank: 1 },
  { rank: 2, user: mockUsers[1], xp: 3200, level: 15, previousRank: 3 },
  { rank: 3, user: mockUsers[2], xp: 2890, level: 14, previousRank: 2 },
  { rank: 4, user: mockUsers[0], xp: 2450, level: 12, previousRank: 4 },
  { rank: 5, user: mockUsers[5], xp: 2100, level: 11, previousRank: 5 },
  { rank: 6, user: mockUsers[3], xp: 1800, level: 10, previousRank: 6 },
  { rank: 7, user: mockUsers[4], xp: 1200, level: 8, previousRank: 7 },
  { rank: 8, user: mockUsers[6], xp: 600, level: 5, previousRank: 8 },
];

export const mockShopItems: ShopItem[] = [
  { id: 'char_cyber', name: 'Cyber Lumi', description: 'A futuristic cyber character', category: 'characters', price: 500, icon: 'Bot', rarity: 'epic', owned: false, equipped: false, previewColor: '#06B6D4' },
  { id: 'char_space', name: 'Space Explorer', description: 'Explore the cosmos', category: 'characters', price: 750, icon: 'Rocket', rarity: 'legendary', owned: false, equipped: false, previewColor: '#8B5CF6' },
  { id: 'char_ninja', name: 'Ninja Lumi', description: 'Stealthy and cool', category: 'characters', price: 400, icon: 'User', rarity: 'rare', owned: true, equipped: false, previewColor: '#16A34A' },
  { id: 'outfit_scholar', name: 'Scholar Outfit', description: 'Look the part of a scholar', category: 'outfits', price: 300, icon: 'GraduationCap', rarity: 'rare', owned: true, equipped: true, previewColor: '#1D4ED8' },
  { id: 'outfit_coder', name: 'Coder Outfit', description: 'For the code warriors', category: 'outfits', price: 350, icon: 'Code', rarity: 'rare', owned: false, equipped: false, previewColor: '#0EA5E9' },
  { id: 'outfit_explorer', name: 'Explorer Outfit', description: 'Ready for adventure', category: 'outfits', price: 250, icon: 'Compass', rarity: 'common', owned: true, equipped: false, previewColor: '#F97316' },
  { id: 'hat_crown', name: 'Golden Crown', description: 'For royalty', category: 'hats', price: 1000, icon: 'Crown', rarity: 'legendary', owned: false, equipped: false, previewColor: '#FBBF24' },
  { id: 'hat_cap', name: 'Cool Cap', description: 'Stay cool', category: 'hats', price: 150, icon: 'HardHat', rarity: 'common', owned: true, equipped: false, previewColor: '#EF4444' },
  { id: 'hat_wizard', name: 'Wizard Hat', description: 'Magical headwear', category: 'hats', price: 600, icon: 'Sparkles', rarity: 'epic', owned: false, equipped: false, previewColor: '#8B5CF6' },
  { id: 'acc_glasses', name: 'Smart Glasses', description: 'Look intelligent', category: 'accessories', price: 200, icon: 'Glasses', rarity: 'common', owned: true, equipped: true, previewColor: '#0F172A' },
  { id: 'acc_wings', name: 'Rainbow Wings', description: 'Soar with style', category: 'accessories', price: 800, icon: 'Feather', rarity: 'legendary', owned: false, equipped: false, previewColor: '#EC4899' },
  { id: 'bg_galaxy', name: 'Galaxy Background', description: 'A starry backdrop', category: 'backgrounds', price: 500, icon: 'Galaxy', rarity: 'epic', owned: false, equipped: false, previewColor: '#1E1B4B' },
  { id: 'bg_beach', name: 'Beach Background', description: 'Relaxing shore vibes', category: 'backgrounds', price: 300, icon: 'Palmtree', rarity: 'rare', owned: true, equipped: false, previewColor: '#F0F9FF' },
  { id: 'badge_pro', name: 'Pro Badge', description: 'Show off your status', category: 'badges', price: 400, icon: 'Medal', rarity: 'rare', owned: false, equipped: false, previewColor: '#F59E0B' },
];

export const mockChatMessages: ChatMessage[] = [
  { id: 'msg_1', role: 'assistant', content: "Hi there! I'm Lumi, your AI learning assistant. I can help explain concepts, give examples, quiz you, and more. What would you like to learn about today?", timestamp: '2025-09-10T09:00:00Z' },
];

export const mockSuggestedPrompts = [
  'Explain this topic',
  'Give me another example',
  'Why is my answer wrong?',
  'Quiz me',
  'Make this easier',
];

export const mockGems = 1250;
