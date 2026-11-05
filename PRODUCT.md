# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Malaysian SME business owners and operators managing their team, sales, ads, and finances in one unified system without juggling disconnected subscriptions. Secondary users include department leads and operations staff executing day-to-day CRM, HR, payroll, and marketing workflows.

## Product Purpose

OpenKuasa provides a free-to-self-host, all-in-one business operating system tailored for Malaysian SMEs. It consolidates advertising management, customer relationship management, human resources, recruitment, payroll, and accounting under a single platform enhanced by an AI command center. Success means eliminating fragmented SaaS subscriptions and giving local businesses full sovereignty over their operations and data.

## Positioning

The open-source Malaysian business OS combining local operational compliance (Malaysian statutory deductions/payroll, local SME workflows) with unified cross-module intelligence (AI Command Center / Tuah), replacing fragmented paid SaaS stacks with a self-hostable AGPL-3.0 platform.

## Operating Context

- Web application accessed on desktop and mobile browsers across offices, retail, and field operations.
- Self-hosted environments via Docker Compose or managed hosted deployments.
- Daily transactional workflows: payroll runs, invoice generation, customer communication, recruitment pipelines, and ad campaign tracking.

## Capabilities and Constraints

- Core modules: Reach (Jebat/Ads), CRM, People (HR & Payroll), Hire (Recruitment), Finance (Accounting & Invoicing), Command (AI Command Center / Tuah), and Settings.
- AGPL-3.0 licensed community codebase.
- Built on Next.js 16 (App Router), React 19, Supabase (PostgreSQL with RLS), and Tailwind CSS 4.
- Must remain fully operable in self-hosted offline/local environments without mandatory proprietary cloud dependencies.

## Brand Commitments

- Name: OpenKuasa.
- Community-driven, transparent, empowering local entrepreneurship ("Kuasa").
- Respects data ownership and privacy — no lock-in.

## Evidence on Hand

- Production codebase with functional modules (`src/app/(app)/...`).
- Public live demo available at `https://openkuasa.com/login`.
- Product documentation and screenshot fixtures in `docs/screenshots/`.

## Product Principles

1. **Unification over fragmentation:** Deliver cohesive cross-module workflows rather than siloed feature sets.
2. **Local relevance first:** Design specifically for Malaysian business customs, tax/statutory requirements, and operational realities.
3. **Data sovereignty & freedom:** Ensure self-hosting is a first-class citizen, fully functional and uncompromised.
4. **Actionable AI assistance:** Ground AI assistance in real company context and operational tasks rather than generic conversational novelty.

## Accessibility & Inclusion

- Responsive design supporting varied screen sizes and low-bandwidth connections.
- Bilingual / localized context readiness (Malay & English operational terms).
