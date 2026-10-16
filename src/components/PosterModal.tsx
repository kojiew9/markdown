import React, { useState, useRef } from 'react';
import { ArticleTheme } from '../types';
import { Download, Sparkles, X, Loader2, Check } from 'lucide-react';
import { exportAsPosterImage } from '../utils/wechatInliner';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  theme: ArticleTheme;
}

export const PosterModal: React.FC<PosterModalProps> = ({
  isOpen,
  onClose,
  html,
  theme,
}) => {
  const [authorName, setAuthorName] = useState('Doocs 极客创作者');
  const [tagline, setTagline] = useState('扫码或搜索关注 · 持续分享前沿干货');
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsExporting(true);
    const result = await exportAsPosterImage(posterRef.current, 'doocs-article-poster');
    setIsExporting(false);
    if (result) {
      setExported(true);
      setTimeout(() => setExported(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500 text-white rounded-xl shadow-xs">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">生成高清长图海报</h2>
              <p className="text-xs text-gray-500">
                适配小红书多图切割、微信朋友圈与微博长图分享
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

        {/* Configuration strip */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">署名作者：</span>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="px-2.5 py-1 bg-white border border-gray-300 rounded-md outline-none text-gray-800"
              placeholder="输入你的作者名"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">文末标语：</span>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="px-2.5 py-1 bg-white border border-gray-300 rounded-md outline-none text-gray-800 w-52"
              placeholder="文末引导语"
            />
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="ml-auto px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>正在高清渲染...</span>
              </>
            ) : exported ? (
              <>
                <Check className="w-4 h-4" />
                <span>已保存到下载！</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>一键下载高清 PNG</span>
              </>
            )}
          </button>
        </div>

        {/* Poster Scrollable Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-200/70 flex justify-center items-start">
          <div
            ref={posterRef}
            className="w-[460px] max-w-full bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200"
          >
            {/* Poster Header Banner */}
            <div
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              }}
              className="p-6 text-gray-900 relative"
            >
              <div className="flex items-center justify-between text-xs opacity-80 mb-2">
                <span className="font-bold tracking-wider uppercase">DOOCS MARKDOWN 排版精选</span>
                <span className="px-2 py-0.5 bg-black/10 rounded-full font-mono">
                  {new Date().toLocaleDateString('zh-CN')}
                </span>
              </div>
              <div className="text-xs text-gray-700 font-medium flex items-center gap-1">
                <span>专栏作者：</span>
                <span className="font-bold">{authorName}</span>
              </div>
            </div>

            {/* Poster Article Body */}
            <div className="p-6">
              <div
                className="prose max-w-none"
                style={{
                  fontSize: `${theme.fontSize}px`,
                  lineHeight: theme.lineHeight,
                  letterSpacing: `${theme.letterSpacing}px`,
                }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>

            {/* Poster Footer Banner */}
            <div className="bg-gray-50 border-t border-gray-100 p-5 flex items-center justify-between text-xs text-gray-500">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-gray-800">{authorName}</span>
                <span className="text-[11px] text-gray-400">{tagline}</span>
              </div>
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg p-1 flex items-center justify-center text-[10px] text-gray-400 font-mono shadow-xs text-center">
                QR CODE
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
