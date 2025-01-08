import { ResultInterest } from "./interest_result"

export interface ResultProp {
    interest: ResultInterest,
    url: string
    remarks?: string
    lastUpdated: Date
}