# Shape Match — Game Design Document

**Version:** 1.0.0  
**Status:** Approved for production  
**Repository:** `jaychtw/shape-match`  
**Genre:** Family-friendly match-3 puzzle  
**Platforms:** Desktop and mobile web browsers  
**Languages:** English and Traditional Chinese (`zh-TW`)  
**Engine:** `@jaychtw/match3-core` v1.0.0  
**Engine source:** `jaychtw/match3-core`, commit `9863f8e023a227540a58491282e87d9f11a0cf79`  
**Governing standard:** UGDS v1.0.0, commit `d5c6696efdd6efc028118600466db44aecae0c9b`  
**Creative authority:** User  
**Implementation and technical verification:** Codex

## 1. Product vision

Shape Match is a vibrant, polished, accessible puzzle game featuring six distinctive geometric shapes.

It serves two purposes:

1. Deliver an enjoyable standalone family game.
2. Establish a production-quality reference implementation for Match3 Core, enabling future games to reuse its mechanics without copying gameplay logic.

**The game must feel finished, not like an engine demonstration.**

Design pillars:

- Clarity and immediate learnability.
- Satisfying visual and audio feedback.
- Fair, understandable gameplay.
- Accessibility across devices and abilities.
- Faithful separation of engine logic and presentation.

## 2. Approved launch scope

### 2.1 Puzzle Journey

15 handcrafted levels divided into three chapters.

| Chapter | Levels | Learning focus |
|---|---|---|
| First Connections | 1–5 | Swapping, matching, scoring |
| Shape Power | 6–10 | Special-piece creation and activation |
| Chain Reactions | 11–15 | Cascades, combinations, compound objectives |

Each level has a move limit and at least one engine-supported objective.

Level specifications must include their configuration, seed, objective, move limit, introduction of mechanics, and verification evidence.

Level configurations must be tested for solvability and reasonable difficulty. Passing a seeded solver is evidence of feasibility, not proof that a level is enjoyable.

### 2.2 Free Play

An endless, no-time-limit mode with no mandatory score target or move limit.

Includes score tracking, restart confirmation, save/resume, and full support for the engine's matching and special-piece mechanics.

### 2.3 Progression

- Complete a level to unlock the next.
- Completed levels remain replayable.
- Failed levels may be retried without penalty.
- Active gameplay and progress persist locally.
- Restart and abandon-session actions require confirmation when progress would be lost.

No account, paid service, advertising, or online leaderboard is required.

## 3. Board and pieces

### 3.1 Board rules

- Default 8×8 grid.
- Six piece types.
- Orthogonally adjacent swaps.
- Invalid swaps revert without consuming a move.
- Three-or-more matching.
- Gravity, refill, and cascades.
- Four special-piece categories.
- All ten special-piece combinations.

All rules must come from Match3 Core v1.0.0, not a separate implementation.

### 3.2 Six geometric shapes

| Piece | Proposed palette | Recognition requirement |
|---|---|---|
| Circle | Coral red | Clearly rounded |
| Triangle | Golden yellow | Three corners |
| Square | Sky blue | Equal width and height |
| Rectangle | Mint green | Clearly wider than tall |
| Pentagon | Violet | Five-sided |
| Star | Orange | Five-pointed |

The visual system must make pieces distinguishable by silhouette as well as color.

Square and rectangle require particular care at mobile scale.

Palette choices may be refined during the visual POC without changing piece identities.

### 3.3 Special pieces

- Horizontal line-clearer: strong horizontal markings.
- Vertical line-clearer: strong vertical markings.
- Area bomb: radial marking or burst motif.
- Same-type clearer: distinctive multicolor/prismatic appearance.

Special markers must remain recognizable on all applicable shapes.

Use Match3 Core's documented precedence, anchors, effects, activation rules, and scoring. Do not invent alternative rules.

## 4. Input and controls

### Desktop

- Click or tap two adjacent pieces to swap.
- Drag a piece toward an adjacent cell.
- Keyboard board navigation and selection.
- Visible keyboard focus.

### Mobile

