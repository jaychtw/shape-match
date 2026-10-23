# Codex Handoff — Shape Match v1.0

## Mission

Implement **Shape Match**, a polished, bilingual, family-friendly match-3 game using the approved GDD v1.0 and the existing Match3 Core v1.0.0 engine.

This is a new standalone game, not an extension of the engine repository.

**Target repository:** `jaychtw/shape-match`

**Current authorization:** Prepare the repository, technical foundation, and Gate G1 visual proof of concept. Do not proceed to full game production without explicit visual approval.

## 1. Governing references

Read and follow these authoritative sources before implementation:

1. Approved Shape Match GDD v1.0 supplied with this handoff.
2. UGDS v1.0.0 at `jaychtw/game-development-standards`, commit `d5c6696efdd6efc028118600466db44aecae0c9b`.
3. Match3 Core v1.0.0 at `jaychtw/match3-core`, commit `9863f8e023a227540a58491282e87d9f11a0cf79`.
4. Match3 Core `README.md`, `docs/RULES.md`, `docs/EVENTS.md`, `docs/STATE.md`, `docs/EDD-REVIEW.md`, and `docs/ACCEPTANCE.md`.

The approved GDD governs product behavior. Match3 Core governs gameplay mechanics. UGDS governs development and quality standards.

Document any conflicts before proceeding.

## 2. Repository and project setup

Create or initialize `jaychtw/shape-match`, as authorized by the available GitHub permissions.

Establish:

- TypeScript application structure.
- Browser-compatible build tooling.
- Automated tests.
- Browser integration test framework.
- GitHub Actions CI.
- GitHub Pages deployment configuration.
- English and Traditional Chinese localization infrastructure.
- Project documentation and changelog.
- Reproducible dependency lockfile.

Use an appropriate lightweight rendering approach. Justify the choice in a brief technical decision record.

Ensure GitHub Pages works under the repository subpath `/shape-match/`, not only at the domain root.

Do not overwrite unrelated repository contents or modify other projects.

## 3. Match3 Core integration

Use the immutable Match3 Core v1.0.0 release.

Preferred approach:

- Build or retrieve the exact tagged package from verified source.
- Verify its integrity.
- Pin the dependency and record its integrity in the lockfile or equivalent reproducibility evidence.
- Confirm TypeScript imports and browser bundling.
- Record the source commit and package identity in documentation.

Do not use a floating `main` dependency.

Do not copy Match3 Core source files or reimplement matching, gravity, cascades, scoring, or special effects.

If an engine defect is discovered, document a reproducible case and raise it against `match3-core`. Do not silently patch around it inside Shape Match.

## 4. First production milestone: visual POC

Produce a representative game screen showing:

- An 8×8 board.
- All six geometric shapes.
- The four special-piece treatments.
- Moves, score, and objective HUD.
- Desktop and mobile layouts.
- Representative match, cascade, and special-effect feedback.

Aim for a cohesive, colorful, tactile, commercially credible 2D puzzle aesthetic.

The shapes must remain recognizable without color.

Pay particular attention to differentiating squares and rectangles.

Provide visual evidence:

- Desktop screenshot.
- Mobile portrait screenshot.
- Close-up of all ordinary and special pieces.
- Short animation demonstration or reproducible preview, where feasible.

Do not substitute low-fidelity placeholder graphics for the approved final visual target.

### G1 acceptance

Stop and request the user's visual approval.

Do not infer approval from successful builds, tests, screenshots, or your own aesthetic assessment.

## 5. Second milestone: playable vertical slice

After G1 approval, implement an actual playable slice using Match3 Core.

Minimum scope:

- 8×8 board with six shapes.
- Mouse, touch, and keyboard input.
- Valid and invalid swaps.
- Ordinary matching.
- Special creation and activation.
- All engine-defined special combinations.
- Cascades, gravity, and refill.
- Score, moves, and one objective.
- Engine-driven animation.
- One representative level.
- Session save and restore.
- English and Traditional Chinese switching.

