# Shape Match production QA — G3/G4 candidate

Final creative acceptance is **pending G5**. G1 visuals and G2 implementation were approved; [current authorization](design/G3-G4-AUTHORIZATION.md) permits production/QA without intermediate gates. Dark mode remains an approved deferral. No new game-rule, visual-direction, security or service exception was introduced.

## Scope and architecture

15 deterministic handcrafted levels in three chapters; chapter selection/unlocking, replay, multi-objective victory/defeat, unlimited Free Play, exact local sessions, bilingual menus/tutorials/settings, original synthesized effects/optional music, persisted audio/motion/language/board size preferences. Level 1 retains the approved G2 seed, objectives and move budget. All board rules and scoring remain in unchanged Match3 Core v1.0.0, source `9863f8e023a227540a58491282e87d9f11a0cf79`; package SHA-256 `9513ff12d24ff8b139b593167083ea3dc7390ae17690f495ee4c80de53e5a853`.

The runtime manifest checks all 15 IDs/seeds, chapter/number order, dimensions, types, move budgets and special setups; the pinned engine validates configuration semantics. Ordered engine events drive the existing animation/projection pipeline. Input remains locked through resolution. Projection includes every piece identity/type/special, score, moves, status and objective progress; DOM checks include all identities, counters, status and localized objective totals before saving. Failure rolls back to the last exact valid session, preserving typed error and deterministic reproduction information.

## Verification record

Local environment: Node 24.19.0 / npm 11.9.0, Playwright 1.58.2 driving Debian Chromium 154.0.8037.57. Hosted jobs use matching Chromium, Firefox and WebKit from the official Playwright 1.58.2 Noble image pinned by manifest digest. Local machine has no installed Playwright Firefox/WebKit, physical device bridge, screen reader or Safari.

Commands: `npm run typecheck`, `npm test`, `npm run build`, `npm run test:browser -- --workers=3`, hosted `npm run test:compat`, `npm run validate:levels`, hosted `npm run verify:live`. Unit tests replay checked-in level witnesses on every CI run; search regeneration is a separate reproducible command. `npm audit --audit-level=low --cache /workspace/.npm-cache` found **zero vulnerabilities across the full dependency tree** after updating existing Vite tooling to 7.3.7 and esbuild to 0.28.2. Match3 Core is unchanged. Frozen installation/build/unit checks passed; the patched tooling initially produced byte-identical artifacts.

