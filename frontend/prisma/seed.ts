import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';

async function main() {
  console.log('🌱 开始填充测试数据...');

  // 1. 创建测试用户
  console.log('👤 创建测试用户...');
  
  const hashedPassword = await hash('password123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gamehub.com' },
    update: {},
    create: {
      email: 'admin@gamehub.com',
      username: 'admin',
      displayName: '管理员',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      level: 100,
      experience: 10000,
      points: 5000,
      emailVerified: true,
      userSettings: {
        create: {
          emailNotifications: true,
          pushNotifications: true,
          theme: 'dark',
          language: 'zh-CN',
          timezone: 'Asia/Shanghai'
        }
      }
    }
  });

  const testUser = await prisma.user.upsert({
    where: { email: 'user@gamehub.com' },
    update: {},
    create: {
      email: 'user@gamehub.com',
      username: 'testuser',
      displayName: '测试用户',
      passwordHash: hashedPassword,
      role: 'USER',
      status: 'ACTIVE',
      level: 10,
      experience: 1000,
      points: 500,
      emailVerified: true,
      userSettings: {
        create: {
          emailNotifications: true,
          pushNotifications: true,
          theme: 'light',
          language: 'zh-CN',
          timezone: 'Asia/Shanghai'
        }
      }
    }
  });

  console.log(`✅ 创建用户: ${adminUser.displayName}, ${testUser.displayName}`);

  // 2. 创建游戏分类
  console.log('📂 创建游戏分类...');
  
  const categories = [
    { name: '新闻资讯', slug: 'news', description: '最新游戏新闻和行业动态' },
    { name: '游戏评测', slug: 'reviews', description: '专业游戏评测和评分' },
    { name: '攻略指南', slug: 'guides', description: '游戏攻略和技巧分享' },
    { name: '视频内容', slug: 'videos', description: '游戏视频和直播内容' },
    { name: '社区讨论', slug: 'community', description: '玩家交流和讨论' }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
  }

  console.log(`✅ 创建分类: ${categories.map(c => c.name).join(', ')}`);

  // 3. 创建游戏标签
  console.log('🏷️ 创建游戏标签...');
  
  const tags = [
    { name: '角色扮演', slug: 'rpg' },
    { name: '动作冒险', slug: 'action-adventure' },
    { name: '射击游戏', slug: 'fps' },
    { name: '策略游戏', slug: 'strategy' },
    { name: '体育竞技', slug: 'sports' },
    { name: '独立游戏', slug: 'indie' },
    { name: '多人游戏', slug: 'multiplayer' },
    { name: '单人游戏', slug: 'singleplayer' },
    { name: '免费游戏', slug: 'free-to-play' },
    { name: '手机游戏', slug: 'mobile' }
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag
    });
  }

  console.log(`✅ 创建标签: ${tags.map(t => t.name).join(', ')}`);

  // 4. 创建测试文章
  console.log('📝 创建测试文章...');
  
  const newsCategory = await prisma.category.findUnique({ where: { slug: 'news' } });
  const reviewsCategory = await prisma.category.findUnique({ where: { slug: 'reviews' } });
  const guidesCategory = await prisma.category.findUnique({ where: { slug: 'guides' } });

  const articles = [
    {
      title: '《赛博朋克2077》2.0版本重大更新发布',
      slug: 'cyberpunk-2077-2-0-update',
      content: `# 《赛博朋克2077》2.0版本重大更新发布

CD Projekt Red今日正式发布了《赛博朋克2077》的2.0版本重大更新，这是游戏自2020年发售以来最大规模的更新。

## 主要更新内容

### 1. 技能系统重做
全新的技能树系统，提供更多自定义选项和玩法多样性。

### 2. 警察系统改进
更智能的警察AI和追捕机制，提升游戏沉浸感。

### 3. 载具战斗
新增载具战斗系统，可以在车辆上进行射击和战斗。

### 4. 性能优化
大幅优化游戏性能，提升帧率和稳定性。

## 玩家反馈

更新发布后，玩家社区反响热烈。许多玩家表示游戏体验得到了显著提升。

"这感觉像是一个全新的游戏！" - 玩家评论

## 未来展望

CD Projekt Red表示将继续支持《赛博朋克2077》，未来还会有更多更新和内容。`,
      excerpt: 'CD Projekt Red发布了《赛博朋克2077》2.0版本重大更新，包含技能系统重做、警察系统改进等多项内容。',
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      authorId: adminUser.id,
      categoryId: newsCategory?.id,
      status: 'PUBLISHED',
      views: 1250,
      likes: 89,
      commentsCount: 42,
      publishedAt: new Date('2026-03-20T10:00:00Z'),
      tags: ['角色扮演', '动作冒险']
    },
    {
      title: '《艾尔登法环》DLC「黄金树之影」深度评测',
      slug: 'elden-ring-dlc-golden-tree-shadow-review',
      content: `# 《艾尔登法环》DLC「黄金树之影」深度评测

FromSoftware最新DLC「黄金树之影」为《艾尔登法环》带来了全新的冒险体验。

## 评测总结

**评分：9.5/10**

### 优点
1. **庞大的新区域**：新增地图面积相当于原游戏的1/3
2. **丰富的敌人设计**：超过20种新敌人和10个新BOSS
3. **深度的剧情**：补充了游戏世界观的重要细节
4. **挑战性十足**：保持了FromSoftware一贯的高难度

### 缺点
1. **部分区域过于困难**：可能会劝退部分玩家
2. **新机制学习曲线陡峭**：需要时间适应

## 新内容亮点

### 新武器和法术
- 黄金树之矛：神圣属性武器
- 影之魔法：全新的暗影系法术
- 龙之呼吸：龙系祷告扩展

### 新区域探索
DLC新增了「影之国度」区域，包含：
- 影之森林
- 黄金树遗迹
- 古代龙墓

## 购买建议

如果你是《艾尔登法环》的粉丝，这个DLC是必买的。它提供了数十小时的全新内容，物超所值。`,
      excerpt: 'FromSoftware《艾尔登法环》DLC「黄金树之影」评测：庞大的新区域、丰富的敌人设计、深度的剧情，评分9.5/10。',
      coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      authorId: adminUser.id,
      categoryId: reviewsCategory?.id,
      status: 'PUBLISHED',
      views: 890,
      likes: 67,
      commentsCount: 31,
      publishedAt: new Date('2026-03-19T14:30:00Z'),
      tags: ['角色扮演', '动作冒险', '单人游戏']
    },
    {
      title: '《原神》4.0版本新角色「枫原万叶」培养攻略',
      slug: 'genshin-impact-4-0-kaedehara-kazuha-guide',
      content: `# 《原神》4.0版本新角色「枫原万叶」培养攻略

「枫原万叶」是《原神》4.0版本推出的五星风元素角色，定位为辅助/副C。

## 角色定位分析

### 核心优势
1. **元素精通转换**：可以将元素精通转化为全队元素伤害加成
2. **聚怪能力**：强大的范围聚怪效果
3. **元素反应增强**：提升队伍元素反应伤害

### 适用队伍
- 元素反应队
- 扩散反应队
- 多元素混合队

## 天赋优先级

### 推荐升级顺序
1. **元素战技（E）**：★★★★★
2. **元素爆发（Q）**：★★★★☆
3. **普通攻击（A）**：★★☆☆☆

## 圣遗物推荐

### 毕业套装
**翠绿之影4件套**
- 2件套：获得15%风元素伤害加成
- 4件套：扩散反应造成的伤害提升60%

### 主属性选择
- 时之沙：元素精通
- 空之杯：元素精通/风元素伤害加成
- 理之冠：元素精通/暴击率

## 武器推荐

### 五星武器
1. **苍古自由之誓**：最佳选择
2. **磐岩结绿**：次选

### 四星武器
1. **铁蜂刺**：锻造获取，性价比高
2. **西风剑**：充能效率优秀

## 命之座分析

### 关键命座
- **1命**：元素战技冷却时间减少10%
- **2命**：元素爆发期间，场上角色元素精通提升200点
- **6命**：枫原万叶获得风元素附魔

## 实战技巧

### 连招顺序
1. 使用元素战技聚怪
2. 切换其他角色上元素
3. 枫原万叶触发扩散
4. 使用元素爆发
5. 切换主C输出

## 总结

枫原万叶是一个强度极高的辅助角色，适合大多数队伍配置。建议所有玩家都培养一个。`,
      excerpt: '《原神》4.0版本新角色「枫原万叶」完整培养攻略，包含角色定位、天赋升级、圣遗物选择、武器推荐和实战技巧。',
      coverImage: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=1200&q=80',
      authorId: testUser.id,
      categoryId: guidesCategory?.id,
      status: 'PUBLISHED',
      views: 1560,
      likes: 124,
      commentsCount: 78,
      publishedAt: new Date('2026-03-18T09:15:00Z'),
      tags: ['角色扮演', '免费游戏', '手机游戏']
    }
  ];

  for (const articleData of articles) {
    const { tags: tagNames, ...article } = articleData;
    
    const createdArticle = await prisma.article.create({
      data: {
        ...article,
        articleTags: {
          create: tagNames.map(tagName => ({
            tag: {
              connect: { slug: tagName }
            }
          }))
        }
      }
    });

    console.log(`✅ 创建文章: ${createdArticle.title}`);
  }

  // 5. 创建论坛板块
  console.log('💬 创建论坛板块...');
  
  const forums = [
    { name: '综合讨论', slug: 'general', description: '游戏综合讨论区' },
    { name: '新闻资讯', slug: 'news-forum', description: '游戏新闻讨论区' },
    { name: '攻略交流', slug: 'guides-forum', description: '游戏攻略交流区' },
    { name: '技术问题', slug: 'technical', description: '游戏技术问题求助' },
    { name: '玩家交友', slug: 'friends', description: '玩家交友和组队' }
  ];

  for (const forum of forums) {
    await prisma.forum.upsert({
      where: { slug: forum.slug },
      update: {},
      create: forum
    });
  }

  console.log(`✅ 创建论坛板块: ${forums.map(f => f.name).join(', ')}`);

  // 6. 创建测试商品
  console.log('🛒 创建测试商品...');
  
  const products = [
    {
      name: '《赛博朋克2077》典藏版',
      slug: 'cyberpunk-2077-collectors-edition',
      description: '包含游戏本体、艺术画册、原声带、角色手办等',
      price: 299.99,
      discountPrice: 249.99,
      stock: 50,
      images: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      category: '典藏版',
      tags: '角色扮演,动作冒险',
      status: 'ACTIVE'
    },
    {
      name: '《艾尔登法环》标准版',
      slug: 'elden-ring-standard-edition',
      description: '游戏本体，包含完整游戏内容',
      price: 59.99,
      stock: 200,
      images: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      category: '标准版',
      tags: '角色扮演,动作冒险',
      status: 'ACTIVE'
    },
    {
      name: '游戏手柄 - 专业版',
      slug: 'game-controller-pro',
      description: '专业游戏手柄，支持PC和主机',
      price: 89.99,
      discountPrice: 79.99,
      stock: 100,
      images: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80',
      category: '外设',
      tags: '配件,手柄',
      status: 'ACTIVE'
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product
    });
  }

  console.log(`✅ 创建商品: ${products.map(p => p.name).join(', ')}`);

  // 7. 创建测试评论
  console.log('💭 创建测试评论...');
  
  const firstArticle = await prisma.article.findFirst({ where: { slug: 'cyberpunk-2077-2-0-update' } });
  
  if (firstArticle) {
    const comments = [
      {
        content: '终于等到2.0更新了！游戏体验提升了很多！',
        authorId: testUser.id,
        articleId: firstArticle.id,
        likes: 15
      },
      {
        content: '警察系统改进真的很棒，追捕更有挑战性了。',
        authorId: adminUser.id,
        articleId: firstArticle.id,
        likes: 8
      },
      {
        content: '载具战斗系统还需要优化，有时候操作不太流畅。',
        authorId: testUser.id,
        articleId: firstArticle.id,
        likes: 3
      }
    ];

    for (const comment of comments) {
      await prisma.comment.create({
        data: comment
      });
    }

    console.log(`✅ 创建评论: ${comments.length}条`);
  }

  // 8. 创建测试通知
  console.log('🔔 创建测试通知...');
  
  const notifications = [
    {
      userId: testUser.id,
      type: 'SYSTEM',
      title: '欢迎来到GameHub！',
      message: '感谢您注册GameHub，开始您的游戏之旅吧！',
      read: true
    },
    {
      userId: testUser.id,
      type: 'ARTICLE',
      title: '您的评论收到点赞',
      message: '您在《赛博朋克2077》2.0版本文章中的评论收到了15个点赞',
      data: JSON.stringify({ articleId: firstArticle?.id }),
      read: false
    },
    {
      userId: adminUser.id,
      type: 'SYSTEM',
      title: '新用户注册',
      message: '有新用户注册了GameHub',
      read: false
    }
  ];

  for (const notification of notifications) {
    await prisma.notification.create({
      data: notification
    });
  }

  console.log(`✅ 创建通知: ${notifications.length}条`);

  console.log('🎉 测试数据填充完成！');
}

main()
  .catch((e) => {
    console.error('❌ 填充测试数据失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });