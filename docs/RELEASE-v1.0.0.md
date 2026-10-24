# Shape Match v1.0.0

**Status: Released.** G5 final creative acceptance was formally granted on **2026-10-24 (Asia/Taipei)**. Shape Match v1.0 is closed and ready to serve as the reference implementation for future Match3 Core games. No additional features, redesigns or speculative improvements are part of this closure.

## Approval and immutable production snapshot

The creative director explicitly instructed:

> G5 is formally approved. Shape Match v1.0 has passed final creative acceptance.

The same instruction identified approved production commit **`857dfe124cbce152b4aa118550f11276cbb7414e`**, authorized release wrap-up, and directed that QA issues #1 and #2 remain open as non-blocking follow-ups. Source: the creative director’s formal G5 approval in this project conversation. No independent human testing or device certification is inferred from that acceptance.

- [Play the released game](https://jaychtw.github.io/shape-match/)
- [Annotated v1.0.0 tag](https://github.com/jaychtw/shape-match/tree/v1.0.0)
- [GitHub release](https://github.com/jaychtw/shape-match/releases/tag/v1.0.0)
- [Approved production commit](https://github.com/jaychtw/shape-match/commit/857dfe124cbce152b4aa118550f11276cbb7414e)
- [G5 acceptance and QA record #3](https://github.com/jaychtw/shape-match/issues/3)

The annotated tag points directly to the approved production commit, not to the later documentation-only closure commit on `main`. Application source, dependencies, lockfile, tests, assets and deployment workflows remain unchanged. The private application package retains the approved snapshot’s `1.0.0-rc.1` metadata; the release identity is `v1.0.0`. Rewriting that approved snapshot merely to change package metadata is outside this closure.

## Release notes

- Fifteen deterministic handcrafted levels across First Connections, Shape Power and Chain Reactions, with validated configurations, progressive mechanics and engine-driven winning/losing witnesses.
- Chapter progression, successor unlocking, replay, complete victory/defeat flows and unlimited Free Play without a mandatory score target.
- Complete English and Traditional Chinese interfaces, menus, tutorials and accessibility labels.
- Optional original synthesized effects and background melody with persisted mute, volume, music and effect preferences.
- Exact local engine/RNG persistence, separate Journey/Free Play sessions, confirmation flows and explicit damaged-data recovery.
- Keyboard/mouse/tap/swipe operation, reduced motion, visible focus, readable silhouettes and enlarged/pannable touch alternatives.
- Approved geometric art and board presentation preserved. All matching, scoring, objectives, specials and resolution remain authoritative in the unchanged pinned Match3 Core v1.0.0 engine. All ten special combinations are covered by automated tests.
- Dark mode remains the approved v1.0 deferral. No accounts, telemetry, paid service or runtime gameplay API were introduced.

## Verification and provenance

- [Approved-commit hosted CI](https://github.com/jaychtw/shape-match/actions/runs/40020833805): frozen installation, TypeScript/build, **55 unit/integration tests**, **40 Chromium browser tests**, and **4 Firefox/WebKit compatibility tests**, all passed.
- [Approved-commit Pages deployment and live gameplay](https://github.com/jaychtw/shape-match/actions/runs/40021290381): deployment and normal-trust public desktop/touch checks passed. The live checks exercise three actual turns per viewport, exact engine/DOM/save equality, deterministic reload, separate mode restoration, all 15 menu tiles, audio preferences and language persistence, with zero page errors.
- [Production QA and UGDS checklist](G4-QA.md), [deterministic level evidence](evidence/level-validation.json), and [architecture/engine identity](ARCHITECTURE.md).
- Match3 Core v1.0.0 source: `9863f8e023a227540a58491282e87d9f11a0cf79`; artifact SHA-256: `9513ff12d24ff8b139b593167083ea3dc7390ae17690f495ee4c80de53e5a853`.
- UGDS v1.0.0 immutable baseline: `d5c6696efdd6efc028118600466db44aecae0c9b`.

Public assets verified for the approved build:

| Asset | SHA-256 |
|---|---|
| `index-B79_HEQI.js` | `c22dd223afe835b35638141e91fe2e51dda69abdcf0efb603b5a355a8ceea961` |
| `index-Dt2Lyno7.css` | `c8c7c95f4a7b1d3853506c06e408bf6fe20e4c429afeaeb133a1c57335779f5e` |

Release wrap-up verifies the remote annotated tag, hosted checks and continued public asset identity. It does not redeploy a different production commit or alter TLS validation/trust stores. The linked Actions record retains hosted live verification; closure documentation records the later G5 decision separately from the original evidence snapshots.

## Remaining limitations and non-blocking follow-ups

- [QA #1 — physical touch and sustained performance](https://github.com/jaychtw/shape-match/issues/1) stays open. Physical iOS/Android accuracy, browser chrome/orientation, and sustained ordinary-phone performance/battery/thermal behavior remain unverified. Compact cells can be below 44px; larger-board/pan and direction-control alternatives have automated coverage.
- [QA #2 — manual accessibility, Safari/audio and independent player review](https://github.com/jaychtw/shape-match/issues/2) stays open. Actual Safari/manual Firefox review, screen-reader use, subjective audio/device permissions, independent linguistic and first-time-player/balance checks are not certified. WebKit automation is not actual Safari/device certification. Creative acceptance is now granted; these remaining checks do not reopen G5.
- Winning/losing routes establish deterministic feasibility, not exhaustive solvability or guaranteed recovery from arbitrary choices.
- Browser-local saves can be cleared by the platform/user and do not sync across devices. Free Play checkpoints its diagnostic trace after 256 turns without resetting current board/RNG/counters.

## Reference implementation boundary

Use the immutable `v1.0.0` tag as the starting reference for future Match3 Core games: engine/presentation separation, ordered event consumption, exact state reconciliation, typed failure diagnostics, deterministic persistence, validated level data, localization and accessible input alternatives. Future games require their own design/creative acceptance and device verification; this release does not certify future products. v1.0 feature/design development is closed.
