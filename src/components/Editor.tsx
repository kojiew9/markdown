import React, { useRef, useEffect } from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  editorRef: React.RefObject<HTMLTextAreaElement | null>;
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange, editorRef, onScroll }) => {
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Calculate lines for gutter
  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Sync line numbers scroll with textarea scroll
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
    if (onScroll) {
      onScroll(e);
    }
  };

  // Handle Tab key and Auto-close brackets
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd } = textarea;

    // Tab key indent
    if (e.key === 'Tab') {
      e.preventDefault();
      const nextVal = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
      onChange(nextVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
      }, 0);
      return;
    }

    // Auto close quotes and brackets
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '`': '`',
      '"': '"',
    };

    if (pairs[e.key]) {
      const closing = pairs[e.key];
      const selectedText = value.substring(selectionStart, selectionEnd);
      if (selectedText.length > 0) {
        e.preventDefault();
        const nextVal =
          value.substring(0, selectionStart) +
          e.key +
          selectedText +
          closing +
          value.substring(selectionEnd);
        onChange(nextVal);
        setTimeout(() => {
          textarea.selectionStart = selectionStart + 1;
          textarea.selectionEnd = selectionEnd + 1;
        }, 0);
      }
    }
  };

  // Drag & drop image files
  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          const imageMarkdown = `\n![${file.name}](${base64})\n`;
          const textarea = editorRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const next = value.slice(0, start) + imageMarkdown + value.slice(start);
            onChange(next);
          } else {
            onChange(value + imageMarkdown);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="relative flex-1 flex h-full overflow-hidden bg-white">
      {/* Line Numbers Gutter */}
      <div
        ref={lineNumbersRef}
        className="w-12 py-4 select-none text-right pr-3 text-xs text-gray-300 bg-gray-50/70 border-r border-gray-100 font-mono overflow-hidden hidden md:block"
      >
        {Array.from({ length: lineCount }).map((_, i) => (
          <div key={i} className="h-6 leading-6">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Main Markdown Textarea */}
      <textarea
        ref={editorRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        onDrop={handleDrop}
        placeholder="# 在此输入或粘贴 Markdown 内容...&#10;&#10;✨ 支持拖拽本地图片上传&#10;🚀 支持微信排版样式内联&#10;💡 点击上方【AI 智能润色】获取高赞排版建议"
        className="flex-1 w-full h-full p-4 resize-none outline-none font-mono text-[14px] leading-6 text-gray-800 placeholder-gray-400 bg-transparent selection:bg-emerald-100"
        spellCheck={false}
      />
    </div>
  );
};
