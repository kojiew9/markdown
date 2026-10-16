import React, { useState } from 'react';
import { TEMPLATES } from '../data/templates';
import { ArticleTemplate } from '../types';
import {
  LayoutTemplate,
  FileCode2,
  Sparkles,
  Briefcase,
  Rocket,
  BookOpen,
  Newspaper,
  Check,
  X,
  ArrowRight,
} from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: ArticleTemplate, mode: 'replace' | 'append') => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<ArticleTemplate>(TEMPLATES[0]);

  if (!isOpen) return null;

  const filteredTemplates =
    selectedCategory === 'all'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory);

  const getIcon = (name: string) => {
    switch (name) {
      case 'FileCode2':
        return <FileCode2 className="w-5 h-5 text-emerald-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-orange-500" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-purple-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-rose-600" />;
      case 'Newspaper':
        return <Newspaper className="w-5 h-5 text-amber-600" />;
      default:
        return <LayoutTemplate className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">精选爆款排版模版库</h2>
              <p className="text-xs text-gray-500">
                涵盖公众号长文、小红书图文、个人简历、产品发版、周刊通讯，一键载入即刻排版
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

        {/* Category Tabs */}
        <div className="px-6 py-2.5 border-b border-gray-200 flex items-center gap-2 overflow-x-auto text-xs bg-white">
          {[
            { id: 'all', label: '全部模版' },
            { id: 'wechat', label: '微信公众号' },
            { id: 'xiaohongshu', label: '小红书图文' },
            { id: 'tech', label: '技术与发版' },
            { id: 'resume', label: '工程师简历' },
            { id: 'notes', label: '深度读书笔记' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full transition-all font-medium ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Modal Body: Split view (Left: Cards, Right: Preview) */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
          {/* Templates list */}
          <div className="w-full lg:w-96 flex flex-col gap-3 shrink-0">
            {filteredTemplates.map((template) => {
              const isSelected = previewTemplate.id === template.id;
              return (
                <div
                  key={template.id}
                  onClick={() => setPreviewTemplate(template)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                      : 'bg-white hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-100">
                        {getIcon(template.iconName)}
                      </div>
                      <span className="font-bold text-sm text-gray-900">{template.title}</span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800">
                      {template.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pl-9">
                    {template.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Template Detail Preview & Action */}
          <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 flex flex-col overflow-hidden">
            <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900">{previewTemplate.title}</h3>
                <span className="text-xs text-gray-400">
                  推荐默认主题：{previewTemplate.defaultTheme}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTemplate(previewTemplate, 'append');
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                >
                  追加到文末
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTemplate(previewTemplate, 'replace');
                    onClose();
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1"
                >
                  <span>立即使用此模版</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-gray-800 bg-white/70 whitespace-pre-wrap leading-relaxed select-text">
              {previewTemplate.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
