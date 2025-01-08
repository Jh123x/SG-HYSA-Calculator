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
}

export const STORE_KEY = "current_profile"
export const bankInfo: Record<string, Info> = {
    "UOB Bank": {
        interestFn: uob_interest,
        url: "https://www.uob.com.sg/personal/save/everyday-accounts/one-account.page",
        remarks: "The calculation here excludes spending rebates included in their calculator",
    },
    "Maribank": {
        interestFn: maribank_interest,
        url: "https://www.maribank.sg/product/mari-savings-account",
        remarks: `Interest rates are a flat ${mariInterestRate}%`,
    },
    "OCBC Bank": {
        interestFn: ocbc_interest,
        url: "https://www.ocbc.com/personal-banking/deposits/360-savings-account",
        remarks: "For more information use the calculator on their website"
    },
    "Chocolate Finance": {
        interestFn: choco_finance,
        url: "https://www.chocolatefinance.com/",
        remarks: "Amounts above 50k are investments and not included in this calculator"
    },
    "Standard Chartered Bank": {
        interestFn: stand_chart_interest,
        url: "https://www.sc.com/sg/save/current-accounts/bonussaver/?intcid=web_listing-sc_com_top_nav-homepg1-staticmedia_others-sng-homepage_new-bsaver-acquisition-sc_com_organic-sg-en",
        remarks: "For more information use the calculator on their website",
    },
    "DBS Bank Multiplier Account": {
        interestFn: default_ir,
        url: "https://www.dbs.com.sg/personal/deposits/bank-earn/multiplier",
        remarks: "To be added"
    },
    "Trust Bank": {
        interestFn: default_ir,
        url: "https://trustbank.sg/savings-account/",
        remarks: "To be added"
    },
    "Bank of China SmartSaver": {
        interestFn: default_ir,
        url: "https://www.bankofchina.com/sg/pbservice/pb1/202212/t20221230_22348761.html",
        remarks: "To be added"
    },
    "Maybank Save Up": {
        interestFn: default_ir,
        url: "https://www.maybank2u.com.sg/en/personal/saveup/save-up-programme.page",
        remarks: "To be added"
    },
    "Citibank Wealth First Account": {
        interestFn: default_ir,
        url: "https://www.citibank.com.sg/personal-banking/deposits/citi-wealth-first-saving-account",
        remarks: "To be added"

    }
}
