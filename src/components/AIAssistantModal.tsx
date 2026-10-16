import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Heading,
  CheckCheck,
  FileText,
  Expand,
  Languages,
  Share2,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  X,
  AlertCircle,
  Flame,
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onApplyResult: (newContent: string, mode: 'replace' | 'prepend' | 'append') => void;
}

type AIAction = 'polish' | 'headlines' | 'format_fix' | 'tldr' | 'expand' | 'translate' | 'social_copy' | 'humanize_zhuque' | 'wechat_style' | 'zhihu_style';

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  content,
  onApplyResult,
}) => {
  const [selectedAction, setSelectedAction] = useState<AIAction>('polish');
  const [styleOption, setStyleOption] = useState('专业且引人入胜的技术/新媒体风格');
  const [targetLang, setTargetLang] = useState('英语 (English)');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleRunAI = async () => {
    setLoading(true);
    setError(null);
    setResult('');

    try {
      const response = await fetch('/api/ai/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: selectedAction,
          content,
          style: styleOption,
          targetLang,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'AI 智能处理失败，请稍后重试');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || '网络连接异常或服务未就绪');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actionList = [
    {
      id: 'polish' as AIAction,
      icon: Wand2,
      label: '智能润色',
      desc: '修整病句错别字，提升文学与技术专业度',
    },
    {
      id: 'headlines' as AIAction,
      icon: Heading,
      label: '爆款标题',
      desc: '生成 8~10 个高点击率与痛点共鸣标题',
    },
    {
      id: 'format_fix' as AIAction,
      icon: CheckCheck,
      label: '排版规范化',
      desc: '中英文自动空格、标点标准化、去除杂行',
    },
    {
      id: 'tldr' as AIAction,
      icon: FileText,
      label: '提炼导读金句',
      desc: '生成 30 秒极速导读卡片与 5 个精准标签',
    },
    {
      id: 'expand' as AIAction,
      icon: Expand,
      label: '大纲扩写',
      desc: '丰富核心论据、补充实操代码与场景剖析',
    },
    {
      id: 'translate' as AIAction,
      icon: Languages,
      label: '双语互译',
      desc: '保持 Markdown 结构的高质量学术/技术翻译',
    },
    {
      id: 'wechat_style' as AIAction,
      icon: Sparkles,
      label: '微信长文风格化',
      desc: '注入30秒导读、踩坑卡片与公众号文末引导',
    },
    {
      id: 'zhihu_style' as AIAction,
      icon: Sparkles,
      label: '知乎高赞回答风',
      desc: '强化逻辑思辨、先抑后扬、反常识证据链',
    },
    {
      id: 'humanize_zhuque' as AIAction,
      icon: Flame,
      label: '过朱雀 · 去AI味',
      desc: '打破八股，注入真实人类口语与参差句式',
    },
    {
      id: 'social_copy' as AIAction,
      icon: Share2,
      label: '小红书/社交文案',
      desc: '一键提炼小红书、朋友圈、推特极简文案',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-indigo-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">AI 智能排版与创作助手</h2>
              <p className="text-xs text-gray-500">
                基于 Google Gemini 大模型，一键为你的 Markdown 文章赋能
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
          {/* Left: Actions selection & configuration */}
          <div className="w-full md:w-72 shrink-0 flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              选择 AI 赋能任务
            </label>
            <div className="flex flex-col gap-1.5">
              {actionList.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedAction === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedAction(item.id);
                      setResult('');
                      setError(null);
                    }}
                    className={`text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 text-emerald-900 shadow-xs'
                        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{item.label}</div>
                      <div className="text-xs text-gray-500 leading-tight mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sub options if polish */}
            {selectedAction === 'polish' && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                <span className="font-medium text-gray-700 block mb-1.5">润色侧重风格：</span>
                <select
                  value={styleOption}
                  onChange={(e) => setStyleOption(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md p-1.5 text-gray-800 outline-none"
                >
                  <option value="专业且引人入胜的技术/新媒体风格">专业技术 / 权威通透</option>
                  <option value="生动活泼、通俗易懂的自媒体口语化风格">生动通俗 / 抓人眼球</option>
                  <option value="严谨客观的学术论文/架构白皮书风格">严谨规范 / 白皮书</option>
                  <option value="极简利落、精炼短句风格">极简短句 / 清爽干练</option>
                </select>
              </div>
            )}

            {/* Sub options if translate */}
            {selectedAction === 'translate' && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                <span className="font-medium text-gray-700 block mb-1.5">目标语言：</span>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md p-1.5 text-gray-800 outline-none"
                >
                  <option value="英语 (English)">英语 (English)</option>
                  <option value="简体中文 (Simplified Chinese)">简体中文 (Chinese)</option>
                  <option value="日语 (Japanese)">日语 (Japanese)</option>
                  <option value="韩语 (Korean)">韩语 (Korean)</option>
                </select>
              </div>
            )}

            {/* Trigger Button */}
            <button
              type="button"
              onClick={handleRunAI}
              disabled={loading || !content.trim()}
              className="mt-4 w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI 正在思考生成中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>立即执行 AI 任务</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Result Display & Apply Actions */}
          <div className="flex-1 flex flex-col min-h-[360px] bg-gray-50/60 rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-2.5 bg-white border-b border-gray-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">生成结果预览</span>
              {result && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '已复制' : '复制'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {loading && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3 py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                  <p className="text-sm font-medium text-gray-600">
                    Gemini 正在为你的文章深度优化排版与构思...
                  </p>
                  <p className="text-xs text-gray-400">预计耗时 2~5 秒，请稍候</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <span className="font-bold block">请求发生错误</span>
                    <span className="text-xs">{error}</span>
                  </div>
                </div>
              )}

              {!loading && !result && !error && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center py-12">
                  <Sparkles className="w-10 h-10 text-gray-300 mb-3" />
                  <p className="text-sm font-medium text-gray-600">点击左下角按钮即可开始</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm">
                    AI 将针对你当前编辑器中的文章进行精准优化、规范标点、生成标题或提炼导读
                  </p>
                </div>
              )}

              {!loading && result && (
                <pre className="font-mono text-xs text-gray-800 whitespace-pre-wrap leading-relaxed select-text">
                  {result}
                </pre>
              )}
            </div>

            {/* Apply footer if result is available */}
            {result && (
              <div className="p-3 bg-white border-t border-gray-200 flex flex-wrap items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onApplyResult(result, 'prepend');
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  插入到文章开头
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onApplyResult(result, 'append');
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  追加到文章结尾
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onApplyResult(result, 'replace');
                    onClose();
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <span>一键替换当前全文</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
