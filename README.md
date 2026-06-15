<p align="center">
  <img src="public/hysa_logo.webp" alt="SG HYSA Calculator" width="200">
</p>

# [SG] High Yield Savings Account Calculator

> Compare Singapore high-yield savings accounts side by side. Enter your profile and see which bank gives you the best returns.

**Live site:** [hysa.jh123x.com](https://hysa.jh123x.com/)  
**Blog post:** [A look at high yield saving accounts in Singapore](https://jh123x.com/blog/2024/high-yield-saving-accounts/)

![Home Page](./imgs/HYSA%20Page.png "Home Page")

## Features

**Current Rates table** — sortable comparison of every supported account with yearly interest, effective interest rate (EIR), remarks, and last-updated date. An Actions column links directly to each bank's official website and a detailed rate history page.

**Interest vs Savings chart** — interactive line chart plotting projected yearly interest from $0 to $200,000 across all accounts, with a reference line at your current savings amount.

![Interest vs Savings Chart](./imgs/Graph%20Comparison.png "Interest vs Savings Chart")

**Rate Change History** (`/history`) — compare multiple banks over time with a toggle between yearly interest ($) and EIR (%). Select banks via filter chips to plot rate changes forward-filled across the full timeline, with per-bank detail sections showing each rate snapshot and change summary.

**Bank Detail Pages** (`/bank/<slug>`) — per-bank summary card with current EIR, rate snapshot count, and remarks, plus an EIR-over-time line chart with step-after interpolation and a full rate change log table sorted newest-first.

![Bank Details](./imgs/Bank%20Details.png "Bank Details")

**Personalised Profile Inputs** — Savings, Salary, Age, Spending, Investment, Insurance, GIRO transactions, Account Increment, Loan Installment, and NTUC membership. Interest is calculated per-bank based on the criteria you meet. Profile persists via `localStorage`.

---

## Developer Guide

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Git

### Setup & Run

```bash
# Clone the repo
git clone git@github.com:Jh123x/SG-HYSA-Calculator.git
cd SG-HYSA-Calculator

# Install dependencies
bun install

# Start development server
bun start
# → Opens at http://localhost:5173

# Run tests
bun test          # single run
bun test:dev      # watch mode
```

### Build for Production

```bash
bun run build     # outputs to build/
bun run serve     # preview production build locally
```

### Tech Stack

| Layer           | Technology               |
| --------------- | ------------------------ |
| Framework       | React 19                 |
| Build           | Vite 8                   |
| Language        | TypeScript               |
| UI              | MUI (Material UI) 9      |
| Charts          | MUI X Charts             |
| Routing         | React Router 7           |
| Testing         | Vitest + Testing Library |
| Package Manager | Bun                      |

### Project Structure

```
src/
├── Components/       # Reusable UI components
│   ├── BankToggleChips.tsx
│   ├── ComparisonChart.tsx
│   ├── InterestGraph.tsx
│   ├── Inputs.tsx
│   └── ...
├── consts/           # Keys, colours
├── logic/            # Bank-specific interest calculations
│   ├── constants.tsx # Bank registry (bankInfo)
│   ├── uob.ts        # UOB One interest logic
│   ├── ocbc360.ts    # OCBC 360 interest logic
│   ├── maybank.ts    # Maybank iSAVvy/iSAVvy Plus/SaveUp
│   └── ...           # One file per bank
├── pages/            # Route-level pages
│   ├── CurrentRatesTab.tsx
│   ├── HistoryTab.tsx
│   └── BankDetailPage.tsx
└── types/            # TypeScript interfaces
```

---

## Supported Bank Accounts

| #   | Bank Account                      | Key Criteria                                                                             |
| --- | --------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | **UOB One**                       | $500 card spend, $1,600 salary, 3 GIRO                                                   |
| 2   | **OCBC 360**                      | $1,800 salary, $500 ADB increase, $500 spend, insurance, investment, $200k balance       |
| 3   | **Maribank**                      | Flat rate, capped at $100k                                                               |
| 4   | **Standard Chartered Bonus$aver** | $2,000 card spend, salary credit, 3 bill payments, insurance, investment                 |
| 5   | **Trust Bank (Signature)**        | 5× $30 card spend, NTUC Link, salary deposit, $100k balance                              |
| 6   | **Trust Bank (Zen)**              | Flat 0.4% up to $1.2M                                                                    |
| 7   | **DBS Multiplier**                | Income + transactions across categories (credit card, home loan, insurance, investments) |
| 8   | **GXS**                           | Boost pocket (3-month) + savings pocket up to $85k                                       |
| 9   | **Chocolate Finance**             | 2% first $20k, 1.8% next $80k (not a bank — a fund)                                      |
| 10  | **Bank of China SuperSaver**      | PayNow-linked, salary credit                                                             |
| 11  | **Maybank Save Up**               | Flat tiered: 0.1875%–0.3125%                                                             |
| 12  | **Maybank iSAVvy**                | Flat tiered: 0.1875%–0.38%                                                               |
| 13  | **Maybank iSAVvy Plus**           | Flat tiered base + 1.52% p.a. bonus (ADB growth required)                                |
| 14  | **Citi Wealth First**             | Citigold+ only, bonus capped at $500k                                                    |

---

## Disclaimer

> Interest rates are subject to change without notice. Please do your own research before making any decisions — the numbers here serve as a guide. Ask your friends for referral codes to get additional bonuses.
