/**
 * opsConfig.js — module config for TR3SLOG Advanced Operations.
 * Extracted verbatim from "TR3SLOG Advanced Operations.dc.html".
 * Screen identifiers, roles and navigation are the product's routes and
 * permission rules — do not rename or remove entries.
 */

export const ROLES = ['super', 'exec', 'finance', 'ops', 'support', 'compliance', 'partner'];

export const NAV_ICONS = {
  tower: 'M12 3v18|M7 21l5-6 5 6|M6 7l6-3 6 3|M8 11h8',
  urgent: 'M12 3l9 16H3zM12 9v5M12 17v.1',
  drvinc: 'M5 3v18|M5 4h11l-2.5 3.5L16 11H5|M8 15h6M8 18h4',
  manual: 'circle:9,8,3.4|M3 20a6 6 0 0112 0|M15 12l2 2 4-4',
  batch: 'M4 6h12M4 12h12M4 18h12|M20 6v12',
  review: 'circle:11,11,6|M20 20l-4.5-4.5|M11 8v3l2 2',
  offers: 'circle:12,12,8|M12 8v4l3 2',
  addrchg: 'M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z|M9 10h6M13 8l2 2-2 2',
  notify: 'M6 16v-5a6 6 0 0112 0v5l2 2H4z|M10 20a2 2 0 004 0',
  manifest: 'M6 3h12v18H6z|M9 7h6M9 11h6M9 15h3|M15 15h2v2h-2z',
  breakdown: 'M3 7h11v9H3z|M14 10h4l3 3v3h-7|circle:7,18,1.8|circle:17,18,1.8',
  handover: 'M4 8h13l-3-3|M20 16H7l3 3',
  mantransfer: 'M5 4h9l4 4v12H5z|M14 4v4h4|M8 13h7l-2-2M15 17H8l2 2',
  pkgtrace: 'M4 8l8-4 8 4v8l-8 4-8-4z|M4 8l8 4 8-4|M12 12v8',
  vehrecovery: 'M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.5 2.5-2.5-2.5z',
  incost: 'M6 3h12v18l-3-2-3 2-3-2-3 2z|M9 8h6M9 12h6M9 16h3',
  routeopt: 'circle:6,6,2.4|circle:18,18,2.4|M8 6h6a4 4 0 010 8H9a3 3 0 000 6h6',
  forecast: 'M4 19V5M4 19h16|M7 15l4-5 3 3 4-6',
  capplan: 'M4 6h16v12H4z|M8 6v12M12 6v12M16 6v12',
  assign: 'M4 7h10M4 12h10M4 17h6|M17 9l3 3-3 3',
  exrules: 'M12 4l9 16H3z|M12 10v4M12 17v.1',
  tasks: 'M5 5h14v14H5z|M8.5 10l2 2 4-4M8.5 15.5h7',
  shifts: 'M4 6h16v14H4z|M4 10h16M8 4v4M16 4v4|M9 14h2M14 14h2'
};

