import { ArticleTemplate } from '../types';

export const TEMPLATES: ArticleTemplate[] = [
  {
    id: 'wechat-tech-deepdive',
    title: '微信公众号·技术深度长文',
    category: 'wechat',
    badge: '推荐 · 爆款结构',
    iconName: 'FileCode2',
    description: '含导读卡片、实战架构、代码演练、避坑指南、作者名片与文末关注底栏',
    defaultTheme: 'classic-emerald',
    content: `# 高并发系统架构的 5 个关键蜕变：从单体到分布式

> 💡 **30 秒导读**  
> 随着业务量激增，系统架构如何从日均万级请求平稳演进至千万级？本文结合一线大厂实战踩坑经历，梳理架构升级中必经的 5 个关键里程碑。

---

## 01. 为什么“加机器”无法真正解决性能瓶颈？

在系统演进早期，我们最习惯的应对手段往往是水平扩容（加机器）。但随着节点增加，数据库连接池耗尽、分布式事务锁争用、网络带宽饱和等问题接踵而至。

> 📌 **核心洞察**  
> 扩容只能延缓单点崩溃，架构重构才能决定系统的承载上限。

### 常见性能瓶颈分布

| 瓶颈类型 | 常见现象 | 典型解决方案 |
| :--- | :--- | :--- |
| **I/O 阻塞** | 数据库 CPU 95%+，慢查询飙升 | 读写分离、多级缓存架构 |
| **锁争用** | 高并发减库存超卖或响应超时 | 分段锁、Redis+Lua 原子扣减 |
| **服务雪崩** | 下游依赖超时拖垮整个链路 | 熔断限流（Sentinel / Resilience4j） |

---

## 02. 多级缓存实战：如何做到 0 击穿

在核心链路中，我们构建了 **「本地热点缓存 (Caffeine) + 分布式集群 (Redis) + 异步回写 (Kafka)」** 的三级防护盾。

\`\`\`typescript
// 高性能分布式缓存回源范例
async function getCachedUserProfile(userId: string): Promise<UserProfile> {
  // 1. 查询本地微缓存 (0.1ms 响应)
  const localData = localMemoryCache.get(userId);
  if (localData) return localData;

  // 2. 查询 Redis 集群
  const redisKey = \`user:profile:\${userId}\`;
  const remoteData = await redisCluster.get(redisKey);
  if (remoteData) {
    localMemoryCache.set(userId, remoteData, 30); // 本地暂存 30 秒
    return remoteData;
  }

  // 3. 分布式互斥锁防击穿回源 DB
  return await mutexLock.runExclusive(\`lock:profile:\${userId}\`, async () => {
    const freshDbData = await db.queryUser(userId);
    await redisCluster.set(redisKey, freshDbData, 3600);
    return freshDbData;
  });
}
\`\`\`

---

## 03. 避坑指南：三条血泪经验

- **警惕大 Key 隐患**：单 Key 超过 10KB 必须拆分或哈希分桶存储。
- **防止缓存雪崩**：为每个缓存设置 **基准时间 + 随机扰动值 (Jitter)**，避免同一秒集中失效。
- **灰度发布保障**：任何底层架构改动必须支持 **按用户 ID 比例平滑灰度**，可一秒全量切回。

---

> 👤 **关于作者**  
> **极客架构师小张**：前大厂分布式架构核心专家，专注于高可用后端系统设计与技术写作。微信搜索公众号「架构深度游」获取更多系统源码与实战案例。

---

> 📢 **写在最后**  
> 如果这篇干货对你有所启发，欢迎 **点赞**、**在看**、**转发** 三连！你在实际项目中踩过哪些并发坑？欢迎在评论区一起交流探讨！
`,
  },
  {
    id: 'xiaohongshu-guide',
    title: '小红书·极简高赞干货笔记',
    category: 'xiaohongshu',
    badge: '高互动 · 图文',
    iconName: 'Sparkles',
    description: '吸睛开头、短句排版、高亮 Emoji 重点，非常适合一键生成高清长图笔记',
    defaultTheme: 'sunset-orange',
    content: `# 🔥 建议收藏！程序员必须掌握的 5 个效率神器，直接告别加班！

姐妹们 / 兄弟们！今天给大家盘点 5 个我自己每天都在用、让工作效率直接起飞的宝藏生产力工具！建议先【点赞收藏】避免划走找不到~ ✨

---

### 🚀 1. Raycast (Mac 必装)
- 告别原生 Spotlight，一键查剪贴板历史
- 快速唤醒翻译、计算器、窗口分屏
- 键盘流终极神器，效率提升 300% ⚡

### 📝 2. Obsidian / Logseq
- 双链笔记之王，搭建个人终身知识库
- 离线存储 Markdown，隐私绝对安全
- 支持图谱关联，让思考自由穿梭 🧠

### 🎨 3. Excalidraw
- 手绘风格矢量架构图绘制神器
- 支持多人协同，零学习成本
- 汇报做 PPT 放这张图老板眼前一亮 📈

### 🤖 4. Cursor / AI Coding
- 新一代智能代码补全与重构伙伴
- 敲几行提示词自动写完单元测试与文档

---

### 💡 核心心得总结
> 真正的生产力不是拼命加班，而是把重复琐碎的事情交给最好的工具！

💬 **互动区**：大家平时最离不开的生产力软件是哪个？在评论区安利出来互相抄作业呀！👇

#生产力工具 #程序员日常 #效率神器 #搞钱干货 #工具安利 #成长思考
`,
  },
  {
    id: 'resume-developer',
    title: '现代工程师·专业简历模版',
    category: 'resume',
    badge: '求职 · 经典排版',
    iconName: 'Briefcase',
    description: '清晰的技术栈徽章、量化成果经历、规范的项目亮点结构',
    defaultTheme: 'tech-cyan',
    content: `# 张小明 | 全栈开发工程师 / 架构师

- 📱 **联系电话**：138-0000-0000 | 📧 **电子邮箱**：kojiew@example.com
- 🌐 **个人博客**：https://github.com/kojiew | 📍 **求职意向**：高级全栈开发 / 架构师 (远程 / 深圳)

---

## 🛠️ 核心技能清单

- **编程语言**：TypeScript / JavaScript / Go / Python / SQL
- **前端生态**：React 19 / Next.js / Vue 3 / Tailwind CSS / WebGL / Vite
- **后端架构**：Node.js / Express / Spring Boot / Redis / PostgreSQL / Docker / K8s
- **工程化素养**：CI/CD 自动化构建、微前端解耦、前端极致性能优化 (Core Web Vitals)

---

## 💼 工作经历

### **某知名互联网科技公司** · 高级前端技术专家
*2022.06 - 至今 | 基础架构部*

- **负责全球化低代码渲染引擎设计**：主导核心渲染内核重构，包体积由 3.2MB 瘦身至 780KB，首屏加载时间提升 **58%**。
- **搭建企业级自动化 CI 门禁体系**：推行组件库单元测试与快照比对，累计覆盖 180+ 业务组件，线上渲染故障率下降 **72%**。
- **跨团队技术赋能**：主导内部分布式 Markdown 排版与分发平台建设，服务全公司 1200+ 运营与研发同学。

---

## 🚀 核心项目经历

### **云端协同文档与多渠道分发平台** *(核心负责人)*
- **技术栈**：React + TypeScript + Tailwind CSS + Web Workers + Canvas
- **项目亮点**：
  1. 实现毫秒级富文本 Markdown 双向响应式解析引擎，支持 8 种官方排版主题与实时微信排版样式内联。
  2. 研发一键长图海报导出引擎，利用 Canvas 多倍率离屏渲染技术，确保移动端超长图清晰度与导出速度。
  3. 日活跃创作者突破 50,000+，全网累计生成排版文章逾 100 万篇。

---

## 🎓 教育背景

- **某重点大学 (985/211)** · 计算机科学与技术 (学士) | *2018 - 2022*
- 获得国家奖学金、ACM-ICPC 区域赛银牌
`,
  },
  {
    id: 'changelog-release',
    title: '产品发布·新版本 Release Changelog',
    category: 'tech',
    badge: '开源 · 发版必备',
    iconName: 'Rocket',
    description: '新功能亮点、破坏性改动说明、代码升级指南与鸣谢',
    defaultTheme: 'royal-purple',
    content: `# 🚀 Doocs Markdown v3.0 重磅发布：全新智能排版时代！

我们非常自豪地宣布 **Doocs Markdown 3.0 正式发布**！本次大版本带来了全新的 AI 智能辅助创作、多平台一键发布流、以及经过精心重构的富文本排版渲染引擎。

---

## 🌟 核心亮点一览

- 🤖 **AI 深度协作引擎**：内置标题生成、语法润色、中英文空格自动校对与导读提炼。
- 🎨 **8 大官方新主题**：翡翠绿、科技蓝、极光紫、莫兰迪灰粉等，适配微信公众号各类审美需求。
- 📋 **完美微信排版内联**：一键写入剪贴板，格式、代码高亮、表格完全不走样。
- 📱 **一键长图海报**：移动端高清大图实时生成，便于小红书、微博快速分发。

---

## 📦 快速升级指南

\`\`\`bash
# 使用 npm 升级至最新稳定版
npm install doocs-md@latest

# 或使用 pnpm / yarn
pnpm add doocs-md@latest
\`\`\`

---

## 🐛 Bug 修复与体验调优

- 修复微信部分特殊字号在 iOS 客户端渲染偏差问题。
- 优化长代码块水平滚动条的触摸手感与圆角边框裁切。
- 增强表格在移动端自适应折叠布局。

---

> 🙏 **特别鸣谢**  
> 感谢所有社区贡献者与创作者的反馈与支持！开源仓库地址欢迎 Star ⭐️
`,
  },
  {
    id: 'book-notes',
    title: '读书笔记·思维模型与深度复盘',
    category: 'notes',
    badge: '深度思考 · 金句',
    iconName: 'BookOpen',
    description: '核心洞察、逻辑框架、实践清单与金句高光卡片',
    defaultTheme: 'morandi-rose',
    content: `# 《纳瓦尔宝典》精读复盘：关于财富与幸福的终极洞见

> “如果你内心渴望幸福，那就先学会不与现实抗争。” —— 纳瓦尔

---

## 💡 核心心智模型：四种好运

很多人认为成功全靠运气，但纳瓦尔把好运分为四种不同层次：

1. **盲目的运气**：纯粹偶然发生的不可控事件（如中彩票）。
2. **奔波带来的运气**：勤奋与不断尝试带来的概率增加。
3. **见识与洞察带来的运气**：因为具备深厚的专业知识，能先于常人发现机遇。
4. **打造独特声誉带来的运气**：在这个领域建立极高的声誉，让好运主动找到你。

---

## 📌 杠杆的力量：如何建立不依赖时间的财富

财富不是靠出售单位时间换来的，而是通过 **杠杆 (Leverage)** 获得的指数级放大：

- **劳动力杠杆**：雇佣他人为你工作（管理成本最高）。
- **资本杠杆**：用资金撬动商业版图。
- **复制边际成本为零的杠杆**：**代码** 与 **内容**（最适合普通人的时代机遇）。

---

## 📋 个人行动指南 (Action List)

- [ ] 找到自己玩得开心、别人却觉得辛苦的事情（天赋所在）。
- [ ] 坚持长期主义，在值得的人与事上不断复利。
- [ ] 保持健康的身体与从容的心境，不被焦虑吞噬。

---

> 📖 **一句话结语**  
> 人生最大的自由，不是想做什么就做什么，而是不想做什么就可以不做什么。
`,
  },
  {
    id: 'tech-newsletter',
    title: '周刊通讯·独立开发与前沿探索',
    category: 'tech',
    badge: '周刊 · 精选资讯',
    iconName: 'Newspaper',
    description: '行业动态、新奇工具、极客观点与读者互动',
    defaultTheme: 'vintage-paper',
    content: `# 极客前线周刊 第 42 期：AI 原生应用设计的范式转移

欢迎阅读本周的极客周刊！在这里，我们每周精选最新技术趋势、好用工具和深度思考。

---

## ⚡ 本周头条速览

- **全模态大模型推理成本再降 80%**：端侧小模型在代码补全与文本改写场景表现亮眼。
- **React 19 生态迁移平稳推进**：各大主流 UI 库已完成平滑兼容。

---

## 🛠️ 好工具发现

1. **SVG Repo**：超过 50 万个免费、高质量矢量开源图标集合。
2. **Ray.so**：一键生成极其惊艳的代码高亮卡片截图。
3. **Typing.io**：专为程序员定制的快捷打字与代码手感训练平台。

---

## 💭 极客本周一思

> “技术的意义从来不是炫技，而是以最轻盈优雅的方式解决一个真实存在的人类需求。”

如果你喜欢本期周刊，欢迎转发给身边的技术同路人！下期再见！👋
`,
  },
];
