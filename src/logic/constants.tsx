import * as React from "react"
import { ResultInterest } from "../types/interest_result.ts"
import Profile from "../types/profile.ts"
import { maribank_new_interest, mariNewInterestRate } from "./maribank.ts"
import { uob_interest } from "./uob.ts"
import { ocbc_interest, ocbc_new_interest } from "./ocbc360.ts"
import { choco_finance } from "./choco_finance.ts"
import { stand_chart_interest } from "./stand_chart.ts"
import { placeholder_ir } from "./common.ts"
import { ReactElement } from "react"
import { trust_bank } from "./trust_bank.ts"
import { dbs_multiplier_interest } from "./dbs_multiplier.ts"
import { gxs_interest } from "./gxs.ts"
import { Link } from "@mui/material"
import { primaryColor } from "../consts/colors.ts"
import { bank_of_china_smart_saver, bank_of_china_super_saver } from "./bank_of_china.ts"

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
        remarks: <p>
            The calculation here excludes
            <br />
            spending rebates included in their calculator.
            <br />
            (Extra 200 a year if you spend 500/mth for a year)
        </p>,
        lastUpdated: "2025-01-08",
    },
    "OCBC Bank (Pre 2025/05)": {
        interestFn: ocbc_interest,
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        remarks: "For more information use the calculator on their website",
        lastUpdated: "2024-12-01",
    },
    "OCBC Bank (Post 2025/05)": {
        interestFn: ocbc_new_interest,
        url: "https://www.ocbc.com/personal-banking/notices",
        remarks: <p>More info Under the 21 March 2025 notice on their website</p>,
        lastUpdated: "2025-03-22",
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
        lastUpdated: "2025-03-21",
    },
    "Standard Chartered": {
        interestFn: stand_chart_interest,
        url: "https://www.sc.com/sg/save/current-accounts/bonussaver/",
        remarks: <p>Insurance and Investment only<br />fulfils interest for 6 months</p>,
        lastUpdated: "2025-03-22",
    },
    "Trust Bank": {
        interestFn: trust_bank,
        url: "https://trustbank.sg/savings-account/",
        remarks: <p>Spending assumes 5 x $30 if spending is more than 150.</p>,
        lastUpdated: "2025-03-23",
    },
    "DBS Multiplier Account": {
        interestFn: dbs_multiplier_interest,
        url: "https://www.dbs.com.sg/personal/deposits/bank-earn/multiplier",
        remarks: <p>No eligible if you are younger than 18.<br />Spending includes credit card / paylah retail spend</p>,
        lastUpdated: "2025-03-26",
    },
    "GXS": {
        interestFn: gxs_interest,
        url: "https://www.gxs.com.sg/savings-account",
        remarks: <p>
            Assume using boost pocket (3 months) as much as possible.
            <br />
            Remaining balance in main account
            <br />
            The max amount limit is $95000.
            <br />
            <b>Note: The max amount depends on each individual</b>
        </p>,
        lastUpdated: "2025-03-29",
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
    "Bank of China SmartSaver": {
        interestFn: bank_of_china_smart_saver,
        url: "https://www.bankofchina.com/sg/pbservice/pb1/202212/t20221230_22348761.html",
        remarks: <p>
            This account is valid from 2024-11-01 onwards.
            <br />
            Giro Transactions are assumed to be $30 worth each.
            <br />
            <Link
                href="https://www.bankofchina.com/sg/bocinfo/bi3/bi33/202404/t20240401_24845706.html"
                target="_blank"
                sx={{
                    color: primaryColor,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                }}
            >
                Bank of China Prevailing interest rates.
            </Link>
            <br />
            For more information read the information on their website.
        </p>,
        lastUpdated: "2024-12-01",
    },
    "Bank of China SuperSaver": {
        interestFn: bank_of_china_super_saver,
        url: "https://www.bankofchina.com/sg/pbservice/pb1/202212/t20221230_22348756.html",
        remarks: <p>
            This account is valid from 2024-08-01 onwards.
            <br />
            You have to link your paynow to this account to qualify for the sale.
        </p>,
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
}