- Tap two adjacent pieces.
- Swipe toward an adjacent cell.
- Comfortable touch targets.
- No hover-only controls.

### Input safety

- Prevent duplicate move submissions.
- Lock or queue gameplay input while resolution animations run.
- Use engine legality and action results as authoritative.
- Animate invalid swaps without changing state.
- Provide explicit feedback for engine errors that differ from ordinary invalid swaps.

## 5. Visual direction

**Target:** Polished, colorful, tactile 2D family-game presentation with Switch-like visual appeal.

The interface should include:

- A prominent, readable game board.
- Distinctive dimensional shape pieces.
- Clear level, moves, score, and objective indicators.
- Cohesive menus and chapter/level selection.
- Satisfying special-piece treatments.
- Subtle depth, highlights, shadows, and controlled particles.

Avoid flat placeholder geometry as the final visual language.

### 5.1 Visual proof of concept

Before full production, create a representative gameplay scene showing:

- All six ordinary shapes.
- All four special-piece categories.
- A complete board.
- Gameplay HUD.
- Desktop and mobile compositions.
- Examples of match and special-effect feedback.

Codex must provide screenshots or visual artifacts and explain how the proposed presentation meets the quality target.

**The creative director must approve the visual direction before full production.**

### 5.2 Animation

Required:

- Selection.
- Valid and invalid swaps.
- Match highlighting and elimination.
- Special creation and activation.
- Gravity and refill.
- Cascades.
- Victory and defeat.

Animations must consume ordered engine events. The UI must not recalculate matches or special effects.

### 5.3 Motion accessibility

Support reduced-motion preferences and simplified effects without losing state clarity.

## 6. Audio

Provide:

- Selection and swap cues.
- Match sounds.
- Special creation and activation effects.
- Cascade feedback.
- Victory and defeat sounds.
- Optional background music.

Audio must be optional and controllable, with locally persisted preferences.

The game must remain understandable when muted.

## 7. Localization and accessibility

Complete English and Traditional Chinese coverage from the start.

All menus, settings, objectives, level descriptions, instructions, error messages, and accessibility labels must be localized.

Language switching must not restart the session.

Accessibility requirements include:

- Keyboard operation.
- Visible focus.
- Color-independent piece identification.
- Readable text and contrast.
- Appropriate accessible names.
- Reduced-motion support.
- Non-audio feedback for important events.
- Touch-friendly layouts.

The implementation must satisfy applicable UGDS requirements, not merely the examples listed here.

## 8. Persistence and recovery

Persist locally:

- Level unlocks and completions.
- Active session and exact engine state.
- Current mode and level.
- Score and moves.
- Language.
- Audio and motion preferences.

Use the engine's validated serialization and restoration interfaces.

A restored session must preserve the same board and future deterministic behavior.

Malformed or incompatible data must trigger an understandable recovery path rather than a crash or silent corruption.

## 9. Engine integration contract

Pin Match3 Core to the approved v1.0.0 artifact or exact source revision.

Do not rely on a moving branch or unverified package.

Engine responsibilities:

- Board state and legal moves.
- Matching and special combinations.
- Cascades, gravity, and refill.
- Scoring, objectives, and terminal outcomes.
- Deterministic random state.

Shape Match responsibilities:

- Input, UI, animation, and sound.
- Menus, navigation, and level selection.
- Localization and accessibility presentation.
- Storage integration and deployment.

### 9.1 Event handling

Support the complete documented event union:

`rejected`, `swapped`, `matched`, `specialCreated`, `specialConverted`, `combined`, `activated`, `eliminated`, `scored`, `fell`, `refilled`, `objectives`, `completed`, `reshuffled`.

Render authoritative `eliminated` events instead of inferring removals from effect targets.

At the end of every animation sequence, the presentation must reconcile exactly with the engine's authoritative state.

### 9.2 Engine failure handling

Recognize `SHUFFLE_LIMIT`, `UNSHUFFLABLE`, resolution-budget errors, and corrupted-state failures.

These must not be disguised as ordinary invalid swaps.

For unexpected engine failures:

