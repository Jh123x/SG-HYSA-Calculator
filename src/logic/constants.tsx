import * as React from "react"
import { ResultInterest } from "../types/interest_result.ts"
import Profile from "../types/profile.ts"
import { maribank_new_interest, mariNewInterestRate } from "./maribank.ts"
import { uob_interest } from "./uob.ts"
import { ocbc_interest } from "./ocbc360.ts"
import { choco_finance } from "./choco_finance.ts"
import { stand_chart_interest } from "./stand_chart.ts"
import { placeholder_ir } from "./common.ts"
import { ReactElement } from "react"
import { trust_bank } from "./trust_bank.ts"
import { dbs_multiplier_interest } from "./dbs_multiplier.ts"
import { gxs_interest } from "./gxs.ts"
import { bank_of_china_smart_saver, bank_of_china_super_saver } from "./bank_of_china.ts"
import { LocalLink } from "../Components/LocalLink.tsx"
import { maybank_save_up } from "./maybank.ts"

interface Info {
    interestFn: (profile: Profile) => ResultInterest
    url: string
    remarks: string | ReactElement
    lastUpdated: string
}

export const bankInfo: Record<string, Info> = {
    "UOB Bank": {
        interestFn: uob_interest,
        url: "https://www.uob.com.sg/personal/save/everyday-accounts/one-account.page",
        remarks: <p>Visit their official website to find out more</p>,
        lastUpdated: "2025-05-05",
    },
    "OCBC Bank": {
        interestFn: ocbc_interest,
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        remarks: <p>Visit their official website to find out more</p>,
        lastUpdated: "2025-05-05",
    },
    "Maribank": {
        interestFn: maribank_new_interest,
        url: "https://www.maribank.sg/product/mari-savings-account",
        remarks: <p>
            Interest rates are a flat {mariNewInterestRate}%
            <br />
            Capped at $100k
            <br />
            Referral code: <b>4QTP99MT</b>
        </p>,
        lastUpdated: "2025-05-05",
    },
    "Standard Chartered": {
        interestFn: stand_chart_interest,
        url: "https://www.sc.com/sg/save/current-accounts/bonussaver/",
        remarks: <p>Insurance and Investment only<br />fulfils interest for 6 months</p>,
        lastUpdated: "2025-05-05",
    },
    "Trust Bank": {
        interestFn: trust_bank,
        url: "https://trustbank.sg/savings-account/",
        remarks: <p>Spending assumes 5 x $30 if spending is more than 150.</p>,
        lastUpdated: "2025-05-05",
    },
    "DBS Multiplier Account": {
        interestFn: dbs_multiplier_interest,
        url: "https://www.dbs.com.sg/personal/deposits/bank-earn/multiplier",
        remarks: <p>No eligible if you are younger than 18.<br />Spending includes credit card / paylah retail spend</p>,
        lastUpdated: "2025-05-05",
    },
    "GXS": {
        interestFn: gxs_interest,
        url: "https://www.gxs.com.sg/savings-account",
        remarks: <p>
            Caculated using boost pocket (3 months) up to $60,000 with remaining balance in main account
            <br />
            <b>Note: The max amount deposited depends on individual (up to $95,000)</b>
        </p>,
        lastUpdated: "2025-05-05",
    },
    "Chocolate Finance": {
        interestFn: choco_finance,
        url: "https://www.chocolatefinance.com/",
        remarks: <p>
            1st 20k 3.3% p.a, next 30k 3% p.a.
            <br />
            Amounts above 50k are not included.
            <br />
            <b>Note: This is not a bank</b>
            <br />
            <LocalLink href="https://share.chocolate.app/nxW9/l0tqqxem">Referral link</LocalLink>
        </p>,
        lastUpdated: "2025-05-05",
    },
    "Bank of China SmartSaver": {
        interestFn: bank_of_china_smart_saver,
        url: "https://www.bankofchina.com/sg/pbservice/pb1/202212/t20221230_22348761.html",
        remarks: <p>
            This account is valid from 2024-11-01 onwards.
            <br />
            Giro Transactions are assumed to be $30 worth each.
            <br />
            <LocalLink href="https://www.bankofchina.com/sg/bocinfo/bi3/bi33/202404/t20240401_24845706.html"            >
                BOC base interest rates.
            </LocalLink>
        </p>,
        lastUpdated: "2025-05-01",
    },
    "Bank of China SuperSaver": {
        interestFn: bank_of_china_super_saver,
        url: "https://www.bankofchina.com/sg/pbservice/pb1/202212/t20221230_22348756.html",
        remarks: <p>
            This account is valid from 2024-08-01 onwards.
            <br />
            <b>Note: You have to link your paynow to this account to qualify for the sale.</b>
        </p>,
        lastUpdated: "2025-05-05",
    },
    "Maybank Save Up": {
        interestFn: maybank_save_up,
        url: "https://www.maybank2u.com.sg/en/personal/saveup/save-up-programme.page",
        remarks: <>
            <p>*Assumes that Investment qualifies & within Interest period.</p>
            <LocalLink href="https://sslsecure.maybank.com.sg/cgi-bin/mbs/JSPscripts/mbb_rates/mbb_rates_savings.jsp?_gl=1*o41w5v*_gcl_au*MzUxMjAzMzAwLjE3NDYzODE0OTQ.*_ga*MTc5ODIyMTQ3OS4xNzQ2MzgxNDk0*_ga_QME4P70W20*MTc0NjM4MTQ5NC4xLjAuMTc0NjM4MTQ5NC42MC4wLjA.#sav2">
                Check the base interest rates here
            </LocalLink>
        </>,
        lastUpdated: "2024-05-05",
    },
    "Citi Wealth first Account": {
        interestFn: placeholder_ir,
        url: "https://www.citibank.com.sg/personal-banking/deposits/citi-wealth-first-saving-account",
        remarks: <>To be added</>,
        lastUpdated: "2024-12-01",
    },
}
