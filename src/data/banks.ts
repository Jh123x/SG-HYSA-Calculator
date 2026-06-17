/**
 * Bank registry — pure data layer (no React / JSX).
 *
 * Keys are URL-safe slugs (e.g. "uob-one-account", "ocbc-360-account").
 * remarks are plain text strings using lightweight conventions:
 *   **bold**            → rendered as <b> in React
 *   [text](url)         → rendered as <LocalLink> in React
 *
 * This module is safe to import from non-React contexts
 * (scripts, build tools, tests with minimal deps, etc.).
 */

import type { RateSnapshot } from "../types/history";
import type Profile from "../types/profile";
import { uobHistory } from "../logic/uob";
import { gxsHistory } from "../logic/gxs";
import { ocbcHistory } from "../logic/ocbc360";
import {
  maybankSaveUpHistory,
  maybankIsavvyHistory,
  maybankIsavvyPlusHistory,
} from "../logic/maybank";
import { citiHistory } from "../logic/citibank";
import { standChartHistory } from "../logic/stand_chart";
import { dbsMultiplierHistory } from "../logic/dbs_multiplier";
import {
  trustBankZenHistory,
  trustBankSignatureHistory,
} from "../logic/trust_bank";
import { maribankHistory } from "../logic/maribank";
import { deriveCurrentFromHistory } from "../logic/history";
import { bocSuperSaverHistory } from "../logic/bank_of_china";
import { chocoFinanceHistory } from "../logic/choco_finance";

// Pre-compute Mari current rate so remarks are self-contained
const _mariCurrentRate = (() => {
  const { interestFn } = deriveCurrentFromHistory(maribankHistory);
  return interestFn({ Savings: 10000 } as Profile).toYearlyPercent().toFixed(2);
})();

// ── Types ────────────────────────────────────────────────────────────

export interface BankData {
  /** Human-readable display name (e.g. "UOB One Account") */
  name: string;
  /** Official product page URL */
  url: string;
  /** Plain-text remarks (no JSX — see module docstring for conventions) */
  remarks: string;
  /** Chronologically sorted rate snapshots (oldest first) */
  history: RateSnapshot[];
}

// ── Registry ─────────────────────────────────────────────────────────

export const banks: Record<string, BankData> = {
  "uob-one-account": {
    name: "UOB One Account",
    url: "https://www.uob.com.sg/assets/web-resources/personal/pdf/save/everyday-accounts/revision-of-interest-rates-for-uob-one-account.pdf",
    remarks: "Visit their official website to find out more",
    history: uobHistory,
  },
  "ocbc-360-account": {
    name: "OCBC 360 Account",
    url: "https://www.ocbc.com/personal-banking/notices",
    remarks: "Visit the official website to find out more",
    history: ocbcHistory,
  },
  "mari-savings-account": {
    name: "Mari Savings Account",
    url: "https://www.maribank.sg/product/mari-savings-account/",
    remarks:
      `Interest rates are a flat ${_mariCurrentRate}%\nCapped at $100k\nReferral code: **4QTP99MT**`,
    history: maribankHistory,
  },
  "standard-chartered-bonus-saver": {
    name: "Standard Chartered Bonus$aver",
    url: "https://www.sc.com/sg/save/current-accounts/bonussaver/",
    remarks:
      "Insurance and Investment only\nfulfils interest for 6 months",
    history: standChartHistory,
  },
  "trust-bank-signature": {
    name: "Trust Bank (Signature)",
    url: "https://trustbank.sg/savings-account/",
    remarks: "Spending assumes 5 x $30 if spending is more than 150.",
    history: trustBankSignatureHistory,
  },
  "trust-bank-zen": {
    name: "Trust Bank (Zen)",
    url: "https://trustbank.sg/savings-account/",
    remarks: "A Flat 0.4% interest rate up to 1.2 million",
    history: trustBankZenHistory,
  },
  "dbs-multiplier-account": {
    name: "DBS Multiplier Account",
    url: "https://www.dbs.com.sg/personal/deposits/bank-earn/multiplier",
    remarks:
      "No eligible if you are younger than 18.\nSpending includes credit card / paylah retail spend",
    history: dbsMultiplierHistory,
  },
  "gxs-savings-account": {
    name: "GXS Savings Account",
    url: "https://www.gxs.com.sg/savings-account",
    remarks:
      "Calculated using boost pocket (3 months) up to $85,000 with remaining balance in saving pockets\n**Note: The max amount deposited depends on individual (up to $95,000)**\nView other [Notices here](https://www.gxs.com.sg/notices)",
    history: gxsHistory,
  },
  "chocolate-finance": {
    name: "Chocolate Finance",
    url: "https://www.chocolatefinance.com/",
    remarks:
      "1st 20k 2% p.a, next 80k 1.8% p.a.\nAmounts above 100k are invested and will not be counted here.\n**Note: This is not a bank**\n[Referral link](https://share.chocolate.app/nxW9/l0tqqxem)",
    history: chocoFinanceHistory,
  },
  "boc-supersaver": {
    name: "BOC SuperSaver",
    url: "https://www.bankofchina.com/sg/bocinfo/bi1/202509/t20250929_25516576.html",
    remarks:
      "This account is valid from 2024-08-01 onwards.\n**Note: You have to link your paynow to this account to qualify for the sale.**",
    history: bocSuperSaverHistory,
  },
  "maybank-saveup": {
    name: "Maybank SaveUp",
    url: "https://sslsecure.maybank.com.sg/scripts/mbb_rates_savings.jsp",
    remarks:
      "Flat tiered rates: 0.1875% (first $3K), 0.25% (next $47K), 0.3125% (above $50K).\nNo more category-based bonus system.",
    history: maybankSaveUpHistory,
  },
  "maybank-isavvy": {
    name: "Maybank iSAVvy",
    url: "https://sslsecure.maybank.com.sg/scripts/mbb_rates_savings.jsp",
    remarks:
      "Flat tiered rates (non-additive): 0.1875% (<$5K), 0.30% ($5K–$50K), 0.38% (≥$50K).\nRates effective from 11 June 2026.",
    history: maybankIsavvyHistory,
  },
  "maybank-isavvy-plus": {
    name: "Maybank iSAVvy Plus",
    url: "https://sslsecure.maybank.com.sg/scripts/mbb_rates_savings.jsp",
    remarks:
      "Flat tiered base rates: 0.1875% (<$5K), 0.30% ($5K–$50K), 0.38% (≥$50K).\n+1.52% p.a. bonus (paid every 6 months) only if ADB increases every month.\n**Set 'Account Increment' > 0 to qualify for the bonus.**",
    history: maybankIsavvyPlusHistory,
  },
  "citi-wealth-first-account": {
    name: "Citi Wealth First Account",
    url: "https://www.citibank.com.sg/personal-banking/deposits/citi-wealth-first-saving-account",
    remarks:
      "Only Citigold and above members above 18 years old can access this perk (IE: more than 250k avg balance)\nBonus interest capped at first $500k.\n*Assumes Citigold level, Citi Private has a higher level.",
    history: citiHistory,
  },
};

/** All bank slugs in registry order. */
export const BANK_SLUGS = Object.keys(banks);

/** Number of registered banks. */
export const BANK_COUNT = BANK_SLUGS.length;
