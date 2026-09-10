import { CourseService } from '../../types/course';
import { Course } from '../../types/course';
import { mockCourses } from '../../mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockCourseApi: CourseService = {
  async getCourses(): Promise<Course[]> {
    await delay(600);
    return mockCourses;
  },

  async getCourse(courseId: string): Promise<Course> {
    await delay(400);
    const course = mockCourses.find((c) => c.id === courseId);
    if (!course) throw { success: false, message: 'Course not found.', code: 'COURSE_NOT_FOUND' };
    return course;
  },

  async getLevels(courseId: string): Promise<Course['levels']> {
    await delay(400);
    const course = mockCourses.find((c) => c.id === courseId);
    if (!course) throw { success: false, message: 'Course not found.', code: 'COURSE_NOT_FOUND' };
    return course.levels;
  },
};