// [type, data key, options]
export const PAGES = {
  tower: { roles: ['super', 'exec', 'ops', 'support'], blocks: [['stats', 'stats', { cols: 3 }], ['chips', 'filters'], ['table', 'issues'], ['table', 'priority'], ['panels', 'panels', { cols: 2 }], ['note', 'note']] },
  urgent: { roles: ['super', 'ops'], blocks: [['stats', 'stats', { cols: 3 }], ['chips', 'filters'], ['table', 'list'], ['note', 'note']] },
  drvinc: { roles: ['super', 'ops', 'support'], blocks: [['stats', 'stats', { cols: 4 }], ['chips', 'filters'], ['table', 'list'], ['panels', 'panels', { cols: 2 }], ['form', 'form'], ['note', 'note']] },
  manual: { roles: ['super', 'ops'], blocks: [['stats', 'stats', { cols: 4 }], ['chips', 'filters'], ['table', 'list'], ['table', 'drivers'], ['form', 'form'], ['note', 'note']] },
  batch: { roles: ['super', 'ops'], blocks: [['chips', 'filters'], ['table', 'list'], ['panels', 'panels', { cols: 2 }], ['steps', 'steps'], ['note', 'note']] },
  review: { roles: ['super', 'ops', 'compliance'], blocks: [['stats', 'stats', { cols: 3 }], ['chips', 'filters'], ['table', 'list'], ['panels', 'panels', { cols: 2 }], ['note', 'note']] },
  offers: { roles: ['super', 'ops', 'support'], blocks: [['stats', 'stats', { cols: 4 }], ['chips', 'filters'], ['table', 'list'], ['toggles', 'toggles'], ['note', 'note']] },
  addrchg: { roles: ['super', 'ops', 'support'], blocks: [['stats', 'stats', { cols: 3 }], ['chips', 'filters'], ['table', 'list'], ['panels', 'panels', { cols: 1 }], ['form', 'form'], ['note', 'note']] },
  notify: { roles: ['super', 'ops', 'support'], blocks: [['table', 'list'], ['toggles', 'toggles'], ['panels', 'panels', { cols: 1 }], ['note', 'note']] },
  manifest: { roles: ['super', 'ops'], blocks: [['stats', 'stats', { cols: 4 }], ['manifest', 'man'], ['steps', 'steps'], ['panels', 'panels', { cols: 2 }], ['table', 'versions'], ['note', 'note']] },
  breakdown: { roles: ['super', 'ops', 'support'], blocks: [['stats', 'stats', { cols: 3 }], ['chips', 'filters'], ['table', 'list'], ['panels', 'panels', { cols: 2 }], ['form', 'form'], ['note', 'note']] },
  handover: { roles: ['super', 'ops', 'support'], blocks: [['stats', 'stats', { cols: 4 }], ['chips', 'filters'], ['table', 'list'], ['steps', 'steps'], ['panels', 'panels', { cols: 2 }], ['note', 'note']] },
  mantransfer: { roles: ['super', 'ops'], blocks: [['stats', 'stats', { cols: 4 }], ['chips', 'filters'], ['table', 'list'], ['table', 'hist'], ['steps', 'steps'], ['panels', 'panels', { cols: 1 }], ['note', 'note']] },
  pkgtrace: { roles: ['super', 'ops', 'support', 'compliance'], blocks: [['chips', 'filters'], ['timeline', 'timeline'], ['panels', 'panels', { cols: 2 }], ['note', 'note']] },
  vehrecovery: { roles: ['super', 'ops'], blocks: [['stats', 'stats', { cols: 4 }], ['chips', 'filters'], ['table', 'list'], ['steps', 'steps'], ['panels', 'panels', { cols: 2 }], ['form', 'form'], ['table', 'hist'], ['note', 'note']] },
  incost: { roles: ['super', 'ops', 'finance'], blocks: [['stats', 'stats', { cols: 3 }], ['chips', 'filters'], ['table', 'list'], ['panels', 'panels', { cols: 1 }], ['form', 'form'], ['note', 'note']] },
  routeopt: { roles: ['super', 'ops'], blocks: [['optimizer', 'opt'], ['note', 'note']] },
  forecast: { roles: ['super', 'exec', 'ops', 'finance'], blocks: [['stats', 'stats', { cols: 4 }], ['chips', 'filters'], ['table', 'list'], ['panels', 'panels', { cols: 2 }], ['note', 'note']] },
  capplan: { roles: ['super', 'exec', 'ops'], blocks: [['stats', 'stats', { cols: 4 }], ['chips', 'filters'], ['table', 'list'], ['panels', 'panels', { cols: 2 }], ['note', 'note']] },
  assign: { roles: ['super', 'ops'], blocks: [['chips', 'filters'], ['table', 'list'], ['toggles', 'toggles'], ['table', 'hist'], ['note', 'note']] },
  exrules: { roles: ['super', 'ops', 'compliance'], blocks: [['chips', 'filters'], ['table', 'list'], ['toggles', 'toggles'], ['panels', 'panels', { cols: 1 }], ['note', 'note']] },
  tasks: { roles: ['super', 'ops', 'support', 'compliance', 'finance'], blocks: [['stats', 'stats', { cols: 4 }], ['chips', 'filters'], ['table', 'list'], ['form', 'form'], ['panels', 'panels', { cols: 1 }], ['note', 'note']] },
  shifts: { roles: ['super', 'ops'], blocks: [['stats', 'stats', { cols: 4 }], ['chips', 'filters'], ['table', 'list'], ['panels', 'panels', { cols: 2 }], ['steps', 'steps'], ['note', 'note']] }
};

export const NAV_GROUPS = [
  { key: 'control', keys: ['tower', 'urgent', 'drvinc', 'routeopt', 'forecast', 'capplan'] },
  { key: 'dispatch', keys: ['manual', 'batch', 'review', 'offers', 'manifest', 'addrchg', 'notify'] },
  { key: 'contingency', keys: ['breakdown', 'handover', 'mantransfer', 'pkgtrace', 'vehrecovery', 'incost'] },
  { key: 'automation', keys: ['assign', 'exrules', 'tasks', 'shifts'] }
];

const opsConfig = {
  pack: 'ops',
  badge: 'OP',
  roles: ROLES,
  pages: PAGES,
  navGroups: NAV_GROUPS,
  navIcons: NAV_ICONS,
  defaultRole: 'ops',
  defaultScreen: 'tower',
  defaultStage: { routeopt: 2, shifts: 1 },
  geo: null
};

export default opsConfig;
