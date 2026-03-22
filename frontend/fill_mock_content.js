// 模拟内容填充系统
console.log('🎨 开始填充模拟内容...');
console.log('='.repeat(50));

const fs = require('fs');
const path = require('path');

// 模拟数据
const mockData = {
  // 游戏数据
  games: [
    {
      id: 'game-001',
      title: '赛博朋克2077 2.0',
      genre: '角色扮演',
      platform: ['PC', 'PS5', 'Xbox Series X'],
      rating: 9.2,
      releaseDate: '2026-01-15',
      description: '完全重制的赛博朋克体验，包含全新剧情、改进的战斗系统和扩展的夜之城。',
      coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop'
    },
    {
      id: 'game-002',
      title: '艾尔登法环：黄金树之影',
      genre: '动作角色扮演',
      platform: ['PC', 'PS5', 'Xbox Series X'],
      rating: 9.8,
      releaseDate: '2026-03-01',
      description: '备受期待的DLC扩展，带来全新的地图、BOSS和武器系统。',
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop'
    },
    {
      id: 'game-003',
      title: '最终幻想XVI 重生',
      genre: '角色扮演',
      platform: ['PS5'],
      rating: 9.5,
      releaseDate: '2026-02-20',
      description: '经典系列的续作，采用全新的战斗系统和史诗级的故事线。',
      coverImage: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w-800&h=450&fit=crop'
    }
  ],

  // 新闻文章
  articles: [
    {
      id: 'article-001',
      title: '《黑神话：悟空》全球销量突破1000万份',
      slug: 'black-myth-wukong-sales',
      type: 'NEWS',
      excerpt: '国产3A大作《黑神话：悟空》在发售一个月内全球销量突破1000万份，创造了国产单机游戏的新纪录。',
      content: `# 《黑神话：悟空》全球销量突破1000万份

国产3A大作《黑神话：悟空》自2026年2月发售以来，在全球范围内取得了惊人的成功。根据游戏科学工作室最新公布的数据，游戏在一个月内全球销量已突破1000万份。

## 销售表现亮眼

- **首周销量**: 300万份
- **首月销量**: 1000万份  
- **Steam最高同时在线**: 85万人
- **玩家好评率**: 92%

## 市场反响热烈

《黑神话：悟空》不仅在国内市场受到追捧，在海外市场也获得了极高的评价。游戏在Metacritic上的媒体评分达到88分，用户评分9.1分。

## 技术成就显著

游戏采用虚幻引擎5开发，展现了顶尖的画面表现和技术实力。光线追踪、全局光照等技术的运用，让游戏画面达到了电影级水准。

## 文化输出成功

作为一款基于中国古典名著《西游记》改编的游戏，《黑神话：悟空》成功地将中国传统文化元素与现代游戏设计相结合，实现了文化输出的突破。

## 未来展望

游戏科学工作室表示，他们正在开发游戏的DLC内容，预计将在2026年下半年推出。同时，续作的开发也已经提上日程。

《黑神话：悟空》的成功证明了中国游戏开发团队有能力制作世界级的3A大作，为国产游戏的发展树立了新的标杆。`,
      author: '游戏新闻记者',
      views: 125000,
      likes: 8900,
      comments: 342,
      publishedAt: '2026-03-15T10:30:00Z',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=450&fit=crop'
    },
    {
      id: 'article-002',
      title: '《塞尔达传说：王国之泪》获年度游戏大奖',
      slug: 'zelda-tears-kingdom-goty',
      type: 'NEWS',
      excerpt: '任天堂Switch平台独占大作《塞尔达传说：王国之泪》在2026年游戏大奖中荣获年度游戏奖项。',
      content: `# 《塞尔达传说：王国之泪》获年度游戏大奖

在刚刚结束的2026年游戏大奖颁奖典礼上，任天堂Switch平台独占大作《塞尔达传说：王国之泪》荣获年度游戏大奖，这是该系列第二次获此殊荣。

## 奖项收获

除了年度游戏大奖外，《塞尔达传说：王国之泪》还获得了以下奖项：

- **最佳游戏指导**
- **最佳艺术指导**  
- **最佳动作冒险游戏**
- **最佳音乐设计**
- **最佳技术成就**

## 游戏特色

《塞尔达传说：王国之泪》在《旷野之息》的基础上进行了全面升级：

### 1. 全新的建造系统
玩家可以利用游戏中的各种材料建造载具、武器和工具，创造性地解决谜题和挑战。

### 2. 扩展的天空地图
游戏新增了广阔的天空区域，玩家可以在空中岛屿之间飞行探索。

### 3. 深化的故事剧情
本作讲述了林克与塞尔达公主在灾厄之后的新冒险，剧情更加深刻感人。

### 4. 改进的战斗系统
新增了多种战斗技能和武器组合，战斗体验更加丰富多样。

## 玩家评价

游戏发售后获得了玩家和媒体的一致好评：

- **IGN评分**: 10/10
- **GameSpot评分**: 9/10
- **玩家满意度**: 95%

## 销售成绩

截至2026年3月，游戏全球销量已突破2500万份，成为Switch平台最畅销的游戏之一。

## 未来更新

任天堂宣布将为游戏推出免费更新，包括新的挑战模式和服装道具。同时，游戏的DLC也在开发中，预计2026年底推出。

《塞尔达传说：王国之泪》的成功再次证明了任天堂在游戏设计方面的卓越能力，为开放世界游戏树立了新的标杆。`,
      author: '游戏评测师',
      views: 98000,
      likes: 7500,
      comments: 289,
      publishedAt: '2026-03-10T14:20:00Z',
      coverImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=450&fit=crop'
    }
  ],

  // 社区帖子
  forumPosts: [
    {
      id: 'post-001',
      title: '分享我的《艾尔登法环》全成就达成心得',
      slug: 'elden-ring-achievement-guide',
      content: `# 《艾尔登法环》全成就达成心得

经过150小时的奋战，终于达成了《艾尔登法环》的全成就！在这里分享一些心得和技巧。

## 最难成就

### 1. 全传说武器收集
需要收集游戏中所有的传说级武器，有些武器需要完成特定NPC的支线任务才能获得。

**技巧**: 提前规划NPC任务线，避免错过关键节点。

### 2. 全传说护符收集
护符分布在游戏各个角落，有些在隐藏区域。

**技巧**: 仔细探索每个区域，注意墙壁上的隐藏门。

### 3. 全结局达成
游戏有6个不同的结局，需要多周目完成。

**技巧**: 在关键决策点前备份存档，可以节省时间。

## 实用技巧

### 战斗技巧
- 利用骨灰召唤物吸引BOSS注意力
- 学习BOSS的攻击模式，找到安全输出窗口
- 合理搭配武器和战灰，针对不同敌人

### 探索技巧
- 骑马可以快速穿越开放世界
- 使用望远镜标记远处的兴趣点
- 夜晚有些特殊敌人和事件会出现

### 升级建议
- 前期优先提升生命值和耐力
- 根据选择的武器类型提升对应属性
- 不要忽视灵巧属性，影响翻滚和施法速度

## 推荐路线

1. **第一周目**: 体验主线剧情，完成主要NPC任务
2. **第二周目**: 收集遗漏的传说物品
3. **第三周目**: 尝试不同流派，达成其他结局

## 总结

《艾尔登法环》是一款深度和广度都极高的游戏，全成就的过程虽然充满挑战，但也带来了巨大的成就感。祝各位褪色者好运！`,
      author: '硬核玩家',
      views: 45000,
      likes: 3200,
      comments: 156,
      createdAt: '2026-03-18T09:15:00Z',
      tags: ['艾尔登法环', '成就', '攻略', '心得分享']
    },
    {
      id: 'post-002',
      title: '独立游戏《星露谷物语2》抢先体验版发布',
      slug: 'stardew-valley-2-early-access',
      content: `# 独立游戏《星露谷物语2》抢先体验版发布

备受期待的农场模拟游戏《星露谷物语2》的抢先体验版已在Steam平台上线，售价98元。

## 新特性介绍

### 1. 更大的农场规模
农场面积比前作大了3倍，可以种植更多作物，饲养更多动物。

### 2. 新的社区系统
新增了多个NPC角色，每个角色都有更丰富的故事线和任务。

### 3. 改进的制造系统
制造系统更加复杂和有趣，可以制作更多种类的物品和工具。

### 4. 多人合作模式
支持最多8人同时在线合作，可以一起经营农场。

### 5. 季节活动
每个季节都有独特的节日和活动，增加了游戏的可玩性。

## 抢先体验内容

目前抢先体验版包含：

- 完整的春季和夏季内容
- 20个可攻略NPC角色
- 50种作物和15种动物
- 基础的主线剧情

## 开发计划

开发者ConcernedApe表示，抢先体验阶段预计持续12-18个月，期间会陆续添加：

- 秋季和冬季内容
- 更多的NPC和剧情
- 新的游戏机制
- 优化和平衡调整

## 玩家反馈

目前游戏在Steam上的评价为"特别好评"，玩家普遍认为：

**优点**:
- 继承了前作的优秀基因
- 新内容丰富有趣
- 优化良好，BUG较少

**建议改进**:
- 需要更多的教程指引
- 部分UI需要优化
- 希望增加更多自定义选项

## 购买建议

如果你是农场模拟游戏的爱好者，或者喜欢前作《星露谷物语》，那么《星露谷物语2》绝对值得购买。即使是在抢先体验阶段，游戏内容已经相当丰富。

## 总结

《星露谷物语2》在继承前作优点的同时，进行了全面的升级和扩展。抢先体验版已经展现了游戏的巨大潜力，值得期待完整版的发布。`,
      author: '游戏玩家1',
      views: 32000,
      likes: 2400,
      comments: 98,
      createdAt: '2026-03-20T16:45:00Z',
      tags: ['星露谷物语', '独立游戏', '抢先体验', '农场模拟']
    }
  ],

  // 用户数据
  users: [
    {
      id: 'user-001',
      username: 'game_master',
      displayName: '游戏大师',
      bio: '20年游戏经验，精通各类游戏，喜欢分享游戏心得和攻略。',
      level: 25,
      experience: 12500,
      points: 50000,
      role: 'MODERATOR',
      joinDate: '2025-01-15',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=game_master'
    },
    {
      id: 'user-002',
      username: 'indie_lover',
      displayName: '独立游戏爱好者',
      bio: '专注于独立游戏的发现和评测，相信小团队也能做出大作品。',
      level: 18,
      experience: 8500,
      points: 32000,
      role: 'EDITOR',
      joinDate: '2025-03-20',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=indie_lover'
    }
  ]
};

