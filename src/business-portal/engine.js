/**
 * engine.js — client-side behaviour shared by the TR3SLOG blocks.
 *
 * Everything here works without a backend and without pretending otherwise:
 * chips filter the rows in memory, exports produce real files, form records are
 * kept in localStorage, and a scan is looked up against the codes the module
 * actually declares. Swap these helpers for API calls when the services exist.
 */

export const LANG_STORE = 'tr3slog.lang';

export const norm = v => String(v == null ? '' : v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const slug = text =>
  String(text || 'tr3slog').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 48) || 'tr3slog';

export const rowText = r => norm(`${(r.c || []).join(' ')} ${r.pill || ''}`);

/** True when a row belongs to a chip: its status first, then any field. */
export function matchesTerm(r, term) {
  if (!term) return true;
  const t = norm(term);
  const pill = norm(r.pill);
  if (pill && (pill === t || pill.indexOf(t) >= 0 || t.indexOf(pill) >= 0)) return true;
  return norm((r.c || []).join(' ')).indexOf(t) >= 0;
}

/** Chip term + header query + rows the user removed, applied for real. */
export function filterRows(rows = [], { term = '', query = '', dropped = {} } = {}) {
  const q = norm(String(query).trim());
  return rows.filter((r, i) => {
    if (dropped[i]) return false;
    if (q && rowText(r).indexOf(q) < 0) return false;
    return matchesTerm(r, term);
  });
}

/** How many rows on a screen a chip would show — printed on the chip. */
export function chipCount(page = {}, { term = '', query = '', dropped = {} } = {}) {
  const q = norm(String(query).trim());
  let n = 0;
  Object.keys(page).forEach(bk => {
    const blk = page[bk];
    if (!blk || !blk.rows) return;
    blk.rows.forEach((r, i) => {
      if (dropped[i]) return;
      if (q && rowText(r).indexOf(q) < 0) return;
      if (matchesTerm(r, term)) n++;
    });
  });
  return n;
}

/** Every code the module knows about, for a real scan lookup. */
export function knownCodes(pack = {}) {
  const out = {};
  Object.keys(pack).forEach(sk => {
    const page = pack[sk];
    if (!page || typeof page !== 'object') return;
    Object.keys(page).forEach(bk => {
      const blk = page[bk];
      if (!blk || !blk.rows) return;
      blk.rows.forEach(r => {
        const c = (r.c || [])[0];
        if (c) out[String(c).trim().toUpperCase()] = true;
      });
    });
    (page.recent || []).forEach(s => { if (s.code) out[String(s.code).trim().toUpperCase()] = true; });
  });
  return out;
}

export function loadStore(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch (e) { return fallback; }
}

export function saveStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
}

export function downloadBlob(name, mime, text) {
  try {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch (e) { return false; }
}

const DOWNLOADED = { en: 'file downloaded', es: 'archivo descargado', 'zh-CN': '文件已下载' };
const POPUPS = { en: 'allow pop-ups to print', es: 'permita ventanas emergentes para imprimir', 'zh-CN': '请允许弹出窗口以打印' };

/** Real .csv file — opens in Excel. */
export function exportCsv({ title, cols = [], rows = [], lang = 'es', toast }) {
  const esc = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
  const lines = [cols.map(esc).join(',')].concat(
    rows.map(r => (r.c || []).concat(r.pill ? [r.pill] : []).map(esc).join(','))
  );
  const ok = downloadBlob(`${slug(title)}.csv`, 'text/csv;charset=utf-8', `\ufeff${lines.join('\r\n')}`);
  if (toast) toast(`${title} · CSV · ${ok ? (DOWNLOADED[lang] || DOWNLOADED.es) : 'error'}`);
}

/** Real printable document -> the browser's Save as PDF. */
export function exportPdf({ title, cols = [], rows = [], lang = 'es', toast }) {
  const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const head = cols.map(c => `<th>${esc(c)}</th>`).join('');
  const body = rows.map(r => `<tr>${(r.c || []).concat(r.pill ? [r.pill] : []).map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('');
  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>
@page{size:landscape;margin:14mm}body{font:12px Inter,system-ui,sans-serif;color:#10233F;margin:0}
h1{font-family:Montserrat,sans-serif;font-size:18px;color:#001B45;margin:0 0 4px}
.m{font-size:11px;color:#6C82A6;margin-bottom:14px}.bar{display:flex;gap:4px;margin-bottom:10px}
.bar i{display:block;width:26px;height:5px;background:#D99A00;transform:skewX(-24deg)}
.bar i+i{width:10px;background:#087CF0}
table{width:100%;border-collapse:collapse}
th{text-align:left;background:#EEF4FC;color:#6C82A6;font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding:8px 10px;border-bottom:1px solid #DCE6F5}
td{padding:8px 10px;border-top:1px solid #E3EBF7;font-size:11px}tr:nth-child(even) td{background:#FAFCFF}
</style></head><body><div class="bar"><i></i><i></i></div><h1>${esc(title)}</h1>
<div class="m">TR3SLOG · ${stamp} · ${rows.length} — Demo Data</div>
<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></body></html>`;
  const w = window.open('', '_blank');
  if (!w) { if (toast) toast(`${title} · PDF · ${POPUPS[lang] || POPUPS.es}`); return; }
  w.document.write(doc);
  w.document.close();
  setTimeout(() => { try { w.focus(); w.print(); } catch (e) { /* blocked */ } }, 350);
}

export const stampMinute = () => new Date().toISOString().slice(0, 16).replace('T', ' ');
export const stampClock = () => new Date().toTimeString().slice(0, 5);
