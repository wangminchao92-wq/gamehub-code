// 测试环境设置
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// 全局测试配置

// 1. 模拟Next.js路由
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// 2. 模拟Next.js Head组件
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));

// 3. 模拟Next.js Image组件
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // 简化Image组件用于测试
    const { src, alt, ...rest } = props;
    return <img src={src} alt={alt} {...rest} />;
  },
}));

// 4. 模拟NextAuth会话
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'test-user-123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER',
        level: 1,
        experience: 0,
        points: 0,
      },
      expires: '2026-03-23T00:00:00.000Z',
    },
    status: 'authenticated',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
}));

// 5. 模拟Prisma客户端
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    article: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    forumPost: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    comment: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    achievement: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    notification: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    follow: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// 6. 模拟fetch API
global.fetch = jest.fn();

// 7. 模拟localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// 8. 模拟sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// 9. 模拟ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// 10. 模拟IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// 11. 模拟MatchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// 12. 模拟Scroll相关API
window.scrollTo = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// 13. 测试辅助函数

// 模拟用户数据
export const mockUser = {
  id: 'test-user-123',
  username: 'testuser',
  email: 'test@example.com',
  displayName: '测试用户',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
  role: 'USER',
  level: 1,
  experience: 0,
  points: 0,
  status: 'ACTIVE',
  emailVerified: true,
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 模拟文章数据
export const mockArticle = {
  id: 'article-123',
  title: '测试文章标题',
  slug: 'test-article-slug',
  content: '测试文章内容',
  excerpt: '测试文章摘要',
  authorId: 'test-user-123',
  status: 'PUBLISHED',
  views: 100,
  likes: 10,
  commentsCount: 5,
  publishedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 模拟帖子数据
export const mockPost = {
  id: 'post-123',
  title: '测试帖子标题',
  slug: 'test-post-slug',
  content: '测试帖子内容',
  authorId: 'test-user-123',
  views: 200,
  likes: 20,
  commentsCount: 10,
  isPinned: false,
  isLocked: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 模拟成就数据
export const mockAchievement = {
  id: 'achievement-123',
  name: '测试成就',
  description: '测试成就描述',
  type: 'CONTENT',
  rarity: 'COMMON',
  points: 100,
  requirements: [{ type: 'POST_COUNT', value: '10' }],
  icon: '🏆',
  color: '#3b82f6',
  backgroundColor: '#eff6ff',
  createdAt: new Date().toISOString(),
};

// 模拟通知数据
export const mockNotification = {
  id: 'notification-123',
  userId: 'test-user-123',
  type: 'LIKE',
  title: '新点赞',
  content: '用户点赞了您的文章',
  read: false,
  priority: 'MEDIUM',
  createdAt: new Date().toISOString(),
};

// 模拟关注数据
export const mockFollow = {
  id: 'follow-123',
  followerId: 'test-user-123',
  followingId: 'user-456',
  createdAt: new Date().toISOString(),
};

// 测试工具函数
export const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟API响应
export const mockApiResponse = (data, status = 200, ok = true) => ({
  ok,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
});

// 清理测试环境
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});

// 所有测试完成后清理
afterAll(() => {
  jest.restoreAllMocks();
});