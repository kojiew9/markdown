export interface ArticleTheme {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentBg: string;
  headerStyle: 'left-border' | 'badge' | 'bottom-line' | 'gradient-pill' | 'minimal';
  h2Style: 'underline' | 'quote-bar' | 'circle-tag' | 'accent-box';
  quoteBorder: string;
  quoteBg: string;
  cardBg: string;
  codeTheme: 'github-dark' | 'github-light' | 'monokai' | 'dracula' | 'one-dark';
  fontFamily: 'sans' | 'serif' | 'mono';
  fontSize: number; // 14, 15, 16, 17
  lineHeight: number; // 1.6, 1.75, 1.85, 2.0
  letterSpacing: number; // 0, 0.5, 1
  macCodeHeader: boolean;
  codeLineNumbers: boolean;
  convertLinksToFootnotes: boolean;
}

export interface DocumentDraft {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  themeId?: string;
  tags?: string[];
}

export interface ArticleTemplate {
  id: string;
  title: string;
  category: 'wechat' | 'xiaohongshu' | 'tech' | 'resume' | 'notes';
  description: string;
  badge: string;
  iconName: string;
  defaultTheme: string;
  content: string;
}

export interface InsertableComponent {
  id: string;
  title: string;
  category: 'callout' | 'card' | 'decoration' | 'structure';
  preview: string;
  snippet: string;
}

export type TargetPlatform = 'wechat' | 'zhihu' | 'juejin' | 'xiaohongshu' | 'newsletter' | 'clean';
