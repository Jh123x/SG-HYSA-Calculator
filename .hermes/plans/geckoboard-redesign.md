# Geckoboard-Inspired Redesign — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan. Use git worktrees for parallel tasks.

**Goal:** Redesign SG-HYSA-Calculator with a Geckoboard-inspired dashboard aesthetic — dark, minimal, widget-card-based layout with bold data metrics, clean typography, and smooth animations. Follows Airbnb design principles (universal, iconic, conversational, clean).

**Architecture:** Keep existing React 19 + MUI 9 + TypeScript stack. Add `framer-motion` for animations. Overhaul theme.ts with Geckoboard color palette, replace the table-based rate comparison with a card grid, and apply minimalist chrome throughout.

**Design System Reference — Geckoboard palette:**
- `bg`: `#0d1117` (deep dark, near-black)
- `surface`: `#161b22` (card backgrounds)
- `border`: `rgba(255,255,255,0.06)` (subtle card borders)
- `text`: `#e6edf3` (primary text — off-white for eye comfort)
- `muted`: `#8b949e` (secondary text)
- `accent`: `#58a6ff` (blue primary, replaces purple)
- `success`: `#3fb950` (green for positive indicators)
- `warning`: `#d29922` (amber for neutral/caution)

**Typography:**
- Font: system stack — `-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif`
- Large metrics: `2rem–2.5rem` for EIR and yearly interest on cards
- Labels: `0.7rem`, uppercase, `letter-spacing: 0.05em`, `color: muted`
- Body: `0.875rem`, `color: text`
- Weights: 400 (body), 500 (labels), 600 (headings), 700 (metrics)

---

## Task 1: Theme Overhaul — Geckoboard Color Palette + Typography

**Objective:** Replace the purple `#9550ff` / `#282828` theme with Geckoboard's dark blue palette. Update MUI theme overrides.

**Files:**
- Modify: `src/consts/theme.ts`

**Step 1: Update color primitives**

Replace all color exports with the Geckoboard palette:

```typescript
// ── Color primitives ─────────────────────────────────────────────
export const bgColor = "#0d1117";
export const surfaceColor = "#161b22";
export const textColor = "#e6edf3";
export const mutedColor = "#8b949e";
export const primaryColor = "#58a6ff";
export const accentGreen = "#3fb950";
export const accentAmber = "#d29922";
export const dangerColor = "#f85149";
export const borderColor = "rgba(255,255,255,0.06)";
```

**Step 2: Update lineColors for charts**

```typescript
export const lineColors: string[] = [
  "#58a6ff", // blue
  "#3fb950", // green
  "#d29922", // amber
  "#f0883e", // orange
  "#bc8cff", // purple
  "#f85149", // red
  "#79c0ff", // light blue
  "#56d364", // light green
  "#e3b341", // light amber
  "#ffa657", // light orange
  "#d2a8ff", // light purple
  "#ff7b72", // light red
];
```

**Step 3: Update MUI component overrides**

```typescript
const components: Components = {
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        backgroundColor: surfaceColor,
        border: `1px solid ${borderColor}`,
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: { backgroundColor: surfaceColor, borderBottom: `1px solid ${borderColor}` },
      head: { fontWeight: 600, color: mutedColor, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        color: mutedColor,
        borderColor: borderColor,
        textTransform: "none",
        fontSize: "0.8rem",
        borderRadius: 8,
        "&.Mui-selected": {
          color: "#fff",
          backgroundColor: primaryColor,
        },
        "&.Mui-selected:hover": { backgroundColor: primaryColor, opacity: 0.9 },
        "&:hover": { backgroundColor: `${primaryColor}18`, borderColor: primaryColor },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      outlined: { borderColor: borderColor, color: mutedColor },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: { backgroundColor: surfaceColor, border: `1px solid ${borderColor}` },
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: {
        color: textColor,
        backgroundColor: surfaceColor,
        borderRadius: 8,
        "& .MuiOutlinedInput-notchedOutline": { borderColor: borderColor },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor },
        "& .MuiSvgIcon-root": { color: mutedColor },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          color: textColor,
          backgroundColor: surfaceColor,
          borderRadius: 8,
          "& fieldset": { borderColor: borderColor },
          "&:hover fieldset": { borderColor: primaryColor },
          "&.Mui-focused fieldset": { borderColor: primaryColor },
        },
        "& .MuiInputLabel-root": { color: mutedColor },
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: { fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif` },
    },
  },
  MuiCssBaseline: {
    styleOverrides: {
      body: { fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif` },
    },
  },
};
```

**Step 4: Update theme.createTheme palette**

```typescript
export const theme: Theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: primaryColor },
    background: { default: bgColor, paper: surfaceColor },
    text: { primary: textColor, secondary: mutedColor },
    error: { main: dangerColor },
    warning: { main: accentAmber },
    success: { main: accentGreen },
  },
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif`,
  },
  components,
});
```

**Step 5: Verify**

```bash
npx tsc --noEmit && npx vitest run --update
```

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: Geckoboard-inspired color palette and typography"
```

