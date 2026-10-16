import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { ArticleTheme } from '../types';

export async function copyToWeChat(element: HTMLElement, theme: ArticleTheme): Promise<boolean> {
  try {
    // Clone element to avoid mutating original DOM
    const clone = element.cloneNode(true) as HTMLElement;

    // Wrap with WeChat safe outer container
    const wrapper = document.createElement('div');
    wrapper.setAttribute(
      'style',
      `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size: ${theme.fontSize}px; line-height: ${theme.lineHeight}; color: #333333; letter-spacing: ${theme.letterSpacing}px; word-break: break-word;`
    );

    wrapper.appendChild(clone);

    const fullHtml = wrapper.innerHTML;
    const plainText = element.innerText;

    // Modern Clipboard API with text/html and text/plain
    const blobHtml = new Blob([fullHtml], { type: 'text/html' });
    const blobText = new Blob([plainText], { type: 'text/plain' });

    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText,
      }),
    ]);

    // Fire celebration confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    return true;
  } catch (err) {
    console.warn('ClipboardItem failed, falling back to selection copy:', err);
    try {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand('copy');
      selection?.removeAllRanges();
      return true;
    } catch (fallbackErr) {
      console.error('Copy failed completely:', fallbackErr);
      return false;
    }
  }
}

export function downloadMarkdown(content: string, filename: string = 'article.md') {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadHtml(htmlContent: string, title: string = 'article', theme: ArticleTheme) {
  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      max-width: 820px;
      margin: 40px auto;
      padding: 0 20px;
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
      font-size: ${theme.fontSize}px;
      line-height: ${theme.lineHeight};
      color: #333;
      background-color: #ffffff;
    }
    img { max-width: 100%; border-radius: 8px; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/[\/\\?%*:|"<>]/g, '_')}.html`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportAsPosterImage(
  element: HTMLElement,
  title: string = 'article-poster'
): Promise<string | null> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution for Retina displays
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${title.replace(/[\/\\?%*:|"<>]/g, '_')}-poster.png`;
    link.click();
    return dataUrl;
  } catch (err) {
    console.error('Export poster failed:', err);
    return null;
  }
}
