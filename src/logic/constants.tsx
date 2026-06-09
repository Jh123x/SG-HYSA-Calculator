import * as React from "react";
import type Profile from "../types/profile";
import type { ReactElement } from "react";
import type { ResultInterest } from "../types/interest_result";

import { LocalLink } from "../Components/LocalLink";
import { uob_interest_2025_12 } from "./uob";
import { gxs_interest_08_2025, gxs_interest_06_2026 } from "./gxs";
import { ocbc_interest_05_2026, ocbc_interest_08_2025 } from "./ocbc360";
import { maybank_save_up_10_2025, maybank_save_up_06_2026, maybank_isavvy_06_2026, maybank_isavvy_plus_06_2026, maybank_isavvy_promo_06_2026 } from "./maybank";
import { citi_wealth_first_10_2025, citi_wealth_first_06_2026 } from "./citibank";
import { stand_chart_interest_06_2026 } from "./stand_chart";
import { dbs_multiplier_interest } from "./dbs_multiplier";
import {
  trust_bank_flex_12_2025,
  trust_bank_signature_10_2025,
  trust_bank_signature_06_2026,
  trust_bank_zen_06_2026,
} from "./trust_bank";
import {
  maribank_interest_12_2025,
  mariInterestRate_12_2025,
} from "./maribank";
import { bank_of_china_super_saver_11_2025 } from "./bank_of_china";
import { choco_finance_12_2025, choco_finance_06_2026 } from "./choco_finance";

interface Info {
  interestFn: (profile: Profile) => ResultInterest;
  url: string;
  remarks: string | ReactElement;
  lastUpdated: string;
}

