import type Profile from "../types/profile";
import type { ReactElement } from "react";
import type { ResultInterest } from "../types/interest_result";
import type { RateSnapshot } from "../types/history";

import { LocalLink } from "../Components/LocalLink";
import { uobHistory } from "./uob";
import { gxsHistory } from "./gxs";
import { ocbcHistory } from "./ocbc360";
import { maybankSaveUpHistory, maybank_isavvy_06_2026, maybank_isavvy_plus_06_2026 } from "./maybank";
import { citiHistory } from "./citibank";
import { standChartHistory } from "./stand_chart";
import { dbs_multiplier_interest } from "./dbs_multiplier";
import {
  trust_bank_zen_06_2026,
  trustBankSignatureHistory,
} from "./trust_bank";
import {
  mariInterestRate_12_2025,
  maribankHistory,
} from "./maribank";
import { bocSuperSaverHistory } from "./bank_of_china";
import { chocoFinanceHistory } from "./choco_finance";

export interface BankDef {
  url: string;
  remarks: string | ReactElement;
  history: RateSnapshot[];
}

export const bankInfo: Record<string, BankDef> = {
  "UOB Bank": {
    url: "https://www.uob.com.sg/assets/web-resources/personal/pdf/save/everyday-accounts/revision-of-interest-rates-for-uob-one-account.pdf",
    remarks: "Visit their official website to find out more",
    history: uobHistory,
  },
  "OCBC Bank": {
    url: "https://www.ocbc.com/personal-banking/notices",
    remarks: "Visit the official website to find our more",
    history: ocbcHistory,
  },
  Maribank: {
    url: "https://www.maribank.sg/product/mari-savings-account/",
    remarks: (
      <p>
        Interest rates are a flat {mariInterestRate_12_2025}%
        <br />
        Capped at $100k
        <br />
        Referral code: <b>4QTP99MT</b>
      </p>
    ),
    history: maribankHistory,
  },
  "Standard Chartered": {
    url: "https://www.sc.com/sg/save/current-accounts/bonussaver/",
    remarks: (
      <p>
        Insurance and Investment only
        <br />
        fulfils interest for 6 months
      </p>
    ),
    history: standChartHistory,
  },
  "Trust Bank (Signature)": {
    url: "https://trustbank.sg/savings-account/",
    remarks: <p>Spending assumes 5 x $30 if spending is more than 150.</p>,
    history: trustBankSignatureHistory,
  },
  "Trust Bank (Zen)": {
    url: "https://trustbank.sg/savings-account/",
    remarks: "A Flat 0.4% interest rate up to 1.2 million",
    history: [
      {
        effectiveDate: "2026-06-05",
        interestFn: trust_bank_zen_06_2026,
        changeSummary: "Flat 0.4% p.a. up to S$1.2 million",
      },
    ],
  },
  "DBS Multiplier Account": {
    url: "https://www.dbs.com.sg/personal/deposits/bank-earn/multiplier",
    remarks: (
      <p>
        No eligible if you are younger than 18.
        <br />
        Spending includes credit card / paylah retail spend
      </p>
    ),
    history: [
      {
        effectiveDate: "2025-10-14",
        interestFn: dbs_multiplier_interest,
        changeSummary: "Multiplier rates based on eligible transaction categories",
      },
    ],
  },
  GXS: {
    url: "https://www.gxs.com.sg/savings-account",
    remarks: (
      <p>
        Calculated using boost pocket (3 months) up to $85,000 with remaining
        balance in saving pockets
        <br />
        <b>
          Note: The max amount deposited depends on individual (up to $95,000)
        </b>
        <br />
        View other{" "}
        <LocalLink href="https://www.gxs.com.sg/notices">
          Notices here
        </LocalLink>
      </p>
    ),
    history: gxsHistory,
  },
  "Chocolate Finance": {
    url: "https://www.chocolatefinance.com/",
    remarks: (
      <p>
        1st 20k 2% p.a, next 80k 1.8% p.a.
        <br />
        Amounts above 100k are invested and will not be counted here.
        <br />
        <b>Note: This is not a bank</b>
        <br />
        <LocalLink href="https://share.chocolate.app/nxW9/l0tqqxem">
          Referral link
        </LocalLink>
      </p>
    ),
    history: chocoFinanceHistory,
  },
  "Bank of China SuperSaver": {
    url: "https://www.bankofchina.com/sg/bocinfo/bi1/202509/t20250929_25516576.html",
    remarks: (
      <p>
        This account is valid from 2024-08-01 onwards.
        <br />
        <b>
          Note: You have to link your paynow to this account to qualify for the
          sale.
        </b>
      </p>
    ),
    history: bocSuperSaverHistory,
  },
  "Maybank Save Up": {
    url: "https://sslsecure.maybank.com.sg/scripts/mbb_rates_savings.jsp",
    remarks: (
      <p>
        Flat tiered rates: 0.1875% (first $3K), 0.25% (next $47K), 0.3125%
        (above $50K).
        <br />
        No more category-based bonus system.
      </p>
    ),
    history: maybankSaveUpHistory,
  },
  "Maybank iSAVvy": {
    url: "https://sslsecure.maybank.com.sg/scripts/mbb_rates_savings.jsp",
    remarks: (
      <p>
        Flat tiered rates (non-additive): 0.1875% (&lt;$5K), 0.30%
        ($5K–$50K), 0.38% (≥$50K).
        <br />
        Rates effective from 11 June 2026.
      </p>
    ),
    history: [
      {
        effectiveDate: "2026-06-11",
        interestFn: maybank_isavvy_06_2026,
        changeSummary:
          "Simplified tiered rates: 0.1875% (<$5K), 0.30% ($5K–$50K), 0.38% (≥$50K)",
      },
    ],
  },
  "Maybank iSAVvy Plus": {
    url: "https://sslsecure.maybank.com.sg/scripts/mbb_rates_savings.jsp",
    remarks: (
      <p>
        Flat tiered base rates: 0.1875% (&lt;$5K), 0.30% ($5K–$50K), 0.38% (≥$50K).
        <br />
        +1.52% p.a. bonus (paid every 6 months) only if ADB increases every month.
        <br />
        <b>Set "Account Increment" &gt; 0 to qualify for the bonus.</b>
      </p>
    ),
    history: [
      {
        effectiveDate: "2026-06-11",
        interestFn: maybank_isavvy_plus_06_2026,
        changeSummary:
          "Flat tiered base (0.1875%–0.38%) + 1.52% top-up bonus with monthly ADB increment",
      },
    ],
  },
  "Citi Wealth first Account": {
    url: "https://www.citibank.com.sg/personal-banking/deposits/citi-wealth-first-saving-account",
    remarks: (
      <>
        Only Citigold and above members above 18 years old can access this perk
        (IE: more than 250k avg balance)
        <br />
        Bonus interest capped at first $500k.
        <br />
        *Assumes Citigold level, Citi Private has a higher level.
      </>
    ),
    history: citiHistory,
  },
};