---

## Task 2: Widget Card Component — Bank Metric Display

**Objective:** Create a reusable `BankWidgetCard` component that displays a bank's key metrics in a card format — large EIR %, yearly interest $, bank name, and actions.

**Files:**
- Create: `src/Components/BankWidgetCard.tsx`
- Create: `src/Components/BankWidgetCard.test.tsx`

**Design spec:**
```
┌──────────────────────────────┐
│  🏦 Bank Name                │  ← name (0.9rem, weight 500, muted)
│                              │
│         3.85%                │  ← EIR (2.5rem, weight 700, text, letter-spacing: -0.02em)
│     Effective Rate           │  ← label (0.7rem, uppercase, muted, letter-spacing: 0.05em)
│                              │
│       $1,234.56              │  ← yearly interest (1.5rem, weight 600, accentGreen)
│     Yearly Interest          │  ← label
│                              │
│  Remarks: ... (hover info)   │  ← truncated, expand on hover
│  [View] [Website]            │  ← icon buttons
└──────────────────────────────┘
```

**Props:**
```typescript
interface BankWidgetCardProps {
  slug: string;
  name: string;
  eir: number;         // effective interest rate %
  yearlyInterest: number; // yearly interest $
  remarks?: string;
  url?: string;
  lastUpdated?: string;
  onClick: () => void; // navigate to detail page
}
```

**Implementation details:**
- Use MUI `Paper` as the card container (theme handles bg/border/radius)
- Large EIR number uses `variant="h2"` with custom sx
- Yearly interest in green (`accentGreen`) 
- Hover: `transform: translateY(-2px)` + `box-shadow` via CSS transition
- Actions: two small icon buttons at bottom-right
- `transition: "transform 0.2s ease, box-shadow 0.2s ease"` on the Paper

**Step 1: Write test**

```tsx
// BankWidgetCard.test.tsx
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { BankWidgetCard } from "./BankWidgetCard";
import { describe, it, expect } from "vitest";

describe("BankWidgetCard", () => {
  it("renders bank name, EIR, and yearly interest", () => {
    render(
      <BrowserRouter>
        <BankWidgetCard
          slug="uob-one"
          name="UOB One"
          eir={3.85}
          yearlyInterest={1234.56}
          remarks="Min $500 card spend"
          url="https://uob.com.sg"
          onClick={() => {}}
        />
      </BrowserRouter>
    );
    expect(screen.getByText("UOB One")).toBeTruthy();
    expect(screen.getByText("3.85%")).toBeTruthy();
    expect(screen.getByText(/\$1,234/)).toBeTruthy();
  });
});
```

**Step 2: Run test to verify FAIL**

```bash
npx vitest run src/Components/BankWidgetCard.test.tsx
```

**Step 3: Implement component**

Full implementation with MUI Paper, Typography, Box, IconButton, Tooltip.

**Step 4: Run test to verify PASS**

```bash
npx vitest run src/Components/BankWidgetCard.test.tsx
```

**Step 5: Commit**

```bash
git add src/Components/BankWidgetCard.tsx src/Components/BankWidgetCard.test.tsx
git commit -m "feat: BankWidgetCard component with Geckoboard-style metrics"
```

---

## Task 3: Dashboard Grid Layout — Replace Table with Card Grid

