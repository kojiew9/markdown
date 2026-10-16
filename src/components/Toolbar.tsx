import React from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  Quote,
  Code,
  FileCode2,
  Table,
  Link2,
  Image as ImageIcon,
  List,
  ListOrdered,
  Minus,
  Sparkles,
  Wand2,
  LayoutTemplate,
  CheckSquare,
} from 'lucide-react';
import { COMPONENTS } from '../data/components';

interface ToolbarProps {
  onInsertText: (before: string, after?: string, defaultText?: string) => void;
  onOpenAI: () => void;
  onOpenZhuque: () => void;
  onOpenTemplates: () => void;
  onInsertComponent: (snippet: string) => void;
  wordCount: number;
  readingTimeMinutes: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onInsertText,
  onOpenAI,
  onOpenZhuque,
  onOpenTemplates,
  onInsertComponent,
  wordCount,
  readingTimeMinutes,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto select-none">
      {/* Markdown standard formatting buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onInsertText('# ', '', '标题内容')}
          title="一级标题 H1"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onInsertText('## ', '', '二级标题')}
          title="二级标题 H2"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onInsertText('### ', '', '三级标题')}
          title="三级标题 H3"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={() => onInsertText('**', '**', '加粗文本')}
          title="粗体 (Ctrl+B)"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onInsertText('*', '*', '斜体文本')}
          title="斜体 (Ctrl+I)"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onInsertText('~~', '~~', '删除线文本')}
          title="删除线"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={() => onInsertText('> ', '', '引用金句或重点说明')}
          title="引用块"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onInsertText('`', '`', 'code')}
          title="行内代码"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onInsertText('```typescript\n', '\n```', '// 请输入代码片段')}
          title="代码块 (含 Mac 窗口控件)"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <FileCode2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            onInsertText(
              '| 列1 | 列2 | 列3 |\n| :--- | :--- | :--- |\n| 内容A | 内容B | 内容C |\n'
            )
          }
          title="插入表格"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <Table className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onInsertText('[', '](https://)', '链接描述')}
          title="插入超链接 (自动转文末引用)"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <Link2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            onInsertText(
              '![图片说明](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80)'
            )
          }
          title="插入图片"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onInsertText('- ', '', '列表项')}
          title="无序列表"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onInsertText('1. ', '', '有序列表项')}
          title="有序列表"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onInsertText('\n---\n')}
          title="分割线"
          className="p-1.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-gray-200 mx-1" />

        {/* Quick Component Inserts */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onInsertComponent(COMPONENTS[0].snippet)}
            className="text-xs px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-md font-medium border border-amber-200/60 transition-colors flex items-center gap-1"
            title="插入提示框"
          >
            💡 提示框
          </button>
          <button
            type="button"
            onClick={() => onInsertComponent(COMPONENTS[1].snippet)}
            className="text-xs px-2 py-1 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-md font-medium border border-orange-200/60 transition-colors flex items-center gap-1"
            title="插入避坑提醒"
          >
            ⚠️ 避坑
          </button>
          <button
            type="button"
            onClick={() => onInsertComponent(COMPONENTS[4].snippet)}
            className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md font-medium border border-indigo-200/60 transition-colors flex items-center gap-1"
            title="插入作者名片"
          >
            👤 作者名片
          </button>
          <button
            type="button"
            onClick={() => onInsertComponent(COMPONENTS[5].snippet)}
            className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md font-medium border border-emerald-200/60 transition-colors flex items-center gap-1"
            title="插入文末关注引导"
          >
            📢 关注底栏
          </button>
        </div>
      </div>

      {/* Right side stats and triggers */}
      <div className="flex items-center gap-3 text-xs text-gray-500 shrink-0">
        <span className="hidden sm:inline-flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded border border-gray-100">
          <span>{wordCount} 字</span>
          <span className="text-gray-300">|</span>
          <span>约 {readingTimeMinutes} 分钟</span>
        </span>

        <button
          type="button"
          onClick={onOpenTemplates}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>模版库</span>
        </button>

        <button
          type="button"
          onClick={onOpenAI}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 shadow-sm rounded-md transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI 智能润色</span>
        </button>

        <button
          type="button"
          onClick={onOpenZhuque}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
          title="腾讯朱雀 AIGC 疑似度检测与抗微信限流"
        >
          <span>🛡️ 朱雀检测</span>
        </button>
      </div>
    </div>
  );
};
