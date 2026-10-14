# Requirements: Simple Guitar Fingering Finder Webpage

## 1. Goal
Build a simple webpage where a user enters space-separated musical notes, and the app returns **guitar fingerings that include those notes**.

## 2. Scope (MVP)
- Single-page web interface.
- One text input for notes.
- A button (or automatic trigger) to run analysis.
- Results area showing guitar fingerings.
- Basic validation and user-friendly error messages.

## 3. Input Requirements
### 3.1 Accepted format
- Notes are entered as **space-separated tokens**.
- Example: `C E G Bb`

### 3.2 Supported note symbols
- Natural notes: `A B C D E F G`
- Sharps: `#` form, e.g. `F#`, `C#`
- Flats: `b` form, e.g. `Bb`, `Eb`
- Case-insensitive input should be accepted (`c e g` == `C E G`).

### 3.3 Normalization
- Trim leading/trailing spaces.
- Collapse repeated spaces.
- Normalize enharmonic spellings to a canonical internal pitch class representation for matching.

### 3.4 Validation
- Reject invalid tokens (e.g. `H`, `R#`, `Cb#`).
- Show clear feedback listing invalid tokens.
- Do not run matching when input is fully invalid.

## 4. Functional Requirements
### 4.1 Parse Notes
- Read input and split by spaces.
- Convert tokens into internal pitch classes.
- Remove exact duplicates for matching logic, while optionally preserving original order for display.

### 4.2 Guitar Fingering Engine (Core MVP)
Given normalized notes, generate or retrieve candidate guitar fingerings and return those that satisfy the note constraints.

#### 4.2.1 What qualifies as a match
For each fingering candidate:
- Determine the set of pitch classes produced by fretted/open strings (ignoring muted strings).
- A candidate is a **valid match** when it **includes all user-entered notes**.
- Additional notes are allowed in MVP (superset matching).

#### 4.2.2 Fingering data per result
Each returned fingering should include:
- String-by-string positions (e.g. `x 3 2 0 1 0`)
- Muted/open/fretted status
- Optional suggested finger numbers (if available)
- Calculated pitch classes produced by that shape
- Optional root note / inferred chord label (secondary metadata only)

#### 4.2.3 Search/Generation constraints
- Support standard tuning (E A D G B E) in MVP.
- Restrict to practical fret range in MVP (e.g. frets 0–12).
- Filter out obviously unplayable shapes using simple heuristics:
  - Max fret span threshold
  - Limited simultaneous distinct frets
  - Optional barre detection limits

### 4.3 Result Ranking
Order results by practical playability:
1. Lower fret positions first
2. Lower fret span
3. Fewer difficult stretches/barres
4. Common/open-position shapes preferred when otherwise equal

### 4.4 Empty and Edge Cases
- Empty input: prompt user to enter notes.
- Single-note input: show playable positions including that note.
- Two-note input: show dyads/power-chord-like options where applicable.
- Large note sets: return best-effort results; if none, explain constraints.

## 5. Output/Display Requirements
- Show a clear “Fingerings” section.
- For each result, display:
  - Fingering pattern (e.g. `x 3 2 0 1 0`)
  - Notes produced by that fingering
  - Why it matches (input notes covered)
  - Optional inferred chord name (if confidently inferred)
- If no results, show a friendly “No matching fingerings found” message with suggestions.

## 6. Non-Functional Requirements
- Fast response for typical inputs (target: under 300ms on modern desktop for standard search bounds).
- Pure client-side operation for MVP (no backend required).
- Clean, mobile-friendly layout.
- Modular logic so tuning/range/ranking can be extended later.

## 7. User Stories
1. As a guitarist, I can type notes and get playable guitar fingerings that include all those notes.
2. As a beginner, I get clear feedback when I type invalid note names.
3. As a mobile user, I can enter notes and read fingering results without zooming or horizontal scrolling.

## 8. Acceptance Criteria (MVP)
- User can input space-separated notes and run search.
- App validates notes and reports invalid tokens.
- App returns at least one fingering for common note sets (e.g. `C E G`, `A C E`, `D F# A`) within configured search bounds.
- Every returned fingering includes all user-input notes.
- Results are readable, structured, and sorted by playability.
- Works on latest desktop Chrome/Firefox/Safari and mobile browser widths.

## 9. Out of Scope (for now)
- Audio playback.
- Alternate tunings (drop D, DADGAD, etc.).
- Left-handed mirroring.
- User accounts/saving presets.
- Advanced harmonic analysis.

## 10. Future Enhancements
- Interactive chord diagram rendering.
- Fretboard visualization of matched notes.
- Exact-match mode (no extra notes allowed).
- Tuning selection and capo support.
- Difficulty scoring customization.
- Export/share fingerings.
