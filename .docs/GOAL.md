# Curated Dropship Storefront — Frozen Goal

Frozen contract for the storefront build relay. The clause groups below are mirrored verbatim from Section 3 of `.docs/BUILD_PLAN.md` (generated 2026-10-26). Implementing agents never edit clauses. When the user decides a change, append it under **Amendments** with the date, the clause IDs affected, and the new wording; the original clause text stays in place. Handoff entries cite clause IDs.

### Product (P)

- **P-01** One deployment serves every brand. A brand is validated data plus assets, and adding one needs no code unless it needs a new layout preset.
- **P-02** Only made-up demo brands are ever tracked. No real brand name, domain, logo, product, supplier, cost, or customer data.
- **P-03** Mobile-first. Every storefront flow works at 360 px width and inside the Instagram and Facebook in-app browsers; desktop is checked at 1440 px.
- **P-04** MUI 9 is the only UI kit (react-admin for the back office). Storefront flows meet WCAG 2.2 AA, with clean axe runs.
- **P-05** Storefront initial JavaScript is at most 250 KB gzipped. The admin is a separate bundle.

### Brands and theming (BT)

- **BT-01** `BrandConfig` covers the fields listed in BUILD_PLAN Section 2 ("Multi-brand model") and is validated by Zod.
- **BT-02** The brand is resolved from the hostname and inlined at the edge, with no theme flash. `?brand=` works only outside production.
- **BT-03** At least two generically named layout presets exist. Home pages are composed from typed sections.
- **BT-04** Checkout branding, emails, meta and Open Graph tags, and the favicon all follow the active brand.
- **BT-05** Invalid brand data falls back to a neutral theme and logs an error; it never breaks the site.

### Catalog and compliance (CT)

- **CT-01** Products have variants, R2 images, collections, per-brand visibility, and a draft/live/retired status.
- **CT-02** Prices are integer cents plus a currency code. Only the server computes prices.
- **CT-03** Every product carries compliance data: age grade, batteries, magnets, small parts, plant/seed/soil content, CPSC-regulated flag, CPC file, HS code, and country of origin.
  - Publishing is blocked when any of that data is missing.
  - It is also blocked for a product for ages 12 and under without a CPC on file.
  - Anything containing seeds, soil, or plant material can never be published.
- **CT-04** Product pages show a delivery window computed from the product's shipping profile.
- **CT-05** Raw product and collection HTML contains the title, description, Open Graph and Twitter tags, and Product JSON-LD.

### Checkout and payments (CP)

- **CP-01** Checkout is Stripe-hosted only. Card data never touches our code.
- **CP-02** Sessions use per-brand `branding_settings`, allowed countries from the brand's markets (US at launch), shipping options, and promotion codes.
- **CP-03** Webhooks are signature-verified and idempotent. One paid session creates exactly one order.
- **CP-04** `PAYMENTS_MODE=fake` exists for local and end-to-end testing and cannot run in production.
- **CP-05** Secrets live only in Wrangler secrets and the gitignored `.dev.vars`.

### Orders and fulfillment (OF)

- **OF-01** One shared order state machine. Every transition is an append-only event recording who acted and when.
- **OF-02** A Cloudflare Workflow drives each paid order through routing, placement, confirmation, shipment, and delivery. Timeouts escalate to operator tasks.
- **OF-03** Vendors are reached only through `VendorAdapter`s, chosen per vendor offer.
  - New adapters need no workflow changes.
  - Every adapter passes a shared conformance test suite.
- **OF-04** No personal-WeChat bots, marketplace scraping, or unattended purchases on third-party sites.
- **OF-05** Vendor payment requires operator approval by default. Auto-pay is opt-in per vendor, with a spending limit.
- **OF-06** When an order misses its ship-by date, the customer is told automatically and offered a one-click cancel and refund.
- **OF-07** Customers can see order status and tracking by entering their order number and email. The lookup is rate-limited.
- **OF-08** Every vendor scenario runs offline through the real workflow and produces a readable timeline, which is snapshot-tested.

### Sourcing (SR)

- **SR-01** A candidate pipeline from idea to listed product. It records source platform and URL, trend notes, sample tracking, an evaluation rubric, photos, and a compliance checklist.
- **SR-02** A tested margin calculator gives landed cost, break-even price, contribution per order, and break-even return on ad spend, with warnings when margins are too thin.
- **SR-03** An approved candidate converts into a product draft with a vendor offer attached.

### Admin and operations (AD)

- **AD-01** `/admin` and `/api/admin` sit behind Cloudflare Access when deployed, and the Worker also verifies the Access token (JWT). A development bypass works only when `APP_ENV=development`.
- **AD-02** The admin covers:
  - orders (timeline and refunds)
  - operator tasks
  - products
  - vendors and offers
  - brands, with a live preview
  - sourcing
  - the simulator (outside production only)
- **AD-03** Deployed Workers have no routes in config, and `workers_dev` and preview URLs are off. Domains are attached in the Cloudflare dashboard.
- **AD-04** CI only builds and tests. Deploys run from the owner's machine.
- **AD-05** A pre-commit hook and `npm run leak-check` block any tracked content that matches the private denylist.

### Quality (AQ)

- **AQ-01** `npm run build`, `npm run test:unit`, and `npm run test:e2e` pass at every slice. Worker logic is tested inside workerd.
- **AQ-02** End-to-end tests cover browse, cart, fake checkout, order creation, simulated fulfillment, and the status page, with axe checks.

### Non-goals (NG)

- **NG-01** No PayPal or custom payment flows at launch.
- **NG-02** No customer accounts; guest checkout plus order lookup only.
- **NG-03** No EU or UK sales until an amendment approves the EU improvement.
- **NG-04** No server-rendering framework.
- **NG-05** No inventory or warehouse features in the relay.
- **NG-06** No automated ad spending in the relay.

## Amendments

Append only, newest last. Format: `- YYYY-MM-DD — <clause IDs> — <decision and new wording> — approved by user`.
