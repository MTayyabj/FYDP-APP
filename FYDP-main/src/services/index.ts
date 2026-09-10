import { config } from '../constants/config';
import { AuthService } from '../types/auth';
import { CourseService } from '../types/course';
import { LessonService } from '../types/lesson';
import { TestService } from '../types/test';
import { UserService } from '../types/user';
import { FriendService } from '../types/friend';
import { LeaderboardService } from '../types/leaderboard';
import { ShopService } from '../types/shop';
import { ChatbotService } from '../types/chatbot';

import { mockAuthApi } from './mock/mockAuthApi';
import { mockCourseApi } from './mock/mockCourseApi';
import { mockLessonApi } from './mock/mockLessonApi';
import { mockTestApi } from './mock/mockTestApi';
import { mockUserApi } from './mock/mockUserApi';
import { mockFriendApi } from './mock/mockFriendApi';
import { mockLeaderboardApi } from './mock/mockLeaderboardApi';
import { mockShopApi } from './mock/mockShopApi';
import { mockChatbotApi } from './mock/mockChatbotApi';

// When the real backend is ready, replace mock implementations with real ones:
// import { authApi } from './api/authApi';
// export const authService: AuthService = config.mockEnabled ? mockAuthApi : authApi;

export const authService: AuthService = mockAuthApi;
export const courseService: CourseService = mockCourseApi;
export const lessonService: LessonService = mockLessonApi;
export const testService: TestService = mockTestApi;
export const userService: UserService = mockUserApi;
export const friendService: FriendService = mockFriendApi;
export const leaderboardService: LeaderboardService = mockLeaderboardApi;
export const shopService: ShopService = mockShopApi;
export const chatbotService: ChatbotService = mockChatbotApi;

export { mockAuthApi, mockCourseApi, mockLessonApi, mockTestApi, mockUserApi, mockFriendApi, mockLeaderboardApi, mockShopApi, mockChatbotApi };
