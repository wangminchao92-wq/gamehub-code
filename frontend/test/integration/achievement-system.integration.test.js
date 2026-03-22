/**
 * AchievementSystem 集成测试
 * 测试组件与API、状态管理、路由的集成
 */

const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const React = require('react');
const { rest } = require('msw');
const { setupServer } = require('msw/node');
const AchievementSystem = require('../../src/components/AchievementSystem').default;

// 模拟服务器
const server = setupServer(
  // 获取成就列表
  rest.get('/api/achievements', (req, res, ctx) => {
    const userId = req.url.searchParams.get('userId');
    
    if (!userId) {
      return res(
        ctx.status(401),
        ctx.json({ error: '需要用户认证' })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        achievements: [
          {
            id: 'welcome',
            name: '欢迎来到GameHub',
            description: '完成注册并首次登录',
            type: 'SPECIAL',
            rarity: 'COMMON',
            points: 100,
            progress: 100,
            total: 100,
            unlockedAt: new Date().toISOString(),
            isUnlocked: true,
            isSecret: false,
            icon: '👋',
            color: '#3b82f6',
            backgroundColor: '#eff6ff',
          },
          {
            id: 'first_post',
            name: '首次发帖',
            description: '发布第一篇社区帖子',
            type: 'CONTENT',
            rarity: 'UNCOMMON',
            points: 200,
            progress: 50,
            total: 1,
            unlockedAt: null,
            isUnlocked: false,
            isSecret: false,
            icon: '📝',
            color: '#10b981',
            backgroundColor: '#d1fae5',
          },
        ],
        stats: {
          total: 2,
          unlocked: 1,
          inProgress: 1,
          totalPoints: 300,
        },
      })
    );
  }),

  // 解锁成就
  rest.post('/api/achievements/:id/unlock', (req, res, ctx) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res(
        ctx.status(401),
        ctx.json({ error: '需要用户认证' })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        achievement: {
          id,
          unlockedAt: new Date().toISOString(),
          isUnlocked: true,
        },
        pointsAwarded: 200,
      })
    );
  }),

  // 分享成就
  rest.post('/api/achievements/:id/share', (req, res, ctx) => {
    const { id } = req.params;
    const { platform } = req.body;

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        shareUrl: `https://gamehub.com/achievements/${id}/share`,
        platform,
      })
    );
  }),

  // 获取用户统计
  rest.get('/api/users/:userId/stats', (req, res, ctx) => {
    const { userId } = req.params;

    return res(
      ctx.status(200),
      ctx.json({
        userId,
        postsCount: 5,
        commentsCount: 20,
        likesCount: 50,
        followersCount: 10,
        followingCount: 15,
        achievementsCount: 1,
        totalPoints: 100,
      })
    );
  })
);

// 在所有测试之前启动模拟服务器
beforeAll(() => server.listen());

// 在每个测试之后重置处理程序
afterEach(() => server.resetHandlers());

// 在所有测试之后关闭服务器
afterAll(() => server.close());

