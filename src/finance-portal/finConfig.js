/**
 * finConfig.js — module config for TR3SLOG Finance and Claims.
 * Extracted from "TR3SLOG Finance and Claims.dc.html".
 */

export const ROLES = ['super', 'finance', 'support', 'compliance', 'ops'];

export const NAV_ICONS = {
  fin: 'M4 19V5M4 19h16M9 16V9M13 16v-4M17 16v-7',
  tx: 'M3 7h18v10H3zM3 11h18|M7 15h4',
  refunds: 'M4 12a8 8 0 1114 5|M4 12V7M4 12h5',
  recon: 'M4 6h7v12H4zM13 6h7v12h-7|M8 12h8',
  finrep: 'M6 3h9l4 4v14H6zM15 3v4h4|M9 13h7M9 17h5',
  claims: 'M12 3l8 4v6c0 5-3.4 7.6-8 8-4.6-.4-8-3-8-8V7z|M9.5 12.5l2 2 3.5-4'
};

export const PAGES = {
  fin: { roles: ['super', 'finance'], sensitive: true, blocks: [['stats', 'stats', { cols: 3 }], ['chips', 'filters'], ['table', 'svc'], ['table', 'track'], ['table', 'mkt'], ['table', 'fails'], ['note', 'note']] },
  tx: { roles: ['super', 'finance', 'support'], sensitive: true, blocks: [['stats', 'stats', { cols: 4 }], ['chips', 'filters'], ['table', 'list'], ['note', 'note']] },
  refunds: { roles: ['super', 'finance'], sensitive: true, blocks: [['stats', 'stats', { cols: 4 }], ['form', 'form'], ['panels', 'panels', { cols: 2 }], ['steps', 'steps'], ['table', 'hist'], ['note', 'note']] },
  recon: { roles: ['super', 'finance'], sensitive: true, blocks: [['stats', 'stats', { cols: 4 }], ['chips', 'filters'], ['table', 'diff'], ['panels', 'panels', { cols: 2 }], ['steps', 'closure'], ['note', 'note']] },
  finrep: { roles: ['super', 'finance'], sensitive: true, blocks: [['chips', 'filters'], ['cards', 'cards'], ['note', 'note']] },
  claims: { roles: ['super', 'support', 'compliance', 'ops', 'finance'], blocks: [['stats', 'stats', { cols: 5 }], ['chips', 'filters'], ['table', 'list'], ['note', 'note']] }
};

export const NAV_GROUPS = [
  { key: 'finance', keys: ['fin', 'tx', 'refunds', 'recon', 'finrep'] },
  { key: 'claims', keys: ['claims'] }
];

const finConfig = {
  pack: 'fin',
  badge: 'FC',
  roles: ROLES,
  pages: PAGES,
  navGroups: NAV_GROUPS,
  navIcons: NAV_ICONS,
  defaultRole: 'finance',
  defaultScreen: 'fin',
  defaultStage: { refunds: 1 },
  geo: null
};

export default finConfig;
