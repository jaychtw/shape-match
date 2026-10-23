# Shape Match

A bilingual geometric match-3 game: 15 handcrafted levels in three chapters and unlimited Free Play. G1 and G2 are approved. The production candidate is being prepared for final **G5 creative acceptance**. Dark mode is deferred from v1.0.

Play at **https://jaychtw.github.io/shape-match/**. See [production QA](docs/G4-QA.md) for candidate status, evidence and limits.

## Develop and verify

Node 24 (validated 24.19.0), npm; the unchanged pinned Match3 Core artifact is bundled in `vendor/`.

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npx playwright install chromium firefox webkit
npm run test:browser
npm run test:compat
npm run validate:levels
```

In this cloud machine, use `npm ci --cache /workspace/.npm-cache`. Chromium tests automatically use `/usr/bin/chromium`; `CHROMIUM_PATH` selects another executable. Firefox/WebKit tests require their matching Playwright browsers and system dependencies; hosted jobs use the official preinstalled image pinned by digest. Do not weaken HTTPS validation or change persistent trust stores to work around cloud proxy certificates. Live browser verification runs safely in hosted CI.

The existing checkout is `/workspace/shape-match`. Development uses port 5173 and production preview 4173, both under `/shape-match/`. Tests start their own preview; stop an existing service on that port for a clean run. Processes must restart in each task. `npm run validate:levels` reproduces engine-driven win/loss witnesses, including a bounded beam search when greedy search fails. This is feasibility evidence, not exhaustive solvability or human balance certification.

## Play

Click/tap two adjacent shapes, swipe/drag toward a neighbor, or use arrows to focus and Enter/Space to select. Escape clears selection. Large direction buttons offer another swap control. “Larger pieces” provides cells beyond 44px inside a horizontally bounded board with pan controls. Compact mode preserves the approved layout; physical-device accuracy remains unverified.

Puzzle Journey opens the chapter selector. Each victory unlocks the next level; completed levels may be replayed, failures retried freely. Free Play has unlimited moves and no score target. Mode switches retain separate exact sessions; choosing another level confirms replacement of an unfinished Journey. Restart requires confirmation. Home, settings and bilingual tutorials are available below the board; the brand also opens Home.

English/繁體中文 switching preserves the game. Language, motion, board size, mute, volume, effects and optional background melody persist locally. Audio starts after interaction; all cues also have visual feedback. Audio is original locally synthesized Web Audio; no external assets or service are needed.

The pinned engine owns every rule, score, move, objective and outcome. Ordered events drive animation; input is locked until exact engine/projection/DOM reconciliation succeeds. Full engine/RNG state is saved at stable turn boundaries. Free Play checkpoints diagnostic replay after 256 turns without resetting its board, score or RNG. Corrupt data requires explicit recovery, blocked storage is disclosed, and typed failures retain the last valid state with a downloadable reproduction record.

## Evidence and release

- [GDD](docs/design/GDD-v1.0.md), [UGDS](docs/design/UGDS-v1.0.0.md), [current authorization](docs/design/G3-G4-AUTHORIZATION.md)
- [Architecture and engine identity](docs/ARCHITECTURE.md)
- [Production QA](docs/G4-QA.md), [level evidence](docs/evidence/level-validation.json)
- [Historical G2 QA](docs/G2-QA.md), [G1 report](docs/QA.md); screenshots under `docs/evidence/`

Hosted CI runs frozen installation, TypeScript, unit/integration tests, build, Chromium gameplay and Firefox/WebKit compatibility tests. The manual Pages workflow repeats these checks, deploys `dist`, then verifies live asset hashes, actual desktop/touch gameplay, exact engine/DOM state, deterministic reload, Journey/Free Play navigation, all level tiles, language and audio preferences. Reports and screenshots are uploaded as artifacts.

For a local predeployment run of the same verification flow, set `SHAPE_MATCH_VERIFY_URL` to the local production preview URL. The report records its target; a local run does not establish public readiness. Hosted release verification uses the public URL by default.

Publication is authorized for G5 review: `gh workflow run pages.yml --ref main`. Verify exact-commit CI, deployment and live interaction separately. Reuse platform GitHub authentication and the configured API/Pages domains; never put credential values in source or chat.

**Stop at G5 for the user's explicit final acceptance.** Physical devices, manual Safari, screen readers and independent human balance/first-time-player review are not certified by automated tests.
