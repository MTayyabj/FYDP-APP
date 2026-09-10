import { LessonService } from '../../types/lesson';
import { Lesson } from '../../types/lesson';
import { mockLessons } from '../../mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockLessonApi: LessonService = {
  async getLesson(lessonId: string): Promise<Lesson> {
    await delay(500);
    const lesson = mockLessons[lessonId] || Object.values(mockLessons)[0];
    return lesson;
  },

  async getLessonsByLevel(levelId: string): Promise<Lesson[]> {
    await delay(400);
    return Object.values(mockLessons).filter((l) => l.levelId === levelId);
  },

  async submitLesson(lessonId: string, _answers: Record<string, unknown>): Promise<{ xpEarned: number }> {
    await delay(400);
    const lesson = mockLessons[lessonId] || Object.values(mockLessons)[0];
    return { xpEarned: lesson.xpReward };
  },
};
