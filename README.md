# Shape Match

A bilingual geometric match-3 game. Current milestone: **G1 visual direction review**, not a playable game or an approved final art direction.

## Develop

Node.js 22+ (24 recommended), npm.

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

In the cloud environment, keep caches writable:

```sh
npm ci --cache /workspace/.npm-cache
npm run test:browser
```

Browser tests automatically use `/usr/bin/chromium` when present, or the Playwright-managed browser elsewhere. `CHROMIUM_PATH` overrides the executable. If a cloud machine has no system browser, install with `PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright npx playwright install chromium` and export that path when testing; browser download domains may need approval in environment settings.

The existing checkout is `/workspace/shape-match`; no worktree is needed. Vite uses `/shape-match/` for development and production so assets work under GitHub Pages. Browser tests start the production preview themselves. `npm run preview -- --port 4173 --strictPort` also starts it manually.

## Review the visual study

The 8×8 board, sample HUD, ordinary/special piece collections, English/繁體中文 toggle, sample selection and Match/Cascade/Special effect controls form the review scene. Arrow keys move sample focus; Enter selects. Touch/click selects. Selection does not submit a move. Effects are labeled choreography, not gameplay. The real immutable engine is bundled and creates the sample board; production game rules remain entirely in it.

Preferences persist locally; blocked/malformed preference storage falls back without crashing. No gameplay session/progression persistence or sound is implemented at this gate.

See [GDD](docs/design/GDD-v1.0.md), [handoff](docs/design/HANDOFF-v1.0.md), [architecture](docs/ARCHITECTURE.md), and [QA report](docs/QA.md). Screenshots are in `docs/evidence/`. Run the browser capture test to regenerate them from the production build.

## CI and deployment

`ci.yml` validates pushes/PRs and uploads browser failure diagnostics and screenshots. `pages.yml` is manual-only, runs all local checks, then deploys `dist` using GitHub Pages Actions. Once publication is authorized, push the branch, verify the exact commit's CI, enable Pages → GitHub Actions, and run the Pages workflow. Check the actual deployed `/shape-match/` URL and interactions before claiming a deployment works. Workflow configuration alone is not hosted evidence.

G1 approval is required before playable G2 work. G2 review precedes full production; final acceptance remains the user's.
