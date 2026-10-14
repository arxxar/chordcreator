# Requirements: Simple Guitar Note Finder Webpage

## 1. Goal
Build a simple webpage where a user enters space-separated musical notes, and the app returns useful **guitar-related findings** based on those notes.

## 2. Scope (MVP)
- Single-page web interface.
- One text input for notes.
- A button (or automatic trigger) to run analysis.
- Results area showing guitar-related matches.
- Basic validation and user-friendly error messages.

## 3. Input Requirements
### 3.1 Accepted format
- Notes are entered as **space-separated tokens**.
- Example: `C D E F# G A B`

### 3.2 Supported note symbols
- Natural notes: `A B C D E F G`
- Sharps: `#` form, e.g. `F#`, `C#`
- Flats: `b` form, e.g. `Bb`, `Eb`
- Case-insensitive input should be accepted (`c d e` == `C D E`).

### 3.3 Normalization
- Trim leading/trailing spaces.
- Collapse repeated spaces.
- Normalize note names to a canonical format for processing.

### 3.4 Validation
- Reject invalid tokens (e.g. `H`, `R#`, `Cb#`).
- Show clear feedback listing invalid tokens.
- Do not run matching when input is fully invalid.

## 4. Functional Requirements
### 4.1 Parse Notes
- Read input and split by spaces.
- Convert tokens into internal pitch classes.
- Remove exact duplicates for matching logic, while optionally preserving original order for display.

### 4.2 Guitar Findings Engine
Given normalized notes, return relevant guitar findings, including:

1. **Possible chord names**
   - Identify likely chord qualities (major, minor, 7, maj7, sus, etc.) where possible.
   - Support multiple candidate matches when ambiguous.

2. **Playable guitar chord shapes (when available)**
   - For matched chords, provide one or more playable voicings/fingerings.
   - Include basic metadata per shape:
     - Fret positions
     - Muted/open strings
     - Optional finger numbers

3. **Related scale hints (optional in MVP, required in next phase)**
   - Suggest compatible scales/modes for the entered note set.

### 4.3 Ranking/Ordering of Findings
- Results should be ordered by practical usefulness for guitar players.
- Prefer common chord interpretations and common playable shapes first.

### 4.4 Empty and Edge Cases
- Empty input: prompt user to enter notes.
- Single note or two-note input: return meaningful guitar context (interval/power-chord hint if applicable).
- Large note sets: still return best-effort findings.

## 5. Output/Display Requirements
- Show a clear “Findings” section.
- For each finding, display:
  - Name (e.g. `Cmaj7`)
  - Why it matches (the matched notes)
  - Guitar shape summary (if available)
- If no findings, show a friendly “No matches found” message with suggestions.

## 6. Non-Functional Requirements
- Fast response for normal inputs (target: under 200ms on modern desktop for typical note sets).
- Pure client-side operation for MVP (no backend required).
- Clean, mobile-friendly layout.
- Code structure should allow replacing or upgrading matching logic later.

## 7. User Stories
1. As a guitarist, I can type `C E G` and quickly see likely chord matches and playable shapes.
2. As a beginner, I get clear error messages when I type invalid note names.
3. As a mobile user, I can enter notes and read results without zooming or horizontal scrolling.

## 8. Acceptance Criteria (MVP)
- User can input space-separated notes and run search.
- App validates notes and reports invalid tokens.
- App returns at least one guitar-relevant finding for common triads (e.g. C E G, A C E, D F# A).
- Results are readable and structured.
- Works on latest desktop Chrome/Firefox/Safari and mobile browser widths.

## 9. Out of Scope (for now)
- Audio playback.
- Full fretboard visualization.
- User accounts/saving presets.
- Advanced reharmonization analysis.

## 10. Future Enhancements
- Interactive chord diagram rendering.
- Fretboard note map highlighting.
- Tuning selection (E standard, drop D, etc.).
- Left-handed display mode.
- Export/share findings.
