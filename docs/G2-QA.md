# G2 playable slice — verification and review record

Date: 2026-10-24 (Asia/Taipei). G1 approved at `3c9ae1bd5128fcd42f14210c87e4d4cd414c08ce`. G2 is a candidate for explicit creative-director review; G3 is not authorized.

## Implementation and reproducibility

One complete level, `g2-bright-beginning`, uses seed `shape-match-g2-bright`, 8×8, six shapes, 18 moves and a 1,800-point objective. The structured definition is `src/level.ts`. Match3 Core 1.0.0 remains the unchanged independently reproduced package from source `9863f8e023a227540a58491282e87d9f11a0cf79`; SHA-256 remains `9513ff12d24ff8b139b593167083ea3dc7390ae17690f495ee4c80de53e5a853`. Lockfile and artifact integrity tests pin it.

Local environment: Node 24.19.0, npm 11.9.0, Debian Chromium 154.0.8037.57 driven by Playwright 1.58.2. Node 24 is now the application prerequisite for native TypeScript test imports; the engine's independent minimum remains Node 22. Build/runtime assets remain self-contained. No theme switcher, analytics, accounts, paid service, new engine rules or engine source patch.

## Final local checks

| Check | Outcome | Evidence |
| --- | --- | --- |
| Frozen install | Pass | `npm ci --cache /workspace/.npm-cache` |
| TypeScript + production build | Pass | `npm run build` (strict `tsc --noEmit`, then Vite); Pages `/shape-match/` asset base |
| Unit/integration tests | 36 passed; 0 failed/skipped | `npm test` |
| Chromium browser tests | 32 passed; 0 failed/skipped | `npm run test:browser` |
| Level feasibility record | Pass, heuristic witnesses | `npm run validate:level`, `docs/evidence/g2-level-validation.json` |

These are local results. Hosted CI, Pages deployment and actual live interaction are separately verified/reported with the release SHA in the task handoff. Workflow files by themselves are not evidence of those outcomes.

## What the tests establish

- **All ten special pairs** exercise the real engine, controller, ordered event projection and final equality in both integration and browser tests: H/H, H/V, V/V, H/bomb, V/bomb, bomb/bomb, color/H, color/V, color/bomb, color/color. Converted pieces are exercised by color/typed-special combinations. Fixtures are validated authored initial states using the engine loader, not copied resolution code or fabricated successful outcomes.
- Four real special-creation scenarios (horizontal, vertical, bomb, color) pass integration and browser tests. Ordinary/special activation of each category passes integration tests. Protected/overlapping effect targets are not removed until authoritative `eliminated` events.
- **600 committed simulated turns across 20 deterministic seeds** reconcile after every turn. The observed stream includes ordinary matches, special creation/activation, cascades, elimination, gravity, refill, scoring and objectives. This bounded stress run encountered no unexpected engine error. It is not a proof of absence of bugs.
- Complete actual-browser winning and losing playthroughs use engine simulations to choose moves; outcomes survive reload and offer replay. The retained feasibility witnesses win in **8 moves / 2,000 points**, or lose after **18 moves / 540 points**. These are deterministic witnesses, not an exhaustive solvability proof or a human enjoyment/difficulty assessment.
- Invalid swaps retain board, score, moves and RNG, and show a return animation. Duplicate submissions are locked during the entire event sequence. A normal-motion combination, creation sequence, cascades and ordinary moves reach exact reconciliation before the next turn is accepted. Long sequences use shorter animation timings without dropping events.
- Roving keyboard focus, Enter/Space selection, mouse dragging, tap controls, actual touch-emulated swipe events, larger-cell panning, direction controls and reduced motion are exercised in real Chromium. Keyboard arrows navigate; Escape cancels selection.
- Widths **320, 390, 768 and 1440 CSS px**, both English and Traditional Chinese: actual rendered gameplay, no document horizontal overflow, exact saved/rendered state and live language switching. Eight axe WCAG 2 A/AA + 2.1 AA audits report zero violations. Automated audits do not establish complete accessibility certification.
- Save/reload compares the full engine serialization, including RNG, special metadata and counters; the next action is compared against independently restored engine continuation. A mid-animation reload resumes the last committed stable turn. Corrupt/incompatible saves are not overwritten before explicit recovery; validated backup restore, restart cancellation, quota/blocked storage and in-memory fallback have coverage.
- Actual deterministic `SHUFFLE_LIMIT`, `UNSHUFFLABLE` and `RESOLUTION_LIMIT` fixtures verify typed failure handling, retained state/RNG and replayable diagnostics in controller integration. The first two use deliberately constrained small-board configurations to exercise engine safety behavior; they are not normal level configurations. Browser coverage additionally uses a validated 8×8 clear-counter overflow fixture to trigger a real `RESOLUTION_LIMIT`, checks the Traditional Chinese recovery dialog, unchanged save and diagnostic download/reproduction. These are expected safety-limit cases, not newly observed engine defects.
- Projection is exhaustive over the documented event union, including rejected/reshuffled/converted/completed. Explicit reshuffle projection, rollback on projection mismatch and animation exceptions are tested. DOM piece IDs/types/specials and HUD counters are checked before saving; browser tests compare them against the engine after gameplay. No matches or effects are recalculated in presentation.

## Mobile touch findings

Compact cells remain below 44px at narrow widths, preserving the approved composition. A swipe uses the starting cell plus dominant direction; the user need not land on the adjacent target. Motion below the threshold remains a tap; ambiguous diagonals and cancelled pointers submit nothing. Tap two neighbors remains available.

