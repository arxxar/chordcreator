// Theory/matching: exact-match fingering search in standard tuning.
import { NOTE_NAMES } from './parser.js';

export const TUNING = [4, 9, 2, 7, 11, 4]; // E A D G B E (low to high)
export const MAX_FRET = 12;
const WINDOW = 4; // max fret span a hand can cover (frets s..s+3)

// Fingering: array of 6 entries, -1 = muted, 0 = open, n = fret.
export function producedPitchClasses(f) {
  const s = new Set();
  f.forEach((fret, i) => { if (fret >= 0) s.add((TUNING[i] + fret) % 12); });
  return s;
}

// Mutes are only allowed on the outer strings (a muted string between played ones is awkward).
function mutesAreOuter(f) {
  const played = f.map((x, i) => (x >= 0 ? i : -1)).filter((i) => i >= 0);
  if (!played.length) return false;
  return f.slice(played[0], played[played.length - 1] + 1).every((x) => x >= 0);
}

// Returns { fingers, barre } or null if impossible with 4 fingers.
function handCost(f) {
  const fretted = f.map((x, i) => [x, i]).filter(([x]) => x > 0);
  if (!fretted.length) return { fingers: 0, barre: false };
  const min = Math.min(...fretted.map(([x]) => x));
  const barreStrings = fretted.filter(([x]) => x === min).map(([, i]) => i);
  let barre = false;
  let fingers = fretted.length;
  if (barreStrings.length >= 2) {
    const a = barreStrings[0], b = barreStrings[barreStrings.length - 1];
    // a barre needs every string it crosses to be fretted at or above it
    if (f.slice(a, b + 1).every((x) => x >= min)) {
      barre = true;
      fingers -= barreStrings.length - 1;
    }
  }
  return fingers <= 4 ? { fingers, barre } : null;
}

function describe(f) {
  const fretted = f.filter((x) => x > 0);
  const maxFret = fretted.length ? Math.max(...fretted) : 0;
  const minFret = fretted.length ? Math.min(...fretted) : 0;
  const cost = handCost(f);
  if (!cost) return null;
  return {
    frets: [...f],
    maxFret,
    minFret,
    span: maxFret - minFret,
    barre: cost.barre,
    fingers: cost.fingers,
    openCount: f.filter((x) => x === 0).length,
    notes: [...producedPitchClasses(f)].sort((a, b) => a - b).map((p) => NOTE_NAMES[p]),
  };
}

export function findFingerings(pitchClasses) {
  const target = new Set(pitchClasses);
  if (!target.size) return [];
  const seen = new Set();
  const results = [];
  // Enumerate each hand position (window start) with x / open / fretted-in-window per string.
  for (let start = 1; start <= MAX_FRET; start++) {
    const choices = [-1, 0];
    for (let fr = start; fr < start + WINDOW && fr <= MAX_FRET; fr++) choices.push(fr);
    const f = new Array(6);
    const rec = (i) => {
      if (i === 6) {
        const key = f.join(',');
        if (seen.has(key)) return;
        seen.add(key);
        const sounding = f.filter((x) => x >= 0).length;
        if (sounding < Math.max(4, target.size)) return;
        const produced = producedPitchClasses(f);
        if (produced.size !== target.size || ![...produced].every((p) => target.has(p))) return;
        if (!mutesAreOuter(f)) return;
        const r = describe(f);
        if (r) results.push(r);
        return;
      }
      for (const c of choices) {
        f[i] = c;
        // prune: a pitch outside the target can never be fixed later
        if (c >= 0 && !target.has((TUNING[i] + c) % 12)) continue;
        rec(i + 1);
      }
    };
    rec(0);
  }
  return results.sort(
    (a, b) =>
      a.maxFret - b.maxFret ||
      a.span - b.span ||
      Number(a.barre) - Number(b.barre) ||
      a.fingers - b.fingers ||
      b.openCount - a.openCount ||
      a.frets.join().localeCompare(b.frets.join())
  );
}

export const formatFingering = (f) => f.frets.map((x) => (x < 0 ? 'x' : x)).join(' ');
