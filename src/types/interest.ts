export interface CutoffInterest {
    Cutoff: number
    InterestRatePercent: number
}

export interface Interest {
    cutoffs: Array<CutoffInterest>
    baseRatePercent: number
}
