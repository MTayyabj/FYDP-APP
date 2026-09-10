export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
  currentLevelId?: string;
  levels: CourseLevel[];
}

export interface CourseLevel {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  isLocked: boolean;
  progress: number;
  testAvailable: boolean;
  testCompleted: boolean;
  testBestScore?: number;
}

export interface CourseService {
  getCourses(): Promise<Course[]>;
  getCourse(courseId: string): Promise<Course>;
  getLevels(courseId: string): Promise<CourseLevel[]>;
}
