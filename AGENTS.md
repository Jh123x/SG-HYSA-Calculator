# AGENTS.md — SG-HYSA-Calculator

> Guidance for AI assistants working on this codebase. Follow these conventions to maximize one-shot accuracy.

## Project Overview

**SG HYSA Calculator** — Compare Singapore High Yield Savings Account interest rates based on your financial profile. Live at [hysa.jh123x.com](https://hysa.jh123x.com/).

- **Stack**: React 19, MUI 9, TypeScript, Vite, Vitest
- **Theme**: Dark mode (`bgColor: #282828`, `textColor: #FFFFFF`, `primaryColor: #9550ff`)
- **Tests**: 175 test cases across all bank files + components
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
├── logic/           # One file per bank + shared utilities + tests
│   ├── common.ts        # calculate_ir() — shared tiered interest calculator
│   ├── history.ts       # deriveCurrentFromHistory(), resolveHistoryForChart()
│   ├── constants.tsx     # bankInfo registry — THE single source of truth for bank list
│   ├── {bank}.ts        # Per-bank interest functions + history array
│   └── {bank}.test.ts   # Per-bank tests
├── Components/      # React components + tests
│   ├── InterestVsSavingsChart.tsx  # Reusable savings-vs-interest LineChart
│   ├── InterestGraph.tsx           # Current rates comparison chart (homepage)
│   ├── HistoryView.tsx             # Per-bank rate history accordions + charts
│   ├── Interests.tsx               # Current rates table with sorting
│   ├── Inputs.tsx                  # User profile form fields
│   ├── InputValues.ts              # Input field definitions (numerical + boolean)
│   ├── Header.tsx, Footer.tsx      # Layout
│   ├── Alert.tsx, LocalLink.tsx    # Shared utilities
│   └── types.ts                    # InputArg, Field types
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
