/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { THEMES } from './data/themes';
import { TEMPLATES } from './data/templates';
import { ArticleTheme, DocumentDraft, TargetPlatform, ArticleTemplate } from './types';
import { renderMarkdown } from './utils/markdownRenderer';
import { copyToWeChat } from './utils/wechatInliner';
import { Navbar } from './components/Navbar';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { TemplateModal } from './components/TemplateModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { PublishModal } from './components/PublishModal';
import { PosterModal } from './components/PosterModal';
import { ZhuqueModal } from './components/ZhuqueModal';

const DEFAULT_DRAFTS: DocumentDraft[] = [
  {
    id: 'draft-wechat-guide',
    title: '微信高并发实战长文',
    content: TEMPLATES[0].content,
    updatedAt: Date.now(),
    themeId: 'classic-emerald',
  },
  {
    id: 'draft-product-release',
    title: 'Doocs 3.0 发版说明',
    content: TEMPLATES[3].content,
    updatedAt: Date.now() - 3600000,
    themeId: 'royal-purple',
  },
];

export default function App() {
  // Drafts state
  const [drafts, setDrafts] = useState<DocumentDraft[]>(() => {
    try {
      const saved = localStorage.getItem('doocs_md_drafts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load drafts from localStorage:', e);
    }
    return DEFAULT_DRAFTS;
  });

  const [activeDraftId, setActiveDraftId] = useState<string>(() => {
    return drafts[0]?.id || 'draft-wechat-guide';
  });

  // Current active draft
  const activeDraft = useMemo(() => {
    return drafts.find((d) => d.id === activeDraftId) || drafts[0];
  }, [drafts, activeDraftId]);

  // Current theme
  const [theme, setTheme] = useState<ArticleTheme>(() => {
    try {
      const saved = localStorage.getItem('doocs_md_theme');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return THEMES[0];
  });

  // Target platform
  const [targetPlatform, setTargetPlatform] = useState<TargetPlatform>('wechat');

  // Modals state
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [isZhuqueModalOpen, setIsZhuqueModalOpen] = useState(false);

  // Copy notification state
  const [isCopiedWeChat, setIsCopiedWeChat] = useState(false);

  // Refs
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Autosave drafts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('doocs_md_drafts', JSON.stringify(drafts));
    } catch (e) {
      console.warn('Failed to save drafts:', e);
    }
  }, [drafts]);

  // Autosave theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('doocs_md_theme', JSON.stringify(theme));
    } catch (e) {}
  }, [theme]);

  // Update current draft content
  const handleContentChange = (newContent: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === activeDraftId ? { ...d, content: newContent, updatedAt: Date.now() } : d))
    );
  };

  // Draft tab operations
  const handleCreateDraft = () => {
    const newId = `draft-${Date.now()}`;
    const newDraft: DocumentDraft = {
      id: newId,
      title: `未命名文档 ${drafts.length + 1}`,
      content: '# 请在此输入标题\n\n开启你的智能排版之旅...',
      updatedAt: Date.now(),
      themeId: theme.id,
    };
    setDrafts((prev) => [newDraft, ...prev]);
    setActiveDraftId(newId);
  };

  const handleDeleteDraft = (id: string) => {
    if (drafts.length <= 1) return;
    const remaining = drafts.filter((d) => d.id !== id);
    setDrafts(remaining);
    if (activeDraftId === id) {
      setActiveDraftId(remaining[0].id);
    }
  };

  const handleRenameDraft = (id: string, newTitle: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, title: newTitle, updatedAt: Date.now() } : d))
    );
  };

  // Theme update handlers
  const handleUpdateTheme = (updated: Partial<ArticleTheme>) => {
    setTheme((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectTheme = (selected: ArticleTheme) => {
    setTheme(selected);
  };

  const handleResetTheme = () => {
    const base = THEMES.find((t) => t.id === theme.id) || THEMES[0];
    setTheme(base);
  };

  // Insert markdown at cursor
  const handleInsertText = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = activeDraft.content;
    const selected = currentText.substring(start, end) || defaultText;

    const next = currentText.substring(0, start) + before + selected + after + currentText.substring(end);
    handleContentChange(next);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selected.length;
    }, 0);
  };

  const handleInsertComponent = (snippet: string) => {
    const textarea = editorRef.current;
    if (!textarea) {
      handleContentChange(activeDraft.content + '\n\n' + snippet);
      return;
    }

    const start = textarea.selectionStart;
    const currentText = activeDraft.content;
    const next = currentText.substring(0, start) + '\n\n' + snippet + '\n\n' + currentText.substring(start);
    handleContentChange(next);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + snippet.length + 4;
    }, 0);
  };

  // Template select handler
  const handleSelectTemplate = (template: ArticleTemplate, mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      handleContentChange(template.content);
      // Auto switch recommended theme if found
      const matchingTheme = THEMES.find((t) => t.id === template.defaultTheme);
      if (matchingTheme) {
        setTheme(matchingTheme);
      }
    } else {
      handleContentChange(activeDraft.content + '\n\n---\n\n' + template.content);
    }
  };

  // AI Result apply handler
  const handleApplyAIResult = (newContent: string, mode: 'replace' | 'prepend' | 'append') => {
    if (mode === 'replace') {
      handleContentChange(newContent);
    } else if (mode === 'prepend') {
      handleContentChange(newContent + '\n\n---\n\n' + activeDraft.content);
    } else {
      handleContentChange(activeDraft.content + '\n\n---\n\n' + newContent);
    }
  };

  // Quick Copy WeChat
  const handleQuickCopyWeChat = async () => {
    if (!previewRef.current) return;
    const success = await copyToWeChat(previewRef.current, theme);
    if (success) {
      setIsCopiedWeChat(true);
      setTimeout(() => setIsCopiedWeChat(false), 2500);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S / Cmd+S: Quick copy WeChat
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleQuickCopyWeChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme]);

  // Parse Markdown with theme
  const { html, wordCount, readingTimeMinutes } = useMemo(() => {
    return renderMarkdown(activeDraft.content, theme);
  }, [activeDraft.content, theme]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50 text-gray-900 select-text">
      {/* Top Navigation Bar */}
      <Navbar
        drafts={drafts}
        activeDraftId={activeDraftId}
        onSelectDraft={setActiveDraftId}
        onCreateDraft={handleCreateDraft}
        onDeleteDraft={handleDeleteDraft}
        onRenameDraft={handleRenameDraft}
        currentTheme={theme}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenZhuque={() => setIsZhuqueModalOpen(true)}
        onOpenPublish={() => setIsPublishModalOpen(true)}
        onQuickCopyWeChat={handleQuickCopyWeChat}
        targetPlatform={targetPlatform}
        onSelectPlatform={setTargetPlatform}
        isCopiedWeChat={isCopiedWeChat}
      />

      {/* Markdown Toolbar */}
      <Toolbar
        onInsertText={handleInsertText}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenZhuque={() => setIsZhuqueModalOpen(true)}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        onInsertComponent={handleInsertComponent}
        wordCount={wordCount}
        readingTimeMinutes={readingTimeMinutes}
      />

      {/* Split Workspace: Editor (Left) & Preview (Right) */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Editor */}
        <section className="flex-1 flex flex-col h-1/2 md:h-full border-r border-gray-200 overflow-hidden">
          <Editor
            value={activeDraft.content}
            onChange={handleContentChange}
            editorRef={editorRef}
          />
        </section>

        {/* Right: Live Themed Preview */}
        <section className="flex-1 flex flex-col h-1/2 md:h-full overflow-hidden">
          <Preview
            html={html}
            theme={theme}
            previewRef={previewRef}
            onThemeChange={handleUpdateTheme}
            onOpenPublishModal={() => setIsPublishModalOpen(true)}
            onOpenPosterModal={() => setIsPosterModalOpen(true)}
            onOpenZhuque={() => setIsZhuqueModalOpen(true)}
            targetPlatform={targetPlatform}
            onSelectPlatform={setTargetPlatform}
          />
        </section>
      </main>

      {/* Modals */}
      <ThemeSettingsModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={theme}
        onSelectTheme={handleSelectTheme}
        onUpdateTheme={handleUpdateTheme}
        onResetTheme={handleResetTheme}
      />

      <TemplateModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        content={activeDraft.content}
        onApplyResult={handleApplyAIResult}
      />

      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        previewRef={previewRef}
        markdown={activeDraft.content}
        html={html}
        theme={theme}
        onOpenPosterModal={() => setIsPosterModalOpen(true)}
      />

      <PosterModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        html={html}
        theme={theme}
      />

      <ZhuqueModal
        isOpen={isZhuqueModalOpen}
        onClose={() => setIsZhuqueModalOpen(false)}
        content={activeDraft.content}
        onApplyHumanized={(newContent) => handleContentChange(newContent)}
      />
    </div>
  );
}
