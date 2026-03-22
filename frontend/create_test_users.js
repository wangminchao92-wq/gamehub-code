const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestUsers() {
  console.log('👥 创建测试用户...\n');
  
  // 测试用户数据
  const testUsers = [
    {
      username: 'testuser1',
      email: 'testuser1@gamehub.test',
      displayName: '游戏爱好者小明',
      password: 'test123',
      bio: '热爱各种游戏，特别是RPG和策略游戏',
      level: 3,
      experience: 450,
      points: 1200,
      role: 'USER',
      status: 'ACTIVE',
    },
    {
      username: 'testuser2',
      email: 'testuser2@gamehub.test',
      displayName: '电竞玩家小华',
      password: 'test123',
      bio: '专注电竞游戏，CS:GO和英雄联盟高手',
      level: 5,
      experience: 1200,
      points: 3500,
      role: 'USER',
      status: 'ACTIVE',
    },
    {
      username: 'testuser3',
      email: 'testuser3@gamehub.test',
      displayName: '独立游戏探索者',
      password: 'test123',
      bio: '喜欢探索各种独立游戏，支持开发者',
      level: 2,
      experience: 180,
      points: 800,
      role: 'USER',
      status: 'ACTIVE',
    },
    {
      username: 'creator1',
      email: 'creator1@gamehub.test',
      displayName: '游戏评测师',
      password: 'test123',
      bio: '专业游戏评测，深度分析游戏机制',
      level: 7,
      experience: 2500,
      points: 6800,
      role: 'EDITOR',
      status: 'ACTIVE',
    },
    {
      username: 'creator2',
      email: 'creator2@gamehub.test',
      displayName: '游戏新闻记者',
      password: 'test123',
      bio: '报道最新游戏新闻和行业动态',
      level: 6,
      experience: 1900,
      points: 5200,
      role: 'EDITOR',
      status: 'ACTIVE',
    },
    {
      username: 'admin',
      email: 'admin@gamehub.test',
      displayName: '系统管理员',
      password: 'admin123',
      bio: 'GameHub系统管理员，负责内容审核和用户管理',
      level: 10,
      experience: 5000,
      points: 15000,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  ];

  let createdCount = 0;
  let updatedCount = 0;

  for (const userData of testUsers) {
    try {
      // 检查用户是否已存在
      const existingUser = await prisma.user.findUnique({
        where: { username: userData.username },
      });

      // 哈希密码
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      if (existingUser) {
        // 更新现有用户
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            email: userData.email,
            displayName: userData.displayName,
            passwordHash: hashedPassword,
            bio: userData.bio,
            level: userData.level,
            experience: userData.experience,
            points: userData.points,
            role: userData.role,
            status: userData.status,
          },
        });
        updatedCount++;
        console.log(`  🔄 更新用户: ${userData.username} (${userData.displayName})`);
      } else {
        // 创建新用户
        await prisma.user.create({
          data: {
            username: userData.username,
            email: userData.email,
            displayName: userData.displayName,
            passwordHash: hashedPassword,
            bio: userData.bio,
            level: userData.level,
            experience: userData.experience,
            points: userData.points,
            role: userData.role,
            status: userData.status,
          },
        });
        createdCount++;
        console.log(`  ✅ 创建用户: ${userData.username} (${userData.displayName})`);
      }
    } catch (error) {
      console.log(`  ❌ 错误处理用户 ${userData.username}: ${error.message}`);
    }
  }

  console.log(`\n📊 用户创建完成:`);
  console.log(`  ✅ 新创建: ${createdCount} 个用户`);
  console.log(`  🔄 更新: ${updatedCount} 个用户`);
  console.log(`  👥 总计: ${createdCount + updatedCount} 个用户`);

  // 显示用户列表
  console.log('\n👤 测试用户列表:');
  console.log('='.repeat(60));
  const allUsers = await prisma.user.findMany({
    select: {
      username: true,
      displayName: true,
      email: true,
      role: true,
      level: true,
      points: true,
    },
    orderBy: { role: 'desc' },
  });

  allUsers.forEach(user => {
    console.log(`  ${user.username.padEnd(12)} | ${user.displayName.padEnd(15)} | ${user.role.padEnd(10)} | 等级: ${user.level} | 积分: ${user.points}`);
  });

  console.log('='.repeat(60));
  console.log('\n🔑 登录信息:');
  console.log('  普通用户: testuser1 / test123');
  console.log('  内容创作者: creator1 / test123');
  console.log('  管理员: admin / admin123');
}

