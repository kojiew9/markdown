import React, { useState, useEffect } from 'react';
import { ArticleTheme, TargetPlatform } from '../types';
import {
  Monitor,
  Smartphone,
  BookOpen,
  Check,
  Copy,
  Share2,
  Download,
  Flame,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Heart,
  Star,
} from 'lucide-react';
import { copyToWeChat } from '../utils/wechatInliner';

interface PreviewProps {
  html: string;
  theme: ArticleTheme;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onThemeChange: (updated: Partial<ArticleTheme>) => void;
  onOpenPublishModal: () => void;
  onOpenPosterModal: () => void;
  onOpenZhuque: () => void;
  targetPlatform: TargetPlatform;
  onSelectPlatform: (platform: TargetPlatform) => void;
}

export const Preview: React.FC<PreviewProps> = ({
  html,
  theme,
  previewRef,
  onThemeChange,
  onOpenPublishModal,
  onOpenPosterModal,
  onOpenZhuque,
  targetPlatform,
  onSelectPlatform,
}) => {
  const [deviceMode, setDeviceMode] = useState<'pc' | 'mobile' | 'card'>('pc');
  const [copied, setCopied] = useState(false);
  const [copiedType, setCopiedType] = useState<string>('');

  // Automatically adapt device frame when targetPlatform changes
  useEffect(() => {
    if (targetPlatform === 'wechat') {
      setDeviceMode('mobile');
    } else if (targetPlatform === 'xiaohongshu') {
      setDeviceMode('card');
    } else {
      setDeviceMode('pc');
    }
  }, [targetPlatform]);

  const handleCopyFormatted = async (type: string) => {
    if (!previewRef.current) return;
    const success = await copyToWeChat(previewRef.current, theme);
    if (success) {
      setCopied(true);
      setCopiedType(type);
      setTimeout(() => {
        setCopied(false);
        setCopiedType('');
      }, 2500);
    }
  };

  const getFontFamilyClass = () => {
    if (theme.fontFamily === 'serif') {
      return 'font-serif';
    }
    if (theme.fontFamily === 'mono') {
      return 'font-mono';
    }
    return 'font-sans';
  };

  return (
    <div className="relative flex-1 flex flex-col h-full overflow-hidden bg-gray-100/70">
      {/* Top Preview Controls Bar */}
      <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between gap-2 text-xs select-none">
        {/* Device Mode Switcher */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200/60">
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              deviceMode === 'mobile'
                ? 'bg-white text-emerald-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>微信真机</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('pc')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              deviceMode === 'pc'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>知乎专栏/宽屏</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('card')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              deviceMode === 'card'
                ? 'bg-white text-rose-600 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>小红书长图</span>
          </button>
        </div>

        {/* Footnote and Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Footnote Toggle */}
          <button
            type="button"
            onClick={() =>
              onThemeChange({ convertLinksToFootnotes: !theme.convertLinksToFootnotes })
            }
            className={`px-2 py-1 rounded border transition-colors ${
              theme.convertLinksToFootnotes
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
            title="微信公众号无法直接打开外部超链接，开启后自动将外链转换为文末参考文献引用 [1]"
          >
            {theme.convertLinksToFootnotes ? '✓ 微信外链转引用' : '保留原生外链'}
          </button>

          {/* Quick Platform Copy Button */}
          {targetPlatform === 'xiaohongshu' ? (
            <button
              type="button"
              onClick={onOpenPosterModal}
              className="flex items-center gap-1.5 px-3 py-1 font-bold rounded-md bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出小红书海报</span>
            </button>
          ) : targetPlatform === 'zhihu' ? (
            <button
              type="button"
              onClick={() => handleCopyFormatted('知乎')}
              className={`flex items-center gap-1.5 px-3 py-1 font-bold rounded-md shadow-xs transition-all ${
                copied && copiedType === '知乎'
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied && copiedType === '知乎' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied && copiedType === '知乎' ? '已复制知乎格式！' : '复制到知乎'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleCopyFormatted('微信')}
              className={`flex items-center gap-1.5 px-3 py-1 font-bold rounded-md shadow-xs transition-all ${
                copied && copiedType === '微信'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {copied && copiedType === '微信' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied && copiedType === '微信' ? '已复制微信格式！' : '复制到微信'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Preview Content Area with Scroll */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start">
        {deviceMode === 'mobile' ? (
          /* Realistic WeChat iPhone Device Frame */
          <div className="w-[390px] max-w-full bg-white rounded-[40px] shadow-2xl border-[8px] border-gray-800 overflow-hidden flex flex-col my-2 transition-all">
            {/* Status Bar */}
            <div className="bg-gray-100 px-6 pt-3 pb-2 flex items-center justify-between text-[11px] text-gray-700 font-semibold select-none">
              <span>9:41</span>
              <div className="w-20 h-4 bg-gray-800 rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span>5G</span>
                <div className="w-4 h-2.5 border border-gray-700 rounded-xs p-0.5">
                  <div className="w-full h-full bg-gray-800 rounded-xs" />
                </div>
              </div>
            </div>

            {/* WeChat Header Bar */}
            <div className="bg-gray-100 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs text-gray-800 select-none">
              <span className="font-medium text-gray-500">‹ 微信</span>
              <span className="font-bold text-gray-800 text-[13px] truncate max-w-[180px]">
                微信公众号 · 文章预览
              </span>
              <span className="font-bold tracking-widest text-gray-600">···</span>
            </div>

            {/* Mobile Article Container */}
            <div className="p-4 bg-white max-h-[640px] overflow-y-auto">
              <div
                ref={previewRef}
                className={`prose max-w-none ${getFontFamilyClass()}`}
                style={{
                  fontSize: `${theme.fontSize}px`,
                  lineHeight: theme.lineHeight,
                  letterSpacing: `${theme.letterSpacing}px`,
                }}
                dangerouslySetInnerHTML={{ __html: html }}
              />

              {/* WeChat Article Bottom Meta Bar */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-400 select-none">
                <span>阅读 10万+</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">👍 2568</span>
                  <span className="flex items-center gap-1">⭐ 在看 1892</span>
                </div>
              </div>
            </div>
          </div>
        ) : deviceMode === 'card' ? (
          /* Xiaohongshu / Card Poster Mode */
          <div className="w-[520px] max-w-full bg-white rounded-2xl shadow-xl border border-rose-200 overflow-hidden my-2">
            <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-4 text-white">
              <div className="flex items-center justify-between text-xs opacity-90">
                <span className="font-extrabold tracking-wider">📕 小红书爆款图文笔记</span>
                <span className="bg-black/10 px-2 py-0.5 rounded-full font-mono text-[11px]">3:4 高清海报尺寸</span>
              </div>
            </div>
            <div className="p-6">
              <div
                ref={previewRef}
                className={`prose max-w-none ${getFontFamilyClass()}`}
                style={{
                  fontSize: `${theme.fontSize}px`,
                  lineHeight: theme.lineHeight,
                  letterSpacing: `${theme.letterSpacing}px`,
                }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
            <div className="bg-rose-50/60 px-6 py-3 border-t border-rose-100 flex items-center justify-between text-xs text-rose-700">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-bold"><Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> 2.8万</span>
                <span className="flex items-center gap-1 font-bold"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> 1.6万</span>
                <span className="flex items-center gap-1 font-bold"><MessageSquare className="w-3.5 h-3.5" /> 2180</span>
              </div>
              <button
                type="button"
                onClick={onOpenPosterModal}
                className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-md font-bold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                导出长图海报
              </button>
            </div>
          </div>
        ) : (
          /* Standard PC Desktop / Zhihu Column Preview */
          <div className="w-full max-w-[840px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all">
            {/* Zhihu Column Header Banner */}
            <div className="bg-blue-50/60 border-b border-blue-100 px-6 py-2.5 flex items-center justify-between text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <span className="font-black text-blue-600 text-sm">知乎</span>
                <span className="text-gray-300">|</span>
                <span className="font-semibold text-gray-700">专栏与深度技术问答</span>
              </div>
              <span className="text-gray-400">阅读排版已对齐知乎编辑器</span>
            </div>

            <div className="p-6 sm:p-10">
              <div
                ref={previewRef}
                className={`prose max-w-none ${getFontFamilyClass()}`}
                style={{
                  fontSize: `${theme.fontSize}px`,
                  lineHeight: theme.lineHeight,
                  letterSpacing: `${theme.letterSpacing}px`,
                }}
                dangerouslySetInnerHTML={{ __html: html }}
              />

              {/* Zhihu Bottom Interaction Bar */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500 select-none">
                <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-md font-bold">
                  ▲ 赞同 4.2K
                </span>
                <span className="flex items-center gap-1 hover:text-gray-800 cursor-pointer">
                  <MessageSquare className="w-3.5 h-3.5" /> 382 条评论
                </span>
                <span className="flex items-center gap-1 hover:text-gray-800 cursor-pointer">
                  <Bookmark className="w-3.5 h-3.5" /> 收藏
                </span>
                <span className="flex items-center gap-1 hover:text-gray-800 cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" /> 分享
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="absolute bottom-5 right-6 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-full shadow-lg border border-gray-200/80">
        {/* Dynamic Primary Platform Action */}
        {targetPlatform === 'xiaohongshu' ? (
          <button
            type="button"
            onClick={onOpenPosterModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出小红书长图海报</span>
          </button>
        ) : targetPlatform === 'zhihu' ? (
          <button
            type="button"
            onClick={() => handleCopyFormatted('知乎')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold shadow-xs transition-colors"
          >
            {copied && copiedType === '知乎' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied && copiedType === '知乎' ? '已复制知乎格式！' : '一键复制到知乎'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleCopyFormatted('微信')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold shadow-xs transition-colors"
          >
            {copied && copiedType === '微信' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied && copiedType === '微信' ? '已复制微信格式！' : '一键复制到微信'}</span>
          </button>
        )}

        {/* Zhuque Detection Trigger */}
        <button
          type="button"
          onClick={onOpenZhuque}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-full text-xs font-semibold transition-colors"
          title="腾讯朱雀 AIGC 疑似度检测与抗微信限流"
        >
          <Flame className="w-3.5 h-3.5 text-red-600" />
          <span>朱雀检测</span>
        </button>

        {/* Multi-channel Publish Hub Trigger */}
        <button
          type="button"
          onClick={onOpenPublishModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-full text-xs font-medium transition-colors"
          title="多渠道发布看板"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">多渠道发布</span>
        </button>
      </div>
    </div>
  );
};
