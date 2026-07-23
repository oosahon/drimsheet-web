---
name: review-pull-request
description: Review pull requests, branches, commits, staged changes, or working-tree diffs and report severity-ordered actionable findings. Use when asked to review, audit, inspect, or approve code changes before merge, including requirements, correctness, repository-rule compliance, architecture, accessibility, security, performance, maintainability, and test coverage.
---

# Review Pull Request

Review changes as a code reviewer. Find defects and material risks introduced by
the changes; do not implement fixes unless the user asks.

## Workflow

### 1. Establish the review scope

- Inspect the working tree before reviewing and preserve unrelated user changes.
- Prefer a target and comparison base supplied by the user.
- For a pull request or branch review, use available PR metadata or the merge
  base with the target branch. Do not assume that all local working-tree changes
  belong to the branch diff.
- For a request to review "current changes," include staged, unstaged, and
  relevant untracked files.
- State the reviewed range or scope. If the base remains ambiguous and different
  choices could materially change the review, ask the user before concluding.
- Inspect the complete diff, then read enough surrounding code and affected call
  sites to validate behavior. Do not review the patch in isolation.

Use read-only inspection by default. Do not edit files, stage changes, create a
review report, post comments, approve a PR, or otherwise mutate external state
unless explicitly requested.

### 2. Understand the intended change

- Read the PR description, linked ticket, acceptance criteria, or other supplied
  requirements.
- Read `ticket-description.md` from the repository root when it exists and is
  relevant.
- If requirements are missing, empty, or stale, continue reviewing what can be
  established from the code and report the resulting limitation. Ask for updated
  requirements only when they are necessary to judge correctness.
- Compare the implementation with the stated scope and flag unrelated changes
  only when they create review risk or should be separated.

### 3. Load applicable project guidance

1. Read `AGENTS.md`.
2. Read the core rules:
   - `.agents/rules/folder-structure.md`
   - `.agents/rules/dependency-rules.md`
   - `.agents/rules/file-responsibility-rules.md`
3. Inspect the available repository rules and skills, then load every one whose
   scope matches the changed files or behavior.
4. Apply these known conditional routes:
   - For React components, forms, stories, component tests, validation, or
     component public exports, use `$create-ui-components` and read every rule it
     requires.
   - For translations or i18n behavior, read
     `.agents/rules/i18n-rules.md`.
   - For shadcn-generated or shadcn-owned code, use `$add-shadcn-ui` and follow
     the shadcn rules and workflow it requires.
5. Treat current rules as authoritative. Use nearby code as context, not as
   authority when it conflicts with those rules.

Do not copy specialist rules into the review. Cite the applicable rule when a
finding depends on it.

### 4. Review by risk

Prioritize:

1. **Requirements and correctness**
   - Validate the intended behavior, data flow, error handling, boundary
     conditions, asynchronous behavior, and affected callers.
   - Look for regressions, invalid state transitions, data loss, race conditions,
     and mismatches between UI and underlying behavior.
2. **Project architecture and rule compliance**
   - Check ownership, dependency direction, file responsibilities, public APIs,
     side-effect placement, and every applicable repository rule.
3. **Accessibility**
   - Apply accessibility review whenever rendered UI or user interaction changes.
   - Check semantic elements, accessible names and labels, keyboard operation,
     focus behavior, form instructions and errors, status announcements, and
     appropriate ARIA state and relationships.
   - Check that meaning is not conveyed only by color and assess contrast,
     motion, loading, and disabled states when evidence is available.
   - Treat accessibility defects as correctness issues and assign severity from
     user impact, not from category alone.
4. **Security**
   - Check trust boundaries, authorization, validation, injection risks,
     sensitive-data exposure, unsafe browser behavior, and dependency changes.
5. **Performance**
   - Check unnecessary work, repeated requests, render churn, unbounded
     operations, unsuitable data structures, bundle impact, and resource leaks.
6. **Maintainability**
   - Check clarity, duplication, coupling, naming, ownership, public contracts,
     and whether comments or documentation are needed to preserve non-obvious
     behavior.
7. **Tests**
   - Check that changed observable behavior and important failure paths are
     covered at the appropriate level.
   - Report missing tests as a finding only when a specific unverified behavior
     creates a credible regression risk.

Do not report speculative concerns without a concrete triggering scenario and
impact. Do not report pre-existing issues unless the changes worsen or newly
expose them.

### 5. Verify proportionately

- Run the smallest relevant checks needed to confirm or refute suspected issues.
- Prefer focused tests first, then use checks such as `npm run check:structure`,
  `npm run check-stories`, `npm run lint`, and `npm run build` when warranted by
  the scope and risk.
- Use Storybook, browser inspection, or interaction tests when accessibility or
  visual behavior cannot be assessed confidently from code and verification is
  feasible.
- Avoid automatic fix or formatting commands during a review.
- Distinguish failures introduced by the changes from unrelated existing
  failures. Report every relevant check that was not run or could not complete.

## Report the review

Lead with actionable findings ordered by severity:

- **P0 — Critical:** Causes catastrophic or broadly unsafe outcomes and blocks
  release immediately.
- **P1 — High:** Causes serious functional, security, accessibility, or data
  integrity failures and should be fixed before merge.
- **P2 — Medium:** Causes a real defect in a limited or non-critical scenario and
  should normally be fixed.
- **P3 — Low:** Causes a minor but concrete defect or project-rule violation with
  limited impact.

For each finding:

1. Write a concise title prefixed with its priority.
2. Point to the tightest relevant file and line range.
3. Explain the triggering scenario, evidence, and impact.
4. Suggest the direction of a fix when it is not obvious.
5. Keep one independently actionable issue per finding.

After the findings, provide a brief conclusion containing:

- Assumptions or unanswered questions that materially affect confidence.
- Verification performed and checks not run.
- A concise overall risk summary.

If there are no findings, say `No actionable findings identified.` and still
state the reviewed scope and verification limitations. Avoid praise, generic
advice, and style preferences that are not backed by project rules or concrete
maintenance risk.
