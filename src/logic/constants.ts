import { ResultInterest } from "../types/interest_result"
import Profile from "../types/profile"
import { maribank_interest } from "./maribank.ts"
import { uob_interest } from "./uob.ts"
import { ocbc_interest } from "./ocbc360.ts"
import { choco_finance } from "./choco_finance.ts"
import { stand_chart_interest } from "./stand_chart.ts"

export const STORE_KEY = "current_profile"
export const calc_fn: Record<string, (profile: Profile) => ResultInterest> = {
    "UOB Bank": uob_interest,
    "Maribank": maribank_interest,
    "OCBC Bank": ocbc_interest,
    "Chocolate Finance": choco_finance,
    "Standard Chartered Bank": stand_chart_interest,

    // TODO
    //dbs_finance,
    //trust_bank,
}