**Objective:** Replace the table in `CurrentRatesTab` desktop with a responsive card grid, and add sort controls above the grid.

**Files:**
- Modify: `src/pages/CurrentRatesTab.tsx` (desktop variant only)

**Design spec:**
```
┌──────────────────────────────────────────────┐
│  Rate Comparison          [Sort: ▼ EIR] [ASC/DESC]  │
├──────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ UOB One  │ │ OCBC 360 │ │ DBS Mult │      │
│  │  3.85%   │ │  3.20%   │ │  2.80%   │      │
│  │ $1,234   │ │ $1,024   │ │  $896    │      │
│  └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Maribank │ │ GXS      │ │ Trust    │      │
│  │  2.50%   │ │  2.38%   │ │  2.00%   │      │
│  │  $800    │ │  $762    │ │  $640    │      │
│  └──────────┘ └──────────┘ └──────────┘      │
└──────────────────────────────────────────────┘
```

**Layout:**
- CSS Grid: `display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;`
- Sort controls row above the grid (dropdown + toggle, same as mobile but styled for desktop)
- Each cell renders a `BankWidgetCard`
- Smooth stagger animation on load (each card fades in 50ms after the previous)

**Step 1: Create the desktop variant**

The desktop `CurrentRatesTabDesktop` component replaces the table `bottomRight` slot with the card grid. Keep the chart in `bottomLeft`. The `ThreePanelLayout` stays, but the right panel now contains:
- Sort controls bar
- Card grid

**Step 2: Update Mobile to use BankWidgetCard**

Replace the mobile `Card` rendering with `BankWidgetCard` component.

**Step 3: Run tests**

```bash
npx vitest run --update
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: dashboard card grid replacing rate comparison table"
```

---

## Task 4: Minimalist Header & Footer Redesign

**Objective:** Reduce chrome — slim header, ultra-minimal footer. Follow Geckoboard's "data-first, chrome-last" philosophy.

**Files:**
- Modify: `src/Components/Header.tsx`
- Modify: `src/Components/Footer.tsx`

**Header design:**
```
┌─────────────────────────────────────────┐
│  ◆ SG HYSA Calculator          [FAQs]  │  ← 48px height, border-bottom subtle
└─────────────────────────────────────────┘
```
- Height: 48px (down from ~64px default AppBar)
- Background: `bgColor` with `borderBottom: 1px solid ${borderColor}`
- Left: small diamond icon + "SG HYSA Calculator" (0.9rem, weight 600)
- Right: "FAQs" text link (no icon, simpler)
- No elevation, no heavy AppBar styling

**Footer design:**
```
┌─────────────────────────────────────────┐
│  © Jh123x · Built in Singapore          │  ← 32px height, single line
└─────────────────────────────────────────┘
```
- Height: 32px, no border-top
- Single line: copyright + social icons inline
- `fontSize: "0.7rem"`, `color: mutedColor`

**Step 1: Rewrite Header**

Remove AppBar, use simple Box with flex row. Compact 48px height.

**Step 2: Rewrite Footer**

Ultra-compact single-line footer.

**Step 3: Run tests**

```bash
npx vitest run --update
```

**Step 4: Commit**

```bash
git add src/Components/Header.tsx src/Components/Footer.tsx
git commit -m "feat: minimalist Geckoboard-style header and footer"
```

---

## Task 5: Input Section Redesign — Compact, Collapsible

**Objective:** Shrink the input form to take less vertical space — Geckoboard dashboards minimize configuration UI. Collapse inputs into a single row with expand capability.

**Files:**
- Modify: `src/Components/Inputs.tsx`

**Design:** 
- Default: single-row compact bar showing key fields inline (Savings $, Salary $, Age)
- "Customize" button expands to full form
- Savings field shows the amount prominently
- All inputs use the new border/radius from theme

**Step 1: Compact row layout**

Horizontal flex row with inline inputs: Savings | Salary | Age | [Customize ▼]

**Step 2: Expandable full form**

Clicking "Customize" expands to show all boolean toggles (Credit Card, Income Tax, etc.)

**Step 3: Tests + Commit**

```bash
npx vitest run --update
git add -A && git commit -m "feat: compact collapsible input section"
```

---

