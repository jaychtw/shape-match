# Shape Match

A bilingual geometric match-3 game. **G1 visual direction approved; G2 playable slice is awaiting creative review.** One representative level is playable; the full 15-level journey and Free Play remain gated G3 work. Dark mode is deferred from v1.0 by the creative director.

## Develop and verify

Node.js 24 (validated 24.19.0), npm. The immutable engine artifact is included in `vendor/`; no registry publication or new secret is needed.

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:browser
npm run validate:level
```

In this cloud machine, use `npm ci --cache /workspace/.npm-cache`; browser tests automatically use existing `/usr/bin/chromium`. Outside the snapshot, install Playwright Chromium as above. `CHROMIUM_PATH` selects another executable. A writable browser cache can be selected with `PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright` for both installation and tests. Browser tests start a production preview on port 4173 themselves; stop any existing service you started on that port before a clean test run.

Use the existing `/workspace/shape-match` checkout; no worktree is necessary. Both development and production use `/shape-match/` so GitHub Pages subpath assets work. `npm run preview -- --port 4173 --strictPort` serves a built bundle manually. Live processes must restart in each cloud task.

## Play the G2 slice

Reach 1,800 points in 18 moves on an engine-seeded 8×8 board. Tap/click two neighbors, drag or swipe a shape toward a neighbor, or use arrow keys to move focus and Enter/Space to select. Escape cancels selection. The large arrow controls swap the selected piece. “Larger pieces” provides 44px-plus cells with pan buttons on narrow devices; the compact board remains available.

Rules, specials, all ten combinations, scoring and outcomes come exclusively from the pinned Match3 Core. Resolution input stays locked until ordered animations finish and displayed identities/counters/objectives match the authoritative engine result. Restart requires confirmation. Victory/defeat offer replay.

English/繁體中文 switching preserves the active game. Reduced motion, language and board-size preferences persist locally. A complete engine state (including RNG), initial state and action trace are saved only at stable turn boundaries; reload restores exact deterministic continuation. Corrupt saves offer explicit backup/new-session recovery, and blocked storage is disclosed. Unexpected engine failures preserve the last valid session and offer a nonpersonal JSON diagnostic download.

## References and evidence

- [GDD](docs/design/GDD-v1.0.md), [original handoff](docs/design/HANDOFF-v1.0.md), [G2 authorization](docs/design/G2-AUTHORIZATION.md)
- [Architecture and immutable engine identity](docs/ARCHITECTURE.md)
- [G2 QA/limitations](docs/G2-QA.md); [historical G1 report](docs/QA.md)
- `docs/evidence/g2-*.png`: actual browser screenshots; `g2-level-validation.json`: deterministic win/loss witnesses. Browser tests regenerate images; `npm run validate:level` regenerates the route record.

## CI and deployment

CI runs frozen installation, TypeScript, unit/integration tests, production build and actual Chromium gameplay tests on pushes/PRs. It uploads traces, failure reports and screenshots. The manual Pages workflow repeats checks, uploads `dist`, then deploys through GitHub Pages Actions.

G2 publication is explicitly authorized. After pushing the candidate and verifying CI, run `gh workflow run pages.yml --ref main` (or the workflow's Run control). Verify the deployment run and the actual `https://jaychtw.github.io/shape-match/` build and gameplay before claiming it works. API/Pages access may require the environment's allowed domains `api.github.com` and `jaychtw.github.io`; reuse platform authentication, never paste tokens in files or chat.

**Stop for explicit G2 approval before G3.** No final product acceptance, physical-device certification or completed 15-level game is claimed.
