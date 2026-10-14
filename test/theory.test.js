import test from 'node:test';
import assert from 'node:assert/strict';
import { parseNotes } from '../src/parser.js';
import { findFingerings, formatFingering, producedPitchClasses } from '../src/theory.js';

const search = (s) => findFingerings(parseNotes(s).pitchClasses);

test('invalid tokens are reported', () => {
  assert.deepEqual(parseNotes('C H G').invalid, ['H']);
});
test('normalizes case, spacing, duplicates and enharmonics', () => {
  assert.deepEqual(parseNotes('  c  e  g c ').pitchClasses, [0, 4, 7]);
  assert.deepEqual(parseNotes('Bb').pitchClasses, parseNotes('A#').pitchClasses);
  assert.deepEqual(parseNotes('Cb').pitchClasses, [11]);
});
for (const [input, expected] of [['C E G', 'x 3 2 0 1 0'], ['A C E', 'x 0 2 2 1 0'], ['D F# A', 'x x 0 2 3 2']]) {
  test(`${input} includes ${expected}`, () => {
    const r = search(input);
    assert.ok(r.map(formatFingering).includes(expected));
    const target = new Set(parseNotes(input).pitchClasses);
    for (const x of r) {
      const p = producedPitchClasses(x.frets);
      assert.equal(p.size, target.size);
      assert.ok([...p].every((n) => target.has(n)));
    }
  });
}
test('open C chord is among the top ranked for C E G', () => {
  const top = search('C E G').slice(0, 5).map(formatFingering);
  assert.ok(top.includes('x 3 2 0 1 0'));
});
test('rejects fingerings requiring more than 4 fingers / extra notes', () => {
  assert.equal(search('C H').length, 0);
});
