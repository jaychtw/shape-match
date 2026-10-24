# ADR 001: TypeScript, Vite and dimensional vector pieces

Current status: **Released — v1.0.0**, G5 approved 2026-10-24 (Asia/Taipei). [Release record](RELEASE-v1.0.0.md). The initial G1/G2 sections below are historical; the production extension describes the released architecture. The application requires Node 24; the engine independently supports Node >=22.

Use a lightweight DOM interface and original layered SVG assets. An 8×8 grid does not need a rendering framework or canvas: native buttons offer focus, keyboard and touch semantics, while SVG allows silhouette clarity, dimensional highlights, beveled rims, shadows and scalable special markers. Vite bundles the engine and local assets for offline runtime independence. No fonts, images, telemetry or services are fetched at runtime. These assets are original code-created assets; no third-party artwork licenses apply.

`src/pieces.ts` owns ordinary and special rendering. `src/i18n.ts` owns all interface copy. `src/main.ts` initializes the real pinned engine and demonstrates lossless restoration. The board is seeded by that engine. Four special appearances and HUD values are explicitly presentation samples, not claims of engine-generated special states or playable progress. Effect controls run reversible visual choreography only. No matching, gravity, refill, scoring or special-effect rules are implemented in the presentation.

G2 will introduce an event projection/animation queue consuming every documented event, authoritative `eliminated`, and final-state reconciliation. Preserve last valid saves for engine failures, localize recovery, and retain reproducible diagnostics. Do not implement that playable slice until G1 approval.

## Reference interpretation

Read the approved GDD, handoff, immutable UGDS, and engine README/RULES/EVENTS/STATE/EDD-REVIEW/ACCEPTANCE before implementation. No mechanic conflict found. UGDS V04's representative “playable scene” is staged across G1 visual study and G2 playable slice per the explicit handoff ordering; this deliverable is openly labeled nonplayable. No waiver or final UGDS acceptance is claimed. If a playable scene is required for G1 approval, resolve that sequencing with the user before advancing to G2.

## Immutable engine

Package: `@jaychtw/match3-core@1.0.0`, exact source `9863f8e023a227540a58491282e87d9f11a0cf79`.

The engine's own `verify:release` built committed source twice, compared identical SHA-256 packages, ran its committed-source tests and installed/type-checked an independent consumer. The verified tarball lives in `vendor/`, with unchanged release evidence and SHA256SUMS; npm's lockfile also pins its integrity. This is a built distribution artifact, not copied engine source or a floating Git dependency. No engine changes were made. Hosted engine release/tag status was not independently checked.

UGDS baseline: `d5c6696efdd6efc028118600466db44aecae0c9b`, unchanged local copy in `docs/design/`.

## G2 — approved visual direction, playable architecture

G1 was explicitly approved at `3c9ae1bd5128fcd42f14210c87e4d4cd414c08ce`; see `design/G2-AUTHORIZATION.md`. The above G1 notes describe the historical study. G2 replaces staged board specials/HUD/effects with real engine state and ordered events. Dark mode is explicitly out of v1.0 scope, not an unresolved defect.

- `level.ts`: a single structured level definition (18 moves, 1,800 points, fixed seed, difficulty/teaching intention). No other levels or Free Play added.
- `controller.ts`: synchronous input lock, private engine candidate, event presentation, exact projection reconciliation, then atomic session commit. A failed resolution or presentation leaves the previous engine session intact.
- `projection.ts`: exhaustive discriminated event consumer. Only `eliminated` removes pieces; effect targets decorate. Falls apply simultaneous origin clears and destination placement. Objective/status/counters come directly from events. Engine/RNG logic is never recreated.
- `animation.ts`: ordered swap, match, removal, special creation/conversion, activation/combination, gravity/refill, and shuffle feedback. Long event streams use shorter per-event timing; no events are dropped. Reduced motion removes travel/particles while retaining highlighting, counters and status. Input remains locked until the authoritative state and projection agree.
- `session.ts`: validated, versioned envelope with immutable engine identity, level/seed, exact serialized state, initial snapshot and accepted action trace. Primary save is written only after successful reconciliation; backup receives the previous valid session. A mid-animation reload resumes the preceding stable turn. Corrupt/incompatible data stays untouched until explicit recovery; blocked storage gives a visible warning and in-memory gameplay. This is integrity validation, not anti-cheat authentication.
- `main.ts`: localized presentation and controls, plus DOM identity/counter checks before persistence. Pointer gestures use origin cell and dominant axis with a minimum movement threshold. Ambiguous diagonals/cancelled pointers submit nothing. Click-generated keyboard actions use the same controller.

