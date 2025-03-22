import * as React from "react"
import { ResultInterest } from "../types/interest_result.ts"
import Profile from "../types/profile.ts"
import { maribank_interest, mariInterestRate, maribank_new_interest, mariNewInterestRate } from "./maribank.ts"
import { uob_interest } from "./uob.ts"
import { ocbc_interest, ocbc_new_interest } from "./ocbc360.ts"
import { choco_finance } from "./choco_finance.ts"
import { stand_chart_interest } from "./stand_chart.ts"
import { placeholder_ir } from "./common.ts"
import { ReactElement } from "react"

interface Info {
    interestFn: (profile: Profile) => ResultInterest
    url: string
    remarks: string | ReactElement
    lastUpdated: string
}

export const STORE_KEY = "current_profile"
export const bankInfo: Record<string, Info> = {
    "UOB Bank": {
        interestFn: uob_interest,
        url: "https://www.uob.com.sg/personal/save/everyday-accounts/one-account.page",
        remarks: <p>The calculation here excludes <br /> spending rebates included in their calculator.<br /> (Extra 200 a year if you spend 500/mth for a year)</p>,
        lastUpdated: "2025-01-08",
    },
    "Maribank": {
        interestFn: maribank_interest,
        url: "https://www.maribank.sg/product/mari-savings-account",
        remarks: `Interest rates are a flat ${mariInterestRate}%`,
        lastUpdated: "2025-01-08",
    },
    "Maribank (After 2025/04)": {
        interestFn: maribank_new_interest,
        url: "https://www.maribank.sg/product/mari-savings-account",
        remarks: `Interest rates are a flat ${mariNewInterestRate}%`,
        lastUpdated: "2025-03-21",
    },
    "OCBC Bank": {
        interestFn: ocbc_interest,
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        remarks: "For more information use the calculator on their website",
        lastUpdated: "2024-12-01",
    },
    "OCBC Bank (After 2025/05)": {
        interestFn: ocbc_new_interest,
        url: "https://www.ocbc.com/personal-banking/notices",
        remarks: "Under the 21 March 2025 notice.",
        lastUpdated: "2025-03-22",
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
        </p>,
        lastUpdated: "2024-12-01",
    },
    "Standard Chartered": {
        interestFn: stand_chart_interest,
        url: "https://www.sc.com/sg/save/current-accounts/bonussaver/",
        remarks: <p>Insurance and Investment only<br />fulfils interest for 6 months</p>,
        lastUpdated: "2025-03-22",
    },
    "Trust Bank": {
        interestFn: placeholder_ir,
        url: "https://trustbank.sg/savings-account/",
        remarks: "To be added",
        lastUpdated: "2024-12-01",
    },
    "Bank of China SmartSaver": {
        interestFn: placeholder_ir,
        url: "https://www.bankofchina.com/sg/pbservice/pb1/202212/t20221230_22348761.html",
        remarks: "To be added",
        lastUpdated: "2024-12-01",
    },
    "Maybank Save Up": {
        interestFn: placeholder_ir,
        url: "https://www.maybank2u.com.sg/en/personal/saveup/save-up-programme.page",
        remarks: "To be added",
        lastUpdated: "2024-12-01",
    },
    "Citi Wealth first Account": {
        interestFn: placeholder_ir,
        url: "https://www.citibank.com.sg/personal-banking/deposits/citi-wealth-first-saving-account",
        remarks: "To be added",
        lastUpdated: "2024-12-01",
    },
    "DBS Multiplier Account": {
        interestFn: placeholder_ir,
        url: "https://www.dbs.com.sg/personal/deposits/bank-earn/multiplier",
        remarks: "To be added",
        lastUpdated: "2024-12-01",
    },
}