## Task 6: Chart & Graph Redesign

**Objective:** Update chart styling to match the new dark palette — clean gridlines, updated line colors, minimal chrome.

**Files:**
- Modify: `src/Components/InterestGraph.tsx`
- Modify: `src/Components/ComparisonChart.tsx`
- Modify: `src/Components/InterestVsSavingsChart.tsx`

**Changes:**
- Grid lines: `stroke: ${borderColor}` (very subtle)
- Axis labels: `fill: ${mutedColor}`, `fontSize: 0.7rem`
- Legend: compact, muted text
- Tooltip: dark background with border
- Remove heavy chart chrome, let data stand out

**Step 1: Update each chart component**

**Step 2: Tests + Commit**

```bash
npx vitest run --update
git add -A && git commit -m "feat: Geckoboard-style chart theming"
```

---

## Task 7: Framer Motion Animations

**Objective:** Add smooth page transitions and card entrance animations.

**Files:**
- Modify: `src/App.tsx` (add AnimatePresence for route transitions)
- Modify: `src/pages/CurrentRatesTab.tsx` (stagger card entrance)
- New dependency: `framer-motion`

**Animations:**
- Page transitions: fade + slight slide (200ms)
- Card grid: stagger children (each card fades in 50ms delayed)
- Card hover: scale(1.02) + shadow
- Chart: fade in on data change
- Toggle: smooth background color transition

**Step 1: Install framer-motion**

```bash
npm install framer-motion
```

**Step 2: Add AnimatePresence to App.tsx**

Wrap routes with `<AnimatePresence mode="wait">` and add `motion.div` wrappers:

```tsx
import { AnimatePresence, motion } from "framer-motion";

// In route component:
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.2 }}
>
  <CurrentRatesTab profile={...} />
</motion.div>
```

**Step 3: Card stagger animation**

In the card grid, wrap each card with `motion.div` using staggerChildren:

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
```

**Step 4: Tests + Commit**

```bash
npx vitest run --update
git add -A && git commit -m "feat: Framer Motion page transitions and card animations"
```

---

## Task 8: Polish — Spacing, Consistency, QA

**Objective:** Final consistency pass. Audit all pages for the new design language. Fix spacing, remove old theme references, ensure mobile looks good.

**Files:**
- All component files (audit pass)

**Checklist:**
- [ ] No remaining `#282828` or `#9550ff` hardcoded values (grep)
- [ ] All Papers use theme defaults (no manual borderRadius/bg)
- [ ] Mobile card layout looks good with new BankWidgetCard
- [ ] FAQ page styling updated
- [ ] BankDetailPage styling updated
- [ ] HistoryTab styling updated
- [ ] All tests pass
- [ ] Build succeeds

**Step 1: Audit grep**

```bash
rg "#282828|#9550ff" src/ --glob '*.tsx' --glob '*.ts'
```

**Step 2: Fix any remaining hardcoded colors**

**Step 3: Full test + build**

```bash
npx tsc --noEmit && npx vitest run && npm run build
```

**Step 4: Commit**

```bash
git add -A && git commit -m "chore: final polish and consistency pass for Geckoboard redesign"
```

---

## Parallel Worktree Plan

Three parallel worktrees for independent tasks:

| Worktree | Branch | Tasks |
|----------|--------|-------|
| WT1 | `feat/geckoboard-theme` | Task 1 (Theme) + Task 4 (Header/Footer) + Task 5 (Inputs) |
| WT2 | `feat/geckoboard-cards` | Task 2 (WidgetCard) + Task 3 (Dashboard Grid) |
| WT3 | `feat/geckoboard-charts` | Task 6 (Charts) + Task 7 (Animations) |

WT2 depends on Task 1 being merged first (needs new theme exports).
WT3 depends on Task 1 being merged first (needs new lineColors).

**Execution order:**
1. Dispatch WT1 first (foundational — theme changes)
2. Once WT1 is reviewed and merged, dispatch WT2 and WT3 in parallel
3. Final integration + polish (Task 8) on a unified branch

---

## Verification

After all tasks complete:
```bash
npm run build          # Production build must succeed
npx vitest run         # All 250+ tests pass
npm run preview        # Manual visual verification
```
