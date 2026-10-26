# Business Notes

Research behind BUILD_PLAN Section 1, gathered in October 2026. Tariffs and platform rules change often, so re-check the sources before pricing or compliance decisions. This is planning research, not legal or tax advice.

This repo is public. Never add the real brand, domain, suppliers, costs, or customer data here; those live in `private/` and Cloudflare.

## 1. The model

Curated products made in China are found on Amazon, Instagram, Taobao, RedNote, and trend tools. Each one is validated by ordering a sample first, then rebranded and listed on the storefront. Customers pay through Stripe Checkout. Each paid order is placed with a vendor (through an API, a sourcing agent, or an operator messaging the vendor) and shipped directly to the customer. The store holds no inventory.

## 2. Reality check

### 2.1 US duties and customs

- The $800 de minimis exemption no longer applies to any country. Courier shipments lost it on August 29, 2025 [2]. For mail, CBP suspended it indefinitely on June 24, 2026 and opened a new postal informal-entry process on July 24, 2026 [1][3].
- The Supreme Court struck down the IEEPA tariffs on February 20, 2026. A 10% Section 122 surcharge covered February 24 to July 24, 2026. Since July 24, 2026, a Section 301 tariff tied to forced-labor enforcement applies to about 60 economies: 12.5% for China, on top of normal (MFN) duty and the existing China Section 301 tariffs [4][5].
- 178 exclusions from the China Section 301 tariffs expire on November 9, 2026 [5]. Expect rates on some products to move.
- From January 20, 2027, postal shipments subject to Section 301, 232, or 201 duties, or to a partner agency such as the CPSC, must be filed electronically as Entry Type 13 (otherwise formal entry). That covers essentially every China-origin parcel, and every CPSC-regulated product [1][3][4].
- Zonos reports that postal shipments up to $2,500 must now have duties prepaid [4].
- Many China sellers have moved to bulk imports into US warehouses and domestic shipping [5].

What this means for the store:

- Ship only on DDP (duties-paid) lines, so customers never get a bill at the door. Duty is part of the landed cost.
- Ask every logistics line how it files US entries (Entry Type 13 or formal entry) and who supplies CPSC certificate data for regulated products.
- Re-check duty rates per HS code before setting a price.

### 2.2 EU and UK (deferred; see NG-03)

- Since July 1, 2026, the EU charges a temporary €3 customs duty per item type in consignments up to €150. Items with the same tariff classification count once, so five T-shirts cost €3 but T-shirts plus a watch cost €6. It applies until July 1, 2028, when normal duty rates take over [6][7][8].
- The seller, platform, or carrier declares and pays it, not the consumer. Non-EU sellers are responsible for customs formalities and duty payment [6][9].
- A per-item Union handling fee is expected from about November 1, 2026 [6][9].
- VAT is separate: low-value distance sales use IOSS, which a non-EU seller registers for through an EU intermediary.
- The General Product Safety Regulation (GPSR) requires an EU-based responsible person for every product. Online listings must show the manufacturer's contact details and the responsible person's name and postal and electronic addresses [10].
- EU consumers also have a 14-day right to withdraw from distance purchases, and tracking pixels need consent.
- The UK has its own regime: for consignments of £135 or less, overseas sellers charge UK VAT at checkout. It needs separate research before any UK launch.

### 2.3 Product safety and categories

- **CPSC eFiling:** since July 8, 2026, importers must electronically file certificate data for regulated consumer products. That includes toys, children's products, and battery-powered products. There is no low-value or direct-to-consumer exemption [11][29].
- **Children's products (designed for ages 12 and under):** these need third-party testing by a CPSC-accepted lab and a Children's Product Certificate (CPC). The importer must issue its own CPC; it cannot pass along the factory's certificate, though it may rely on the factory's lab results with due care [12][13]. In a dropship model, plan as if the store is the importer.
- **Other regulated products** need a General Certificate of Conformity (GCC). The CPSC Regulatory Robot helps decide which rules apply.
- **Seeds, soil, and plants:** anyone buying seeds from abroad is an importer and usually needs an APHIS PPQ 587 permit. Small lots of seed have strict packet, labeling, and inspection-station rules. Soil and plant material are regulated separately [14][15][30]. Gardening kits should be tools, planters, and decor, with any seeds sourced in the US.
- **Extra review (not researched in depth):** lithium and coin-cell batteries (many shipping lines restrict them), small powerful magnets, lasers, anything with a radio (FCC), food-contact items, and California Proposition 65 warnings for cheap plastics and metals.
- **Knockoffs and copyright:** products copying designer toys, licensed characters, or trademarks are off limits. So are supplier photos the store doesn't have rights to. Use original photos and video from the samples.