async function createTestContent() {
  console.log('\n📝 创建测试内容...\n');

  // 获取用户ID
  const admin = await prisma.user.findUnique({ where: { username: 'admin' } });
  const creator1 = await prisma.user.findUnique({ where: { username: 'creator1' } });
  const creator2 = await prisma.user.findUnique({ where: { username: 'creator2' } });

  if (!admin || !creator1 || !creator2) {
    console.log('❌ 用户不存在，请先创建测试用户');
    return;
  }

  // 测试文章数据
  const testArticles = [
    {
      title: '《赛博朋克2077 2.0》深度评测：凤凰涅槃',
      slug: 'cyberpunk-2077-2-0-review',
      content: `# 赛博朋克2077 2.0：凤凰涅槃

经过多年的更新和优化，《赛博朋克2077》终于迎来了它的2.0版本。这个版本不仅仅是修复bug，更是对整个游戏体验的重塑。

## 核心改进

### 1. 战斗系统重做
全新的技能树和战斗机制让战斗更加流畅和多样化。近战、远程、黑客攻击的平衡性得到了极大改善。

### 2. 警察系统优化
GTA式的通缉系统被完全重做，现在警察的追捕更加合理和具有挑战性。

### 3. 车辆战斗
新增的车辆战斗系统让追逐战更加刺激，你可以在驾驶时使用武器攻击敌人。

## 视觉和性能

2.0版本在视觉表现上也有显著提升：
- 光线追踪Overdrive模式
- DLSS 3.5支持
- 更好的优化，帧数更稳定

## 总结

《赛博朋克2077 2.0》终于兑现了最初的承诺，成为了一个真正优秀的RPG游戏。如果你之前因为bug而放弃，现在是时候重新体验夜之城了。

**评分：9/10**`,
      type: 'REVIEW',
      status: 'PUBLISHED',
      featured: true,
      rating: 9.0,
      views: 1250,
      likes: 320,
      shares: 85,
      authorId: creator1.id,
    },
    {
      title: '任天堂Switch 2传闻汇总：2025年发布？',
      slug: 'nintendo-switch-2-rumors-2025',
      content: `# 任天堂Switch 2：2025年见？

关于任天堂下一代游戏机的传闻越来越多，让我们来看看目前已知的信息。

## 硬件规格传闻

### 显示
- 8英寸LCD屏幕
- 1080p掌机模式分辨率
- 4K电视模式输出

### 性能
- NVIDIA定制芯片
- DLSS技术支持
- 更好的散热设计

## 发布时间

根据多个消息源，Switch 2预计在2025年第一季度发布。任天堂可能会在2024年底正式公布。

## 兼容性

好消息是，Switch 2将完全兼容现有的Switch游戏。这意味着你的游戏库可以无缝迁移到新主机。

## 价格预测

分析师预测Switch 2的售价可能在$399-$449之间，比初代Switch稍贵，但考虑到通货膨胀和技术进步，这个价格是合理的。

## 总结

虽然任天堂官方尚未确认任何信息，但Switch 2的传闻越来越具体。对于Switch玩家来说，2025年值得期待。`,
      type: 'NEWS',
      status: 'PUBLISHED',
      featured: true,
      views: 890,
      likes: 210,
      shares: 45,
      authorId: creator2.id,
    },
    {
      title: '《艾尔登法环》DLC攻略：如何击败第一个Boss',
      slug: 'elden-ring-dlc-first-boss-guide',
      content: `# 《艾尔登法环》DLC首个Boss攻略

《艾尔登法环》的DLC"黄金树之影"已经发布，第一个Boss就让许多玩家头疼。本攻略将帮助你顺利通过。

## Boss：影之守护者

### 攻击模式

#### 第一阶段
1. **快速连击**：连续3-4次快速攻击，注意躲避时机
2. **范围横扫**：大范围横扫攻击，需要向后翻滚
3. **跳跃重击**：跳起后重击地面，产生冲击波

#### 第二阶段（血量50%以下）
1. **暗影分身**：召唤2个分身同时攻击
2. **暗影爆发**：范围AOE攻击，需要远离
3. **连续冲刺**：快速连续冲刺3次，注意节奏

## 推荐装备

### 武器
- 神圣属性武器（对暗影敌人有额外伤害）
- 快速攻击武器（方便在攻击间隙反击）

### 防具
- 暗影抗性高的防具
- 轻甲以保持机动性

### 法术/祷告
- 黄金律法恢复
- 神圣武器附魔

## 战斗策略

### 核心技巧
1. **保持距离**：Boss的大部分攻击都有前摇，保持适当距离观察
2. **攻击时机**：在连击结束后立即反击
3. **分身处理**：优先清理分身，避免被围攻

### 阶段转换
当Boss血量降到50%时，会进入第二阶段并恢复部分血量。这是使用强力技能的最佳时机。

## 奖励
击败影之守护者后，你将获得：
- 影之守护者套装
- 暗影之魂（重要升级材料）
- 通往DLC新区域的钥匙

## 总结
影之守护者虽然强大，但只要掌握攻击模式并保持耐心，就能顺利击败。祝你好运，褪色者！`,
      type: 'GUIDE',
      status: 'PUBLISHED',
      featured: false,
      views: 560,
      likes: 150,
      shares: 32,
      authorId: creator1.id,
    },
  ];

  // 创建文章
  let articleCount = 0;
  for (const articleData of testArticles) {
    try {
      // 检查文章是否已存在
      const existingArticle = await prisma.article.findUnique({
        where: { slug: articleData.slug },
      });

      if (existingArticle) {
        // 更新现有文章
        await prisma.article.update({
          where: { id: existingArticle.id },
          data: articleData,
        });
        console.log(`  🔄 更新文章: ${articleData.title}`);
      } else {
        // 创建新文章
        await prisma.article.create({
          data: articleData,
        });
        console.log(`  ✅ 创建文章: ${articleData.title}`);
        articleCount++;
      }
    } catch (error) {
      console.log(`  ❌ 错误处理文章 ${articleData.title}: ${error.message}`);
    }
  }

  // 获取测试用户ID
  const testuser1 = await prisma.user.findUnique({ where: { username: 'testuser1' } });
  const testuser2 = await prisma.user.findUnique({ where: { username: 'testuser2' } });
  const testuser3 = await prisma.user.findUnique({ where: { username: 'testuser3' } });

  // 创建测试帖子
  const testPosts = [
    {
      title: '新手提问：应该先玩《巫师3》还是《赛博朋克2077》？',
      content: '大家好，我是RPG游戏新手。最近想尝试CDPR的游戏，但不知道应该从《巫师3》开始还是直接玩《赛博朋克2077》。两个游戏哪个更适合新手？游戏时长大概多久？谢谢！',
      authorId: testuser1.id,
      views: 120,
      likes: 25,
      comments: 8,
    },
    {
      title: '《星空》玩后感：优点和缺点都很明显',
      content: '玩了50小时《星空》，来说说我的感受：\n\n优点：\n1. 太空探索感很棒\n2. 飞船自定义系统有趣\n3. 主线剧情有深度\n\n缺点：\n1. 加载画面太多\n2. NPC表情僵硬\n3. 星球探索重复性高\n\n大家有什么不同的看法？',
      authorId: testuser2.id,
      views: 85,
      likes: 18,
      comments: 12,
    },
    {
      title: '独立游戏推荐：《星露谷物语》精神续作来了！',
      content: '最近发现一款叫《珊瑚岛》的游戏，简直是《星露谷物语》的精神续作！\n\n- 画面更精美\n- 角色更丰富\n- 玩法更多样\n\n喜欢农场模拟游戏的玩家不要错过！Steam上现在有demo可以试玩。',
      authorId: testuser3.id,
      views: 65,
      likes: 32,
      comments: 5,
    },
  ];

  // 由于Post模型可能不存在，我们跳过帖子创建
  console.log('\n📋 内容创建完成:');
  console.log(`  📝 文章: ${articleCount} 篇`);
  console.log(`  💬 帖子: 跳过（模型可能不存在）`);
}

async function main() {
  console.log('🚀 开始创建测试数据\n');
  console.log('='.repeat(60));

  try {
    await createTestUsers();
    await createTestContent();

    console.log('\n' + '='.repeat(60));
    console.log('🎉 测试数据创建完成！');
    console.log('='.repeat(60));
    
    console.log('\n🔗 测试页面:');
    console.log('  1. 首页: http://localhost:3000/');
    console.log('  2. 文章详情: http://localhost:3000/news/ultra-simple/cyberpunk-2077-2-0-review');
    console.log('  3. 用户个人中心: http://localhost:3000/user/ultra-simple/admin');
    console.log('  4. 登录页面: http://localhost:3000/login');
    
    console.log('\n📋 测试任务建议:');
    console.log('  1. 使用 testuser1 / test123 登录');
    console.log('  2. 浏览文章和评测');
    console.log('  3. 测试个人中心功能');
    console.log('  4. 测试移动端适配');

  } catch (error) {
    console.error('❌ 创建测试数据失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();