export const bankInfo: Record<string, Info> = {
  "UOB Bank": {
    interestFn: uob_interest_2025_12,
    url: "https://www.uob.com.sg/assets/web-resources/personal/pdf/save/everyday-accounts/revision-of-interest-rates-for-uob-one-account.pdf",
    remarks: "Visit their official website to find out more",
    lastUpdated: "2025-11-14",
  },
  "OCBC Bank (Pre 05/26)": {
    interestFn: ocbc_interest_08_2025,
    url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
    remarks: "Visit their official website to find out more",
    lastUpdated: "2025-12-27",
  },
  "OCBC Bank (Post 05/26)": {
    interestFn: ocbc_interest_05_2026,
    url: "https://www.ocbc.com/personal-banking/notices",
    remarks: "Visit the official website to find our more",
    lastUpdated: "2026-04-05",
  },
  Maribank: {
    interestFn: maribank_interest_12_2025,
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
    lastUpdated: "2025-12-27",
  },
  "Standard Chartered": {
    interestFn: stand_chart_interest_06_2026,
    url: "https://www.sc.com/sg/save/current-accounts/bonussaver/",
    remarks: (
      <p>
        Insurance and Investment only
        <br />
        fulfils interest for 6 months
      </p>
    ),
    lastUpdated: "2026-06-05",
  },
  "Trust Bank (Signature)": {
    interestFn: trust_bank_signature_06_2026,
    url: "https://trustbank.sg/savings-account/",
    remarks: <p>Spending assumes 5 x $30 if spending is more than 150.</p>,
    lastUpdated: "2026-06-05",
  },
  "Trust Bank (Zen)": {
    interestFn: trust_bank_zen_06_2026,
    url: "https://trustbank.sg/savings-account/",
    remarks: "A Flat 0.4% interest rate up to 1.2 million",
    lastUpdated: "2026-06-05",
  },
  "DBS Multiplier Account": {
    interestFn: dbs_multiplier_interest,
    url: "https://www.dbs.com.sg/personal/deposits/bank-earn/multiplier",
    remarks: (
      <p>
        No eligible if you are younger than 18.
        <br />
        Spending includes credit card / paylah retail spend
      </p>
    ),
    lastUpdated: "2025-10-14",
  },
  GXS: {
    interestFn: gxs_interest_06_2026,
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
    lastUpdated: "2026-06-05",
  },
  "Chocolate Finance": {
    interestFn: choco_finance_06_2026,
    url: "https://www.chocolatefinance.com/",
    remarks: (
      <p>
        1st 20k 2% p.a, next 80k 1.8% p.a.
        <br />
        Amounts above 100k at 1.8% p.a.
        <br />
        <b>Note: This is not a bank</b>
        <br />
        <LocalLink href="https://share.chocolate.app/nxW9/l0tqqxem">
          Referral link
        </LocalLink>
      </p>
    ),
    lastUpdated: "2026-06-05",
  },
  "Bank of China SuperSaver": {
    interestFn: bank_of_china_super_saver_11_2025,
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
    lastUpdated: "2025-10-14",
  },
  "Maybank Save Up (Pre 06/26)": {
    interestFn: maybank_save_up_10_2025,
    url: "https://www.maybank2u.com.sg/en/personal/saveup/save-up-programme.page",
    remarks: (
      <>
        <p>*Assumes that Investment qualifies & within Interest period.</p>
        <LocalLink href="https://sslsecure.maybank.com.sg/cgi-bin/mbs/JSPscripts/mbb_rates/mbb_rates_savings.jsp?_gl=1*o41w5v*_gcl_au*MzUxMjAzMzAwLjE3NDYzODE0OTQ.*_ga*MTc5ODIyMTQ3OS4xNzQ2MzgxNDk0*_ga_QME4P70W20*MTc0NjM4MTQ5NC4xLjAuMTc0NjM4MTQ5NC42MC4wLjA.#sav2">
          Check the base interest rates here
        </LocalLink>
      </>
    ),
    lastUpdated: "2025-10-14",
  },
  "Maybank Save Up": {
    interestFn: maybank_save_up_06_2026,
    url: "https://sslsecure.maybank.com.sg/scripts/mbb_rates_savings.jsp",
    remarks: (
      <p>
        Flat tiered rates: 0.1875% (first $3K), 0.25% (next $47K), 0.3125%
        (above $50K).
        <br />
        No more category-based bonus system.
      </p>
    ),
    lastUpdated: "2026-06-09",
  },
  "Maybank iSAVvy": {
    interestFn: maybank_isavvy_06_2026,
    url: "https://sslsecure.maybank.com.sg/scripts/mbb_rates_savings.jsp",
    remarks: (
      <p>
        Tiered rates with interest-on-interest bonus (6–18% on interest earned
        every 6 months).
        <br />
        Effective rates: 0.19% (&lt;$5K), 0.31% ($5K–$50K), 0.39%
        ($50K–$100K), 0.42% (≥$100K).
      </p>
    ),
    lastUpdated: "2026-06-09",
  },
  "Maybank iSAVvy Plus": {
    interestFn: maybank_isavvy_plus_06_2026,
    url: "https://sslsecure.maybank.com.sg/scripts/mbb_rates_savings.jsp",
    remarks: (
      <p>
        Same tiers as iSAVvy + 1.52% p.a. bonus every 6 months.
        <br />
        Effective: 1.82% ($5K–$50K), 1.90% (≥$50K).
      </p>
    ),
    lastUpdated: "2026-06-09",
  },
  "Maybank iSAVvy Promo": {
    interestFn: maybank_isavvy_promo_06_2026,
    url: "https://www.maybank2u.com.sg/en/personal/about_us/important-notices/2026/changes-current-savings-accounts-interest-hibah-tiers-rates.page",
    remarks: (
      <p>
        <b>Promo: 1 May – 30 June 2026.</b> Up to 1.50% p.a. on incremental
        deposits.
        <br />
        Requires ≥$20K fresh funds vs April 2026 balance.
        <br />
        Capped at $200K for the 1.50% bonus tier.
      </p>
    ),
    lastUpdated: "2026-06-09",
  },
  "Citi Wealth first Account": {
    interestFn: citi_wealth_first_06_2026,
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
    lastUpdated: "2026-06-05",
  },
};
