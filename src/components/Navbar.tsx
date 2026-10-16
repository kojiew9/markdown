import React, { useState } from 'react';
import { ArticleTheme, DocumentDraft, TargetPlatform } from '../types';
import {
  FileText,
  Plus,
  Trash2,
  Palette,
  LayoutTemplate,
  Sparkles,
  Share2,
  Copy,
  Download,
  ChevronDown,
  Check,
  CheckCircle2,
  Smartphone,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  drafts: DocumentDraft[];
  activeDraftId: string;
  onSelectDraft: (id: string) => void;
  onCreateDraft: () => void;
  onDeleteDraft: (id: string) => void;
  onRenameDraft: (id: string, newTitle: string) => void;
  currentTheme: ArticleTheme;
  onOpenThemeModal: () => void;
  onOpenTemplates: () => void;
  onOpenAI: () => void;
  onOpenZhuque: () => void;
  onOpenPublish: () => void;
  onQuickCopyWeChat: () => void;
  targetPlatform: TargetPlatform;
  onSelectPlatform: (platform: TargetPlatform) => void;
  isCopiedWeChat: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  drafts,
  activeDraftId,
  onSelectDraft,
  onCreateDraft,
  onDeleteDraft,
  onRenameDraft,
  currentTheme,
  onOpenThemeModal,
  onOpenTemplates,
  onOpenAI,
  onOpenZhuque,
  onOpenPublish,
  onQuickCopyWeChat,
  targetPlatform,
  onSelectPlatform,
  isCopiedWeChat,
}) => {
  const [showPlatformMenu, setShowPlatformMenu] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');

  const activeDraft = drafts.find((d) => d.id === activeDraftId) || drafts[0];

  const handleStartRename = (draft: DocumentDraft) => {
    setEditingTitleId(draft.id);
    setTempTitle(draft.title);
  };

  const handleFinishRename = (id: string) => {
    if (tempTitle.trim()) {
      onRenameDraft(id, tempTitle.trim());
    }
    setEditingTitleId(null);
  };

  const platformLabels: Record<TargetPlatform, { label: string; icon: string }> = {
    wechat: { label: '微信公众号', icon: '微' },
    zhihu: { label: '知乎专栏', icon: '知' },
    xiaohongshu: { label: '小红书长图', icon: '薯' },
    juejin: { label: '掘金/CSDN', icon: '掘' },
    newsletter: { label: '邮件通讯', icon: '邮' },
    clean: { label: '标准 Markdown', icon: 'MD' },
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between gap-3 select-none z-20">
      {/* Left: Brand & Drafts */}
      <div className="flex items-center gap-3 overflow-x-auto py-1">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-blue-600 to-rose-500 flex items-center justify-center text-white shadow-xs font-bold text-sm">
            MD
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-extrabold text-gray-900 text-sm tracking-tight leading-none">
              微信 · 知乎 · 小红书 智能排版
            </span>
            <span className="text-[10px] text-gray-500 font-medium tracking-wider mt-0.5">
              一键多端适配 · 样式深度内联 · 朱雀防限流
            </span>
          </div>
        </div>

        <span className="w-px h-5 bg-gray-200 shrink-0 mx-1" />

        {/* 3-Platform Primary Segmented Switcher */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200 shrink-0">
          <button
            type="button"
            onClick={() => onSelectPlatform('wechat')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              targetPlatform === 'wechat'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-gray-600 hover:text-emerald-700'
            }`}
            title="微信公众号排版模式：样式深度内联、文末外链转引用、朱雀检测"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
            <span>微信公众号</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectPlatform('zhihu')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              targetPlatform === 'zhihu'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-gray-600 hover:text-blue-700'
            }`}
            title="知乎专栏/回答排版模式：知乎学术清晰行距、知乎代码规范"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
            <span>知乎专栏</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectPlatform('xiaohongshu')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              targetPlatform === 'xiaohongshu'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'text-gray-600 hover:text-rose-600'
            }`}
            title="小红书图文模式：3:4 爆款长图海报导出、短句Emoji分点"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
            <span>小红书图文</span>
          </button>
        </div>

        <span className="w-px h-5 bg-gray-200 shrink-0 mx-1 hidden lg:block" />

        {/* Draft Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[360px] scrollbar-none">
          {drafts.map((draft) => {
            const isActive = draft.id === activeDraftId;
            return (
              <div
                key={draft.id}
                onClick={() => onSelectDraft(draft.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border shrink-0 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                {editingTitleId === draft.id ? (
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={() => handleFinishRename(draft.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFinishRename(draft.id)}
                    autoFocus
                    className="w-20 bg-white border border-emerald-400 rounded px-1 outline-none text-xs"
                  />
                ) : (
                  <span
                    onDoubleClick={() => handleStartRename(draft)}
                    className="max-w-[100px] truncate"
                    title="双击可重命名文档"
                  >
                    {draft.title}
                  </span>
                )}
                {drafts.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDraft(draft.id);
                    }}
                    className="text-gray-400 hover:text-rose-600 rounded p-0.5 ml-0.5"
                    title="删除此草稿"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={onCreateDraft}
            className="p-1.5 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-dashed border-gray-300 transition-colors shrink-0"
            title="新建空白文档"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Actions, Platform Selector, Theme & Publish */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Platform Selector Dropdown */}
        <div className="relative hidden lg:block">
          <button
            type="button"
            onClick={() => setShowPlatformMenu(!showPlatformMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
              {platformLabels[targetPlatform].icon}
            </span>
            <span>{platformLabels[targetPlatform].label}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showPlatformMenu && (
            <div className="absolute top-full right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
              {(Object.keys(platformLabels) as TargetPlatform[]).map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => {
                    onSelectPlatform(platform);
                    setShowPlatformMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-gray-50 ${
                    targetPlatform === platform
                      ? 'text-emerald-700 font-semibold bg-emerald-50/50'
                      : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px] font-bold">
                      {platformLabels[platform].icon}
                    </span>
                    <span>{platformLabels[platform].label}</span>
                  </div>
                  {targetPlatform === platform && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Settings Button */}
        <button
          type="button"
          onClick={onOpenThemeModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          title="调整主题配色与排版字号"
        >
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
            style={{ backgroundColor: currentTheme.primaryColor }}
          />
          <span className="hidden sm:inline">{currentTheme.name}</span>
        </button>

        {/* Templates Button */}
        <button
          type="button"
          onClick={onOpenTemplates}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-gray-200 transition-colors"
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">模版</span>
        </button>

        {/* AI Assistant Button */}
        <button
          type="button"
          onClick={onOpenAI}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg shadow-xs transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>AI 润色</span>
        </button>

        {/* Zhuque AIGC Detection Button */}
        <button
          type="button"
          onClick={onOpenZhuque}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
          title="腾讯朱雀 AIGC 疑似度检测与防微信限流"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>朱雀检测</span>
        </button>

        {/* Quick Copy WeChat Button */}
        <button
          type="button"
          onClick={onQuickCopyWeChat}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-xs transition-all ${
            isCopiedWeChat
              ? 'bg-emerald-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
          title="复制具有完整微信内联样式的富文本"
        >
          {isCopiedWeChat ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{isCopiedWeChat ? '已复制微信！' : '一键复制'}</span>
        </button>

        {/* Publish Hub Modal Trigger */}
        <button
          type="button"
          onClick={onOpenPublish}
          className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          title="打开多渠道发布看板"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
