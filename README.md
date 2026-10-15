# chordcreator

Client-side guitar fingering finder. Enter space-separated notes and get playable
fingerings with chord box diagrams.

## Run
No build step, no backend. It is a static site (`index.html` + `src/*.js`, all
relative paths), so it runs on any static host.

**GitHub Pages:** in the repo, go to Settings → Pages → Source: "GitHub Actions".
Pushes to `main` are deployed by `.github/workflows/pages.yml` to
`https://<user>.github.io/chordcreator/`.

**Azure Static Web Apps:** create an Azure Static Web App and add its deployment
token to the GitHub repository as the `AZURE_STATIC_WEB_APPS_API_TOKEN` Actions
secret (Settings → Secrets and variables → Actions). The existing
`.github/workflows/azure-static-web-apps.yml` workflow deploys the static site
when changes are pushed to `main`; pull requests get preview deployments, which
are closed when the pull request is closed. You can also run the workflow
manually from the Actions tab.

**Locally:** browsers block ES modules on `file://`, so opening `index.html`
directly will not work; use any static server:

    python3 -m http.server 8000   # then open http://localhost:8000

Tests (Node 18+): `npm test`

## Exact-match behavior
Standard tuning (E A D G B E), frets 0–12. A fingering is shown only if the set of
pitch classes it sounds is **exactly** the set you entered (duplicates and enharmonics
like `A#`/`Bb` are merged): no missing and no extra notes. Shapes are filtered by
heuristics (4-fret hand span, max 4 fingers with barre support, mutes only on outer
strings, at least 4 sounding strings) and ranked by lower max fret, smaller span,
fewer barres/fingers, then more open strings.

## Manual verification
- `C E G` → includes `x 3 2 0 1 0`
- `A C E` → includes `x 0 2 2 1 0`
- `D F# A` → includes `x x 0 2 3 2`
- `C H G` → error listing invalid token `H`

## Known limitations
Standard tuning only; no chord naming; at most 24 results shown; heuristics are approximate.
