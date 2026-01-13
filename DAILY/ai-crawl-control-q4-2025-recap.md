# AI Crawl Control: Q4 2025 Ship Recap

## Putting Creators Back in Control of AI

Over the past three months, the AI Crawl Control team shipped **153 tickets** representing a massive leap forward in our mission to give content creators visibility, control, and the ability to monetize their content in the age of AI.

The internet is at an inflection point. AI crawlers are consuming content at unprecedented scale without attribution or compensation, threatening the business models that sustain content creation. Our Q4 deliveries represent Cloudflare's answer: a comprehensive toolkit that lets any site owner—from individual creators to major publishers—decide who accesses their content and on what terms.

---

## Pay Per Crawl: Building for Scale and Experimentation

**Pay Per Crawl (DARIC)** transforms AI crawling from background traffic into a metered, billable channel. This quarter's focus was on making that channel reliable enough for enterprise deals and flexible enough to enable internal and customer experimentation with pricing and policy.

### In-Band Pricing

We completed the **in-band pricing** architecture ([AA-120](https://jira.cfdata.org/browse/AA-120)), which lets publishers set prices dynamically from their own code instead of static configuration. A Worker at the edge can inspect `request.cf.bot_management.detection_ids` to identify the crawler and examine the request path—archives vs. fresh news, API vs. HTML—then return a `crawler-price` header to set a different price on every response. DARIC treats those origin-specified prices as first class, so commercial teams can run pricing experiments per bot and per content type without waiting for an FL release.

To make this accessible, we shipped a [deployable Worker template](https://gitlab.cfdata.org/crodrigues/ppc-worker-template/-/blob/main/worker.js) ([AA-279](https://jira.cfdata.org/browse/AA-279)) that publishers can use immediately, and validated the approach with internal demos covering two-dimensional policies: different rates for known vs. unknown bots, and different rates by content type ([AA-248](https://jira.cfdata.org/browse/AA-248), [AA-293](https://jira.cfdata.org/browse/AA-293), [AA-294](https://jira.cfdata.org/browse/AA-294)). Integration tests now cover the full Worker subrequest flow ([AA-302](https://jira.cfdata.org/browse/AA-302)).

### Payment Protocol Hardening

We hardened the **payment protocol** itself. 402 responses now carry a clear license URL ([AA-276](https://jira.cfdata.org/browse/AA-276))—appearing both as an HTTP `Link` header (`rel="license"`) and in the JSON body—so crawlers making autonomous payment decisions know exactly what terms they're agreeing to. We also fixed response code semantics ([AA-257](https://jira.cfdata.org/browse/AA-257)) so crawlers get unambiguous signals: 402 means "pay me," 400 means "malformed request," 403 means "blocked."

On the reporting side, charged requests now show up directly in HTTP analytics via `ppcStatus` in GraphQL ([AA-97](https://jira.cfdata.org/browse/AA-97)), letting publishers compare total traffic with billable traffic and reconcile invoices against actual usage.

### Discovery APIs for Crawlers

For the marketplace to work, crawlers need to answer two questions before they can start paying:

- **Where can I pay for content?** A new discovery endpoint ([AA-299](https://jira.cfdata.org/browse/AA-299)) returns all accounts and zones with Pay Per Crawl enabled, with cursor-based pagination for efficient querying across thousands of publishers. This is the index that makes the marketplace queryable—AI companies can discover charging publishers programmatically instead of guessing.
- **What terms have I agreed to?** The API now retrieves contract PDFs directly from Ironclad ([AA-289](https://jira.cfdata.org/browse/AA-289)), surfacing legal agreement status alongside Stripe billing status. Crawlers can verify what they've signed before making payments.

We also expanded the beta with new publisher screenings approved this quarter, including **Funke Mediengruppe**, **SAP SE**, **Infogreffe**, and **Gutefrage.Net GmbH**.

### Operational Integrity

Internally, we needed to guarantee the system can't be abused or misconfigured:

- **Can we guarantee integrity of pricing agreements?** Yes—cryptographically. The crawlers API now requires Web Bot Auth ([AA-327](https://jira.cfdata.org/browse/AA-327)), ensuring only verified crawlers can query discovery endpoints. Unknown bots probing for configuration leaks get nothing.
- **How can we disable Pay Per Crawl for security or compliance?** Through entitlements. Removing entitlements from an account now properly disables the feature across FL ([AA-92](https://jira.cfdata.org/browse/AA-92)). Before this work, entitlement revocation didn't propagate—zones could continue charging even after access was revoked. Now the system is self-healing.

### Summary

Taken together, Q4 moved Pay Per Crawl toward **marketplace-ready infrastructure**: dynamic pricing that publishers control, a protocol crawlers can integrate with confidence, and an operational surface area the business can depend on.

### References

**Q4 Jira Tickets**
- [AA-120: In-band pricing via crawler-price header](https://jira.cfdata.org/browse/AA-120)
- [AA-279: Worker template for pricing policies](https://jira.cfdata.org/browse/AA-279)
- [AA-276: License URL in 402 responses](https://jira.cfdata.org/browse/AA-276)
- [AA-257: 402 priority and proper error codes](https://jira.cfdata.org/browse/AA-257)
- [AA-97: Charged request analytics in GraphQL](https://jira.cfdata.org/browse/AA-97)
- [AA-299: Discovery endpoint for configured accounts](https://jira.cfdata.org/browse/AA-299)
- [AA-289: Ironclad contract retrieval](https://jira.cfdata.org/browse/AA-289)
- [AA-327: Web Bot Auth for crawlers API](https://jira.cfdata.org/browse/AA-327)
- [AA-92: Entitlement-based disable](https://jira.cfdata.org/browse/AA-92)

**GitLab & Internal Resources**
- [PPC Worker Template](https://gitlab.cfdata.org/crodrigues/ppc-worker-template/-/blob/main/worker.js) — Deployable pricing policy template
- [DARIC API repository](https://gitlab.cfdata.org/cloudflare/pvc/privacy-core) — Backend API (now daric-api)
- [Internal & Crawlers API Documentation](https://wiki.cfdata.org/display/~acruz/DARIC+-+Internal+and+Crawlers+API+documentation) — Complete API reference

---

## Operator-Focused Analytics for Business Development

Before this quarter, publishers were flying blind. They knew AI crawlers were hitting their sites, but they couldn't answer the questions that actually matter: _How is ByteDance accessing my API? Which images on my site are being used to train OpenAI's models? How frequently are AI assistants reading articles I published this week? Are search engine crawlers hitting 429s or 403s because of security rules I'm not even aware of?_

These aren't hypotheticals—they're the questions publishers ask every day when trying to decide which operator is worth a phone call, which crawler is worth blocking, and which content is valuable enough to monetize. Before Q4, none of them were answerable. Now they all are.

This quarter we rebuilt the AI Crawl Control dashboard from the ground up. The new interface surfaces operator-level insights, lets users drill down from aggregate trends to individual bot behavior, and exports data for external analysis—giving publishers everything they need to turn crawler traffic into business development conversations and informed content strategy.

The new **Overview page** delivers an executive summary with at-a-glance statistics, while the redesigned **Crawlers section** ranks operators by crawl and referral volume—surfacing exactly who's consuming the most and making it obvious where to focus outreach. A new **Drilldown menu** lets users inspect any bot on Radar, jump directly to raw logs in Security Analytics, and copy bot identifiers (user agent or detection ID) to fine-tune behavior with Redirect Rules, custom Link headers, or targeted WAF exceptions.

The **Requests chart** now supports grouping by crawler, operator, host, or status code—with downloadable data for external analysis. Filter by hostname, path, or content type, or pivot to a **single-operator view** to see all activity from OpenAI, Anthropic, or any other company in isolation. That operator-level lens is what turns raw traffic data into the foundation for large-scale licensing conversations.

### References

**Developer Documentation**

- [Analyze AI traffic](https://developers.cloudflare.com/ai-crawl-control/features/analyze-ai-traffic/) — Metrics, filters, and CSV export
- [Manage AI crawlers](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/) — Crawler controls and per-crawler actions

**Q4 Changelog (what shipped)**

- [New Overview tab](https://developers.cloudflare.com/changelog/2025-12-18-overview-tab/) — December 2025: Executive summary, operator grouping, customizable filters
- [Crawler drilldowns with extended actions menu](https://developers.cloudflare.com/changelog/2025-11-10-ai-crawl-control-crawler-info/) — November 2025: Status code charts, View on Radar, Copy User Agent/Detection ID, Security Analytics integration
- [Enhanced metrics with drilldowns and filters](https://developers.cloudflare.com/changelog/2025-10-14-enhanced-metrics-drilldowns/) — October 2025: Group by crawler/operator/host/status code, referrer analytics, CSV export
- [AI Crawl Control product changelog](https://developers.cloudflare.com/ai-crawl-control/changelog/) — Full release history

**Internal Resources**

- [AI Crawl Control Jira Project](https://jira.cfdata.org/projects/AA/issues) — Full ticket history and backlog
- [AI Crawl Control Wiki](https://wiki.cfdata.org/display/AA/AI+Crawl+Control) — Product hub with PRDs and sales resources
- [AI Crawl Control Sales Program](https://wiki.cfdata.org/display/MRK/AI+Crawl+Control+sales+program) — Sales enablement and competitive positioning

---

## Robots.txt: From Config File to Enforcement Layer

When a foundational model company told us "a block is ambiguous—a robots.txt directive is an explicit signal," it crystallized why this work matters. AI companies evaluating whether to respect publisher preferences look for unambiguous, machine-readable intent. Robots.txt is that source of truth.

This quarter we shipped **Robots.txt Analytics**—a single view across all hostnames showing what directives are being served, whether crawlers are fetching them successfully, and critically, whether they're actually complying.

### What we built

**Coverage visibility**: See robots.txt availability across every hostname in your zone. No more loading files in a browser to spot-check subdomains or guessing whether apex and www serve different directives.

**Fetch analytics**: Track when crawlers request your robots.txt, what response codes they receive, and how frequently they check for updates. One publisher discovered a major AI crawler was hitting a 404 on their robots.txt for weeks—they had no idea their directives weren't being read.

**Violation detection**: When crawlers ignore directives, we surface which paths they continue to access. Our own dev docs team used this when they discovered preview deployment URLs had no robots.txt coverage—AI crawlers were indexing internal preview links. They deployed robots.txt directives, but crawlers continued hitting the same paths. The violation tracking showed exactly which crawlers weren't re-fetching robots.txt, so the team set temporary WAF rules to block access until the new directives were indexed and respected. Without visibility into the gap between "directive deployed" and "directive enforced," they'd have been flying blind.

**Content Signals parsing**: This is the first in-dashboard integration of [Content Signals](https://contentsignals.org)—the emerging standard for declaring post-access usage rights. Here's the problem: blocking a crawler is binary, but many publishers want to allow access while restricting specific uses. Googlebot is a perfect example—it powers both search indexing (which publishers want) and AI training via Google-Extended (which many don't). A Disallow directive blocks both. Content Signals solve this by letting publishers declare granular permissions: `search=yes, ai-train=no, ai-input=no`.

We now parse and display these signals for every hostname—whether from Cloudflare's managed robots.txt or your origin file. Publishers can audit exactly what they're broadcasting to crawlers, see it the same way crawlers do, and verify alignment with their licensing strategy. No origin changes required; no managed feature dependency. If your robots.txt has content signals, we'll surface them.

### Why it matters for Pay Per Crawl

Robots.txt directives and content signals are the foundation of any charging strategy. Before you can monetize access, you need to know: Are my directives being served? Are they being respected? What am I signaling about permitted use? This quarter's work answers all three.

### References

- [Track robots.txt](https://developers.cloudflare.com/ai-crawl-control/features/track-robots-txt/) — Developer documentation
- [Managed robots.txt](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/) — Configuration guide with Content Signals Policy
- [Content Signals specification](https://contentsignals.org) — The emerging standard for post-access usage rights
- [Changelog: New Robots.txt tab](https://developers.cloudflare.com/changelog/2025-10-21-track-robots-txt/) — October 2025 release notes

---

## x402: Supporting the Payment Standard

x402 is the open HTTP standard for internet-native payments, developed by Coinbase and a broader ecosystem. This quarter, our AI Crawl Control team worked closely with the x402 community to shape v2 of the specification—proposing and advocating for design improvements that support the real-world demands of content monetization at scale.

### Structural Changes We Proposed for v2

Working with Coinbase, we advocated for critical refinements based on our Pay Per Crawl implementation experience:

**De-coupling from wallet identity**: Early x402 tightly coupled payment identity to wallet addresses. We proposed moving to **merchant-agnostic payment routing**, where payment directives specify merchant endpoints independent of identity. This allows crawlers and AI companies to negotiate with content platforms and payment processors without tight coupling to specific wallet addresses.

**Direct-to-merchant settlement paths**: We argued for and helped design support for **multiple settlement models**—not just blockchain settlement, but also paths to traditional merchant accounts, payment processors, and deferred settlement. This flexibility means publishers using Pay Per Crawl can choose settlement paths aligned with their financial infrastructure.

**Authentication as a first-class concern**: Early versions relied on implicit identity. We advocated for **authentication mechanisms separate from payment**, enabling crawlers and agents to cryptographically prove identity independent of settlement. This foundation supports Web Bot Auth integration and future verification schemes without baking identity into the payment layer itself.

**Fiat and network expansion**: We advocated for the protocol to support not just EVM networks, but also **fiat stablecoins, traditional payment rails, and multi-chain settlement**. v2 now abstracts payment networks as pluggable schemes, enabling Base, Ethereum, Solana, and future settlement types without protocol rewrites.

**Extensibility through structured headers**: Rather than hardcoding payment semantics, v2 introduces an extension framework. We proposed support for **custom HTTP header extensions** (e.g., `x402-terms`, `x402-licensing`) that let merchants communicate specialized requirements—content licensing terms, pricing policies, time-based access conditions—without protocol changes. This unlocks patterns like attaching "training use prohibited" metadata directly to payment requirements.

### Moving to Standards-Based Headers

Our crawler payment responses now use **RFC 9421 HTTP Message Signatures** and x402-standardized headers instead of proprietary patterns. The protocol shifted from ad-hoc headers to a structured, extensible framework. When a crawler encounters a paywall, the 402 response includes:

- Standard `payment-required` message format (RFC compliant)
- Extensible requirement fields for merchant endpoints, acceptable networks, and settlement terms
- Support for future extensions without breaking existing clients

### One-Click x402 Deployment: The Proxy Template

The real value for developers is **accessibility**. We shipped the **x402-proxy-template**—a production-ready Worker that adds x402 payment gating to any origin with zero code changes.

Deploy in minutes:

1. Set a merchant wallet or account to receive payments
2. Configure which routes require payment (e.g., `/api/premium/*` for $0.01, `/dashboard` for $0.10)
3. Deploy

The proxy:

- **Forwards unprotected routes** directly to your origin (no overhead)
- **Intercepts protected routes** and returns HTTP 402 with x402 payment requirements
- **Accepts payments** via x402 on any supported network (Base, Ethereum, Solana, etc.) with extensible settlement paths
- **Validates signatures** using RFC 9421 headers for authenticated crawlers
- **Issues JWT cookies** valid for 1 hour after payment
- **Proxies authenticated requests** to origin transparently—your backend never touches payment logic

No payment processor integrations. No KYC flows. No accounts. Just HTTP and x402. Developers choose their routing mode:

- **DNS-based** (default): Proxy to any traditional backend
- **External Origin**: Proxy to another Worker or external API
- **Service Binding**: Zero-overhead Worker-to-Worker proxying

### Extensibility Built In

The template provides a foundation for adding x402 extensions without modifying core logic. Future work can layer on:

- **Terms extensions**: Attach content licensing requirements (`x402-terms: training-prohibited`) directly to payment responses
- **Custom pricing logic**: Implement dynamic pricing, tiered access, or usage-based fees via extensible handlers
- **Settlement plugins**: Support new payment networks and fiat rails by adding extension handlers

The Worker platform lets us iterate on these without waiting for upstream changes, and the structural improvements to v2 ensure they compose cleanly with other implementers' extensions.

### References

**x402 Protocol & Standards**

- [x402.org](https://www.x402.org/) — The open standard homepage with ecosystem overview
- [x402 documentation](https://x402.gitbook.io/x402) — Full specification including facilitators, schemes, and extensions
- [x402 GitHub repository](https://github.com/coinbase/x402) — Source code, specifications, and protocol development
- [x402 ecosystem partners](https://www.x402.org/ecosystem) — List of implementers and service providers

**Cloudflare x402 Implementation**

- [x402-proxy-template repository](https://github.com/cloudflare/templates/tree/main/x402-proxy-template) — Full source code with documentation
- [x402-proxy-template README](https://github.com/cloudflare/templates/blob/main/x402-proxy-template/README.md) — Complete guide including Quick Start, architecture, and deployment modes
- [Quick Start guide](https://github.com/cloudflare/templates/blob/main/x402-proxy-template/README.md#quick-start) — Get running in 2 minutes with npm install
- [Configuration guide](https://github.com/cloudflare/templates/blob/main/x402-proxy-template/README.md#configuration) — Pattern-based route protection, network selection, merchant setup
- [Proxy modes documentation](https://github.com/cloudflare/templates/blob/main/x402-proxy-template/README.md#proxy-modes) — DNS-based, External Origin, and Service Binding routing options
- [Testing guide](https://github.com/cloudflare/templates/blob/main/x402-proxy-template/README.md#testing) — Automated and manual testing instructions
- [Source code: auth.ts](https://github.com/cloudflare/templates/blob/main/x402-proxy-template/src/auth.ts) — Authentication middleware implementation
- [Source code: jwt.ts](https://github.com/cloudflare/templates/blob/main/x402-proxy-template/src/jwt.ts) — Stateless JWT signing and verification

**Pay Per Crawl Integration**

- [AI Crawl Control home](https://wiki.cfdata.org/display/AA/AI+Crawl+Control) — Product overview and roadmap
- [Pay Per Crawl crawler guide](https://wiki.cfdata.org/display/PVC/Pay+Per+Crawl+Guide+for+Crawlers) — How AI crawlers authenticate and submit x402 payments
- [DARIC specification](https://wiki.cfdata.org/display/PVC/SPEC%3A+%5BDARIC+Beta%5D+payment-gated+Content+for+AI+Crawlers) — Technical specification for payment-gated content
- [Pay Per Crawl PRD](https://wiki.cfdata.org/display/AA/PRD+-+DARIC+%28Pay+Per+Crawl%29+Jul+1) — Product requirements and implementation details

---

## Code Orange: Hardening AI Crawl Control for Production

[INCIDENT-7788](https://jira.cfdata.org/browse/INCIDENT-7788) triggered a company-wide Code Orange requiring all FL2 modules to define explicit failure modes. For AI Crawl Control, this became the forcing function for a broader production-readiness push: failure mode hardening, SLOs, Sentry integration, and end-to-end testing across the stack. Our response is tracked in [RM-26309: ACC / PPC Code Orange](https://jira.cfdata.org/browse/RM-26309).

**Failure mode hardening**: We audited every panic condition in the DARIC FL2 module ([AA-277](https://jira.cfdata.org/browse/AA-277)) and found that invalid zone configuration could take down an entire zone. We added fail-open handling for missing configurations while choosing fail-closed for payment phases—serving free content without publisher consent is worse than returning 500. All four DARIC phases now have documented, intentional failure modes ([AA-328](https://jira.cfdata.org/browse/AA-328)), and the changes have landed in FL2 RoW.

**SLOs and observability**: We defined SLOs for the AI Crawl Control product ([AA-314](https://jira.cfdata.org/browse/AA-314)) and stood up [SLI dashboards](https://grafana.cfdata.org/d/bf6w22z0yjawwc/daric-slis?orgId=1) ([AA-315](https://jira.cfdata.org/browse/AA-315)) tracking latency, error rate, and availability—foundational for SLA conversations with enterprise publishers. Sentry instrumentation now covers the DARIC module ([AA-319](https://jira.cfdata.org/browse/AA-319)), the Crawlers API ([AA-317](https://jira.cfdata.org/browse/AA-317)), the Robots API ([AA-224](https://jira.cfdata.org/browse/AA-224)), and the QS provisioner ([AA-193](https://jira.cfdata.org/browse/AA-193)), so we know about errors before customers report them.

**End-to-end and unit testing**: We added e2e tests for the AI Crawl Control dashboard ([AA-185](https://jira.cfdata.org/browse/AA-185)), unit tests for dashboard components ([AA-312](https://jira.cfdata.org/browse/AA-312)), Flamingo tests covering in-band pricing and Worker subrequests ([AA-302](https://jira.cfdata.org/browse/AA-302)), and tests for the Robots API ([AA-203](https://jira.cfdata.org/browse/AA-203)).

**Dynamic configuration**: The "charge-by-default" crawler set now lives in Quicksilver ([AA-320](https://jira.cfdata.org/browse/AA-320)) instead of hardcoded in FL2, so we can onboard new bots and respond to incidents without an FL release. We also renamed the backend from `privacy-core` to `daric-api` ([AA-278](https://jira.cfdata.org/browse/AA-278)) to reflect its actual ownership in the AA org.

### References

- [RM-26309: ACC / PPC Code Orange](https://jira.cfdata.org/browse/RM-26309) — Parent epic
- [INCIDENT-7788](https://jira.cfdata.org/browse/INCIDENT-7788) — The incident that triggered Code Orange
- [AA-277](https://jira.cfdata.org/browse/AA-277), [AA-328](https://jira.cfdata.org/browse/AA-328) — Failure mode audit and implementation
- [AA-314](https://jira.cfdata.org/browse/AA-314), [AA-315](https://jira.cfdata.org/browse/AA-315) — SLO definition and dashboards
- [AA-319](https://jira.cfdata.org/browse/AA-319), [AA-317](https://jira.cfdata.org/browse/AA-317), [AA-224](https://jira.cfdata.org/browse/AA-224), [AA-193](https://jira.cfdata.org/browse/AA-193) — Sentry integration
- [AA-185](https://jira.cfdata.org/browse/AA-185), [AA-312](https://jira.cfdata.org/browse/AA-312), [AA-302](https://jira.cfdata.org/browse/AA-302), [AA-203](https://jira.cfdata.org/browse/AA-203) — Testing
- [AA-320](https://jira.cfdata.org/browse/AA-320) — QS-based bot configuration
- [DARIC SLI Grafana Dashboard](https://grafana.cfdata.org/d/bf6w22z0yjawwc/daric-slis?orgId=1)

---

## What's Next

Q1 2026 starts with experimentation—the AI content monetization space is moving fast, and we're staying responsive to what we learn from publishers, crawlers, and the broader ecosystem. The roadmap will evolve, but we have conviction on three directions (see [2026 Q1: AI Crawl Control](https://wiki.cfdata.org/display/EW/2026+Q1%3A+AI+Crawl+Control)):

**Closed by default (Charge Policy)**: Flipping the economics from "open unless blocked" to "charge all traffic by default," with explicit exceptions for free paths, human traffic (bot score), and crawlers you have deals with. Publishers set a price once; the system enforces it.

**x402 integration**: We're working to have the Cloudflare network fully adopted into x402, and to migrate Pay Per Crawl onto the x402 standard for 1-to-1 crawler payments, with crypto-native support so AI agents can pay using stablecoins directly.

**Customizable dashboard & medium-tail coverage**: Extending AI Crawl Control from ~25 hardcoded crawlers to allow users to track any verified AI bot Cloudflare can detect, and providing deeper insights into Bot Score and custom user agent patterns so publishers can create policies for any crawler—known or unknown.

The AI content marketplace is still taking shape, and we intend to be at the center of it. Q1 is about putting the pieces in place so that when demand-side adoption accelerates, publishers on Cloudflare are ready.

---

_AI Crawl Control is available on all Cloudflare plans. Pay per crawl is currently in private beta for Enterprise customers with Bot Management in US, UK, EU, Canada, and Australia. [Learn more in our developer docs](https://developers.cloudflare.com/ai-crawl-control/)._
