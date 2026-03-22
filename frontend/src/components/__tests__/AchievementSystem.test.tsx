import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AchievementSystem from '../AchievementSystem';
import { mockUser, mockAchievement } from '../../../test/setupTests';

// 模拟数据
const mockAchievements = [
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
  {
    id: 'social_butterfly',
    name: '社交达人',
    description: '获得10个粉丝',
    type: 'SOCIAL',
    rarity: 'RARE',
    points: 500,
    progress: 30,
    total: 10,
    unlockedAt: null,
    isUnlocked: false,
    isSecret: false,
    icon: '🦋',
    color: '#8b5cf6',
    backgroundColor: '#ede9fe',
  },
];

describe('AchievementSystem 组件测试', () => {
  // 测试1: 组件正常渲染
  test('应该正确渲染成就系统', () => {
    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={mockAchievements}
        showLocked={true}
        showProgress={true}
      />
    );

    // 检查标题
    expect(screen.getByText('成就系统')).toBeInTheDocument();
    
    // 检查成就数量
    const achievementElements = screen.getAllByTestId('achievement-item');
    expect(achievementElements).toHaveLength(mockAchievements.length);
    
    // 检查已解锁成就
    expect(screen.getByText('欢迎来到GameHub')).toBeInTheDocument();
    expect(screen.getByText('首次发帖')).toBeInTheDocument();
    expect(screen.getByText('社交达人')).toBeInTheDocument();
  });

  // 测试2: 成就分类过滤
  test('应该能够按类别过滤成就', async () => {
    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={mockAchievements}
        showLocked={true}
        showProgress={true}
      />
    );

    // 初始应该显示所有成就
    let achievementElements = screen.getAllByTestId('achievement-item');
    expect(achievementElements).toHaveLength(3);

    // 切换到内容类成就
    const contentFilter = screen.getByLabelText('内容成就');
    fireEvent.click(contentFilter);

    // 应该只显示内容类成就
    await waitFor(() => {
      achievementElements = screen.getAllByTestId('achievement-item');
      expect(achievementElements).toHaveLength(1);
      expect(screen.getByText('首次发帖')).toBeInTheDocument();
      expect(screen.queryByText('欢迎来到GameHub')).not.toBeInTheDocument();
    });
  });

  // 测试3: 成就状态过滤
  test('应该能够按状态过滤成就', async () => {
    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={mockAchievements}
        showLocked={true}
        showProgress={true}
      />
    );

    // 切换到已解锁成就
    const unlockedFilter = screen.getByLabelText('已解锁');
    fireEvent.click(unlockedFilter);

    // 应该只显示已解锁成就
    await waitFor(() => {
      const achievementElements = screen.getAllByTestId('achievement-item');
      expect(achievementElements).toHaveLength(1);
      expect(screen.getByText('欢迎来到GameHub')).toBeInTheDocument();
      expect(screen.queryByText('首次发帖')).not.toBeInTheDocument();
    });
  });

  // 测试4: 成就搜索功能
  test('应该能够搜索成就', async () => {
    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={mockAchievements}
        showLocked={true}
        showProgress={true}
      />
    );

    // 搜索"发帖"
    const searchInput = screen.getByPlaceholderText('搜索成就...');
    fireEvent.change(searchInput, { target: { value: '发帖' } });

    // 应该只显示包含"发帖"的成就
    await waitFor(() => {
      const achievementElements = screen.getAllByTestId('achievement-item');
      expect(achievementElements).toHaveLength(1);
      expect(screen.getByText('首次发帖')).toBeInTheDocument();
      expect(screen.queryByText('欢迎来到GameHub')).not.toBeInTheDocument();
    });
  });

  // 测试5: 成就排序功能
  test('应该能够按不同方式排序成就', async () => {
    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={mockAchievements}
        showLocked={true}
        showProgress={true}
      />
    );

    // 初始按解锁时间排序（已解锁的在前）
    let achievementElements = screen.getAllByTestId('achievement-item');
    expect(achievementElements[0]).toHaveTextContent('欢迎来到GameHub');

    // 切换到按积分排序
    const sortSelect = screen.getByLabelText('排序方式');
    fireEvent.change(sortSelect, { target: { value: 'points' } });

    // 应该按积分降序排列（500积分的在前）
    await waitFor(() => {
      achievementElements = screen.getAllByTestId('achievement-item');
      expect(achievementElements[0]).toHaveTextContent('社交达人');
    });
  });

  // 测试6: 成就详情查看
  test('应该能够查看成就详情', async () => {
    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={mockAchievements}
        showLocked={true}
        showProgress={true}
      />
    );

    // 点击成就查看详情
    const achievementItem = screen.getByText('首次发帖').closest('[data-testid="achievement-item"]');
    fireEvent.click(achievementItem!);

    // 应该显示成就详情
    await waitFor(() => {
      expect(screen.getByText('成就详情')).toBeInTheDocument();
      expect(screen.getByText('发布第一篇社区帖子')).toBeInTheDocument();
      expect(screen.getByText('200 积分')).toBeInTheDocument();
    });
  });

  // 测试7: 成就进度显示
  test('应该正确显示成就进度', () => {
    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={mockAchievements}
        showLocked={true}
        showProgress={true}
      />
    );

    // 检查进度条
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(3);

    // 检查进度文本
    expect(screen.getByText('50%')).toBeInTheDocument(); // 首次发帖 50%
    expect(screen.getByText('30%')).toBeInTheDocument(); // 社交达人 30%
  });

  // 测试8: 成就统计显示
  test('应该正确显示成就统计', () => {
    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={mockAchievements}
        showLocked={true}
        showProgress={true}
      />
    );

    // 检查统计信息
    expect(screen.getByText('总成就: 3')).toBeInTheDocument();
    expect(screen.getByText('已解锁: 1')).toBeInTheDocument();
    expect(screen.getByText('进行中: 2')).toBeInTheDocument();
    expect(screen.getByText('总积分: 800')).toBeInTheDocument();
  });

  // 测试9: 秘密成就处理
  test('应该正确处理秘密成就', () => {
    const achievementsWithSecret = [
      ...mockAchievements,
      {
        id: 'secret_achievement',
        name: '秘密成就',
        description: '这是一个秘密成就',
        type: 'SPECIAL',
        rarity: 'LEGENDARY',
        points: 1000,
        progress: 0,
        total: 1,
        unlockedAt: null,
        isUnlocked: false,
        isSecret: true,
        icon: '🔒',
        color: '#f59e0b',
        backgroundColor: '#fef3c7',
      },
    ];

    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={achievementsWithSecret}
        showLocked={true}
        showProgress={true}
      />
    );

    // 秘密成就应该被隐藏
    const achievementElements = screen.getAllByTestId('achievement-item');
    expect(achievementElements).toHaveLength(3); // 只显示3个，秘密成就被隐藏
    expect(screen.queryByText('秘密成就')).not.toBeInTheDocument();
  });

  // 测试10: 响应式设计
  test('应该支持响应式设计', () => {
    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={mockAchievements}
        showLocked={true}
        showProgress={true}
      />
    );

    // 检查网格布局
    const gridContainer = screen.getByTestId('achievements-grid');
    expect(gridContainer).toHaveClass('grid');
    
    // 检查移动端适配
    const viewToggle = screen.getByLabelText('切换视图');
    expect(viewToggle).toBeInTheDocument();
  });

  // 测试11: 错误处理
  test('应该正确处理错误状态', () => {
    // 模拟API错误
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={[]}
        showLocked={true}
        showProgress={true}
      />
    );

    // 应该显示空状态
    expect(screen.getByText('暂无成就数据')).toBeInTheDocument();
    expect(screen.getByText('开始参与社区活动来解锁成就吧！')).toBeInTheDocument();

    consoleError.mockRestore();
  });

  // 测试12: 加载状态
  test('应该正确显示加载状态', () => {
    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={[]}
        showLocked={true}
        showProgress={true}
        loading={true}
      />
    );

    // 应该显示加载指示器
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('加载成就数据中...')).toBeInTheDocument();
  });

  // 测试13: 交互反馈
  test('应该提供良好的交互反馈', async () => {
    const handleUnlock = jest.fn();
    const handleShare = jest.fn();

    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={mockAchievements}
        showLocked={true}
        showProgress={true}
        onUnlock={handleUnlock}
        onShare={handleShare}
      />
    );

    // 测试解锁按钮
    const unlockButtons = screen.getAllByText('立即解锁');
    fireEvent.click(unlockButtons[0]);

    expect(handleUnlock).toHaveBeenCalledWith('first_post');

    // 测试分享按钮
    const shareButtons = screen.getAllByLabelText('分享成就');
    fireEvent.click(shareButtons[0]);

    expect(handleShare).toHaveBeenCalledWith('welcome');
  });

  // 测试14: 无障碍访问
  test('应该满足无障碍访问要求', () => {
    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={mockAchievements}
        showLocked={true}
        showProgress={true}
      />
    );

    // 检查ARIA标签
    expect(screen.getByRole('heading', { name: '成就系统' })).toBeInTheDocument();
    
    // 检查按钮的aria-label
    const filterButtons = screen.getAllByRole('button');
    filterButtons.forEach(button => {
      expect(button).toHaveAttribute('aria-label');
    });

    // 检查进度条的aria属性
    const progressBars = screen.getAllByRole('progressbar');
    progressBars.forEach(progressBar => {
      expect(progressBar).toHaveAttribute('aria-valuenow');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });
  });

  // 测试15: 性能优化
  test('应该进行性能优化', async () => {
    const largeAchievements = Array.from({ length: 100 }, (_, i) => ({
      id: `achievement-${i}`,
      name: `成就 ${i + 1}`,
      description: `成就 ${i + 1} 的描述`,
      type: i % 4 === 0 ? 'CONTENT' : i % 4 === 1 ? 'SOCIAL' : i % 4 === 2 ? 'GAME' : 'COMMUNITY',
      rarity: i % 5 === 0 ? 'COMMON' : i % 5 === 1 ? 'UNCOMMON' : i % 5 === 2 ? 'RARE' : i % 5 === 3 ? 'EPIC' : 'LEGENDARY',
      points: (i + 1) * 10,
      progress: Math.min(100, (i + 1) * 10),
      total: 100,
      unlockedAt: i < 20 ? new Date().toISOString() : null,
      isUnlocked: i < 20,
      isSecret: i >= 90,
      icon: '🏆',
      color: '#3b82f6',
      backgroundColor: '#eff6ff',
    }));

    const startTime = performance.now();

    render(
      <AchievementSystem
        userId={mockUser.id}
        initialAchievements={largeAchievements}
        showLocked={true}
        showProgress={true}
      />
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // 渲染时间应该在合理范围内
    expect(renderTime).toBeLessThan(1000); // 1秒内渲染100个成就

    // 应该使用虚拟滚动或分页
    const visibleAchievements = screen.getAllByTestId('achievement-item');
    expect(visibleAchievements.length).toBeLessThan(50); // 不应该一次性渲染所有成就
  });
});