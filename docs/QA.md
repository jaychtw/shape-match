# G1 verification and acceptance record

Date: 2026-10-24 (Asia/Taipei). Gate: **G1 candidate, awaiting explicit user visual approval**. This is a presentation study, not playable G2 or final acceptance.

## Local evidence

- Node 24.19.0; npm 11.9.0; Debian Chromium 154.0.8037.57, driven by Playwright 1.58.2. Chromium is the actual system browser; no claim that Playwright's downloaded browser was used.
- Frozen installation: `npm ci --cache /workspace/.npm-cache` passed; dependencies and engine artifact retained in the lockfile.
- `npm run build` passed (includes strict TypeScript checking); Vite production bundle uses `/shape-match/`. Approximate compressed JS 12 KB, CSS 4 KB. No runtime external assets/services.
- `npm test`: **3 passed**, 0 failed/skipped. Artifact SHA-256/source identity; engine initialization/exact restoration/deterministic continuation; complete nonempty bilingual resource parity.
- `npm run test:browser`: **7 passed**, 0 failed/skipped. Four viewport cases (320, 390, 768, 1440 CSS px), touch-emulated phone, system reduced-motion/malformed preference recovery, and screenshot capture.
- Viewport cases exercise roving keyboard focus, Enter selection, live language switching preserving sample selection, preference reload, all three effect buttons, reduced-motion controls, no horizontal overflow in either language, and zero WCAG 2 A/AA + 2.1 AA axe violations in both languages. Eight automated audits support accessibility; they do not certify all accessibility requirements.
- Touch case uses a real browser with touch emulation, selects a sample piece, and activates an effect preview. This is not physical-device evidence.
- Engine's own committed-source release verifier passed two independent package builds, identical SHA-256, upstream tests and an external installed/type-checked consumer. See `vendor/release-evidence.json`. No engine modification.

## Visual evidence

`docs/evidence/`: desktop, mobile portrait, Traditional Chinese mobile, ordinary-piece close-up, special-piece close-up, special-feedback frame. These are screenshots of the production bundle, not concept images. Regenerate with `npm run build && npm run test:browser -- --grep 'capture G1'`.

The running POC's Match / Cascade / Special buttons provide a repeatable animation demonstration. They illustrate presentation choreography only and do not calculate or represent a submitted engine move. The HUD values and four board special appearances are design samples. Engine-created ordinary board and engine import/restore are real.

Visual proposal: cream canvas, teal inset checkerboard, six original beveled, shaded SVG silhouettes, white directional/burst/prismatic markings, calm HUD and chapter card. Rectangle has a distinctly wide silhouette while square remains equal-sided. Desktop keeps board central; phone stacks objective/HUD/board with effects and galleries below. User visual assessment is pending; no self-certification of commercial quality.

## Diagnosed and corrected during validation

- Playwright default cache was unwritable; writable cache then hit a CDN network restriction. Use existing `/usr/bin/chromium` instead; no verification bypass or new browser artifact was used.
- Automated contrast checks exposed two muted label colors; darkened them.
- Browser geometry exposed tablet gallery overflow and narrow-phone effect control overflow; corrected the relevant responsive grids.
- Replaced unsupported diagonal-arrow glyphs and suppressed decorative heading glyph on mobile to avoid a stray line.

## Remaining verification and scope

- Full gameplay, 15 levels, Free Play, event projection/reconciliation, invalid swaps, victory/loss, session persistence, sound and stress/balance checks belong to G2–G5 and remain **Not Verified / not implemented**.
- Full UGDS applicability/acceptance is not Pass at G1. P03/L01/L02/A01/A02/V03/V06/Q04 have scoped browser evidence above; P01/P04/P05/S01/Q01/Q02/Q03 require later playable/product checks. V02/V04/V05 require user visual review. S03 needs physical-device performance evidence. C01/C02 approval gates are preserved. No UGDS text changed, exception approved, or final acceptance inferred.
- At narrow widths, dense 8×8 sample cells are below the preferred 44px target. Roving keyboard focus and tap selection work in emulation; physical touch comfort and an appropriate production interaction strategy require G2 review.
- Physical devices, screen readers, independent first-time player testing and subjective sound/difficulty/fun remain unverified.
- Hosted CI and actual Pages deployment are separate from local evidence. Pages workflow is manual and has not been executed. No deployed-build claim is made.
- GitHub Issues: none filed; no engine defect observed. Remaining items are planned gated scope/verification, not silently waived defects.

## Approval boundary

The handoff explicitly requires “Stop and request the user's visual approval.” GDD §5.1 and §12 also require it. Review screenshots and the effect presentation, approve this direction or request changes; only explicit G1 approval authorizes a playable G2 slice. UGDS's representative playable-scene wording is staged across G1/G2 per the handoff and disclosed in ADR 001.