### Narrow-phone input

Keep the approved compact 8×8 composition by default. Tap two cells or start a directional swipe anywhere within the first cell; endpoint precision is unnecessary. Alternatively select a cell and use the four 44px direction buttons. “Larger pieces” retains the art/board and expands cells beyond 44px within a horizontally scrollable viewport; explicit 44px pan buttons and keyboard auto-scroll expose offscreen cells without conflicting with swipe-to-swap. No document overflow is introduced. These are usability options, not different game rules. Physical-device ergonomics remain a human acceptance check.

### Failure handling

Ordinary `NO_MATCH`/`NOT_ADJACENT` rejections visibly return and use no move. `SHUFFLE_LIMIT`, `UNSHUFFLABLE`, `RESOLUTION_LIMIT`, malformed actions, typed engine exceptions and presentation discrepancies take a separate localized recovery path. A local/downloadable diagnostic contains engine version/commit, config, seed, initial/current engine serialization and accepted/attempted actions—no personal data or credentials. No board is silently regenerated. Tests use actual deterministic engine failures; these expected safety-budget fixtures do not constitute engine defects.

## Production extension (G3–G4)

`level.ts` is the structured 15-level manifest, validated at module initialization for sequence, chapters, unique IDs/seeds, six types, 8×8 geometry, move budgets, objectives and special setups. The engine validates configuration semantics. The approved G2 definition is unchanged as level 1. Authored specials use the engine's public detached state/validated `loadGame` interface; no board rule or resolution is reimplemented. The same controller/projection/animation pipeline serves every level and Free Play.

`progress.ts` models completions, successor unlocking and best scores independently of engine rules. `main.ts` owns native modal navigation, confirmation, bilingual objectives and settings. Navigation dialogs preserve the active session. Mode switches save/resume separate Journey and Free Play slots; choosing a different level confirms replacement of an unfinished Journey even from Free Play. Completed active levels can be replayed. The primary save still uses the G2 version-1 envelope and storage key; old G2 saves remain compatible.

Free Play uses `moveLimit: null` and `objectives: []` supported by the engine. To bound storage, after 256 accepted actions the diagnostic replay checkpoints its initial state to the prior exact serialization, then appends further actions. Board, RNG, score, moves and future behavior are never reset. Corrupt primary and mode slots require explicit recovery. Corrupt progression is disclosed, retained, and copied to a damaged-data key before explicit reset. Local saves are not accounts or cross-device sync; no client save is treated as a security boundary.

`audio.ts` synthesizes original short oscillators/envelopes and an optional eight-note background melody locally using Web Audio after a user gesture. Voices are capped at 32, ended nodes disconnect, background timing pauses while hidden/muted, and volume/mute/effects/music preferences persist. No downloaded audio assets, external services, analytics, paid dependencies or personal information were introduced.

Final authority is the creative director’s [G5 approval and release record](RELEASE-v1.0.0.md), following the [G3–G4 authorization](design/G3-G4-AUTHORIZATION.md). G1/G2/G5 are approved. v1.0 is closed as a reference implementation: preserve the pinned engine, event-driven resolution, exact reconciliation/persistence, localization and accessibility patterns. Future games should reference the immutable `v1.0.0` snapshot; this closure authorizes no new v1.0 implementation work.