Local checks: build/TypeScript pass; **55 unit/integration tests pass**, **39 Chromium browser tests pass** (all 32 original G2 regressions retained). Hosted Firefox/WebKit and release outcomes are recorded in the [G5 release record](https://github.com/jaychtw/shape-match/issues/3); that record is updated only after actual hosted verification. Tests are automated engineering evidence, not independent human testing.

- Retains all 36 G2 unit/integration tests and all 32 G2 browser regressions.
- Production unit tests replay both winning and losing routes for every level; validate progression/best scores/storage corruption, localization parity, manifest rejection and 258 Free Play turns with bounded replay checkpoints/exact deterministic continuation.
- Production Chromium tests play the entire campaign through real inputs, compare engine/save/DOM every move, reload every completion, verify chapter unlocking and replay; test separate Journey/Free Play navigation, restart and abandon confirmations, damaged progress/mode-slot recovery, audio/settings persistence, actual running Web Audio context/oscillator creation, bilingual tutorials and menu accessibility.
- Viewports: 320, 390, 768 and 1440px from G2 gameplay/layout regressions; new menus/settings/tutorials audited at 320 and 1440px. Axe WCAG 2 A/AA and 2.1 AA scans plus keyboard/focus assertions are automated coverage. They do not certify manual screen-reader usability.
- Hosted Firefox/WebKit automation exercises keyboard gameplay, deterministic reload, Free Play/Journey navigation, settings and both languages at 390 and 1440px. WebKit is Safari-engine automation, not actual branded Safari or physical iOS verification.
- All ten special-piece combinations retain actual-engine unit and Chromium coverage, plus all four special creations and standalone activations. G2 tests retain valid/invalid swap, gravity/refill/cascade, duplicate input locking, normal/reduced motion and failure rollback coverage.
- Real deterministic `SHUFFLE_LIMIT`, `UNSHUFFLABLE`, and `RESOLUTION_LIMIT` fixtures preserve engine state/RNG and produce replayable diagnostics. The browser exercises a real `RESOLUTION_LIMIT` recovery. These intentional budget fixtures do not demonstrate a production engine defect.

## Levels and balance

[Full level validation](evidence/level-validation.json) records each seed, normalized configuration, authored initial board/special setup, objectives, move budget, intended difficulty/mechanics, and complete successful/failed action traces and counters. The companion table below summarizes witness moves, not player skill requirements.

The solver ranks engine-reported legal moves by normalized objective progress and score; when greedy search fails it uses beam search of width 8. It never implements matching/resolution. All 15 have an actual win and a move-exhaustion loss. This is deterministic feasibility evidence, **not mathematical proof of exhaustive solvability, guaranteed recoverability from arbitrary choices, balance quality or enjoyment**.

Chapter 1 introduces targeted silhouettes and simultaneous goals around the retained G2 opener. Chapter 2 supplies recognizable specials to teach activation before requiring combinations. Chapter 3 emphasizes conversion chains and compound objectives. Difficulty is intentionally shaped through goals, opening powers and move budgets rather than monotonically raising scores. Supplied specials make some late openings forgiving; independent first-time-player/balance review remains outstanding.

| Level | Chapter | Move limit | Objectives | Win moves | Loss moves |
|---|---|---|---|---|---|
| 1 | 1 | 18 | score 1800 | 8 | 18 |
| 2 | 1 | 18 | circle 18 | 4 | 18 |
| 3 | 1 | 20 | score 1100; triangle 12 | 7 | 20 |
| 4 | 1 | 20 | square+rectangle 28 | 6 | 20 |
| 5 | 1 | 22 | score 2400 | 7 | 22 |
| 6 | 2 | 16 | score 2000 | 10 | 16 |
| 7 | 2 | 18 | square+rectangle 42 | 9 | 18 |
| 8 | 2 | 20 | score 2400; star 15 | 8 | 20 |
| 9 | 2 | 20 | pentagon 28 | 9 | 20 |
| 10 | 2 | 20 | score 3500 | 5 | 20 |
| 11 | 3 | 22 | score 3200; circle 25 | 11 | 22 |
| 12 | 3 | 20 | triangle+star 60 | 13 | 20 |
| 13 | 3 | 22 | score 4200; pentagon 25 | 9 | 22 |
| 14 | 3 | 24 | score 5000; rectangle 40 | 12 | 24 |
| 15 | 3 | 26 | score 6500; circle+triangle+square+rectangle+pentagon+star 170 | 18 | 26 |


## Mobile, performance and recovery limits

The approved compact board retains sub-44px cells at narrow widths. Dominant-axis swipes need only a start cell and direction; taps, keyboard and 44px direction buttons remain alternatives. Larger pieces increases targets beyond 44px with bounded scrolling and explicit pan controls. G2 touch automation retains the captured-swipe compatibility-click regression fix; live verification also uses actual touch-emulated controls through the new menus. Physical-device accuracy, diagonal/cancel behavior under real fingers, orientation/browser chrome and audio permissions remain unverified.

All assets are local; no analytics, accounts, personal-data collection, runtime API, fonts/CDNs, advertising or paid service. Music is off by default and starts only after interaction; mute/volume/effects/music persist. Oscillator voices are capped, nodes disconnect, and melody timing pauses when hidden or muted. A continuous real-device thermal/battery/FPS assessment and subjective speaker/headphone audio review remain unverified. Engine safety budgets still apply; typed failures are never disguised as invalid swaps.

Journey and Free Play each have an exact serialized slot; mode switching/navigation does not reset either. Choosing another Journey level requires confirmation before replacing unfinished play, including when coming from Free Play. Restarts require confirmation. Completions/best scores persist separately. Free Play checkpoints its diagnostic trace at 256 turns without altering the authoritative current state, counters or RNG. Corrupt primary/backup handling retains G2 behavior. Damaged progression is copied to a retained damaged-data key on explicit reset; corrupt inactive mode slots require explicit recovery. Blocked/quota-limited storage is disclosed while gameplay continues in memory. Browser storage is local and can be cleared by the user/platform; no cross-device/cloud guarantee is made.

No TLS verification was disabled and no persistent trust store changed. The cloud proxy certificate limitation affecting external local Chromium remains documented in G2 QA; normal-trust hosted verification checks the actual public build.

## UGDS checklist

Baseline immutable commit `d5c6696efdd6efc028118600466db44aecae0c9b`, unchanged local source. Pass here denotes the available engineering evidence; final aesthetic and product acceptance remains G5.

| Requirement | Status | Evidence / limit |
|---|---|---|
| P01 complete loop | Pass | 15-level campaign, outcomes/retry/replay and Free Play |
| P02 input | Pass | mouse/keyboard/touch-emulated gameplay; hardware accuracy Not Verified |
| P03 responsive | Pass | four widths; larger-board pan strategy; hardware chrome/orientation Not Verified |
| P04 fair/observable rules | Pass | pinned engine, ordered events and exact state checks |
| P05 recovery | Pass | confirmations, typed failure rollback, explicit corrupt-data recovery |
| L01 bilingual | Pass | complete key parity, actual localized gameplay/menus/errors/results |
| L02 switching | Pass | exact state retained across language changes/reload |
| A01 interaction | Pass | silhouette distinction, keyboard/focus/labels, axe, target alternatives; manual screen reader Not Verified |
| A02 motion/sound | Pass | reduced/system motion; persisted mute/volume/music/effects and visual equivalents |
| V01 production assets | Pass | approved original geometric SVGs, no concept-art substitution |
| V02 visual acceptance | Not Verified | G1/G2 approved; final composed production review belongs to G5 |
| V03 consistency | Pass | approved shapes/board/style retained in actual captures; G5 aesthetic review pending |
| V04 representative scene | Pass | G1/G2 explicit approvals and G2 firsthand gameplay |
| V05 no silent downgrade | Pass | no material art/rule substitution; dark-mode deferral approved |
| V06 evidence | Pass | actual desktop/mobile game, tutorials, menus, final campaign and live captures |
| S01 persistence | Pass | engine RNG/session, progression/preferences, navigation and failure tests |
| S02 independence | Pass | bundled assets/engine; no runtime service/telemetry |
| S03 performance | Not Verified | local/hosted responsiveness exercised; ordinary physical-device sustained performance unverified |
| S04 safety/honesty | Pass | no accounts/payments/scientific or certification claims |
| Q01 verifiable engine | Pass | immutable artifact, 15 deterministic cases, existing failures/combinations |
| Q02 browser gameplay | Pass | real inputs, full campaign, desktop/touch, localized failure/retry/reload |
| Q03 balance | Not Verified | 15 win/loss witnesses pass; human difficulty/enjoyment review pending |
| Q04 accessibility validation | Pass | automated axe/keyboard/focus; manual screen reader Not Verified |
| Q05 release integrity | See release record | [Exact-SHA CI, deployment and live checks](https://github.com/jaychtw/shape-match/issues/3) establish this separately from local success |
| Q06 evidence/limits | Pass | report, deterministic routes, screenshots, honest manual gaps |
| C01 ownership | Pass | G5 reserved to user |
| C02 escalation | Pass | no material scope/security/visual exception introduced |
| C03 standard changes | Not Applicable | UGDS unchanged; project changelog records implementation |

## Unverified requirements / G5 review

Physical iOS/Android touch accuracy and accessibility; actual Safari manual review; manual Firefox visual/audio review (distinct from automation); VoiceOver/NVDA/TalkBack or other screen-reader operation; subjective audio quality and device permission behavior; sustained performance/battery/thermal behavior on ordinary phones; independent first-time-player, cultural/translation and balance/enjoyment review; final creative acceptance. Do not interpret automated WebKit as physical Safari certification.

Outstanding QA is tracked in [physical touch/performance #1](https://github.com/jaychtw/shape-match/issues/1) and [manual accessibility/Safari/player review #2](https://github.com/jaychtw/shape-match/issues/2). These track known verification limitations, not fabricated observed device failures. Final release links are appended below. No critical unresolved implementation defect is knowingly waived. These manual gaps remain visible for G5; this report does not declare final product acceptance or general device certification.
