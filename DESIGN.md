---
name: OpenKuasa
description: The open-source business OS for Malaysian SMEs
colors:
  primary: "#148658"
  primary-foreground: "#fbfcfb"
  neutral-bg: "#ffffff"
  neutral-fg: "#22252a"
  card: "#ffffff"
  card-foreground: "#22252a"
  muted: "#f4f5f6"
  muted-foreground: "#68707a"
  border: "#e2e5e8"
  accent-command: "#148658"
  accent-reach: "#ca4043"
  accent-crm: "#1882a8"
  accent-people: "#2572d4"
  accent-hire: "#cb6228"
  accent-finance: "#927715"
typography:
  display:
    fontFamily: "var(--font-sans), Lexend, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "var(--font-sans), Lexend, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  title:
    fontFamily: "var(--font-sans), Lexend, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "var(--font-sans), Lexend, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  label:
    fontFamily: "var(--font-sans), Lexend, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-outline:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-secondary:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.lg}"
    padding: "4px 10px"
    height: "32px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: "16px"
---

# Design System: OpenKuasa

## Overview

**Creative North Star: "The Clear Operating Canvas"**

OpenKuasa balances Scandinavian-inspired operational restraint with surgical Malaysian enterprise precision. Surfaces are quiet, disciplined, and deliberately low-noise so critical business data — sales figures, payroll runs, pipeline conversions, and cash flows — remains immediately scanable. 

Rather than relying on heavy ornaments, visual hierarchy is established through meticulous typography, structured tabular rhythms, and deliberate product module identity tokens. Every screen is built for high-throughput daily operation by business owners and teams.

**Key Characteristics:**
- **Calm, High-Information Surfaces:** Clean neutral canvas with light gray borders, micro-spacing grids, and low visual vibration.
- **Module-Scoped Accents:** Purposeful color anchors identify active domains (Command Jade, Reach Coral-Red, CRM Teal, People Blue, Hire Amber, Finance Gold).
- **Subtle Tonal Depth:** Strictly restrained elevation; zero heavy drop shadows, relying instead on clean 1px borders, muted fills, and delicate focus outlines.

## Colors

The OpenKuasa palette couples a signature Malaysian emerald brand core with crisp near-grayscale operational neutrals and distinct, module-specific product accents.

