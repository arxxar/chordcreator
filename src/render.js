// Rendering: SVG chord box diagrams and result list.
const NS = 'http://www.w3.org/2000/svg';
const el = (name, attrs, text) => {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text !== undefined) e.textContent = text;
  return e;
};

export function chordBox(frets) {
  const gx = 12, gy = 30, sw = 18, fh = 20, rows = 5;
  const played = frets.filter((x) => x > 0);
  const base = played.length && Math.max(...played) > 5 ? Math.min(...played) : 1;
  const svg = el('svg', { viewBox: '0 0 130 150', width: 130, height: 150, role: 'img',
    'aria-label': 'Chord box: ' + frets.map((x) => (x < 0 ? 'x' : x)).join(' ') });
  for (let r = 0; r <= rows; r++) {
    const bold = r === 0 && base === 1;
    svg.append(el('line', { x1: gx, x2: gx + 5 * sw, y1: gy + r * fh, y2: gy + r * fh,
      stroke: '#222', 'stroke-width': bold ? 4 : 1 }));
  }
  for (let s = 0; s < 6; s++) {
    svg.append(el('line', { x1: gx + s * sw, x2: gx + s * sw, y1: gy, y2: gy + rows * fh, stroke: '#222' }));
  }
  if (base > 1) svg.append(el('text', { x: gx + 5 * sw + 6, y: gy + fh * 0.7, 'font-size': 11 }, base + 'fr'));
  frets.forEach((fr, s) => {
    const x = gx + s * sw;
    if (fr < 0) svg.append(el('text', { x, y: gy - 8, 'text-anchor': 'middle', 'font-size': 13 }, '×'));
    else if (fr === 0) svg.append(el('circle', { cx: x, cy: gy - 11, r: 5, fill: 'none', stroke: '#222' }));
    else svg.append(el('circle', { cx: x, cy: gy + (fr - base + 0.5) * fh, r: 7, fill: '#222' }));
  });
  return svg;
}

export function renderResults(container, results, formatFn) {
  container.replaceChildren();
  for (const r of results) {
    const card = document.createElement('article');
    card.className = 'card';
    const info = document.createElement('div');
    const code = document.createElement('code');
    code.textContent = formatFn(r);
    const notes = document.createElement('p');
    notes.textContent = 'Notes: ' + r.notes.join(' ') + (r.barre ? ' (barre)' : '');
    info.append(code, notes);
    card.append(chordBox(r.frets), info);
    container.append(card);
  }
}
