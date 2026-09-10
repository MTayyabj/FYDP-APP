import { create } from 'zustand';
import { Course } from '../types/course';
import { Lesson } from '../types/lesson';
import { TestResult } from '../types/test';
import { Achievement, UserStats } from '../types/user';

interface LearningState {
  courses: Course[];
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  currentTestResult: TestResult | null;
  achievements: Achievement[];
  stats: UserStats | null;
  isLoadingCourses: boolean;
  isLoadingLesson: boolean;

  setCourses: (courses: Course[]) => void;
  setCurrentCourse: (course: Course | null) => void;
  setCurrentLesson: (lesson: Lesson | null) => void;
  setCurrentTestResult: (result: TestResult | null) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setStats: (stats: UserStats) => void;
  addXP: (xp: number) => void;
  completeLesson: (lessonId: string) => void;
  setLoadingCourses: (loading: boolean) => void;
  setLoadingLesson: (loading: boolean) => void;
}

export const useLearningStore = create<LearningState>((set) => ({
  courses: [],
  currentCourse: null,
  currentLesson: null,
  currentTestResult: null,
  achievements: [],
  stats: null,
  isLoadingCourses: false,
  isLoadingLesson: false,

  setCourses: (courses) => set({ courses }),
  setCurrentCourse: (course) => set({ currentCourse: course }),
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
  setCurrentTestResult: (result) => set({ currentTestResult: result }),
  setAchievements: (achievements) => set({ achievements }),
  setStats: (stats) => set({ stats }),
  addXP: (xp) =>
    set((state) => ({
      stats: state.stats
        ? { ...state.stats, totalXP: state.stats.totalXP + xp }
        : null,
    })),
  completeLesson: (_lessonId) =>
    set((state) => ({
      stats: state.stats
        ? { ...state.stats, lessonsCompleted: state.stats.lessonsCompleted + 1 }
        : null,
    })),
  setLoadingCourses: (loading) => set({ isLoadingCourses: loading }),
  setLoadingLesson: (loading) => set({ isLoadingLesson: loading }),
}));