### Primary
- **Brand Emerald** (#148658 / `oklch(0.52 0.125 164)`): The primary identity color for OpenKuasa and the core Command module. Anchors main call-to-actions, primary active navigation, and key positive metrics.

### Secondary
- **Module Accents** (Scoped per domain):
  - **Reach Coral** (#ca4043 / `oklch(0.56 0.2 8)`): Campaigns, ads, and outreach tracking.
  - **CRM Teal** (#1882a8 / `oklch(0.53 0.095 210)`): Customer records, deals, and pipeline stages.
  - **People Blue** (#2572d4 / `oklch(0.52 0.16 257)`): Employee directories, leave schedules, and payroll.
  - **Hire Amber** (#cb6228 / `oklch(0.57 0.17 48)`): Candidate pipelines, job boards, and talent acquisition.
  - **Finance Olive-Gold** (#927715 / `oklch(0.54 0.115 78)`): General ledger, invoices, bills, and tax declarations.

### Neutral
- **Canvas White** (#ffffff / `oklch(1 0 0)`): Primary background for cards, modals, and data tables.
- **Off-Canvas Gray** (#f4f5f6 / `oklch(0.97 0.004 240)`): Base page background, muted chips, and table headers.
- **Deep Slate Foreground** (#22252a / `oklch(0.17 0.01 240)`): High-legibility text for labels, titles, and numbers.
- **Muted Slate** (#68707a / `oklch(0.42 0.015 200)`): Secondary descriptions, helper text, and inactive iconography.
- **Border Silver** (#e2e5e8 / `oklch(0.9 0.006 165)`): 1px structural dividing lines and component perimeters.

### Named Rules
**The Single-Accent Scope Rule.** Inside any given product module, all interactive focus rings, primary actions, and badge accents inherit exclusively from that module's designated `--pc` accent variable (`[data-product="..."]`). The global Brand Emerald never collides with a module's accent.

## Typography

**Display Font:** Lexend (`var(--font-sans)`, system-ui, sans-serif)  
**Body Font:** Lexend (`var(--font-sans)`, system-ui, sans-serif)  
**Label/Mono Font:** Geist Mono (`var(--font-mono)`, monospace)

**Character:** Lexend delivers clean geometric warmth with expanded tracking and open counters designed for reading efficiency, while Geist Mono brings dense tabular alignment to monetary figures, serial keys, and timestamps.

### Hierarchy
- **Display** (SemiBold 600, 2.25rem / 36px, line-height 1.2): Screen hero titles and major dashboard counters.
- **Headline** (SemiBold 600, 1.5rem / 24px, line-height 1.3): Section headers and major modal headings.
- **Title** (Medium 500, 1rem / 16px, line-height 1.4): Card titles, table column groupings, and section headers.
- **Body** (Regular 400, 0.875rem / 14px, line-height 1.5): Standard UI copy, table row values, and input text.
- **Label** (Medium 500, 0.75rem / 12px, line-height 1.4): Metadata tags, badge text, table column headers, and form field labels.

### Named Rules
**The Monospace Figure Rule.** All currency values (e.g., `RM 12,450.00`), invoice numbers, dates, and quantitative table cells MUST render in `font-mono` with tabular numbers (`tabular-nums`) to maintain strict vertical scanning alignment.

## Layout

OpenKuasa employs a dense, structured spatial model optimized for enterprise data workflows:
- **Navigation:** Persistent left-hand collapsible module sidebar (width `16rem` expanded, `4rem` collapsed).
- **Page Container:** Standard fluid responsive container with max-width bounds (`max-w-7xl` or full-bleed with horizontal gutters `px-4 md:px-6`).
- **Form Rows:** Form container layouts collapse to single rows above `54rem` / `60rem` (`--container-lines-row`) for streamlined dual-entry line items.
- **Rhythm & Grid:** 8px baseline rhythm (`spacing-2` = 8px, `spacing-3` = 12px, `spacing-4` = 16px).

## Elevation & Depth

OpenKuasa is **flat with subtle tonal depth**. Surfaces do not rely on diffused drop shadows; separation is achieved through crisp 1px borders, subtle neutral contrast (`bg-background` vs `bg-muted`/`bg-card`), and delicate focus rings.

### Shadow Vocabulary
- **Zero Rest Elevation:** Components sit directly on their canvas with `box-shadow: none`.
- **Delicate Card Border:** 1px ring (`ring-1 ring-foreground/10`) creates perimeter clarity without blurring.
- **Floating Popovers / Menus:** `box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.08)` reserved exclusively for elevated overlays (dropdown menus, popovers, command dialogs).

### Named Rules
**The Border-Over-Shadow Rule.** Never use drop shadows to distinguish adjacent cards or table sections. Use structural 1px border lines (`border-border`) or background shift (`bg-muted/50`).

## Shapes

- **Base Radius:** 8px (`rounded-lg` / `--radius-lg`) for primary interactive controls (buttons, inputs, selects).
- **Cards & Containers:** 12px (`rounded-xl` / `--radius-xl`) with clipped internal headers.
- **Pills & Badges:** Rounded-full (`rounded-full`) or subtle 4px (`rounded-sm`) for compact indicators.
- **Form Fields:** Uniform 8px radius with 1px border perimeter.

## Components

### Buttons
- **Shape:** Rounded-lg (8px radius)
- **Primary:** `bg-primary text-primary-foreground hover:bg-primary/80` (height 32px / 2rem, `px-2.5`)
- **Outline:** `border border-border bg-background hover:bg-muted hover:text-foreground`
- **Secondary:** `bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]`
- **Ghost:** `hover:bg-muted hover:text-foreground`
- **Destructive:** `bg-destructive/10 text-destructive hover:bg-destructive/20`
- **Focus:** `focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring`

### Cards / Containers
- **Corner Style:** Rounded-xl (12px radius)
- **Background:** `bg-card text-card-foreground`
- **Border:** `ring-1 ring-foreground/10`
- **Padding:** `--card-spacing: 16px` (or `12px` when `size="sm"`)

### Inputs / Fields
- **Style:** 1px border (`border-input bg-transparent px-2.5 py-1 text-sm rounded-lg h-8`)
- **Focus:** `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`
- **Placeholder:** `placeholder:text-muted-foreground`

### Navigation
- **Sidebar Items:** Clean rounded-lg menu items, active state highlighted with `--sidebar-accent` and `--sidebar-accent-foreground` matching the module accent.

## Do's and Don'ts

### Do:
- **Do** wrap numbers, currencies (`RM`), timestamps, and financial figures in `font-mono tabular-nums`.
- **Do** scope interactive component accents (`--pc`) to the active module (`[data-product="..."]`).
- **Do** preserve 32px (h-8) standard compact button and field heights for high-density administrative workflows.
- **Do** use 1px border lines and subtle surface tonal shifts instead of drop shadows for card separation.

### Don't:
- **Don't** add decorative gradients, heavy drop shadows, or skeuomorphic bevels to standard dashboard cards.
- **Don't** mix inconsistent font families; reserve Lexend for sans and Geist Mono for tabular figures.
- **Don't** introduce arbitrary accent colors outside the defined module palette without a semantic purpose (e.g. destructive red).