Consume engine events in order.

Use `eliminated` as the authoritative removal event, not the target lists of `activated` or `combined`.

Do not accept further gameplay input until the presentation has reconciled with the engine's final state.

### G2 acceptance

Provide a playable deployed build and automated browser evidence.

Stop for user review before full production.

## 6. Third milestone: complete product

After G2 approval:

- Implement all 15 handcrafted levels.
- Add three-chapter progression.
- Add Free Play.
- Complete settings, audio, localization, accessibility, and persistence.
- Complete menus, tutorials, victory/defeat flows, and confirmation dialogs.
- Implement the approved animation and visual language.
- Complete responsive desktop/mobile layouts.

Do not expand scope without approval.

## 7. Level design verification

Maintain a level manifest with objectives, seed, configuration, move limit, and difficulty intention.

Provide automated evidence that levels are feasible.

Where exact solving is practical, use it. Otherwise, distinguish heuristic search or simulation evidence from a proof of solvability.

Provide test results and identify any levels whose difficulty or fairness requires human evaluation.

## 8. QA requirements

Run the applicable UGDS checks and project-specific tests.

Required areas:

- Build and type checks.
- Unit and integration tests.
- Real browser interaction tests.
- Mobile viewport tests.
- Keyboard accessibility.
- Language completeness.
- Reduced-motion behavior.
- Save/reload/replay.
- Engine/UI state reconciliation.
- Special-piece visual coverage.
- Deterministic stress tests.
- Recovery from malformed saves and engine failures.

For engine failures, preserve the last valid state and report enough nonpersonal information to reproduce the defect.

Do not silently change the board or engine configuration to make tests pass.

Use GitHub Issues for nonurgent defects and clearly distinguish them from release-blocking defects.

## 9. GitHub Actions and deployment

Configure CI to run on pushes and pull requests.

At minimum, CI must:

- Install dependencies reproducibly.
- Type-check.
- Build.
- Run automated tests.
- Run browser integration tests.
- Produce useful failure diagnostics.

Configure GitHub Pages deployment from the approved workflow when deployment is authorized.

Verify the actual hosted workflow result. The presence of a workflow file is not evidence of a successful run.

Do not claim that a deployed game works until its live URL has been checked.

## 10. Required reporting

At each gate, provide:

1. Current gate and status.
2. Git commit SHA and branch.
3. What was implemented.
4. What was tested, with counts and outcomes.
5. Visual artifacts or playable URL, where applicable.
6. Deviations from the GDD.
7. Known limitations and GitHub Issue links.
8. What remains unverified.
9. Explicit request for the next approval.

Avoid vague claims such as "fully tested" without supporting evidence.

Distinguish local tests, hosted CI, browser emulation, physical-device checks, and user creative acceptance.

## 11. Boundaries and authority

You may make ordinary technical implementation decisions within the approved design.

You may not independently:

- Redefine gameplay rules.
- Replace the shared engine.
- Lower the visual quality target.
- Remove agreed accessibility or localization requirements.
- Change the 15-level scope or Free Play requirement.
- Introduce paid services or unnecessary data collection.
- Skip user approval gates.
- Declare final product acceptance.

Escalate material design changes rather than making them silently.

## 12. Immediate execution order

For this first handoff:

1. Inspect all governing references.
2. Confirm repository and dependency access.
3. Prepare the technical architecture and project skeleton.
4. Configure initial local checks and CI.
5. Produce the G1 visual proof of concept.
6. Capture the required visual evidence.
7. Report results and stop for creative approval.

**Do not build the entire game before G1 approval.**

The goal is to establish the visual language and technical foundation before committing to full production.

## 13. Success criteria

The first handoff is successful when:

- The repository is initialized and documented.
- Match3 Core is pinned reproducibly.
- The technical architecture is justified.
- Initial checks pass.
- A credible visual POC is available for review.
- Any deviations and uncertainties are disclosed.
- The user can make an informed G1 approval decision.

**Final product completion remains subject to G2–G5 and explicit user acceptance.**