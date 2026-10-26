# Curated Dropship Storefront — Relay Handoff Ledger

Append-only. Never rewrite or delete an earlier entry; add a correction entry instead. One entry per slice attempt, in chronological order. Each slice commits when it is done; the user reviews after the whole relay.

Rules: `.docs/BUILD_PLAN.md` (Section 4), `.cursor/rules/storefront-relay.mdc`, and `.cursor/rules/public-repo-hygiene.mdc`. Contract: `.docs/GOAL.md`.

Entries never contain the real brand name, domain, supplier details, costs, customer data, or secrets. Use the demo brands and placeholders.

## Entry template

Copy this block to the end of the file and fill every field. Keep the headings; use `n/a` rather than deleting a field.

```markdown
## Slice NN — <title> — <YYYY-MM-DD>

- Starting commit: `<hash>` (<subject>)
- Working tree at start: clean | <describe>
- GOAL clauses addressed: <IDs, e.g. BT-01, BT-02, CT-03>
- Library research and decisions: <what was checked, what was chosen, why>
- Files changed: <paths, grouped>
- Behavior implemented: <what a user can now do / what changed>
- Tests and exact results:
  - `npm run build` — <pass/fail, summary line>
  - `npm run test:unit` — <pass/fail, counts per Vitest project>
  - `npm run leak-check` — <pass/fail>
  - `npm run test:e2e` — <pass/fail, counts> | not run (no browser flow affected)
- Evidence: `.docs/evidence/NN-<slug>/<file>.png` — <what it shows> (one line per screenshot; demo brands only)
- Earlier-slice defects fixed: none | <what, why it blocked this slice>
- Known limitations / follow-ups: none | <item — target Slice NN>
- Status: COMPLETE
- Commit: `feat(slice-NN): <short title>`
```

The finishing agent commits that entry in the same slice commit (do not wait for review; do not add a second commit just to store `git log -1`'s hash). The next agent matches HEAD to this `Commit:` subject.

Corrections in the same chat before the next slice starts get their own short entry, then a new commit:

```markdown
## Slice NN — correction <k> — <YYYY-MM-DD>

- Requested: <what the user asked to change>
- Changed: <files / behavior>
- Tests and exact results: <as above>
- Status: COMPLETE
- Commit: `feat(slice-NN): <short title>`
```

---

## Ledger

## Slice 00 — baseline — 2026-10-26

- Starting commit: `f2daa49` (Initial commit)
- Working tree at start: `README.md` modified (embeds `.docs/image.png`). Untracked: both rules in `.cursor/rules/`; the four contract files, `image.png`, and both Excalidraw files in `.docs/`; `.github/workflows/render-excalidraw.yml`; `.gitignore`; `.gitattributes`. `private/` present and ignored. Matches BUILD_PLAN Section 0.
- GOAL clauses addressed: P-02 (the baseline tracks no real brand data and `private/` stays ignored) and CP-05 groundwork (`.gitignore` covers `.dev.vars`). No product behavior.
- Library research and decisions: n/a (no code or dependencies)
- Files changed:
  - Contract: `.docs/GOAL.md`, `.docs/BUILD_PLAN.md`, `.docs/handoff.md` (this entry), `.docs/BUSINESS_NOTES.md`
  - Rules: `.cursor/rules/storefront-relay.mdc`, `.cursor/rules/public-repo-hygiene.mdc`
  - Diagrams: `.docs/image.png`, `.docs/direct-dropship.excalidraw`, `.docs/middleman-amazon-warehouse.excalidraw`
  - Repo: `README.md`, `.github/workflows/render-excalidraw.yml`, `.gitignore`, `.gitattributes`
- Behavior implemented: the approved plan, frozen goal, relay rules, and diagrams are committed as the relay baseline. No application code.
- Tests and exact results:
  - `npm run build` — not run (no `package.json` until Slice 1)
  - `npm run test:unit` — not run (no `package.json` until Slice 1)
  - `npm run leak-check` — not available until Slice 1. The manual check from `public-repo-hygiene.mdc` ran on all 13 committed files: the string grep and the sha256 grep both printed nothing (grep exit 1). `grep -I` skips binaries, so `.docs/image.png` and the four PNGs embedded in the Excalidraw files (two China maps, a US map, and Amazon's logo) were checked by eye for store branding, and the embedded PNGs by hash; nothing matched.
  - `npm run test:e2e` — not run (no browser flow affected)
  - Baseline checks: branch `main`; every Section 4 required file present; `git check-ignore -q private/` exit 0; `GOAL.md` clauses identical to BUILD_PLAN Section 3; no CRLF in tracked text files; Node 24.21.0 and npm 11.19.0; no global Wrangler or Stripe CLI.
- Evidence: n/a (Slice 0 has no screenshots)
- Earlier-slice defects fixed: none
- Known limitations / follow-ups:
  - `npm run leak-check`, `scripts/leak-check.mjs`, and the `.githooks/` pre-commit hook (AD-05) — Slice 1
  - `render-excalidraw.yml` commits rendered SVGs back to `origin/main` whenever `.excalidraw` files are pushed, so pulling after a push during the relay moves HEAD past the commit below — note for the user, not a slice task
- Status: COMPLETE
- Commit: `chore: establish storefront baseline`