### 2.4 Vendors, agents, and WeChat

- Tencent does not allow bots to control WeChat accounts, whether personal or WeCom staff accounts. Injection and protocol bots carry a high ban risk. The only official automation path is WeCom Customer Service, which is built for inbound customer support [16].
- So WeChat vendors use the `assisted` adapter: the system drafts a bilingual order message, an operator sends it, and the operator records the confirmation.
- The better path is to ask WeChat-only factories to deliver to a sourcing agent's China warehouse. The agent then ships to customers, and the store talks only to the agent's API. See Section 4 for the agent comparison.
- Every vendor must ship in neutral or branded packaging, with no Chinese invoices or other sellers' branding in the parcel.

### 2.5 Payments

- Stripe does not list dropshipping as prohibited, but it can require extra due diligence for some categories and can impose reserves or pause payouts when it sees risk [17][18].
- Long delivery times and "where is my order" frustration drive chargebacks, which are the main account risk. Keep disputes well under 1% of orders with honest delivery windows, prompt tracking emails, and quick refunds.
- One Stripe account can brand each Checkout session with `branding_settings` (display name, logo, icon, colors, font, corner style). Receipts, invoices, and terms still show the account's business name, and Stripe warns that an unrecognizable name raises chargeback risk [19].
- Stripe's PayPal payment method supports only businesses in Europe, the UK, and the EEA. US businesses would need the PayPal custom payment method, which is in preview [20]. Hence NG-01.
- The store pays vendors when an order is placed but receives Stripe payouts later. New accounts often wait longer, so keep working capital (or a business card) for vendor payments.

### 2.6 Shipping promises: the FTC Mail Order Rule

What the rule requires [21]:

- Any shipping time the store states needs a reasonable basis. With no statement, the store must be able to ship within 30 days.
- On learning it can't ship on time, the store must send a delay-option notice, and no notice may arrive later than the original promised date. The notice gives a revised ship date (or says it is unknown), says the customer may cancel for a full, prompt refund, and offers a way to cancel at the store's expense.
- If the revised date is at most 30 days after the original, the customer's silence counts as consent. Longer or indefinite delays, and every second delay, need express consent. Without it, the store must refund promptly without being asked.
- Keep records of the notices sent.

What Slice 5's `OrderWorkflow` must do:

- **Internal ship-by date:** product pages promise a window. The workflow's ship-by date is an internal deadline a few days before the promised date, so every notice arrives in time.
- **First timeout:** send the delay-option notice with a definite revised date no more than 30 days out, plus a one-click cancel link. Silence keeps the order open.
- **Second timeout, or a revised date more than 30 days out:** ask the customer to confirm they still want to wait. If they don't confirm by the deadline, cancel and refund automatically.
- **Records:** every notice, consent, and cancellation is recorded as an order event.
- **Definition:** "shipped" means the vendor handed the parcel to a carrier and tracking exists. Delivery comes later.

### 2.7 Ads and trend research

- Meta Advantage+ generates ad variations, and Meta now offers small businesses fully automated campaigns from just a website URL and a budget [23].
- Through the Marketing API, Meta's generative features (text generation, image expansion, background generation) are opt-in per ad. Ads with AI-generated parts must be created paused, previewed, and then enabled [22].
- Plan: start in Ads Manager with original sample photos and video, give each product test a fixed budget and stop-loss, and build the creative kit (an improvement after the relay) only once the store converts.
- The Meta Ad Library (free) shows competitors' running ads. Paid trend tools surface products that are often already saturated. The curated brand and the samples-first quality bar are what set the store apart.

## 3. Unit-economics worksheet