For larger targets, “Larger pieces” expands every cell beyond 44px inside a bounded scroll viewport. Explicit 44px pan buttons and keyboard auto-scroll reveal both sides; this avoids conflicting with board swipes. Four 44px direction controls also swap a selected shape. The 320px touch-emulated browser verifies a real swipe, tap selection, measured enlarged target width, panning and no page overflow. Physical touch accuracy/comfort on real devices remains **Not Verified**.

## Visual artifacts and interpretation

`docs/evidence/g2-desktop.png`, `g2-mobile.png`, `g2-mobile-zh-TW.png`, `g2-match-feedback.png`, and `g2-special-created.png` are screenshots of the real production bundle. The capture scenario uses an engine-validated authored creation setup; the special and 90-point outcome are actually emitted by the engine. These are not staged G1 effects. The deployed level starts from its documented normal seed, not this test fixture.

The approved silhouettes, palette, dimensional SVG pieces and board treatment are preserved. Refinements are limited to real state/animation, localized controls, touch alternatives, error dialogs and adaptive timing. No material visual departure is asserted. Creative quality, controls, enjoyment and final G2 acceptance belong to the user.

## UGDS applicability at this gate

| IDs | Status at G2 |
| --- | --- |
| P01, P04, P05 | Pass for the slice: complete level/replay, engine/UI correspondence, confirmation and recovery |
| P02, P03 | Pass in Chromium desktop and touch/viewport emulation; physical-device checks Not Verified |
| L01, L02 | Pass for implemented slice flows: centralized English/zh-TW, live switching without reset |
| A01 | Automated labels/contrast/keyboard checks Pass; screen-reader and physical touch usability Not Verified |
| A02 | Reduced-motion alternatives Pass; sound control Not Applicable because G2 has no audio |
| V01 | Pass: original retained production assets, no concept-art substitution |
| V02, V04, V05 | G1 approval recorded; visual direction preserved; explicit G2 creative review pending |
| V03, V06 | Browser composition/animation screenshots supplied; subjective integration remains user review |
| S01, S02, S04 | Pass for slice persistence/recovery, bundled runtime assets and family-friendly content |
| S03 | Not Verified on ordinary physical target devices; only browser responsiveness/resource bounds observed |
| Q01, Q02, Q03 | Pass for slice logic/integration/browser routes and bounded feasibility evidence; human balance pending |
| Q04 | Automated checks Pass; manual screen-reader/independent accessibility review Not Verified |
| Q05 | Local evidence separated from hosted/deployment/live verification in release handoff |
| Q06 | Counts, commands, screenshots, deterministic artifacts and limitations recorded; release SHA in handoff |
| C01, C02 | G1 approval/G2 authorization honored; stop before G3; dark-mode deferral recorded |
| C03 | Not Applicable: governing UGDS unchanged; project changes recorded in CHANGELOG |

## Known limitations and outstanding review

Physical devices, Safari/Firefox, screen readers, independent first-time players and human balance/enjoyment review remain unverified. No mathematical solvability claim, universal performance guarantee or full product acceptance is made. Audio, 15 authored levels, chapter progression, full menus/tutorials and Free Play remain later gated production work; their absence is not silently declared completion. Dark mode is explicitly deferred from v1.0.

No new engine defect or unresolved release-blocking code defect was observed; no GitHub Issue was filed. Expected budget failures are preserved/reproducible and do not justify patching the engine. The user must grant explicit G2 approval before G3.


## Live HTTPS verification route

Pages verification runs as a post-deployment `verify-live` job in the hosted workflow, using normal public certificate validation. `scripts/verify-live.mjs` checks the deployed module bytes against the local production build, makes two actual moves in each desktop/touch context, compares the saved engine and rendered piece state, reloads between moves to verify deterministic continuation, switches to zh-TW and reloads, and captures screenshots/JSON as the `g2-live-verification` artifact. The job's exact SHA/status is reported in the final handoff.

The cloud machine's direct live Chromium check hit `ERR_CERT_AUTHORITY_INVALID`; system curl HTTPS verified the page successfully. Its browser NSS store lacks the environment proxy CA. Automatic approval review rejected a proposed persistent browser CA addition because it would broaden future trust. No certificate verification was disabled and no trust store was changed. Hosted live verification avoids that machine-specific trust issue; it is distinct from local Chromium's 32-case application suite.


## Touch compatibility correction

Hosted browser diagnostics exposed a real interaction issue after a captured board swipe: pointer events reached an off-board control, but Chromium sometimes suppressed the compatibility click, leaving the size toggle inactive. This reproduced locally under repeated touch tests. Off-board touch controls now activate explicitly on a completed primary pointer gesture; pointer cancellation or movement beyond the tap threshold does not activate them. Preventing the compatibility mouse sequence avoids duplicate activation; keyboard and real mouse clicks retain native behavior. The fix applies to buttons and preference checkboxes, including dialog controls. The corrected scenario passed five consecutive local repetitions before the complete suite was rerun. The mobile test retains event diagnostics on failure rather than masking the issue with retries or replacing touch with mouse input.


## Hosted browser environment

A Pages runner stalled while installing Playwright/system dependencies even though the same commit's CI had passed. Browser jobs now use the official `mcr.microsoft.com/playwright:v1.58.2-noble` Ubuntu 24.04 image pinned to manifest digest `sha256:6446946a1d9fd62d9ae501312a2d76a43ee688542b21622056a372959b65d63d`, matching `@playwright/test` 1.58.2. Its public multi-platform manifest and digest were retrieved through verified HTTPS from Microsoft's registry before use. Tests still run in full; only redundant installation is removed. Node 24 is activated explicitly, host labels are pinned to Ubuntu 24.04, and browser jobs have 15-minute time limits. This is infrastructure stabilization, not a game-rule or test-coverage change.
