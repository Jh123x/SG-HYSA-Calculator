# AGENTS.md — SG-HYSA-Calculator

> Guidance for AI assistants working on this codebase. Follow these conventions to maximize one-shot accuracy.

## Project Overview

**SG HYSA Calculator** — Compare Singapore High Yield Savings Account interest rates based on your financial profile. Live at [hysa.jh123x.com](https://hysa.jh123x.com/).

- **Stack**: React 19, MUI 9, TypeScript, Vite, Vitest
- **Theme**: Dark mode (`bgColor: #282828`, `textColor: #FFFFFF`, `primaryColor: #9550ff`)
- **Tests**: 250 test cases across all bank files + components
- **CI**: GitHub Actions (`node.yml`) — runs `npm test` + `npm run build` on push/PR to `main`

## Directory Structure

```
src/
├── types/           # Shared TypeScript interfaces
│   ├── profile.ts       # Profile (Savings, Age, Salary, etc.) + NewProfile() factory
│   ├── history.ts       # RateSnapshot interface
│   ├── interest.ts      # Interest + CutoffInterest types
│   ├── interest_result.ts  # ResultInterest class
│   └── props.ts         # ResultProp interface
├── data/            # Static content — single source of truth for FAQ, etc.
│   └── faq.ts           # FaqEntry[], ACCORDION_FAQ, FULL_FAQ — shared by FaqAccordion & FaqPage
├── logic/           # One file per bank + shared utilities + tests
│   ├── common.ts        # calculate_ir() — shared tiered interest calculator
│   ├── history.ts       # deriveCurrentFromHistory(), resolveHistoryForChart()
│   ├── constants.tsx     # bankInfo registry — THE single source of truth for bank list
│   ├── {bank}.ts        # Per-bank interest functions + history array
│   └── {bank}.test.ts   # Per-bank tests
├── pages/           # Route-level page components
│   ├── CurrentRatesTab.tsx   # Homepage: sortable bank table + InterestGraph + FaqAccordion
│   ├── HistoryTab.tsx        # Per-bank rate history accordions + charts
│   ├── BankDetailPage.tsx    # Single bank detail view
│   └── FaqPage.tsx           # Full FAQ page with FAQPage JSON-LD structured data
├── Components/      # Reusable React components + tests
│   ├── FaqAccordion.tsx          # Compact accordion (5 quick Qs + "See all FAQs" link)
│   ├── InterestVsSavingsChart.tsx  # Reusable savings-vs-interest LineChart
│   ├── InterestGraph.tsx           # Current rates comparison chart (homepage)
│   ├── HistoryView.tsx             # Per-bank rate history accordions + charts
│   ├── Interests.tsx               # Current rates table with sorting
│   ├── Inputs.tsx                  # User profile form fields
│   ├── InputValues.ts              # Input field definitions (numerical + boolean)
│   ├── Header.tsx, Footer.tsx      # Layout
│   ├── Alert.tsx, LocalLink.tsx    # Shared utilities
│   └── types.ts                    # InputArg, Field types
├── hooks/           # Custom React hooks
│   └── useDocumentTitle.ts  # Sets document.title + restores on unmount
└── consts/
    ├── colors.ts       # Theme, lineColors[], primaryColor, bgColor, textColor
    └── keys.ts         # STORE_KEY for localStorage
```

## Core Architecture

### Interest Calculation Flow

```
User inputs → Profile → interestFn(Profile) → ResultInterest
                                              ├── .toYearly() → $ amount
                                              ├── .toYearlyPercent() → EIR %
                                              ├── .toMonthly() / .toDaily()
                                              └── .addInterest(n) → mutates (used by Citibank)
```

### How Banks Are Registered

**Single source of truth**: `src/logic/constants.tsx` → `bankInfo` record.

Each entry maps a bank display name to:
```typescript
{
  url: string;           // Link to bank's official rate page
  remarks: string | ReactElement;  // Notes / caveats / referral codes
  history: RateSnapshot[];         // Chronologically sorted rate history
}
```

The app auto-derives "current" rates from `history` via `deriveCurrentFromHistory()` — no manual current-rate exports needed.

### RateSnapshot Structure

```typescript
interface RateSnapshot {
  effectiveDate: string;  // "YYYY-MM-DD" ISO date
  interestFn: (profile: Profile) => ResultInterest;
  changeSummary: string;  // Human-readable diff from previous snapshot
}
```

**History arrays MUST be sorted chronologically** (oldest first). `deriveCurrentFromHistory()` walks backwards to find the latest entry with `effectiveDate ≤ today`. Future-dated entries are skipped automatically.

## Pattern Catalog

### Pattern A: Adding a New Bank

1. Create `src/logic/{bank}.ts` — export interest functions + `{bank}History: RateSnapshot[]`
2. Create `src/logic/{bank}.test.ts` — table-driven tests (see "Testing Patterns" below)
3. Register in `src/logic/constants.tsx`:
   - Add import for `{bank}History`
   - Add entry to `bankInfo` record with `url`, `remarks`, and `history`
4. Run `npx vitest run` — all tests must pass before pushing

### Pattern B: Adding a Rate Change to an Existing Bank

1. Add a new interest function in the bank's `src/logic/{bank}.ts` (name it with `_MM_YYYY` suffix convention)
2. Append a new `RateSnapshot` to the bank's history array with:
   - `effectiveDate`: the date the rate takes effect
   - `interestFn`: the new function
   - `changeSummary`: what changed (e.g., "Reduced to 1.88% p.a. (from 2.28%).")
3. Add test cases for the new function in the bank's test file
4. Run `npx vitest run`

### Pattern C: Interest Function Variants

**Simple tiered (most common)** — use `calculate_ir()`:
```typescript
// GXS: cumulative tiered with cutoffs
calculate_ir(Savings, {
  cutoffs: [
    { Cutoff: 85_000, InterestRatePercent: 1.38 },
    { Cutoff: 10_000, InterestRatePercent: 1.08 },
  ],
  baseRatePercent: 0,
})
```

**Factory pattern (Maribank, Choco Finance)** — single-tier with HOF:
```typescript
const maribankInterest = (rate: number) => (profile: Profile): ResultInterest =>
  calculate_ir(profile.Savings, {
    cutoffs: [{ Cutoff: 100_000, InterestRatePercent: rate }],
    baseRatePercent: 0,
  });
```

**Flat-tiered / non-additive (Maybank iSAVvy)** — use `baseRatePercent`:
```typescript
// Entire balance earns the rate of its tier (NOT additive)
if (s < 5_000) rate = 0.1875;
else if (s < 50_000) rate = 0.30;
else rate = 0.38;
return calculate_ir(s, { cutoffs: [], baseRatePercent: rate });
```

**Category-based bonus (UOB, OCBC, DBS, Trust)** — build up interest rate by checking profile fields, then pass to `calculate_ir()`.

**Multi-product banks (Maybank, Trust, BOC)** — one file exports multiple history arrays. Register each as a separate `bankInfo` entry.

### Pattern D: Component Conventions

**Charts**: Use `InterestVsSavingsChart` (accepts `ChartLine[]`, optional `children` for `ChartsReferenceLine`).

**Line colors**: Always use `lineColors[idx % lineColors.length]`.

**Dark theme styling**: Use `textColor`, `bgColor`, `primaryColor` from `src/consts/colors.ts`. Import `theme` from colors for shadows/elevation.

**Small screen handling**: Check `useMediaQuery("(max-width:640px)")` and show a fallback message. Charts are desktop-only.

**Row hover effects**: Use `alpha(primaryColor, 0.1)` for hover backgrounds, NOT opacity (opacity fades child text).

**MUI v9**: Uses the new slot-based API for some components (e.g., `slotProps` for chart legends).

### Pattern E: Deriving Current Rates

```typescript
// From any bank's history, derive the current rate function:
const { interestFn, lastUpdated } = deriveCurrentFromHistory(bankHistory);
const result = interestFn(profile);
```

- `deriveCurrentFromHistory` returns `{ interestFn, lastUpdated }`
- When history is empty → zero-interest fallback, `lastUpdated = "Coming soon"`
- When all entries are future-dated → zero-interest, `lastUpdated = "Effective {date}"`
- Otherwise → latest non-future entry

### Pattern F: Adding or Editing FAQ Content

All FAQ content lives in `src/data/faq.ts` — this is the single source of truth for both
the compact accordion on the main page and the full FAQ page.

```typescript
// src/data/faq.ts
export interface FaqEntry {
  question: string;
  answer: string;
}

const FULL: FaqEntry[] = [
  { question: "How is the best HYSA rate calculated?", answer: "..." },
  // ...all 19 Q&A entries
];

// Indices into FULL for the accordion subset (first 5 by default)
export const ACCORDION_INDICES: number[] = [0, 1, 2, 3, 4];

// Derived exports — do NOT edit these directly
export const ACCORDION_FAQ: FaqEntry[] = ACCORDION_INDICES.map((i) => FULL[i]);
export const FULL_FAQ: FaqEntry[] = FULL;
```

**To add a new FAQ**: append to `FULL[]`. If you want it in the accordion too, add its index to `ACCORDION_INDICES`.

**To change accordion questions**: edit `ACCORDION_INDICES` only. Keep it at 4–6 entries.

**To edit answer text**: edit the entry in `FULL[]` — it updates both places automatically.

### Pattern G: Routing & Navigation

**Adding a new page route** involves three steps:

1. Create the page component in `src/pages/`
2. Add a `<Route>` in `src/App.tsx` under the `<Layout>` route
3. Add an entry to `TAB_CONFIG` in `src/Components/Header.tsx` — tabs are auto-generated from this config:
   ```typescript
   const TAB_CONFIG = {
     current: { path: "/", label: "Current Rates" },
     history: { path: "/history", label: "Rate History" },
     faq: { path: "/faq", label: "FAQ" },
   } as const;
   ```
4. If the page should be indexed, add a `<url>` entry to `public/sitemap.xml`

**FaqPage specifics**: Uses `FAQPage` JSON-LD structured data (injected via `dangerouslySetInnerHTML`). Questions and answers are visible by default (not collapsed) to qualify for Google's FAQ rich results. The page includes back-links to the calculator at both top and bottom.

### Pattern H: Component Composition on CurrentRatesTab

## Testing Patterns

### Test Framework
- **Runner**: `vitest` (NOT Jest, despite the jest-dom imports)
- **Environment**: `jsdom`
- **Assertions**: `@testing-library/jest-dom` + `vitest`'s built-in `expect`

### Bank Logic Tests (table-driven)

All bank tests follow this exact pattern:
```typescript
interface testCase {
  caseName: string;
  savings: number;
  expectedResult: number;  // Yearly interest in dollars
}

describe("BankName Interest rates (Month Year)", () => {
  const testCases: Array<testCase> = [
    { caseName: "No $$ is empty", savings: 0, expectedResult: 0 },
    { caseName: "Max tier", savings: 100000, expectedResult: 1548 },
    // ...more cases
  ];
  for (const tc of testCases) {
    it(tc.caseName, () => {
      const result = interestFn(NewProfile({ Savings: tc.savings }));
      expect(result).toEqual(new ResultInterest(tc.expectedResult, tc.savings));
    });
  }
});
```

Key rules:
- Use `NewProfile({ Savings: n })` to create test profiles with only relevant fields set
- Compare entire `ResultInterest` objects with `toEqual()`, not individual properties
- Test edge cases: 0 savings, max tier, tier boundaries, below minimum thresholds

### Component Tests

- Use `@testing-library/react`'s `render()`
- Prefer specific assertions over snapshot tests
- `App.test.tsx` uses `toMatchSnapshot()` — this is the **only** snapshot test. Snapshot updates require running `vitest --update`.

### Running Tests

```bash
npm test              # Run all tests once
npm run test:dev      # Watch mode
npx vitest --update   # Update snapshots
```

## Gotchas & Pitfalls

1. **`ResultInterest` is mutable** — `addInterest()` mutates the instance. Citibank uses this. Don't reuse ResultInterest instances across computations.

2. **`calculate_ir` is non-cumulative** — cutoffs consume savings sequentially. `baseRatePercent` applies to remaining balance after all cutoffs. Setting `cutoffs: []` with a `baseRatePercent` gives a flat rate on the entire balance.

3. **History array order matters** — always oldest-first. The system derives "current" by walking backwards through the sorted array.

4. **Future-dated entries** — allowed but automatically skipped by `deriveCurrentFromHistory()`. Use this for pre-announced rate changes.

5. **iSAVvy rates are NOT additive** — unlike most banks, Maybank iSAVvy/iSAVvy Plus use flat-tiered rates (entire balance earns one rate based on tier). Pass the rate as `baseRatePercent` with empty `cutoffs`.

6. **No `strict: true` in tsconfig** — the project currently compiles without strict null checks. Be defensive with optional values.

7. **No ESLint** — code style is enforced by convention only. Follow existing patterns.

8. **Maribank rate in remarks** — the `mariCurrentRate` string in `constants.tsx` is computed at module load time from `maribankHistory`. It auto-updates when you add rate changes. Use `{ Savings: 10000 }` as the dummy profile for this computation.

9. **MUI v9 slot props** — chart legends use `slotProps.legend` (not the old `legend` prop).

10. **Profile persistence** — user inputs are stored in `localStorage` under `STORE_KEY` (`"current_profile"`).

11. **FAQ structured data must be visible** — Google requires FAQPage Q&A to be visible on page load (not hidden in accordions) to earn the rich result. The `/faq` page renders all answers expanded. The accordion on the homepage intentionally only shows 5 Qs and does NOT include FAQPage schema.

12. **Header snapshots break on new tabs** — adding an entry to `TAB_CONFIG` in `Header.tsx` will break the header snapshot test. Run `npx vitest --update` after adding or removing tabs.

## Adding New Test Cases for a Bank

When adding a rate change (new `RateSnapshot`), add a test `describe` block with:
- Zero savings → zero interest
- At least one mid-tier value
- Max effective savings (the highest cutoff or applicable cap)
- Below minimum threshold (if the bank has one, e.g., GXS requires $200)
- Tier boundary values for any new/changed cutoffs

## Build & Deploy

```bash
npm start        # Dev server (Vite)
npm run build    # Production build → build/
npm run serve    # Preview production build
```

Deployment is handled externally. The build output goes to `build/` (CRA-compatible path).
