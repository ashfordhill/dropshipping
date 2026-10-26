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

## Slice 01 — scaffold and test harness — 2026-10-26

- Starting commit: `3b2dec1` (`chore: establish storefront baseline`)
- Working tree at start: clean
- GOAL clauses addressed: AQ-01 (build, three Vitest projects, worker tests inside workerd, Playwright), AD-03 (no routes, `workers_dev` and preview URLs off, `keep_vars`), AD-04 (CI builds and tests only), AD-05 (leak check and pre-commit hook), P-04 (axe WCAG 2.2 AA on the mounted shell)
- Library research and decisions:
  - Cloudflare's React SPA guide (Vite plugin 1.65.0, Wrangler 4.153.0): one Worker serves the client build, `assets.not_found_handling` is `single-page-application`, and `/api/*` is `run_worker_first`. Vite 8.3.5 and `@vitejs/plugin-react` 6.1.2. Client and worker source maps are off.
  - Email Sending's Workers API (updated 2026-10-21) uses a `send_email` binding named `EMAIL`. D1 binding `DB`, R2 binding `MEDIA`, workflow binding `ORDER_WORKFLOW` with class `OrderWorkflow`. The D1 id is a placeholder. `wrangler deploy --dry-run` uses the Vite build's `dist/worker/wrangler.json`.
  - `@cloudflare/vitest-plugin` 1.4.8 accepts Vitest `^4.1` or `^5`. The plan and the current Workers test guide name Vitest 4.1, so the suite is Vitest 4.1.12 with three projects (client jsdom, worker workerd, shared Node).
  - MUI 9.5.0 with Emotion, React 19.3.1, on the default theme. Hono 4.13.14. Drizzle ORM 0.45.4 and drizzle-kit 0.31.11 write a flat SQL file Wrangler can apply. TypeScript 7.0.2. Playwright 1.64.1 and `@axe-core/playwright` 4.14.0.
  - npm 11 blocks dependency install scripts unless `allowScripts` lists them. `esbuild` and `workerd` are approved so CI can install their binaries.
  - React Router, TanStack Query, Zustand, Stripe, Zod, yaml, MSW, Fontsource, React Email, and react-admin stay out until the slices that use them.
- Files changed:
  - Tooling: `package.json`, `package-lock.json`, `tsconfig.app.json`, `tsconfig.worker.json`, `tsconfig.node.json`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `wrangler.jsonc`, `worker-configuration.d.ts`, `drizzle.config.ts`, `.github/workflows/ci.yml`, `.githooks/pre-commit`, `scripts/leak-check.mjs`, `scripts/leak-check.test.ts`
  - App: `index.html`, `public/favicon.svg`, `src/client/storefront/*`, `src/client/test/setup.ts`, `src/worker/index.ts`, `src/worker/index.test.ts`, `src/worker/workflows/order-workflow.ts`, `src/shared/health.ts`, `src/shared/health.test.ts`, `src/shared/wrangler-config.test.ts`, `src/db/schema.ts`, `src/db/client.ts`, `src/db/migrations.test.ts`, `migrations/0000_baseline.sql`, `migrations/meta/_journal.json`, `migrations/meta/0000_snapshot.json`, `e2e/smoke.spec.ts`
  - Evidence and this entry: `.docs/evidence/01-scaffold/390x844.png`, `.docs/evidence/01-scaffold/1440x900.png`, `.docs/handoff.md`
- Behavior implemented: `npm run dev` and `npm run preview` serve a storefront shell that reports whether `GET /api/health` is up. Unknown pages fall back to that shell. `npm run db:migrate:local` applies the baseline migration. `npm run leak-check` and `.githooks/pre-commit` scan tracked and untracked files against the private denylist and print only file names. CI builds and tests, and does not deploy.
- Tests and exact results:
  - `npm run build` — pass. Client `dist/client/assets/index-BV8VR7py.js` 317.36 kB, gzip 102.07 kB. Worker `dist/worker/index.js` 56.28 kB, gzip 15.57 kB. No `.map` files.
  - `npm run test:unit -- --reporter=verbose` — pass, 6 files, 13 tests. client 1, worker 4 (inside workerd), shared 8.
  - `npm run leak-check` — pass, no output (the denylist is present and nothing matched). `.githooks/pre-commit` exit 0.
  - `npm run test:e2e` — pass, 2 tests (mobile 390x844 and desktop 1440x900), both including the WCAG 2.2 AA axe check.
  - `npx wrangler deploy --dry-run` — pass. Bindings: `ORDER_WORKFLOW`, `EMAIL`, `DB`, `MEDIA`. No upload.
  - `npm run db:migrate:local` — first run applied `0000_baseline.sql`; the run after that reported no migrations to apply.
- Evidence:
  - `.docs/evidence/01-scaffold/390x844.png` — phone view of the shell, heading "Storefront", API status responding
  - `.docs/evidence/01-scaffold/1440x900.png` — the same shell at desktop width
- Earlier-slice defects fixed: none
- Known limitations / follow-ups:
  - `core.hooksPath` is not set, because that changes git config. The hook runs when Git uses `.githooks` — note for the user, not a slice task
  - `OrderWorkflow.run` is empty so the binding has a class. Order steps — Slice 5
  - The D1 database id is a placeholder. Real database, preview, and production — Slice 7
  - Storefront initial JavaScript is 102.07 kB gzipped today. Recheck the 250 kB budget as the shell grows — Slice 11
  - Brand kit, catalog, checkout, and admin — Slices 2–6
- Status: COMPLETE
- Commit: `feat(slice-01): scaffold and test harness`