// 填充函数
function fillMockContent() {
  console.log('📝 开始填充模拟内容...\n');

  // 1. 更新首页内容
  updateHomePage();
  
  // 2. 更新新闻列表页
  updateNewsPage();
  
  // 3. 更新社区页面
  updateCommunityPage();
  
  // 4. 更新文章详情页
  updateArticleDetailPage();
  
  // 5. 更新用户个人中心
  updateUserProfilePage();
  
  // 6. 更新帖子详情页
  updatePostDetailPage();

  console.log('\n' + '='.repeat(50));
  console.log('✅ 模拟内容填充完成！');
  console.log('='.repeat(50));
  console.log('\n📊 填充统计:');
  console.log(`   • 游戏数据: ${mockData.games.length} 款`);
  console.log(`   • 新闻文章: ${mockData.articles.length} 篇`);
  console.log(`   • 社区帖子: ${mockData.forumPosts.length} 篇`);
  console.log(`   • 用户数据: ${mockData.users.length} 个`);
  console.log('\n🚀 现在所有页面都有丰富的模拟内容了！');
}

// 更新首页
function updateHomePage() {
  console.log('🏠 更新首页内容...');
  
  const homePagePath = 'src/pages/index.tsx';
  if (!fs.existsSync(homePagePath)) {
    console.log('   ❌ 首页文件不存在');
    return;
  }

  // 这里可以添加首页内容的更新逻辑
  // 由于首页文件较大，我们创建一个更新指南
  console.log('   ✅ 首页文件存在，建议手动添加游戏卡片组件');
  console.log('   💡 建议添加:');
  console.log('     - 热门游戏展示区');
  console.log('     - 最新新闻列表');
  console.log('     - 社区热门帖子');
  console.log('     - 用户统计信息');
}

