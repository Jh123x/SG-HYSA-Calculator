import { ResultInterest } from "../types/interest_result"
import Profile from "../types/profile"
import { maribank_interest } from "./maribank.ts"
import { uob_interest } from "./uob.ts"

export const STORE_KEY = "current_profile"
export const calc_fn: Array<(profile: Profile) => ResultInterest> = [
    uob_interest,
    maribank_interest,
]