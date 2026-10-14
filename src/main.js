import { parseNotes } from './parser.js';
import { findFingerings, formatFingering } from './theory.js';
import { renderResults } from './render.js';

const $ = (id) => document.getElementById(id);
const MAX_SHOWN = 24;

function run() {
  const msg = $('message'), out = $('results');
  out.replaceChildren();
  msg.textContent = '';
  const { tokens, invalid, pitchClasses } = parseNotes($('notes').value);
  if (!tokens.length) { msg.textContent = 'Please enter at least one note, e.g. C E G.'; return; }
  if (invalid.length) {
    msg.textContent = `Invalid note${invalid.length > 1 ? 's' : ''}: ${invalid.join(', ')}. Use A–G with optional # or b.`;
    return;
  }
  const results = findFingerings(pitchClasses);
  if (!results.length) {
    msg.textContent = 'No exact-match fingerings found. Try fewer notes or check for a typo; extra notes are never allowed.';
    return;
  }
  msg.textContent = `${results.length} exact-match fingering${results.length > 1 ? 's' : ''}` +
    (results.length > MAX_SHOWN ? ` (showing the ${MAX_SHOWN} easiest)` : '') + '.';
  renderResults(out, results.slice(0, MAX_SHOWN), formatFingering);
}

$('form').addEventListener('submit', (e) => { e.preventDefault(); run(); });
