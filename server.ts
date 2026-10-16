import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini AI setup
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// AI Transform API
app.post('/api/ai/transform', async (req, res) => {
  try {
    const { action, content, style, targetLang, intensity = 'deep' } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is required.' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in environment secrets.',
      });
    }

    let systemInstruction = 'You are an expert technical editor, copywriter, and Markdown formatting master specialized in social media and tech platforms like WeChat Official Accounts (微信公众号), Zhihu (知乎), and Xiaohongshu (小红书). Always output high quality, valid Markdown text.';
    let prompt = '';

    switch (action) {
      case 'polish':
        prompt = `请对以下 Markdown 文章内容进行深度润色与优化。
优化目标：文笔更地道流畅、逻辑清晰、用词考究，修正常见错别字和病句，并保持原有 Markdown 结构（标题、列表、加粗、代码块等完全保留）。
风格侧重：${style || '专业且引人入胜的技术/新媒体风格'}。

原文章内容：
${content}`;
        break;

      case 'headlines':
        prompt = `基于以下 Markdown 文章内容，分析其核心痛点、干货亮点与受众心理，生成 8~10 个极具吸引力的高点击率标题。
分类包含：
1. 深度干货型（专业、权威）
2. 痛点共鸣型（反常识、解决焦虑）
3. 爆款自媒体型（微信公众号/知乎头部创作者风格）
4. 极客数字型（带有具体数字、步骤、耗时对比）

请按 Markdown 无序列表输出，每项带有小标签说明（如：【深度干货】标题内容）。

文章内容：
${content.slice(0, 3000)}`;
        break;

      case 'format_fix':
        prompt = `请根据严苛的中文技术排版规范（如中英文之间自动加空格、全角半角标点规范化、专有名词大小写纠正如 GitHub / JavaScript / Python、代码块格式规范、消除无意义乱行）自动修正以下 Markdown。
请直接输出规范化后的完整 Markdown 内容，不要有前言或额外解释：

${content}`;
        break;

      case 'tldr':
        prompt = `请阅读以下 Markdown 文章，生成：
1. 💡 30秒极速导读（3点核心干货金句，用引用框或列表形式呈现）
2. 📌 适合微信公众号文首的读者价值预告卡片
3. 🏷️ 5个精准标签关键词

请以优雅的 Markdown 格式输出：

${content}`;
        break;

      case 'expand':
        prompt = `请对以下 Markdown 内容或大纲进行扩写，填充详实的论据、实战代码示例、深入浅出的解释以及注意事项，使其成为一篇图文并茂、结构完整的深度技术/干货文章，输出标准的 Markdown 格式：

${content}`;
        break;

      case 'translate':
        prompt = `请将以下 Markdown 内容翻译为 ${targetLang || '英语 (English)'}，保持所有 Markdown 标记（代码、标题、表格、链接、强调）结构完全不变，语言自然专业：

${content}`;
        break;

      case 'social_copy':
        prompt = `请根据以下长文，生成三套适配不同平台的发布文案：
1. 📱 小红书爆款笔记文案（含吸睛前3行、Emoji分点、热门标签TAG）
2. 💬 朋友圈 / 读者群推荐分享语（亲切真诚、引发讨论互动）
3. 🐦 微博 / X (Twitter) 极简推文（提炼核心金句）

请用格式清晰的 Markdown 输出：

${content.slice(0, 4000)}`;
        break;

      case 'wechat_style':
        prompt = `请将以下 Markdown 文章深度重写为【微信公众号顶级技术长文】风格：
1. 文首加入“💡 30 秒导读”和读者价值预告卡片；
2. 论点层层递进，合理加入实战踩坑提示框（> ⚠️ 避坑、> 📌 重点）；
3. 代码块规范且关键行带有注释；
4. 文末加入作者名片与互动提问求赞引流底栏；
5. 保持标准 Markdown 格式：

${content}`;
        break;

      case 'zhihu_style':
        prompt = `请将以下 Markdown 文章深度重写为【知乎高赞技术回答 / 深度专栏】风格：
1. 开篇直击核心矛盾，打破常规认知误区（“谢邀，很多人常常误以为...其实底层逻辑恰恰相反”）；
2. 论述逻辑严谨且有理论/数据/代码支撑，避免空洞说教；
3. 善用对比表格与底层源码演变进行推理剖析；
4. 语言幽默犀利，保持知乎高赞答案的专业与思辨质感：

${content}`;
        break;

      case 'humanize_zhuque':
        const modeDesc =
          intensity === 'aggressive'
            ? '【极限过朱雀模式 · 强力突破顽固高危】彻底打碎机械框架，引入叙述化对话感、反转设问、真实心理活动与参差长短句，大幅拉升困惑度 (Perplexity) 与突发度 (Burstiness)，专克多次检测仍未达标的高危顽固文本！'
            : intensity === 'light'
            ? '【轻度去味模式】仅针对明显的八股连接词（如综上所述、在这个时代、毋庸置疑等）进行替换，保留 90% 原文词汇和语感，微调长短句。'
            : '【深度重塑模式 · 推荐】打破均等八股三段论，注入第一人称实战踩坑视角与口语化转折，大幅降低 AI 痕迹。';

        prompt = `你是一名精通微信公众号顶级原创写作的资深技术博主与文字工匠，熟悉腾讯“朱雀 AIGC 检测”与各大 AI 内容风控识别算法。
当前选定强度：${modeDesc}

请重构以下 Markdown 内容，使之【100% 具备真实人类书写特征，彻底消除 AI 味，完美过朱雀检测】：

【核心去 AI 味与抗朱雀法则】：
1. 彻底剔除刻板 AI 套话与假大空前言（严禁出现“在当今快节奏的数字化时代”、“毋庸置疑”、“显而易见”、“总而言之”、“综上所述”、“本文将从以下几方面探讨”、“如同双刃剑一样”等空话）。
2. 注入真实一线工作者的人格化语气与第一人称视角（如“我们在复盘线上事故时发现...”、“很多人以为...但实测下来完全被坑了”）。
3. 增加句式突发度 (Burstiness) 与参差感：长句、短句、甚至单字短句交错使用，拒绝毫无波澜的均等排比句。
4. 自然加入口语化的转折与生动类比（“说白了”、“这就像是”、“千万别图省事”）。
5. 必须 100% 保留原有技术事实、核心观点、代码块、表格、标题层级和 Markdown 语法结构！直接输出重写后的 Markdown 内容，不要有前言或额外解释。

原文章内容：
${content}`;
        break;

      default:
        prompt = `请处理以下 Markdown 文本：\n${content}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ result: response.text || '' });
  } catch (error: any) {
    console.error('AI Error:', error);
    return res.status(500).json({ error: error.message || 'AI request failed' });
  }
});

// Tencent Zhuque AIGC Detection Endpoint
app.post('/api/ai/zhuque-detect', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is required.' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in environment secrets.',
      });
    }

    const prompt = `你现在是微信公众平台核心内容安全与腾讯混元安全团队“朱雀 AIGC 文本检测”专家模型。
请对以下用户输入的 Markdown 文章进行严密、深度的 AI 生成痕迹（AIGC）扫描与综合评测。

评测标准对照腾讯朱雀模型特征：
1. 语言困惑度 (Perplexity) 与突发度 (Burstiness)：AI 生成的文本往往句子长度方差极小、词汇概率平稳；人类文本充满跳跃、长短句相间。
2. 刻板模板词与结构：如“首先/其次/最后/综上所述”、“在...时代”、“不仅...而且...”、“双刃剑”等八股套话。
3. 真实体验与情绪色彩：AI 缺乏真正的人格第一人称痛点体验、口语化转折与具体情境细节。
4. 句式多样性：是否过于工整对仗。

请以严格的 JSON 格式输出，不要有任何 Markdown 代码块标签（如不要写\`\`\`json）：
{
  "aiProbability": 28, // 0~100 之间的整数，表示被朱雀判定为 AIGC 的疑似概率百分比
  "riskLevel": "safe", // "safe" (0-25低风险安全通过), "moderate" (26-60中风险需注意), "high" (61-100高风险可能被微信限流)
  "verdict": "大概率通过朱雀检测，个人风格鲜明", // 核心判定结论
  "summary": "文章具有较强的实战叙事感与具体技术案例，但在第二小节存在少量模板式总结词汇。",
  "dimensions": {
    "burstiness": 75, // 0-100 句式起伏与长短多样性 (越高越像人类)
    "naturalTone": 82, // 0-100 自然口语与情绪表达 (越高越像人类)
    "humanExperience": 80, // 0-100 一手实战案例与真实经历感 (越高越像人类)
    "clicheRatio": 15 // 0-100 刻板AI套话占比 (越低越好)
  },
  "flaggedSentences": [
    {
      "text": "疑似包含典型AI痕迹的句子片段",
      "reason": "过于八股对仗，缺少真实情境细节",
      "suggestion": "建议改为更口语化的真实叙述"
    }
  ],
  "improvementTips": [
    "在开篇增加第一人称具体问题情境",
    "将工整的三段论替换为错落有致的长短句",
    "去掉'综上所述'等标准结尾套话"
  ]
}

待检测文章内容：
${content.slice(0, 5000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    const rawText = (response.text || '').trim();
    // Strip possible markdown json wrappers
    const cleanedJson = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(cleanedJson);

    return res.json(parsed);
  } catch (error: any) {
    console.error('Zhuque Detection Error:', error);
    return res.status(500).json({ error: error.message || 'Zhuque detection failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: Boolean(apiKey) });
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