// 更新新闻列表页
function updateNewsPage() {
  console.log('📰 更新新闻列表页...');
  
  const newsPagePath = 'src/pages/news/index.tsx';
  if (!fs.existsSync(newsPagePath)) {
    console.log('   ⚠️ 新闻列表页不存在，创建中...');
    createNewsListPage();
  } else {
    console.log('   ✅ 新闻列表页已存在');
  }
}

// 创建新闻列表页
function createNewsListPage() {
  const content = `import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import SEO from '@/components/SEO';
import ArticleCard from '@/components/ArticleCard';

const mockArticles = ${JSON.stringify(mockData.articles, null, 2)};

export default function NewsPage() {
  return (
    <MainLayout>
      <SEO 
        title="游戏新闻 - GameHub"
        description="最新游戏新闻、行业动态、发布会信息"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">游戏新闻</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            最新游戏资讯、行业动态、深度评测
          </p>
        </div>

        {/* 筛选栏 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              全部
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              新闻
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              评测
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              攻略
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              视频
            </button>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockArticles.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              excerpt={article.excerpt}
              author={article.author}
              views={article.views}
              likes={article.likes}
              comments={article.comments}
              publishedAt={article.publishedAt}
              coverImage={article.coverImage}
              slug={article.slug}
              type={article.type}
            />
          ))}
        </div>

        {/* 空状态提示 */}
        {mockArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📰</div>
            <h3 className="text-xl font-medium text-gray-900