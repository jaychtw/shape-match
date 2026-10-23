# ADR 001: TypeScript, Vite and dimensional vector pieces

Status: proposed visual language, implemented G1 foundation. Node >=22; validated on Node 24.19.0.

Use a lightweight DOM interface and original layered SVG assets. An 8×8 grid does not need a rendering framework or canvas: native buttons offer focus, keyboard and touch semantics, while SVG allows silhouette clarity, dimensional highlights, beveled rims, shadows and scalable special markers. Vite bundles the engine and local assets for offline runtime independence. No fonts, images, telemetry or services are fetched at runtime. These assets are original code-created assets; no third-party artwork licenses apply.

`src/pieces.ts` owns ordinary and special rendering. `src/i18n.ts` owns all interface copy. `src/main.ts` initializes the real pinned engine and demonstrates lossless restoration. The board is seeded by that engine. Four special appearances and HUD values are explicitly presentation samples, not claims of engine-generated special states or playable progress. Effect controls run reversible visual choreography only. No matching, gravity, refill, scoring or special-effect rules are implemented in the presentation.

G2 will introduce an event projection/animation queue consuming every documented event, authoritative `eliminated`, and final-state reconciliation. Preserve last valid saves for engine failures, localize recovery, and retain reproducible diagnostics. Do not implement that playable slice until G1 approval.

## Reference interpretation

Read the approved GDD, handoff, immutable UGDS, and engine README/RULES/EVENTS/STATE/EDD-REVIEW/ACCEPTANCE before implementation. No mechanic conflict found. UGDS V04's representative “playable scene” is staged across G1 visual study and G2 playable slice per the explicit handoff ordering; this deliverable is openly labeled nonplayable. No waiver or final UGDS acceptance is claimed. If a playable scene is required for G1 approval, resolve that sequencing with the user before advancing to G2.

## Immutable engine

Package: `@jaychtw/match3-core@1.0.0`, exact source `9863f8e023a227540a58491282e87d9f11a0cf79`.

The engine's own `verify:release` built committed source twice, compared identical SHA-256 packages, ran its committed-source tests and installed/type-checked an independent consumer. The verified tarball lives in `vendor/`, with unchanged release evidence and SHA256SUMS; npm's lockfile also pins its integrity. This is a built distribution artifact, not copied engine source or a floating Git dependency. No engine changes were made. Hosted engine release/tag status was not independently checked.

UGDS baseline: `d5c6696efdd6efc028118600466db44aecae0c9b`, unchanged local copy in `docs/design/`.
