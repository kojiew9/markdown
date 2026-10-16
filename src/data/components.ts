import { InsertableComponent } from '../types';

export const COMPONENTS: InsertableComponent[] = [
  {
    id: 'callout-tip',
    title: '💡 提示框 (Tip)',
    category: 'callout',
    preview: '醒目的灵感与操作建议框',
    snippet: `> 💡 **实用技巧**  
> 在这里写下对读者很有帮助的操作技巧或经验提示，能有效提升文章的干货浓度。
`,
  },
  {
    id: 'callout-warning',
    title: '⚠️ 避坑提醒 (Warning)',
    category: 'callout',
    preview: '警示风险与常见雷区',
    snippet: `> ⚠️ **避坑指南**  
> 注意：线上环境务必开启连接池重试机制，避免单点阻塞导致雪崩。
`,
  },
  {
    id: 'callout-info',
    title: '📌 核心重点 (Note)',
    category: 'callout',
    preview: '强调关键概念与规则',
    snippet: `> 📌 **核心结论**  
> 掌握底层原理比死记硬背 API 更重要，代码的本质是解决具体场景的数据流转。
`,
  },
  {
    id: 'callout-success',
    title: '🚀 最佳实践 (Success)',
    category: 'callout',
    preview: '推荐做法与实操成果',
    snippet: `> 🚀 **最佳实践**  
> 经压测验证，开启三级缓存策略后，单机 QPS 从 1,200 提升至 18,500，且延迟稳定在 5ms 以内。
`,
  },
  {
    id: 'author-card',
    title: '👤 作者名片 (Author Bio)',
    category: 'card',
    preview: '公众号文末作者介绍名片',
    snippet: `---

> 👤 **关于作者**  
> **张三**：前一线大厂资深全栈工程师，长期专注前端工程化与现代云原生技术。公众号「全栈进阶路」主理人，致力于分享高质量实战干货。
`,
  },
  {
    id: 'footer-follow',
    title: '📢 文末关注引流 (Footer Banner)',
    category: 'card',
    preview: '经典的微信文末求赞与关注引导',
    snippet: `---

> 📢 **写在最后**  
> 感谢读到这里的每一个你！如果这篇文章对你有帮助，不妨 **点赞**、**在看**、**收藏** 支持一下！  
> 点击上方蓝字关注公众号，不错过每周的硬核深度分享。💬 有任何疑问欢迎在留言区交流！
`,
  },
  {
    id: 'golden-quote',
    title: '💬 金句高光卡片 (Golden Quote)',
    category: 'card',
    preview: '带有双引号与哲思的名言卡片',
    snippet: `> “做难事必有所得。生活里所有看似毫不费力的惊艳，背后都是拼尽全力的日复一日。”  
> —— **作家 / 思想家**
`,
  },
  {
    id: 'timeline-steps',
    title: '⏱️ 步骤时间轴 (Timeline)',
    category: 'structure',
    preview: '清晰的阶段推进与实施步骤',
    snippet: `### 📌 项目推进四个阶段

1. **第一阶段：需求梳理与技术选型** (第 1-2 周)  
   - 确定核心指标与排版标准规范
2. **第二阶段：架构设计与原型跑通** (第 3-4 周)  
   - 搭建跨平台解析内核与样式内联引擎
3. **第三阶段：业务集成与全链路压测** (第 5-6 周)  
   - 覆盖 100+ 极端格式用例，确保排版 0 变形
4. **第四阶段：灰度发布与全量上线** (第 7 周)  
   - 正式对外分发并收集首期创作者反馈
`,
  },
  {
    id: 'comparison-table',
    title: '📊 对比分析表格 (Table)',
    category: 'structure',
    preview: '方案横向评测与选型对比',
    snippet: `| 评测维度 | 传统发布方式 | Doocs 智能发布 | 提升幅度 |
| :--- | :--- | :--- | :--- |
| **排版耗时** | 约 35 分钟 | **10 秒一键搞定** | 95% 效率提升 |
| **格式走样** | 经常丢失代码样式 | **100% 像素级内联** | 零格式问题 |
| **多端分发** | 逐个平台手动排版 | **知乎/公众号/海报一键切换** | 覆盖全网平台 |
`,
  },
  {
    id: 'checklist-card',
    title: '✅ 检查清单 (Checklist)',
    category: 'decoration',
    preview: '行前 Checklist 勾选框',
    snippet: `### 🎯 发布前最后检查清单

- [ ] 文章标题是否具有吸引力与差异化
- [ ] 中英文之间是否已规范添加空格
- [ ] 代码块高亮是否准确、注释是否完备
- [ ] 关键数据结论是否有清晰表格或卡片呈现
- [ ] 文末是否附带作者名片与互动提问
`,
  },
];
