/**
 * tokens.js — TR3SLOG visual tokens (React export)
 * Single source of truth for the React modules. Do not add colors here that are
 * not part of the brand system.
 */

export const C = {
  navy: '#001B45',
  blue: '#087CF0',
  blueDark: '#0768C9',
  blueLight: '#7FBBFA',
  gold: '#D99A00',
  goldText: '#8A6300',
  green: '#137A45',
  greenText: '#0F5F36',
  red: '#A93226',
  white: '#FFFFFF',
  bg: '#EEF4FC',
  border: '#DCE6F5',
  divider: '#E3EBF7',
  text: '#10233F',
  textSecondary: '#6C82A6',
  textMuted: '#8B9DBA'
};

export const RADIUS = { sm: 8, md: 12, lg: 18 };
export const SPACE = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32 };

export const FONT_HEAD = `Montserrat,'Noto Sans SC',sans-serif`;
export const FONT_BODY = `Inter,'Noto Sans SC',system-ui,sans-serif`;
export const FONT_MONO = `ui-monospace,SFMono-Regular,Menlo,monospace`;

export const TONE = {
  ok: { bg: 'rgba(19,122,69,.12)', fg: C.greenText },
  warn: { bg: 'rgba(217,154,0,.16)', fg: C.goldText },
  bad: { bg: 'rgba(192,57,43,.1)', fg: C.red },
  info: { bg: 'rgba(8,124,240,.1)', fg: C.blueDark },
  neutral: { bg: C.bg, fg: C.text }
};

export const card = { background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' };
export const sectionTitle = { fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase' };
export const ghostBtn = { padding: '9px 14px', border: `1.5px solid ${C.border}`, borderRadius: 9, background: C.white, color: C.blueDark, fontSize: 12, fontWeight: 600, cursor: 'pointer', font: 'inherit' };
export const primaryBtn = { padding: '14px 22px', border: 'none', borderRadius: 11, background: C.blue, color: C.white, fontSize: 14, fontWeight: 600, cursor: 'pointer', font: 'inherit' };
export const outlineBtn = { ...primaryBtn, background: C.white, border: `1.5px solid ${C.border}`, color: C.text };

export const PILL_HDR = { es: 'Estado', en: 'Status', 'zh-CN': '状态' };
export const VIEW_STATES = ['data', 'loading', 'empty', 'error', 'offline'];
export const LANGS = ['en', 'es', 'zh-CN'];
export const LANG_STORE = 'tr3slog.lang';
