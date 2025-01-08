import { ResultInterest } from "../types/interest_result"
import Profile from "../types/profile"
import { maribank_interest, mariInterestRate } from "./maribank.ts"
import { uob_interest } from "./uob.ts"
import { ocbc_interest } from "./ocbc360.ts"
import { choco_finance } from "./choco_finance.ts"
import { stand_chart_interest } from "./stand_chart.ts"
import { default_ir } from "./common.ts"

interface Info {
    interestFn: (profile: Profile) => ResultInterest
    url: string
    remarks?: string
    lastUpdated: Date
}

export const STORE_KEY = "current_profile"
export const bankInfo: Record<string, Info> = {
    "UOB Bank": {
        interestFn: uob_interest,
        url: "https://www.uob.com.sg/personal/save/everyday-accounts/one-account.page",
        remarks: "The calculation here excludes spending rebates included in their calculator. (You get extra 200 a year if you spend 500/mth for a year)",
        lastUpdated: new Date("2024-12-01"),
    },
    "Maribank": {
        interestFn: maribank_interest,
        url: "https://www.maribank.sg/product/mari-savings-account",
        remarks: `Interest rates are a flat ${mariInterestRate}%`,
        lastUpdated: new Date("2025-01-08"),
    },
    "OCBC Bank": {
        interestFn: ocbc_interest,
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        remarks: "For more information use the calculator on their website",
        lastUpdated: new Date("2024-12-01"),
    },
    "Chocolate Finance": {
        interestFn: choco_finance,
        url: "https://www.chocolatefinance.com/",
        remarks: "Amounts above 50k are investments and not included in this calculator",
        lastUpdated: new Date("2024-12-01"),
    },
    "Trust Bank": {
        interestFn: default_ir,
        url: "https://trustbank.sg/savings-account/",
        remarks: "To be added",
        lastUpdated: new Date("2024-12-01"),
    },
    "Bank of China SmartSaver": {
        interestFn: default_ir,
        url: "https://www.bankofchina.com/sg/pbservice/pb1/202212/t20221230_22348761.html",
        remarks: "To be added",
        lastUpdated: new Date("2024-12-01"),
    },
    "Maybank Save Up": {
        interestFn: default_ir,
        url: "https://www.maybank2u.com.sg/en/personal/saveup/save-up-programme.page",
        remarks: "To be added",
        lastUpdated: new Date("2024-12-01"),
    },
    // "Citibank Wealth first Account": {
    //     interestFn: default_ir,
    //     url: "https://www.citibank.com.sg/personal-banking/deposits/citi-wealth-first-saving-account",
    //     remarks: "To be added",
    //     lastUpdated: new Date("2024-12-01"),
    // },
    // "Standard Chartered": {
    //     interestFn: stand_chart_interest,
    //     url: "https://www.sc.com/sg/save/current-accounts/bonussaver/?intcid=web_listing-sc_com_top_nav-homepg1-staticmedia_others-sng-homepage_new-bsaver-acquisition-sc_com_organic-sg-en",
    //     remarks: "To be added",
    //     lastUpdated: new Date("2024-12-01"),
    // },
    // "DBS Multiplier Account": {
    //     interestFn: default_ir,
    //     url: "https://www.dbs.com.sg/personal/deposits/bank-earn/multiplier",
    //     remarks: "To be added",
    //     lastUpdated: new Date("2024-12-01"),
    // },
}