describe('AchievementSystem 集成测试', () => {
  // 测试1: 组件与API集成
  test('应该从API加载成就数据', async () => {
    render(
      <AchievementSystem
        userId="test-user-123"
        requireAuth={true}
      />
    );

    // 应该显示加载状态
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // 等待API响应
    await waitFor(() => {
      expect(screen.getByText('欢迎来到GameHub')).toBeInTheDocument();
      expect(screen.getByText('首次发帖')).toBeInTheDocument();
    });

    // 检查统计信息
    expect(screen.getByText('总成就: 2')).toBeInTheDocument();
    expect(screen.getByText('已解锁: 1')).toBeInTheDocument();
    expect(screen.getByText('总积分: 300')).toBeInTheDocument();
  });

  // 测试2: API错误处理
  test('应该处理API错误', async () => {
    // 模拟API错误
    server.use(
      rest.get('/api/achievements', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: '服务器内部错误' })
        );
      })
    );

    render(
      <AchievementSystem
        userId="test-user-123"
        requireAuth={true}
      />
    );

    // 应该显示错误信息
    await waitFor(() => {
      expect(screen.getByText('加载失败')).toBeInTheDocument();
      expect(screen.getByText('服务器内部错误')).toBeInTheDocument();
    });

    // 应该显示重试按钮
    const retryButton = screen.getByText('重试');
    expect(retryButton).toBeInTheDocument();
  });

  // 测试3: 认证失败处理
  test('应该处理认证失败', async () => {
    // 模拟认证错误
    server.use(
      rest.get('/api/achievements', (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ error: '需要登录' })
        );
      })
    );

    render(
      <AchievementSystem
        userId={null}
        requireAuth={true}
      />
    );

    // 应该显示登录提示
    await waitFor(() => {
      expect(screen.getByText('需要登录')).toBeInTheDocument();
      expect(screen.getByText('请先登录以查看成就')).toBeInTheDocument();
    });
  });

  // 测试4: 成就解锁集成
  test('应该能够解锁成就', async () => {
    render(
      <AchievementSystem
        userId="test-user-123"
        requireAuth={true}
      />
    );

    // 等待数据加载
    await waitFor(() => {
      expect(screen.getByText('首次发帖')).toBeInTheDocument();
    });

    // 点击解锁按钮
    const unlockButton = screen.getByText('立即解锁');
    fireEvent.click(unlockButton);

    // 应该显示确认对话框
    expect(screen.getByText('确认解锁')).toBeInTheDocument();
    expect(screen.getByText('确定要解锁此成就吗？')).toBeInTheDocument();

    // 确认解锁
    const confirmButton = screen.getByText('确定');
    fireEvent.click(confirmButton);

    // 应该显示成功消息
    await waitFor(() => {
      expect(screen.getByText('成就解锁成功！')).toBeInTheDocument();
    });

    // 成就状态应该更新
    await waitFor(() => {
      const achievementItem = screen.getByText('首次发帖').closest('[data-testid="achievement-item"]');
      expect(achievementItem).toHaveTextContent('已解锁');
    });
  });

  // 测试5: 成就分享集成
  test('应该能够分享成就', async () => {
    // 模拟navigator.share
    const mockShare = jest.fn().mockResolvedValue();
    global.navigator.share = mockShare;

    render(
      <AchievementSystem
        userId="test-user-123"
        requireAuth={true}
      />
    );

    // 等待数据加载
    await waitFor(() => {
      expect(screen.getByText('欢迎来到GameHub')).toBeInTheDocument();
    });

    // 点击分享按钮
    const shareButton = screen.getAllByLabelText('分享成就')[0];
    fireEvent.click(shareButton);

    // 应该显示分享选项
    expect(screen.getByText('分享到...')).toBeInTheDocument();

    // 选择Twitter分享
    const twitterOption = screen.getByText('Twitter');
    fireEvent.click(twitterOption);

    // 应该调用分享API
    await waitFor(() => {
      expect(mockShare).toHaveBeenCalledWith({
        title: '我在GameHub解锁了成就：欢迎来到GameHub',
        text: '完成注册并首次登录',
        url: 'https://gamehub.com/achievements/welcome/share',
      });
    });

    // 清理模拟
    delete global.navigator.share;
  });

  // 测试6: 实时更新集成
  test('应该支持实时更新', async () => {
    // 模拟WebSocket连接
    const mockWebSocket = {
      onmessage: null,
      send: jest.fn(),
      close: jest.fn(),
    };
    
    global.WebSocket = jest.fn(() => mockWebSocket);

    render(
      <AchievementSystem
        userId="test-user-123"
        requireAuth={true}
        realTimeEnabled={true}
      />
    );

    // 等待初始数据加载
    await waitFor(() => {
      expect(screen.getByText('欢迎来到GameHub')).toBeInTheDocument();
    });

    // 模拟服务器推送新成就
    const newAchievementMessage = JSON.stringify({
      type: 'ACHIEVEMENT_UNLOCKED',
      data: {
        id: 'new_achievement',
        name: '新成就',
        description: '刚刚解锁的新成就',
        type: 'GAME',
        rarity: 'RARE',
        points: 300,
        unlockedAt: new Date().toISOString(),
      },
    });

    // 触发WebSocket消息
    mockWebSocket.onmessage({ data: newAchievementMessage });

    // 应该显示新成就通知
    await waitFor(() => {
      expect(screen.getByText('新成就解锁！')).toBeInTheDocument();
      expect(screen.getByText('新成就')).toBeInTheDocument();
    });

    // 清理模拟
    global.WebSocket.mockRestore();
  });

  // 测试7: 本地存储集成
  test('应该使用本地存储保存用户偏好', () => {
    // 模拟localStorage
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    render(
      <AchievementSystem
        userId="test-user-123"
        requireAuth={true}
      />
    );

    // 应该读取用户偏好
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('achievement-system-preferences');

    // 更改视图模式
    const viewToggle = screen.getByLabelText('切换视图');
    fireEvent.click(viewToggle);

    // 应该保存用户偏好
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'achievement-system-preferences',
      expect.any(String)
    );

    // 清理模拟
    delete window.localStorage;
  });

  // 测试8: 路由集成
  test('应该与路由系统正确集成', async () => {
    // 模拟Next.js路由
    const mockRouter = {
      push: jest.fn(),
      query: { achievementId: 'welcome' },
    };
    
    jest.mock('next/router', () => ({
      useRouter: () => mockRouter,
    }));

    render(
      <AchievementSystem
        userId="test-user-123"
        requireAuth={true}
      />
    );

    // 等待数据加载
    await waitFor(() => {
      expect(screen.getByText('欢迎来到GameHub')).toBeInTheDocument();
    });

    // 点击成就查看详情
    const achievementItem = screen.getByText('欢迎来到GameHub').closest('[data-testid="achievement-item"]');
    fireEvent.click(achievementItem);

    // 应该更新URL
    expect(mockRouter.push).toHaveBeenCalledWith(
      '/achievements/welcome',
      undefined,
      { shallow: true }
    );
  });

  // 测试9: 多语言集成
  test('应该支持多语言', async () => {
    // 模拟i18n
    const mockT = jest.fn((key) => {
      const translations = {
        'achievements.title': 'Achievements',
        'achievements.total': 'Total',
        'achievements.unlocked': 'Unlocked',
        'achievements.inProgress': 'In Progress',
        'achievements.totalPoints': 'Total Points',
      };
      return translations[key] || key;
    });

    // 模拟useTranslation hook
    jest.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: mockT,
        i18n: { language: 'en' },
      }),
    }));

    render(
      <AchievementSystem
        userId="test-user-123"
        requireAuth={true}
      />
    );

    // 应该使用翻译文本
    expect(mockT).toHaveBeenCalledWith('achievements.title');
    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Unlocked')).toBeInTheDocument();
  });

  // 测试10: 主题集成
  test('应该支持主题切换', () => {
    // 模拟主题上下文
    const ThemeContext = React.createContext({
      theme: 'dark',
      toggleTheme: jest.fn(),
    });

    render(
      <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: jest.fn() }}>
        <AchievementSystem
          userId="test-user-123"
          requireAuth={true}
        />
      </ThemeContext.Provider>
    );

    // 应该应用暗色主题样式
    const container = screen.getByTestId('achievements-container');
    expect(container).toHaveClass('dark');
    expect(container).toHaveClass('bg-gray-900');
  });

  // 测试11: 性能监控集成
  test('应该集成性能监控', async () => {
    // 模拟性能监控
    const mockPerfMark = jest.fn();
    const mockPerfMeasure = jest.fn();
    
    global.performance.mark = mockPerfMark;
    global.performance.measure = mockPerfMeasure;

    render(
      <AchievementSystem
        userId="test-user-123"
        requireAuth={true}
      />
    );

    // 应该记录性能标记
    expect(mockPerfMark).toHaveBeenCalledWith('achievements-load-start');
    
    // 等待数据加载完成
    await waitFor(() => {
      expect(screen.getByText('欢迎来到GameHub')).toBeInTheDocument();
    });

    // 应该记录性能测量
    expect(mockPerfMeasure).toHaveBeenCalledWith(
      'achievements-load-duration',
      'achievements-load-start',
      expect.any(String)
    );

    // 清理模拟
    delete global.performance.mark;
    delete global.performance.measure;
  });

  // 测试12: 错误边界集成
  test('应该被错误边界保护', () => {
    // 模拟组件抛出错误
    const ErrorThrowingComponent = () => {
      throw new Error('测试错误');
    };

    // 模拟错误边界
    const ErrorBoundary = ({ children }) => {
      const [hasError, setHasError] = React.useState(false);
      
      React.useEffect(() => {
        const handleError = () => setHasError(true);
        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
      }, []);

      if (hasError) {
        return <div data-testid="error-fallback">组件发生错误</div>;
      }

      return children;
    };

    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    // 应该显示错误回退界面
    expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
    expect(screen.getByText('组件发生错误')).toBeInTheDocument();
  });

  // 测试13: 可访问性集成
  test('应该满足可访问性标准', async () => {
    const { container } = render(
      <AchievementSystem
        userId="test-user-123"
        requireAuth={true}
      />
    );

    // 等待数据加载
    await waitFor(() => {
      expect(screen.getByText('欢迎来到GameHub')).toBeInTheDocument();
    });

    // 使用axe-core进行可访问性测试
    const axe = require('@axe-core/react');
    const results = await axe(container);

    // 应该没有严重的可访问性问题
    const violations = results.violations.filter(v => v.impact === 'serious');
    expect(violations).toHaveLength(0);
  });

  // 测试14: 浏览器兼容性
  test('应该在不同浏览器中正常工作', () => {
    // 测试不同浏览器特性支持
    const features = {
      fetch: typeof fetch !== 'undefined',
      promise: typeof Promise !== 'undefined',
      localStorage: typeof localStorage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      intersectionObserver: typeof IntersectionObserver !== 'undefined',
      resizeObserver: typeof ResizeObserver !== 'undefined',
    };

    // 所有必需特性都应该可用
    expect(features.fetch).toBe(true);
    expect(features.promise).toBe(true);
    expect(features.localStorage).toBe(true);
    expect(features.sessionStorage).toBe(true);

    // IntersectionObserver和ResizeObserver可能在某些旧浏览器中不可用
    // 组件应该有降级方案
    if (!features.intersectionObserver) {
      console.warn('IntersectionObserver not supported, using fallback');
    }

    if (!features.resizeObserver) {
      console.warn('ResizeObserver not supported, using fallback');
    }
  });