- Preserve the last valid session.
- Display a clear localized recovery message.
- Capture reproducible diagnostics without personal information.
- Report a defect in the appropriate repository.
- Do not silently alter engine rules or fabricate a replacement board.

## 10. Level design and difficulty

Create a structured level manifest containing:

- Unique level identifier and chapter.
- Seed and engine configuration.
- Move limit.
- Objectives.
- Intended mechanic introduction.
- Difficulty expectation.
- Verification status.

Progression should be gradual but not monotonous.

The first chapter teaches fundamentals through interaction. Later chapters introduce special-piece mechanics and combinations in a controlled sequence.

Level validation must include automated playability evidence and human review.

Do not claim mathematical solvability based solely on random simulations.

## 11. Quality assurance

### 11.1 Automated functional testing

Cover:

- Legal and illegal swaps.
- Every ordinary match category.
- All special-piece creation and activation paths.
- All ten special-piece combinations.
- Cascades and refill.
- Objectives and level completion.
- Loss and retry.
- Level unlocks.
- Free Play.
- Localization switching.
- Save, reload, and exact restoration.
- Corrupted-save recovery.

### 11.2 Browser integration

Use real browser automation to verify actual pointer, keyboard, and touch-compatible workflows.

Test event-driven animation and engine/UI consistency.

### 11.3 Engine stress testing

Exercise representative complete sessions across deterministic seeds and level configurations.

Investigate unexpected `SHUFFLE_LIMIT`, `UNSHUFFLABLE`, or wave-limit failures.

Failures must be reproducible from engine version, configuration, seed/state, and action sequence.

### 11.4 Device and presentation QA

Verify desktop and mobile layouts, scrolling, input responsiveness, readable pieces, animation behavior, and reduced-motion support.

Automated browser emulation does not substitute for physical-device verification.

### 11.5 Creative acceptance

The creative director evaluates visual quality, controls, responsiveness, sound, difficulty, and enjoyment.

Technical completion is not equivalent to creative acceptance.

## 12. Production gates

| Gate | Deliverable | Required approval |
|---|---|---|
| G0 | Approved GDD v1.0 | User — approved |
| G1 | Visual POC and screenshots | User |
| G2 | Playable vertical slice using real engine | Functional evidence and user review |
| G3 | All 15 levels, Free Play, localization, settings | Technical verification |
| G4 | Hosted CI, browser/device QA, deployed build | Evidence-based review |
| G5 | Final creative and product acceptance | User |

Codex must not advance beyond a gate requiring user approval merely because implementation or tests succeeded.

## 13. Technical and repository requirements

- TypeScript web application.
- Reproducible dependency installation.
- Pinned Match3 Core v1.0.0.
- No duplicate match-resolution implementation.
- GitHub Actions CI.
- GitHub Pages deployment.
- Automated browser tests.
- Documentation for build, test, and deployment.
- Versioned design and change records.
- UGDS v1.0.0 compliance.

The choice of rendering framework and build tooling is delegated to Codex, subject to performance, maintainability, browser compatibility, and the approved visual direction.

## 14. Exclusions

Not included in v1.0:

- Online multiplayer.
- Cloud accounts or sync.
- Monetization.
- Online leaderboards.
- Daily challenges.
- Procedural level generation.
- Arbitrary new match rules.
- Obstacles requiring engine changes.
- Level editor.
- Unapproved extensions to Match3 Core.

## 15. Definition of done

Shape Match v1.0 is complete only when:

1. All 15 levels and Free Play work.
2. All engine rules are correctly presented.
3. Visual direction has been approved and implemented.
4. Controls work on desktop and mobile.
5. Both languages are complete.
6. Persistence and recovery work.
7. Accessibility and motion requirements pass.
8. Automated tests and hosted CI pass.
9. Browser integration is verified.
10. Critical engine failures are absent or resolved.
11. GitHub Pages deployment is verified.
12. Applicable UGDS requirements are satisfied.
13. Remaining defects and limitations are disclosed.
14. The user explicitly grants final creative acceptance.

**No self-certification of final product acceptance by Codex.**