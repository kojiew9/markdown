import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  Flame,
  X,
  FileCheck2,
  Wand2,
  HelpCircle,
  TrendingDown,
  RotateCcw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface ZhuqueDetectionResult {
  aiProbability: number;
  riskLevel: 'safe' | 'moderate' | 'high';
  verdict: string;
  summary: string;
  dimensions: {
    burstiness: number;
    naturalTone: number;
    humanExperience: number;
    clicheRatio: number;
  };
  flaggedSentences: Array<{
    text: string;
    reason: string;
    suggestion: string;
  }>;
  improvementTips: string[];
}

interface ZhuqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onApplyHumanized: (newContent: string) => void;
}

type HumanizeIntensity = 'light' | 'deep' | 'aggressive';

export const ZhuqueModal: React.FC<ZhuqueModalProps> = ({
  isOpen,
  onClose,
  content,
  onApplyHumanized,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ZhuqueDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Intensity mode
  const [intensity, setIntensity] = useState<HumanizeIntensity>('deep');

  // Humanize state & loop tracking
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [humanizedContent, setHumanizedContent] = useState<string | null>(null);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [historyRuns, setHistoryRuns] = useState<Array<{ score: number; intensity: string }>>([]);

  const [copiedText, setCopiedText] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  if (!isOpen) return null;

  // Single detect run
  const runDetection = async (textToDetect: string): Promise<ZhuqueDetectionResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/zhuque-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: textToDetect }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '朱雀检测请求失败，请稍后重试');
      }

      setResult(data);
      return data;
    } catch (err: any) {
      setError(err.message || '检测发生错误');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleStartDetect = () => {
    runDetection(humanizedContent || content);
  };

  // Humanize + Auto-retest Loop
  const handleHumanizeAndRetest = async (forcedIntensity?: HumanizeIntensity) => {
    const activeIntensity = forcedIntensity || intensity;
    const textToRewrite = humanizedContent || content;

    setIsHumanizing(true);
    setError(null);

    // Save previous score for comparison
    if (result) {
      setPreviousScore(result.aiProbability);
      setHistoryRuns((prev) => [
        ...prev,
        { score: result.aiProbability, intensity: activeIntensity },
      ]);
    }

    try {
      const response = await fetch('/api/ai/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'humanize_zhuque',
          content: textToRewrite,
          intensity: activeIntensity,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || '重构失败');
      }

      const rewritten = data.result;
      setHumanizedContent(rewritten);
      setIsHumanizing(false);

      // Automatically re-test with Zhuque!
      await runDetection(rewritten);
    } catch (err: any) {
      setIsHumanizing(false);
      setError(err.message || '去 AI 味失败');
    }
  };

  // Copy rewritten text
  const handleCopyRewritten = () => {
    const textToCopy = humanizedContent || content;
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Apply to main editor
  const handleApplyToEditor = () => {
    if (humanizedContent) {
      onApplyHumanized(humanizedContent);
      setAppliedSuccess(true);
      setTimeout(() => setAppliedSuccess(false), 2000);
    }
  };

  const getScoreColor = (prob: number) => {
    if (prob <= 25) return 'text-emerald-600 bg-emerald-50 border-emerald-300';
    if (prob <= 60) return 'text-amber-600 bg-amber-50 border-amber-300';
    return 'text-rose-600 bg-rose-50 border-rose-300';
  };

  const getBadgeStyle = (risk: 'safe' | 'moderate' | 'high') => {
    if (risk === 'safe') {
      return {
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: ShieldCheck,
        text: '低风险 · 极大概率通过',
      };
    }
    if (risk === 'moderate') {
      return {
        bg: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: AlertTriangle,
        text: '中风险 · 建议继续消除局部套话',
      };
    }
    return {
      bg: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: ShieldAlert,
      text: '高风险 · 疑似 AIGC 易被微信限流',
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-red-50/80 via-orange-50/50 to-amber-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-red-600 to-amber-500 rounded-xl text-white shadow-xs">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">
                  腾讯朱雀 AIGC 疑似度检测与抗封风控
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-700 border border-red-200">
                  全流程闭环
                </span>
              </div>
              <p className="text-xs text-gray-500">
                支持【检测 ➔ 一键去AI味 ➔ 自动复测 ➔ 达标一键复制/发布】全自动闭环工作流
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFaq(!showFaq)}
              className="text-xs text-gray-500 hover:text-gray-800 p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
              title="查看工作流指南"
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span>通关指南</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workflow Guidance FAQ Banner */}
        {showFaq && (
          <div className="bg-amber-50/90 border-b border-amber-200 px-6 py-3 text-xs text-amber-900 animate-in fade-in">
            <div className="font-bold mb-1 flex items-center gap-1">
              <span>💡 创作者通关指南（去 AI 味标准流程）：</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-amber-800">
              <li><strong>优化完后怎么做？</strong> 系统支持【一键复制全文】或【立即应用并自动复测】。</li>
              <li><strong>如果继续检测还是中/高风险？</strong> 直接切换为【🚀 极限过朱雀】模式点击再次重塑，系统会深度打碎八股框架、注入真实案例与参差短句，直到降至 25% 以下（安全区）！</li>
              <li><strong>达标之后：</strong> 当 AI 疑似概率降低至绿色安全区，直接点击【一键复制】粘贴进微信公众号后台即可，安心发布不限流。</li>
            </ol>
          </div>
        )}

        {/* Action Controls & Intensity Settings */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Intensity selector */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">重构强度：</span>
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-gray-200">
              {[
                { id: 'light', label: '🌿 轻度去味' },
                { id: 'deep', label: '⚡ 深度重塑 (推荐)' },
                { id: 'aggressive', label: '🚀 极限过朱雀' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setIntensity(m.id as HumanizeIntensity)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    intensity === m.id
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Run Detect / Retest */}
            <button
              type="button"
              onClick={handleStartDetect}
              disabled={loading || isHumanizing}
              className="px-3.5 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? '检测中...' : result ? '重新检测当前文' : '首次朱雀检测'}</span>
            </button>

            {/* One-click Humanize & Retest Loop */}
            <button
              type="button"
              onClick={() => handleHumanizeAndRetest()}
              disabled={isHumanizing || loading}
              className="px-4 py-1.5 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isHumanizing ? 'animate-spin' : ''}`} />
              <span>
                {isHumanizing
                  ? '正在去 AI 味并自动复测...'
                  : result && result.aiProbability > 25
                  ? '一键去 AI 味并自动复测'
                  : '一键去 AI 味 · 重构过朱雀'}
              </span>
            </button>

            {/* Copy Rewritten Text */}
            <button
              type="button"
              onClick={handleCopyRewritten}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1"
              title="复制重构后的文章全文"
            >
              {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? '已复制重构稿！' : '复制全文'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Comparison Progress Bar if previous score exists */}
          {previousScore !== null && result && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-900">
                    降 AI 味复测完成！疑似概率从{' '}
                    <span className="line-through text-rose-600 font-bold">{previousScore}%</span>{' '}
                    成功下降至{' '}
                    <span className="text-emerald-700 font-extrabold text-sm">
                      {result.aiProbability}%
                    </span>
                  </span>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {result.aiProbability <= 25
                      ? '🎉 太棒了！已成功进入低风险安全区，微信公众平台不会判定为 AIGC 限流！'
                      : '已显著改善，如需进一步降至安全区，可直接切换为【🚀 极限过朱雀】模式继续重构。'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyRewritten}
                  className="px-3 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md font-semibold"
                >
                  {copiedText ? '已复制！' : '复制全文'}
                </button>
                <button
                  type="button"
                  onClick={handleApplyToEditor}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold"
                >
                  {appliedSuccess ? '已应用到编辑器！' : '立即应用到文章'}
                </button>
              </div>
            </div>
          )}

          {/* If Still Moderate or High Risk after test: Smart Recovery Banner */}
          {result && result.aiProbability > 25 && !loading && !isHumanizing && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
                <div>
                  <span className="font-bold text-orange-900">
                    还有残留 AI 痕迹？别担心，可一键升级【极限档位】继续重构！
                  </span>
                  <p className="text-[11px] text-orange-700 mt-0.5">
                    系统已自动定位剩余 {result.flaggedSentences.length} 处顽固句段，点击右侧按钮立刻使用高强度突破模式。
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleHumanizeAndRetest('aggressive')}
                className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-xs transition-colors shrink-0 flex items-center gap-1"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>升级极限档位 · 再次去味</span>
              </button>
            </div>
          )}

          {/* Initial State */}
          {!loading && !result && !error && (
            <div className="py-12 flex flex-col items-center justify-center text-center text-gray-400 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-1">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-gray-700">腾讯朱雀 AIGC 检测引擎就绪</h3>
              <p className="text-xs text-gray-500 max-w-md leading-relaxed">
                微信公众平台对纯 AIGC 文章加大了限流与降权力度。
                点击上方【首次朱雀检测】或【一键去 AI 味并自动复测】，我们将全流程陪伴您直至文章安全通过！
              </p>
            </div>
          )}

          {/* Loading */}
          {(loading || isHumanizing) && (
            <div className="py-16 flex flex-col items-center justify-center text-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
                <Flame className="w-6 h-6 text-red-600 absolute inset-0 m-auto" />
              </div>
              <h4 className="font-bold text-sm text-gray-800 mt-2">
                {isHumanizing
                  ? '正在以人类语言逻辑深度重构文章，并自动执行朱雀复测...'
                  : '正在对照腾讯朱雀风控模型进行 AIGC 痕迹扫描...'}
              </h4>
              <p className="text-xs text-gray-400">
                打破刻板三段论八股，注入第一人称实战踩坑与长短句突发度 (Burstiness)
              </p>
            </div>
          )}

          {/* Result view */}
          {!loading && !isHumanizing && result && (
            <div className="space-y-6">
              {/* Score Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* AI Probability Gauge */}
                <div className="p-5 rounded-2xl border bg-white flex flex-col items-center justify-center text-center shadow-xs">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    朱雀 AIGC 疑似概率
                  </span>
                  <div
                    className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center my-1 ${getScoreColor(
                      result.aiProbability
                    )}`}
                  >
                    <span className="text-3xl font-black">{result.aiProbability}%</span>
                    <span className="text-[10px] font-bold">AI 概率</span>
                  </div>
                  {(() => {
                    const badge = getBadgeStyle(result.riskLevel);
                    const Icon = badge.icon;
                    return (
                      <div
                        className={`mt-2 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{badge.text}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Verdict & Summary */}
                <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 md:col-span-2 flex flex-col justify-between shadow-xs">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                      综合风控评级结论
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      {result.verdict}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {result.summary}
                    </p>
                  </div>

                  {/* Dimension Bars */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200/80 mt-3 text-xs">
                    <div>
                      <div className="flex justify-between text-gray-500 mb-1">
                        <span>句式突发度 (长短多样性)</span>
                        <span className="font-bold text-gray-800">
                          {result.dimensions.burstiness}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${result.dimensions.burstiness}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-gray-500 mb-1">
                        <span>自然人类语气</span>
                        <span className="font-bold text-gray-800">
                          {result.dimensions.naturalTone}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${result.dimensions.naturalTone}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-gray-500 mb-1">
                        <span>一手实战经历感</span>
                        <span className="font-bold text-gray-800">
                          {result.dimensions.humanExperience}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${result.dimensions.humanExperience}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-gray-500 mb-1">
                        <span>刻板AI套话占比</span>
                        <span className="font-bold text-gray-800">
                          {result.dimensions.clicheRatio}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full"
                          style={{ width: `${result.dimensions.clicheRatio}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rewritten Draft Preview if available */}
              {humanizedContent && (
                <div className="p-4 bg-white border border-gray-200 rounded-2xl flex flex-col gap-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      <span>当前重构后的最新稿件预览</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyRewritten}
                        className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                      >
                        {copiedText ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedText ? '已复制！' : '复制重构稿'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyToEditor}
                        className="text-xs text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded font-medium transition-colors"
                      >
                        {appliedSuccess ? '已应用到编辑器！' : '应用到编辑器'}
                      </button>
                    </div>
                  </div>
                  <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-xl border border-gray-100 font-mono text-xs text-gray-800 whitespace-pre-wrap select-text">
                    {humanizedContent}
                  </div>
                </div>
              )}

              {/* Flagged AI Sentences */}
              {result.flaggedSentences && result.flaggedSentences.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>检测出具有典型 AI 特征的句段（共 {result.flaggedSentences.length} 处）</span>
                  </h4>
                  <div className="space-y-2">
                    {result.flaggedSentences.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-rose-50/50 border border-rose-200/80 rounded-xl text-xs space-y-1.5"
                      >
                        <div className="font-mono text-gray-800 bg-white/80 p-2 rounded border border-rose-100">
                          "{item.text}"
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-rose-700">
                          <span className="font-bold">⚠️ 风险成因：</span>
                          <span>{item.reason}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50/80 p-1.5 rounded">
                          <span className="font-bold">💡 建议改写：</span>
                          <span>{item.suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Suggestions */}
              {result.improvementTips && result.improvementTips.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                  <span className="font-bold text-gray-800 block mb-2">
                    🛡️ 微信公众号过朱雀核心避坑建议：
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {result.improvementTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Persistent Bottom Bar with Clear Actions */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-500">
            <span>官方验证通道：</span>
            <a
              href="https://zhuqueaigc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 underline font-medium flex items-center gap-0.5"
            >
              <span>zhuqueaigc.com (腾讯朱雀官网)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyRewritten}
              className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedText ? '已复制重构稿！' : '复制全文'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (humanizedContent) {
                  onApplyHumanized(humanizedContent);
                }
                onClose();
              }}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>{humanizedContent ? '应用并关闭' : '完成'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
