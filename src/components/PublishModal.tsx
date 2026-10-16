import React, { useState, useEffect } from 'react';
import { ArticleTheme } from '../types';
import {
  Share2,
  Copy,
  Check,
  Download,
  Printer,
  Smartphone,
  ExternalLink,
  Sparkles,
  FileText,
  FileCode,
  X,
  Github,
  GitBranch,
  KeyRound,
  Loader2,
  AlertCircle,
  FolderGit2,
} from 'lucide-react';
import { copyToWeChat, downloadMarkdown, downloadHtml } from '../utils/wechatInliner';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewRef: React.RefObject<HTMLDivElement | null>;
  markdown: string;
  html: string;
  theme: ArticleTheme;
  onOpenPosterModal: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  previewRef,
  markdown,
  html,
  theme,
  onOpenPosterModal,
}) => {
  const [copiedWeChat, setCopiedWeChat] = useState(false);
  const [copiedZhihu, setCopiedZhihu] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  // GitHub Settings
  const [showGithubForm, setShowGithubForm] = useState(false);
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('doocs_gh_token') || '');
  const [githubRepo, setGithubRepo] = useState(() => localStorage.getItem('doocs_gh_repo') || '');
  const [githubBranch, setGithubBranch] = useState(() => localStorage.getItem('doocs_gh_branch') || 'main');
  const [githubPath, setGithubPath] = useState('posts/article.md');
  const [githubMsg, setGithubMsg] = useState('docs: publish via Doocs MD');

  // GitHub Publishing State
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubSuccessUrl, setGithubSuccessUrl] = useState<string | null>(null);
  const [githubError, setGithubError] = useState<string | null>(null);

  // Gist state
  const [gistLoading, setGistLoading] = useState(false);
  const [gistUrl, setGistUrl] = useState<string | null>(null);

  useEffect(() => {
    if (githubToken) localStorage.setItem('doocs_gh_token', githubToken);
    if (githubRepo) localStorage.setItem('doocs_gh_repo', githubRepo);
    if (githubBranch) localStorage.setItem('doocs_gh_branch', githubBranch);
  }, [githubToken, githubRepo, githubBranch]);

  if (!isOpen) return null;

  const handleCopyWeChat = async () => {
    if (!previewRef.current) return;
    const success = await copyToWeChat(previewRef.current, theme);
    if (success) {
      setCopiedWeChat(true);
      setTimeout(() => setCopiedWeChat(false), 2500);
    }
  };

  const handleCopyZhihu = async () => {
    if (!previewRef.current) return;
    const success = await copyToWeChat(previewRef.current, theme);
    if (success) {
      setCopiedZhihu(true);
      setTimeout(() => setCopiedZhihu(false), 2500);
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  // Base64 helper supporting UTF-8 for Chinese characters
  const toBase64Utf8 = (str: string): string => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  // Push to GitHub Repository
  const handlePushToGithub = async () => {
    if (!githubToken.trim() || !githubRepo.trim() || !githubPath.trim()) {
      setGithubError('请先填写完整的 GitHub Token、仓库名 (owner/repo) 与文件路径');
      return;
    }

    setGithubLoading(true);
    setGithubError(null);
    setGithubSuccessUrl(null);

    const cleanRepo = githubRepo.trim().replace(/^https:\/\/github.com\//, '').replace(/\/$/, '');
    const cleanPath = githubPath.trim().replace(/^\//, '');

    try {
      // 1. Check if file already exists to get sha
      let existingSha: string | undefined;
      const getRes = await fetch(
        `https://api.github.com/repos/${cleanRepo}/contents/${cleanPath}?ref=${githubBranch}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken.trim()}`,
            Accept: 'application/vnd.github+json',
          },
        }
      );

      if (getRes.ok) {
        const fileData = await getRes.json();
        existingSha = fileData.sha;
      }

      // 2. Put file contents
      const bodyPayload: any = {
        message: githubMsg.trim() || 'docs: publish article via Doocs MD',
        content: toBase64Utf8(markdown),
        branch: githubBranch.trim() || 'main',
      };
      if (existingSha) {
        bodyPayload.sha = existingSha;
      }

      const putRes = await fetch(
        `https://api.github.com/repos/${cleanRepo}/contents/${cleanPath}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${githubToken.trim()}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyPayload),
        }
      );

      const putData = await putRes.json();
      if (!putRes.ok) {
        throw new Error(putData.message || 'GitHub 推送失败，请检查 Token 权限或仓库名称');
      }

      const commitHtmlUrl =
        putData.content?.html_url || `https://github.com/${cleanRepo}/blob/${githubBranch}/${cleanPath}`;
      setGithubSuccessUrl(commitHtmlUrl);
    } catch (err: any) {
      setGithubError(err.message || '网络连接或 GitHub 授权错误');
    } finally {
      setGithubLoading(false);
    }
  };

  // Publish to GitHub Gist
  const handlePublishGist = async () => {
    if (!githubToken.trim()) {
      setGithubError('发布 Gist 需要提供 GitHub Token (需要 gist 权限)');
      return;
    }

    setGistLoading(true);
    setGithubError(null);

    try {
      const filename = githubPath.split('/').pop() || 'article.md';
      const response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${githubToken.trim()}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: 'Published via Doocs MD Typesetter',
          public: true,
          files: {
            [filename]: {
              content: markdown,
            },
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || '创建 Gist 失败');
      }

      setGistUrl(data.html_url);
    } catch (err: any) {
      setGithubError(err.message || '创建 Gist 异常');
    } finally {
      setGistLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-white to-blue-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-xl text-white shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">一键发布与多平台分发中心</h2>
              <p className="text-xs text-gray-500">
                支持发布至微信公众号、知乎、小红书，以及一键推送到您的 GitHub 仓库与 Gist
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

        {/* Channels Grid */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {/* Main Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WeChat Card */}
            <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/30 flex flex-col justify-between relative shadow-xs">
              <span className="absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-full">
                微信首选
              </span>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    微
                  </div>
                  <h3 className="font-bold text-base text-gray-900">微信公众号</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  已自动将样式、字体、代码块 Mac 窗口与文末外链引用内联进 HTML，粘贴进微信公众号后台即刻发布。
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopyWeChat}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedWeChat ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedWeChat ? '已复制微信富文本！' : '一键复制到微信'}</span>
                </button>
                <a
                  href="https://mp.weixin.qq.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-300 transition-colors"
                  title="打开微信公众号后台"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Zhihu Card */}
            <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/30 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    知
                  </div>
                  <h3 className="font-bold text-base text-gray-900">知乎专栏 / 回答</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  优化了知乎富文本编辑器的段落行距与代码语法，一键复制富文本粘贴即用。
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopyZhihu}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedZhihu ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedZhihu ? '已复制知乎格式！' : '一键复制到知乎'}</span>
                </button>
                <a
                  href="https://www.zhihu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-700 hover:bg-blue-100 rounded-xl border border-blue-300 transition-colors"
                  title="打开知乎"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Xiaohongshu Poster */}
            <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/30 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    薯
                  </div>
                  <h3 className="font-bold text-base text-gray-900">小红书 · 高清长图</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  一键生成 3:4 比例超清长图海报，带精美渐变顶栏与作者水印，直接发小红书笔记。
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPosterModal();
                }}
                className="w-full py-2 px-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>生成并下载海报长图</span>
              </button>
            </div>

            {/* GitHub Sync & Commit Card */}
            <div className="p-5 rounded-2xl border-2 border-gray-900 bg-gray-900 text-white flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white text-gray-900 flex items-center justify-center font-bold text-xs shadow-xs">
                      <Github className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-base text-white">GitHub 仓库与 Gist</h3>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-gray-800 text-gray-300 border border-gray-700 rounded-full">
                    代码仓库同步
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  一键将 Markdown 文章 Commit 提交到你的 GitHub 个人博客仓库（如 Hugo/Hexo/Astro）或创建 Gist 分享。
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowGithubForm(!showGithubForm)}
                className="w-full py-2 px-3 bg-white hover:bg-gray-100 text-gray-900 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>{showGithubForm ? '收起 GitHub 设置' : '配置并发布到 GitHub'}</span>
              </button>
            </div>
          </div>

          {/* GitHub Configuration Drawer */}
          {showGithubForm && (
            <div className="p-5 bg-gray-50 border border-gray-300 rounded-2xl text-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-gray-900" />
                  <span className="font-bold text-sm text-gray-900">GitHub 仓库同步配置</span>
                </div>
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>获取 Personal Access Token (PAT)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {githubError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{githubError}</span>
                </div>
              )}

              {githubSuccessUrl && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">恭喜！已成功提交并推送到你的 GitHub 仓库！</span>
                  </div>
                  <a
                    href={githubSuccessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-emerald-600 text-white rounded-md font-bold flex items-center gap-1"
                  >
                    <span>在 GitHub 查看文件</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {gistUrl && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span className="font-bold">已成功创建 GitHub Gist 代码片段！</span>
                  </div>
                  <a
                    href={gistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-600 text-white rounded-md font-bold flex items-center gap-1"
                  >
                    <span>打开 Gist 页面</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    GitHub Token (PAT，需勾选 repo 权限)
                  </label>
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-none font-mono text-xs"
                  />
                  <span className="text-[11px] text-gray-400 mt-0.5 block">
                    仅保存在您的本地浏览器中，绝不上传第三方服务器
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    目标仓库 (格式：owner/repo)
                  </label>
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="例如：username/my-blog-posts"
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    存储路径 (文件相对路径)
                  </label>
                  <input
                    type="text"
                    value={githubPath}
                    onChange={(e) => setGithubPath(e.target.value)}
                    placeholder="例如：posts/2026-high-concurrency.md"
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    提交分支 (Branch) 与 提交信息 (Commit Msg)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={githubBranch}
                      onChange={(e) => setGithubBranch(e.target.value)}
                      placeholder="main"
                      className="w-24 bg-white border border-gray-300 rounded-lg p-2 outline-none font-mono text-xs"
                    />
                    <input
                      type="text"
                      value={githubMsg}
                      onChange={(e) => setGithubMsg(e.target.value)}
                      placeholder="提交信息"
                      className="flex-1 bg-white border border-gray-300 rounded-lg p-2 outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePublishGist}
                  disabled={gistLoading || githubLoading}
                  className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {gistLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitBranch className="w-4 h-4" />}
                  <span>发布为 GitHub Gist</span>
                </button>

                <button
                  type="button"
                  onClick={handlePushToGithub}
                  disabled={githubLoading || gistLoading}
                  className="px-5 py-2 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {githubLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
                  <span>立即 Commit 推送到 GitHub 仓库</span>
                </button>
              </div>
            </div>
          )}

          {/* Export File Options */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              本地离线导出
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => downloadMarkdown(markdown, 'doocs-article.md')}
                className="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2.5 text-xs font-medium text-gray-700 transition-colors text-left"
              >
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">下载 .md 文件</div>
                  <div className="text-[11px] text-gray-400">保留标准 Markdown</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => downloadHtml(html, 'doocs-article', theme)}
                className="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2.5 text-xs font-medium text-gray-700 transition-colors text-left"
              >
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">下载自包含 HTML</div>
                  <div className="text-[11px] text-gray-400">含完整内联样式</div>
                </div>
              </button>

              <button
                type="button"
                onClick={handlePrintPdf}
                className="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2.5 text-xs font-medium text-gray-700 transition-colors text-left"
              >
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">打印 / 导出 PDF</div>
                  <div className="text-[11px] text-gray-400">浏览器原生无损打印</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
