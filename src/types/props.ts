import { ReactElement } from "react"
import { ResultInterest } from "./interest_result"

export interface ResultProp {
    interest: ResultInterest
    url: string
    remarks: string | ReactElement
    lastUpdated: string
}
