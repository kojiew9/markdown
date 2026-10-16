import React from 'react';
import { THEMES } from '../data/themes';
import { ArticleTheme } from '../types';
import { Palette, X, RotateCcw, Check } from 'lucide-react';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ArticleTheme;
  onSelectTheme: (theme: ArticleTheme) => void;
  onUpdateTheme: (updated: Partial<ArticleTheme>) => void;
  onResetTheme: () => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  onUpdateTheme,
  onResetTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">排版主题与排版参数定制</h2>
              <p className="text-xs text-gray-500">
                实时微调字体字号、行高行距、Mac 代码高亮与官方配色
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetTheme}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="重置当前主题到默认"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置默认</span>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Preset Themes Grid */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">
              官方预设配色方案 (8款经典)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {THEMES.map((t) => {
                const isSelected = currentTheme.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectTheme(t)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: t.primaryColor }}
                      />
                      <span className="text-xs font-bold text-gray-900 truncate">{t.name}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 line-clamp-1">{t.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
            {/* Font Family */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                字体系列 (Font Family)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sans', label: '无衬线 (现代)' },
                  { id: 'serif', label: '衬线 (文艺)' },
                  { id: 'mono', label: '等宽 (代码)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onUpdateTheme({ fontFamily: f.id as any })}
                    className={`py-2 px-2 text-xs rounded-lg border font-medium transition-all ${
                      currentTheme.fontFamily === f.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                正文字号 (微信公众号推荐 15px)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[14, 15, 16, 17].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onUpdateTheme({ fontSize: size })}
                    className={`py-2 text-xs rounded-lg border font-medium transition-all ${
                      currentTheme.fontSize === size
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

            {/* Line Height */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                行距倍数 (推荐 1.8)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1.6, 1.75, 1.85, 2.0].map((lh) => (
                  <button
                    key={lh}
                    type="button"
                    onClick={() => onUpdateTheme({ lineHeight: lh })}
                    className={`py-2 text-xs rounded-lg border font-medium transition-all ${
                      currentTheme.lineHeight === lh
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {lh}倍
                  </button>
                ))}
              </div>
            </div>

            {/* Letter Spacing */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                字间距 (Letter Spacing)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: 0, label: '标准 (0px)' },
                  { val: 0.5, label: '适中 (0.5px)' },
                  { val: 1, label: '疏朗 (1.0px)' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => onUpdateTheme({ letterSpacing: item.val })}
                    className={`py-2 text-xs rounded-lg border font-medium transition-all ${
                      currentTheme.letterSpacing === item.val
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Code Block & Decorators */}
          <div className="pt-4 border-t border-gray-100">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">
              代码块风格与细节
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Code theme */}
              <div>
                <span className="text-xs font-medium text-gray-700 block mb-1.5">代码高亮主题</span>
                <select
                  value={currentTheme.codeTheme}
                  onChange={(e) => onUpdateTheme({ codeTheme: e.target.value as any })}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-gray-800 outline-none"
                >
                  <option value="github-dark">GitHub Dark</option>
                  <option value="github-light">GitHub Light</option>
                  <option value="one-dark">One Dark</option>
                  <option value="dracula">Dracula</option>
                  <option value="monokai">Monokai</option>
                </select>
              </div>

              {/* Mac Header Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <div className="text-xs font-semibold text-gray-800">Mac 窗口控件</div>
                  <div className="text-[11px] text-gray-400">红黄绿三色圆点</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentTheme.macCodeHeader}
                  onChange={(e) => onUpdateTheme({ macCodeHeader: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Line Numbers Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <div className="text-xs font-semibold text-gray-800">代码行号</div>
                  <div className="text-[11px] text-gray-400">显示代码行号列</div>
                </div>
                <input
                  type="checkbox"
                  checked={currentTheme.codeLineNumbers}
                  onChange={(e) => onUpdateTheme({ codeLineNumbers: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            完成并应用
          </button>
        </div>
      </div>
    </div>
  );
};
