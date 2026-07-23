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

import { type Profile, NewProfile } from "../types/profile";
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
  trustBankFlexHistory,
} from "../logic/trust_bank";
import { maribankHistory } from "../logic/maribank";
import { deriveCurrentFromHistory } from "../logic/history";
import { bocSuperSaverHistory, bocSmartSaverHistory } from "../logic/bank_of_china";
import { chocoFinanceHistory } from "../logic/choco_finance";
import type { BankData } from "../types/bank_data";
import { FIELDS } from "../consts/fields";
import type { InterestFn } from "../types/interest";

// Pre-compute Mari current rate so remarks are self-contained
const _mariCurrentRate = (() => {
  const { interestFn } = deriveCurrentFromHistory(maribankHistory);
  return interestFn(NewProfile({ Savings: 10000 }))
    .toYearlyPercent()
    .toFixed(2);
})();


export const banks: Record<string, BankData> = {
  "uob-one-account": {
    name: "UOB One",
    url: "https://www.uob.com.sg/assets/web-resources/personal/pdf/save/everyday-accounts/revision-of-interest-rates-for-uob-one-account.pdf",
    remarks: "Visit their official website to find out more",
    history: uobHistory,
  },
  "ocbc-360-account": {
    name: "OCBC 360",
    url: "https://www.ocbc.com/personal-banking/notices",
    remarks: "Visit the official website to find out more",
    history: ocbcHistory,
  },
  "mari-savings-account": {
    name: "Mari Savings",
    url: "https://www.maribank.sg/product/mari-savings-account/",
    remarks: `Interest rates are a flat ${_mariCurrentRate}%\nCapped at $100k\nReferral code: **4QTP99MT**`,
    history: maribankHistory,
  },
  "standard-chartered-bonus-saver": {
    name: "Standard Chartered Bonus$aver",
    url: "https://www.sc.com/sg/save/current-accounts/bonussaver/",
    remarks: "Insurance and Investment categories\neach qualify for bonus interest for only 6 months",
    history: standChartHistory,
  },
  "trust-bank-signature": {
    name: "Trust Bank (Signature)",
    url: "https://trustbank.sg/savings-account/",
    remarks: "Spending assumes 5 × S$30 transactions if total spend exceeds S$150.",
    history: trustBankSignatureHistory,
  },
  "trust-bank-zen": {
    name: "Trust Bank (Zen)",
    url: "https://trustbank.sg/savings-account/",
    remarks: "Flat 0.4% p.a. on balances up to S$1,200,000",
    history: trustBankZenHistory,
  },
  "trust-bank-flex": {
    name: "Trust Bank (Flex)",
    url: "https://trustbank.sg/trust-plus/",
    remarks:
      "Flex Plan: picks top 3 qualifying bonus scoops.\nScoops: salary $1.5K (+0.45%), 5×$30 spend (+0.20% NTUC/+0.10%), $100K ADB (+0.30%), Invest $20K (+0.70%), ADB increase $3K (+0.20%).\n**Trust+ required (min S$100K).**",
    history: trustBankFlexHistory,
  },
  "dbs-multiplier-account": {
    name: "DBS Multiplier",
    url: "https://www.dbs.com.sg/personal/deposits/bank-earn/multiplier",
    remarks:
      "Not eligible if you are younger than 18.\nSpending includes credit card / paylah retail spend",
    history: dbsMultiplierHistory,
  },
  "gxs-savings-account": {
    name: "GXS Savings",
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
      "This account is valid from 2024-08-01 onwards.\n**Note: You have to link your PayNow to this account to qualify for bonus interest.**",
    history: bocSuperSaverHistory,
  },
  "boc-smartsaver": {
    name: "BOC SmartSaver",
    url: "https://sethisfy.com/boc-smartsaver-getting-up-to-4-60-p-a-with-this-savings-account/",
    remarks:
      "Prevailing 0.10%, Card S$750 +0.60% / S$2.5K +0.90%, Salary S$3K +0.50%, 3×Bill +0.10%, Insurance +3.00%. Max 1.60% on S$100K (4.60% with insurance).",
    history: bocSmartSaverHistory,
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
    name: "Citi Wealth First",
    url: "https://www.citibank.com.sg/personal-banking/deposits/citi-wealth-first-saving-account",
    remarks:
      "Only Citigold and above members above 18 years old can access this perk (IE: more than 250k avg balance)\nBonus interest capped at first $500k.\n*Assumes Citigold tier. Citi Private clients enjoy higher rates.",
    history: citiHistory,
  },
};

/**
 * Auto-detect which Profile fields a bank's interest function reads.
 *
 * Uses a Proxy that records every property access while feeding values
 * that maximise bonus branches (Infinity for numbers, true for booleans).
 * This ensures we capture optional criteria that only activate above
 * certain thresholds (e.g. Insurance > $150k, Spending >= $750).
 */
export function deriveFactors(interestFn: InterestFn): string[] {
  const accessed = new Set<string>();

  const proxy = new Proxy({} as Profile, {
    get(_target, prop: string) {
      if (prop === "then" || typeof prop === "symbol") return undefined;
      accessed.add(prop);
      // Booleans → true, everything else → Infinity to trigger all branches
      const fieldValue = FIELDS.find((v) => v.key === prop);

      if (!fieldValue) throw new Error("invalid field");
      if (fieldValue.isBoolean) return true
      return Infinity;
    },
  });

  try {
    interestFn(proxy);
  } catch {
    // If Infinity breaks something, we still captured the field accesses
  }

  return [...accessed]
    .map((f) => FIELDS.find((v) => v.key === f)?.label ?? "")
    .filter(Boolean)
    .sort();
}


// Auto-derive factors for every bank from its interest function
for (const bank of Object.values(banks)) {
  const latest = deriveCurrentFromHistory(bank.history);
  bank.factors = deriveFactors(latest.interestFn);
}

/** All bank slugs in registry order. */
export const BANK_SLUGS = Object.keys(banks);