```text
landed cost      = supplier cost + agent fee + DDP shipping + duty (only if not DDP) + packaging/insert
payment fees     = price × 2.9% + $0.30      (Stripe standard US card rate; international cards and currency conversion cost more)
refund reserve   = price × reserve %         (refunds, reships, and "keep it" replacements)
contribution     = price − landed cost − payment fees − refund reserve
break-even ROAS  = price ÷ contribution      (revenue needed per $1 of ad spend to break even)
profit per order = contribution − customer acquisition cost (CAC)
```

All inputs below are illustrative assumptions. Replace them with real agent and shipping quotes. Sales tax passes through and is not included. Slice 8 turns these formulas into `src/shared/pricing/margin.ts`, and the single-item column becomes a test case.

| Line | Single item | Two-item bundle |
| --- | ---: | ---: |
| Price | $39.99 | $64.99 |
| Supplier cost | $6.00 | $12.00 |
| Agent fee | $1.00 | $2.00 |
| DDP shipping | $10.00 | $13.00 |
| Packaging insert | $0.50 | $0.50 |
| Landed cost | $17.50 | $27.50 |
| Payment fees | $1.46 | $2.18 |
| Refund reserve (4%) | $1.60 | $2.60 |
| Contribution before ads | $19.43 | $32.71 |
| Break-even ROAS | 2.06 | 1.99 |

Profit per order at different customer acquisition costs:

| CAC | Single item | Two-item bundle |
| --- | ---: | ---: |
| $15 | +$4.43 | +$17.71 |
| $25 | −$5.57 | +$7.71 |
| $35 | −$15.57 | −$2.29 |

Takeaways: one cheap item rarely pays for a cold ad click. Bundles, free-shipping thresholds that lift order value, and repeat customers carry the margin. Products that hold up at a $25 CAC are worth testing.

## 4. Sourcing agents compared

| | CJdropshipping | BuckyDrop | HIOBuy |
| --- | --- | --- | --- |
| What it is | Dropshipping agent with its own catalog and API | Sourcing and branded-dropshipping agent for 1688, Taobao, Alibaba, and AliExpress | Procurement API for buying on Taobao and 1688 |
| Placing orders | `createOrderV2`: `payType=2` pays from balance at once; `payType=3` creates only, then `payBalanceV2` pays [24] | Shop orders (from stock) and transfer/purchase orders (sourced for you); cancel and return endpoints [25] | `orders/preview`, `orders/create`, `orders/pay` [27] |
| Duplicate protection | Our `orderNumber` (check behavior in Slice 9) | `partnerOrderNo` must be unique: `70010102` = concurrent duplicate, `70010136` = already used; look the order up before retrying [25] | `external_order_id` [27] |
| Status and tracking | Order detail and track-query endpoints [24] | Webhooks plus an order-detail query [25] | Order detail and trace [27] |
| Test environment | None found in this research | Shared sandbox with published credentials; live access by application [25] | Not checked |
| Branding and QC | Not checked | Private label, custom packaging with no minimum order, quality checks, free storage [26] | n/a |
| Shipping | Freight-calculation endpoint [24] | Multiple routes, DDP worldwide [26] | Delivers within China, such as to an agent's warehouse [27] |
| Best fit | Catalog products with fully automated orders | Taobao and 1688 finds, and WeChat factories shipping through the agent's warehouse | Buying samples or small stock into a China warehouse |

The pay-later flow in both APIs (CJ `payType=3`, BuckyDrop purchase orders) supports OF-05: vendor payment needs operator approval unless auto-pay is turned on for that vendor with a limit.

## 5. Non-code launch checklist

### Business setup

- [ ] Form an LLC (liability protection matters for physical products) and get an EIN.
- [ ] Run a USPTO trademark search on each brand name (toys, retail, and housewares classes) before spending on branding.
- [ ] Open a business bank account and a business card for vendor payments.
- [ ] Register for sales tax in the home state. Decide whether to use Stripe Tax, and watch other states' economic-nexus thresholds as sales grow.
- [ ] Get general and product liability insurance before selling toys or electronics.
- [ ] Track vendor cost, refunds, and ad spend per order. The admin records cost paid per fulfillment.

### Payments

