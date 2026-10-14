// Parsing: turns "C E G" style text into pitch classes (0 = C ... 11 = B).
const BASE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function parseToken(token) {
  const m = /^([A-Ga-g])([#bB]?)$/.exec(token);
  if (!m) return null;
  // "b" after a letter is a flat; letters are case-insensitive
  let pc = BASE[m[1].toUpperCase()];
  if (m[2] === '#') pc += 1;
  else if (m[2]) pc -= 1;
  return (pc + 12) % 12;
}

export function parseNotes(input) {
  const tokens = String(input).trim().split(/\s+/).filter(Boolean);
  const invalid = [];
  const set = new Set();
  for (const t of tokens) {
    const pc = parseToken(t);
    if (pc === null) invalid.push(t);
    else set.add(pc);
  }
  return { tokens, invalid, pitchClasses: [...set].sort((a, b) => a - b) };
}
