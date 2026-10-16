import { marked } from 'marked';
import { ArticleTheme } from '../types';
import { highlightCode } from './syntaxHighlighter';

export interface RenderResult {
  html: string;
  wordCount: number;
  readingTimeMinutes: number;
  imageCount: number;
}

export function renderMarkdown(markdown: string, theme: ArticleTheme): RenderResult {
  const footnotes: { index: number; title: string; href: string }[] = [];
  let linkCounter = 0;
  let imageCounter = 0;

  // Custom marked renderer
  const renderer = new marked.Renderer();

  // Links -> Footnotes for WeChat
  renderer.link = ({ href, title, text }) => {
    if (theme.convertLinksToFootnotes && href && !href.startsWith('#')) {
      linkCounter++;
      footnotes.push({
        index: linkCounter,
        title: text || href,
        href,
      });
      return `<span style="color: ${theme.primaryColor}; font-weight: 500;">${text}</span><sup style="color: ${theme.primaryColor}; font-size: 11px; margin-left: 2px; font-weight: bold;">[${linkCounter}]</sup>`;
    }
    return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer" style="color: ${theme.primaryColor}; text-decoration: underline; text-underline-offset: 3px; font-weight: 500;">${text}</a>`;
  };

  // Image rendering
  renderer.image = ({ href, title, text }) => {
    imageCounter++;
    const caption = text || title;
    return `
      <figure style="margin: 1.8em auto; text-align: center; display: block; max-width: 100%;">
        <img src="${href}" alt="${text || ''}" style="display: block; max-width: 100%; height: auto; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);" />
        ${caption ? `<figcaption style="margin-top: 8px; font-size: 13px; color: #888; text-align: center;">${caption}</figcaption>` : ''}
      </figure>
    `;
  };

  // Code block rendering
  renderer.code = ({ text, lang }) => {
    const language = lang || 'text';
    const highlighted = highlightCode(text, language, theme.codeTheme);

    const isDark = theme.codeTheme !== 'github-light';
    const codeBg = isDark
      ? theme.codeTheme === 'dracula' ? '#282a36' : theme.codeTheme === 'monokai' ? '#272822' : '#1e1e24'
      : '#f6f8fa';
    const codeTextColor = isDark ? '#f8f8f2' : '#24292f';

    const macHeader = theme.macCodeHeader
      ? `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: ${isDark ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.05)'}; border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="display: inline-block; width: 11px; height: 11px; border-radius: 50%; background-color: #ff5f56;"></span>
          <span style="display: inline-block; width: 11px; height: 11px; border-radius: 50%; background-color: #ffbd2e;"></span>
          <span style="display: inline-block; width: 11px; height: 11px; border-radius: 50%; background-color: #27c93f;"></span>
        </div>
        <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; font-weight: 600; text-transform: uppercase; color: ${isDark ? '#8b949e' : '#6e7781'}; letter-spacing: 0.5px;">${language}</span>
      </div>
      `
      : '';

    // Line numbering
    let formattedCode = highlighted;
    if (theme.codeLineNumbers) {
      const lines = highlighted.split('\n');
      formattedCode = lines
        .map((line, idx) => {
          const lineNum = idx + 1;
          const numStyle = `color: ${isDark ? '#6e7681' : '#afb8c1'}; display: inline-block; width: 28px; text-align: right; margin-right: 14px; user-select: none; font-size: 12px;`;
          return `<span style="display: flex; line-height: 1.6;"><span style="${numStyle}">${lineNum}</span><span style="flex: 1;">${line || ' '}</span></span>`;
        })
        .join('');
    }

    return `
      <div class="code-block-wrapper" style="margin: 1.6em 0; border-radius: 8px; overflow: hidden; background: ${codeBg}; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
        ${macHeader}
        <pre style="margin: 0; padding: 14px 16px; overflow-x: auto; background: transparent; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13.5px; line-height: 1.6; color: ${codeTextColor};"><code style="font-family: inherit; font-size: inherit; background: transparent;">${formattedCode}</code></pre>
      </div>
    `;
  };

  // Blockquote rendering (detecting Callout hints)
  renderer.blockquote = ({ text }) => {
    let calloutBorder = theme.quoteBorder;
    let calloutBg = theme.quoteBg;
    let extraIcon = '';

    if (text.includes('💡') || text.includes('实用技巧') || text.includes('提示')) {
      calloutBorder = '#eab308';
      calloutBg = '#fefce8';
    } else if (text.includes('⚠️') || text.includes('避坑') || text.includes('注意')) {
      calloutBorder = '#f97316';
      calloutBg = '#fff7ed';
    } else if (text.includes('🚀') || text.includes('最佳实践')) {
      calloutBorder = '#10b981';
      calloutBg = '#ecfdf5';
    } else if (text.includes('📌') || text.includes('核心')) {
      calloutBorder = theme.primaryColor;
      calloutBg = theme.accentBg;
    } else if (text.includes('👤') || text.includes('作者')) {
      calloutBorder = '#6366f1';
      calloutBg = '#f5f3ff';
    } else if (text.includes('📢') || text.includes('写在最后')) {
      calloutBorder = theme.primaryColor;
      calloutBg = theme.secondaryColor;
    }

    return `
      <blockquote style="margin: 1.5em 0; padding: 14px 18px; border-left: 4.5px solid ${calloutBorder}; background-color: ${calloutBg}; border-radius: 0 8px 8px 0; color: #4b5563; font-size: 14.5px; line-height: 1.8;">
        ${text}
      </blockquote>
    `;
  };

  // Table rendering
  renderer.table = ({ header, rows }) => {
    return `
      <div style="margin: 1.6em 0; overflow-x: auto; width: 100%;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <thead style="background-color: ${theme.accentBg}; border-bottom: 2px solid ${theme.primaryColor}; color: #1f2937;">
            ${header}
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  };

  renderer.tablerow = ({ text }) => {
    return `<tr style="border-bottom: 1px solid #f3f4f6;">${text}</tr>`;
  };

  renderer.tablecell = ({ text, header, align }) => {
    const alignStyle = align ? `text-align: ${align};` : '';
    if (header) {
      return `<th style="padding: 10px 14px; font-weight: 600; color: #111827; ${alignStyle}">${text}</th>`;
    }
    return `<td style="padding: 10px 14px; color: #374151; ${alignStyle}">${text}</td>`;
  };

  // Headings
  renderer.heading = ({ text, depth }) => {
    if (depth === 1) {
      if (theme.headerStyle === 'badge') {
        return `
          <h1 style="margin: 1.8em 0 1em; text-align: center;">
            <span style="display: inline-block; padding: 8px 20px; background: ${theme.primaryColor}; color: #ffffff; border-radius: 30px; font-size: 20px; font-weight: bold; letter-spacing: 1px; box-shadow: 0 4px 12px ${theme.primaryColor}33;">${text}</span>
          </h1>
        `;
      }
      if (theme.headerStyle === 'gradient-pill') {
        return `
          <h1 style="margin: 1.8em 0 1em; padding: 12px 18px; background: linear-gradient(135deg, ${theme.primaryColor}15, ${theme.secondaryColor}); border-left: 6px solid ${theme.primaryColor}; border-radius: 4px; font-size: 22px; font-weight: 700; color: #111827; letter-spacing: 0.5px;">${text}</h1>
        `;
      }
      if (theme.headerStyle === 'bottom-line') {
        return `
          <h1 style="margin: 1.8em 0 1em; font-size: 22px; font-weight: bold; color: #111827; padding-bottom: 10px; border-bottom: 3px solid ${theme.primaryColor}; display: inline-block;">${text}</h1>
        `;
      }
      return `
        <h1 style="margin: 1.8em 0 1em; padding-left: 12px; border-left: 5px solid ${theme.primaryColor}; font-size: 22px; font-weight: 700; color: #111827;">${text}</h1>
      `;
    }

    if (depth === 2) {
      if (theme.h2Style === 'quote-bar') {
        return `
          <h2 style="margin: 2em 0 1em; display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 700; color: #1f2937;">
            <span style="display: inline-block; width: 4px; height: 18px; background-color: ${theme.primaryColor}; border-radius: 2px;"></span>
            <span>${text}</span>
          </h2>
        `;
      }
      if (theme.h2Style === 'accent-box') {
        return `
          <h2 style="margin: 2em 0 1em; padding: 6px 14px; background-color: ${theme.accentBg}; border-radius: 6px; display: inline-block; font-size: 17px; font-weight: 700; color: ${theme.primaryColor}; border-left: 4px solid ${theme.primaryColor};">${text}</h2>
        `;
      }
      if (theme.h2Style === 'circle-tag') {
        return `
          <h2 style="margin: 2em 0 1em; display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 700; color: #111827;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${theme.primaryColor};"></span>
            <span>${text}</span>
          </h2>
        `;
      }
      // underline
      return `
        <h2 style="margin: 2em 0 1em; font-size: 18px; font-weight: 700; color: #111827; padding-bottom: 6px; border-bottom: 2px solid ${theme.primaryColor}40;">
          <span style="border-bottom: 2px solid ${theme.primaryColor}; padding-bottom: 6px; display: inline-block;">${text}</span>
        </h2>
      `;
    }

    if (depth === 3) {
      return `
        <h3 style="margin: 1.6em 0 0.8em; font-size: 16px; font-weight: 600; color: #374151; display: flex; align-items: center; gap: 6px;">
          <span style="color: ${theme.primaryColor}; font-weight: bold;">›</span>
          <span>${text}</span>
        </h3>
      `;
    }

    return `<h${depth} style="margin: 1.4em 0 0.6em; font-size: 15px; font-weight: 600; color: #4b5563;">${text}</h${depth}>`;
  };

  // Horizontal Rule
  renderer.hr = () => {
    return `<hr style="margin: 2.2em auto; border: none; height: 1px; background: linear-gradient(to right, transparent, ${theme.primaryColor}55, transparent); width: 80%;" />`;
  };

  // List & List Item
  renderer.list = (token: any) => {
    const tag = token.ordered ? 'ol' : 'ul';
    const style = `margin: 1em 0; padding-left: 24px; color: #374151; font-size: ${theme.fontSize}px; line-height: ${theme.lineHeight};`;
    let body = '';
    if (token.items && Array.isArray(token.items)) {
      body = token.items.map((item: any) => renderer.listitem(item)).join('');
    } else if (token.body) {
      body = token.body;
    }
    return `<${tag} style="${style}">${body}</${tag}>`;
  };

  renderer.listitem = (item: any) => {
    const text = typeof item === 'object' && item !== null ? item.text || '' : item;
    return `<li style="margin: 0.4em 0;">${text}</li>`;
  };

  // Inline Code
  renderer.codespan = ({ text }) => {
    return `<code style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 88%; padding: 2.5px 6px; background-color: ${theme.accentBg}; color: ${theme.primaryColor}; border-radius: 4px; border: 1px solid ${theme.primaryColor}22; font-weight: 500;">${text}</code>`;
  };

  // Strong
  renderer.strong = ({ text }) => {
    return `<strong style="font-weight: 700; color: ${theme.primaryColor};">${text}</strong>`;
  };

  // Paragraph
  renderer.paragraph = ({ text }) => {
    return `<p style="margin: 1.25em 0; font-size: ${theme.fontSize}px; line-height: ${theme.lineHeight}; letter-spacing: ${theme.letterSpacing}px; color: #333333; text-align: justify; word-break: break-word;">${text}</p>`;
  };

  // Parse markdown
  let parsedHtml = marked.parse(markdown, { renderer, async: false }) as string;

  // Append Footnotes if enabled
  if (theme.convertLinksToFootnotes && footnotes.length > 0) {
    const footnotesHtml = `
      <section class="footnotes-section" style="margin-top: 3em; padding-top: 1.5em; border-top: 1px dashed #d1d5db;">
        <h4 style="font-size: 14px; font-weight: 600; color: #6b7280; margin-bottom: 12px; letter-spacing: 0.5px;">🔗 参考资料与外部链接</h4>
        <ul style="list-style: none; padding: 0; margin: 0; font-size: 12.5px; color: #6b7280; line-height: 1.8;">
          ${footnotes
            .map(
              (fn) => `
            <li style="margin-bottom: 6px; word-break: break-all;">
              <span style="font-weight: 600; color: ${theme.primaryColor}; margin-right: 6px;">[${fn.index}]</span>
              <span style="color: #374151;">${fn.title}:</span>
              <a href="${fn.href}" target="_blank" rel="noopener noreferrer" style="color: ${theme.primaryColor}; text-decoration: underline; margin-left: 4px;">${fn.href}</a>
            </li>
          `
            )
            .join('')}
        </ul>
      </section>
    `;
    parsedHtml += footnotesHtml;
  }

  // Word count & stats
  const cleanText = markdown.replace(/[#*`_\[\]()\-!>|]/g, '').trim();
  const wordCount = cleanText.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 400));

  return {
    html: parsedHtml,
    wordCount,
    readingTimeMinutes,
    imageCount: imageCounter,
  };
}