- [ ] Build in Stripe test mode first. Activating live payments needs a reachable site with product details, policies, and contact information (Slice 11's go-live checklist).
- [ ] Choose a statement descriptor customers will recognize.
- [ ] Expect slower early payouts and possible reserves. Keep cash on hand for vendor payments.

### Meta and marketing

- [ ] Set up a Meta Business portfolio, Facebook Page, Instagram account, and ad account. Verify the domain with a DNS record in Cloudflare.
- [ ] Research competitors in the Meta Ad Library.
- [ ] Set a test budget and a stop-loss for each product before spending.

### Sourcing and vendors

- [ ] Open CJdropshipping and BuckyDrop accounts. Apply for BuckyDrop live API access when Slice 9 is near.
- [ ] Ask WeChat-only factories whether they will ship through an agent's warehouse.
- [ ] Order samples through an agent so several items share one international shipment.
- [ ] Score every sample: build quality, match to the listing, packaging, finish and smell, safety concerns, and actual delivery time. Shoot original photos and video.
- [ ] Require neutral or branded packaging, with no invoices or other branding in parcels.
- [ ] Ask each shipping line: DDP or not, transit time, whether it accepts batteries, how US entries are filed, and who handles CPSC certificate data.

### Per-product compliance, before listing

- [ ] Age grade is 14+ unless a CPC exists.
- [ ] Run the CPSC Regulatory Robot. Collect test reports, and issue a CPC (children's products) or GCC (other regulated products) where required.
- [ ] Nothing with seeds, soil, or plant material.
- [ ] Extra review for batteries, small powerful magnets, lasers, radios (FCC), and food-contact items.
- [ ] No trademarks, licensed characters, designer copies, or borrowed photos.
- [ ] California Proposition 65 review for plastics and metals.

### Customer service and policies

- [ ] Set up a support inbox (Cloudflare Email Routing can forward it).
- [ ] Publish shipping, returns, privacy, and terms pages (Slice 11 templates) with honest delivery windows.
- [ ] For low-cost items, resolve problems with a photo plus a refund or replacement, never return shipping to China.

### Privacy and anonymity

- [ ] Confirm WHOIS redaction for the domain.
- [ ] Know what is public anyway: the Stripe statement descriptor, the Meta Page and its Ad Library entries, and (for any future EU launch) the trader identity the EU requires on the site.
- [ ] Back up `private/` to a password manager or a separate private repository. Apart from Cloudflare, it is the only copy of the real brand pack.

## 6. Decision log

- **2026-10-25: custom stack on Cloudflare + Stripe.** Chosen over headless Shopify and over a plain Shopify theme with dropship apps.
  - Headless Shopify: the Basic plan is $29/month per store, and each brand needs its own store. Below Shopify Plus, the information, shipping, and payment checkout steps can't be customized [28].
  - Plain Shopify theme: fastest to launch, but no React/MUI and little room for custom vendor automation.
- **2026-10-25: public repo with demo brands only.** Real brand data lives in Cloudflare and `private/`, and deploys run from the owner's machine.
- **Defaults to confirm in review:** US-only, 14+ categories, a CPC gate for ages 12 and under, and no seeds, soil, or plants.

## Sources

1. CBP, E-Commerce FAQs: https://www.cbp.gov/trade/basic-import-export/e-commerce/faqs
2. Federal Register, implementation of Executive Order 14324 (de minimis suspended for all countries): https://www.federalregister.gov/documents/2025/09/02/2025-16802/notice-of-implementation-of-the-presidents-executive-order-14324-suspending-duty-free-de-minimis
3. Federal Register, postal de minimis suspension and informal entry, compliance date extended to January 20, 2027: https://www.federalregister.gov/documents/2026/10/22/2026-21600/indefinite-suspension-of-the-de-minimis-exemption-for-mail-shipments-and-new-postal-informal-entry
4. Zonos, US import tariff tracker: https://zonos.com/docs/guides/us-tariff-changes
5. Why It Lands, "US de minimis end, tariffs and USMCA: parcel rules explained" (updated October 23, 2026): https://www.whyitlands.com/briefings/na-us-parcel-rules
6. European Commission, guidance on the temporary €3 duty: https://taxation-customs.ec.europa.eu/news/guidance-and-legal-text-temporary-flat-fee-low-value-imports-which-will-apply-until-1-july-2028-2026-06-08_en
7. European Commission, "Ensuring fairness and safety: €3 customs duty for low-value parcels": https://commission.europa.eu/news-and-media/news/ensuring-fairness-and-safety-eur3-customs-duty-low-value-parcels-2026-06-29_en
8. Council of the EU, EU action on the influx of small parcels: https://www.consilium.europa.eu/en/policies/eu-action-influx-of-small-parcels/
9. European Commission, EU customs reform: https://taxation-customs.ec.europa.eu/customs/eu-customs-reform_en
10. European Commission, GPSR guidelines for businesses (C/2025/6233): https://eur-lex.europa.eu/eli/C/2025/6233/oj/eng
11. CPSC, eFiling FAQ: https://www.cpsc.gov/FAQ/eFiling-Frequently-Asked-Questions-FAQ
12. CPSC, Children's Product Certificate: https://www.cpsc.gov/Business--Manufacturing/Testing-Certification/Childrens-Product-Certificate
13. CPSC, Online Sellers Safety Guide FAQs: https://www.cpsc.gov/FAQ/Online-Sellers-Safety-Guide-FAQs
14. USDA APHIS, How to buy plants and seeds online: https://www.aphis.usda.gov/plant-imports/buy-plants-seeds-online
15. USDA APHIS, Seeds with special requirements and prohibited seeds: https://www.aphis.usda.gov/plant-imports/buy-plants-seeds-online/seeds-additional-requirements
16. Tencent Cloud developer community, on WeChat bots and the official WeCom Customer Service path (Chinese): https://cloud.tencent.com/developer/article/2730298
17. Stripe, Prohibited and restricted businesses: https://stripe.com/legal/restricted-businesses
18. Stripe, Services Agreement (reserves): https://stripe.com/legal/ssa
19. Stripe, Checkout appearance and per-session `branding_settings`: https://docs.stripe.com/payments/checkout/customization/appearance
20. Stripe, PayPal payments: https://docs.stripe.com/payments/paypal/accept-a-payment and the PayPal custom payment method: https://docs.stripe.com/payments/payment-methods/custom-payment-methods/paypal
21. FTC, Business guide to the Mail, Internet, or Telephone Order Merchandise Rule: https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule
22. Meta, Generative AI features on the Marketing API: https://developers.facebook.com/docs/marketing-api/creative/generative-ai-features/
23. Forbes, "Meta Will Run Your Entire Ad Campaign With AI. Should You Let It" (April 25, 2026): https://www.forbes.com/sites/terdawn-deboe/2026/04/25/meta-will-run-your-entire-ad-campaign-with-ai-should-you-let-it/
24. CJdropshipping, API 2.0: https://developers.cjdropshipping.com/en/api/api2/ and the shopping endpoints: https://developers.cjdropshipping.com/en/api/api2/api/shopping.html
25. BuckyDrop, OpenAPI: https://solution-api.buckydrop.com/en/api
26. BuckyDrop, platform overview: https://www.buckydrop.com/en/ and Shopify app listing: https://apps.shopify.com/buckydrop
27. HIOBuy, create procurement order: https://hiobuy.com/en/api-docs/order-create
28. Shopify, pricing: https://www.shopify.com/pricing and checkout customization by plan: https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations
29. UPS, New CPSC eFiling requirements: https://www.ups.com/us/en/shipping/international-shipping/tariffs/cpsc
30. USDA APHIS, How to import plants and plant products (includes soil): https://www.aphis.usda.gov/plant-imports/how-to-import

Platform references used by the plan:

- Cloudflare Workflows events (`waitForEvent`): https://developers.cloudflare.com/workflows/build/events-and-parameters/
- Cloudflare Vitest integration test APIs (Workflow introspection): https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis/
- Wrangler configuration (routes and the dashboard as source of truth): https://developers.cloudflare.com/workers/wrangler/configuration/
- Cloudflare Email Service pricing: https://developers.cloudflare.com/email-service/platform/pricing/
- MUI versions: https://mui.com/material-ui/getting-started/versions/
- react-admin 5.15.0 (MUI 9 support): https://github.com/marmelab/react-admin/releases/tag/v5.15.0
