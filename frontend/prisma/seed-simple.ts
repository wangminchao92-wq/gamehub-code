import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';

async function main() {
  console.log('🌱 开始填充简化测试数据...');

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
      emailVerified: true
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
      emailVerified: true
    }
  });

  console.log(`✅ 创建用户: ${adminUser.displayName}, ${testUser.displayName}`);

  // 2. 创建测试文章
  console.log('📝 创建测试文章...');
  
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
      type: 'NEWS',
      status: 'PUBLISHED',
      featured: true,
      views: 1250,
      likes: 89,
      publishedAt: new Date('2026-03-20T10:00:00Z')
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
      type: 'REVIEW',
      status: 'PUBLISHED',
      featured: true,
      views: 890,
      likes: 67,
      publishedAt: new Date('2026-03-19T14:30:00Z')
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
      type: 'GUIDE',
      status: 'PUBLISHED',
      featured: false,
      views: 1560,
      likes: 124,
      publishedAt: new Date('2026-03-18T09:15:00Z')
    }
  ];

  for (const article of articles) {
    const createdArticle = await prisma.article.create({
      data: article
    });
    console.log(`✅ 创建文章: ${createdArticle.title}`);
  }

  // 3. 创建论坛帖子
  console.log('💬 创建论坛帖子...');
  
  const forumPosts = [
    {
      title: '大家最近在玩什么游戏？',
      content: '最近游戏荒，想找点新游戏玩。大家有什么推荐的吗？最好是RPG或者动作游戏。',
      authorId: testUser.id,
      views: 150,
      likes: 25,
      replies: 12
    },
    {
      title: '《黑神话：悟空》发售日确定！',
      content: '刚刚看到新闻，《黑神话：悟空》确定在8月20日发售！太期待了！',
      authorId: adminUser.id,
      views: 320,
      likes: 45,
      replies: 28,
      pinned: true
    },
    {
      title: '求推荐好用的游戏手柄',
      content: '想买个游戏手柄玩PC游戏，预算500左右，大家有什么推荐的吗？',
      authorId: testUser.id,
      views: 89,
      likes: 12,
      replies: 8
    }
  ];

  for (const post of forumPosts) {
    const createdPost = await prisma.forumPost.create({
      data: post
    });
    console.log(`✅ 创建论坛帖子: ${createdPost.title}`);
  }

  // 4. 创建评论
  console.log('💭 创建评论...');
  
  const firstArticle = await prisma.article.findFirst({ where: { slug: 'cyberpunk-2077-2-0-update' } });
  const firstPost = await prisma.forumPost.findFirst({ where: { title: '大家最近在玩什么游戏？' } });
  
  if (firstArticle) {
    const articleComments = [
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
      }
    ];

    for (const comment of articleComments) {
      await prisma.comment.create({
        data: comment
      });
    }
    console.log(`✅ 创建文章评论: ${articleComments.length}条`);
  }

  if (firstPost) {
    const postComments = [
      {
        content: '我在玩《博德之门3》，超级好玩！',
        authorId: adminUser.id,
        forumPostId: firstPost.id,
        likes: 5
      },
      {
        content: '推荐《星露谷物语》，很治愈的农场游戏',
        authorId: testUser.id,
        forumPostId: firstPost.id,
        likes: 3
      }
    ];

    for (const comment of postComments) {
      await prisma.comment.create({
        data: comment
      });
    }
    console.log(`✅ 创建帖子评论: ${postComments.length}条`);
  }

  console.log('🎉 简化测试数据填充完成！');
  console.log('📊 数据统计:');
  console.log(`  用户: 2个`);
  console.log(`  文章: ${articles.length}篇`);
  console.log(`  论坛帖子: ${forumPosts.length}个`);
  console.log(`  评论: ${(firstArticle ? 2 : 0) + (firstPost ? 2 : 0)}条`);
}

main()
  .catch((e) => {
    console.error('❌ 填充测试数据失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });