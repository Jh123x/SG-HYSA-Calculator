export interface CutoffInterest {
  Cutoff: number;
  InterestRatePercent: number;
}

export interface Interest {
  cutoffs: CutoffInterest[];
  baseRatePercent: number;
}
