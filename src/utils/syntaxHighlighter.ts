// Lightweight, fast, zero-dependency syntax highlighter for common tech languages

interface CodeToken {
  type: 'keyword' | 'string' | 'comment' | 'number' | 'function' | 'operator' | 'punctuation' | 'plain';
  text: string;
}

export function highlightCode(code: string, language: string = 'text', theme: string = 'github-dark'): string {
  const lang = (language || '').toLowerCase().trim();
  const escaped = escapeHtml(code);

  const isDark = theme !== 'github-light';
  
  // Theme color maps for inline styles
  const colors = isDark
    ? {
        bg: theme === 'dracula' ? '#282a36' : theme === 'monokai' ? '#272822' : '#1e1e24',
        text: '#f8f8f2',
        keyword: theme === 'dracula' ? '#ff79c6' : theme === 'monokai' ? '#f92672' : '#ff7b72',
        string: theme === 'dracula' ? '#f1fa8c' : theme === 'monokai' ? '#e6db74' : '#a5d6ff',
        comment: theme === 'dracula' ? '#6272a4' : theme === 'monokai' ? '#75715e' : '#8b949e',
        number: theme === 'dracula' ? '#bd93f9' : theme === 'monokai' ? '#ae81ff' : '#79c0ff',
        func: theme === 'dracula' ? '#50fa7b' : theme === 'monokai' ? '#a6e22e' : '#d2a8ff',
        operator: '#ff7b72',
      }
    : {
        bg: '#f6f8fa',
        text: '#24292f',
        keyword: '#cf222e',
        string: '#0a3069',
        comment: '#6e7781',
        number: '#0550ae',
        func: '#8250df',
        operator: '#cf222e',
      };

  // Process line by line with simple tokenization
  const lines = code.split('\n');
  const highlightedLines = lines.map((line) => {
    let html = escapeHtml(line);

    // Comments (// or #)
    if (html.trim().startsWith('//') || (lang === 'python' || lang === 'bash' || lang === 'yaml' ? html.trim().startsWith('#') : false)) {
      return `<span style="color: ${colors.comment}; font-style: italic;">${html}</span>`;
    }

    // Strings: "..." or '...' or `...`
    html = html.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, (match) => {
      return `<span style="color: ${colors.string};">${match}</span>`;
    });

    // Keywords (TypeScript, JS, Go, Python, Java, Rust)
    const keywords = /\b(const|let|var|function|return|import|export|from|default|class|extends|interface|type|async|await|if|else|for|while|try|catch|switch|case|break|continue|new|this|typeof|instanceof|def|public|private|protected|static|void|struct|package|func|select|insert|update|delete|where)\b/g;
    html = html.replace(keywords, (match) => {
      return `<span style="color: ${colors.keyword}; font-weight: 600;">${match}</span>`;
    });

    // Functions
    html = html.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, (match) => {
      return `<span style="color: ${colors.func};">${match}</span>`;
    });

    // Numbers
    html = html.replace(/\b(\d+(\.\d+)?)\b/g, (match) => {
      return `<span style="color: ${colors.number};">${match}</span>`;
    });

    return html;
  });

  return highlightedLines.join('\n');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
