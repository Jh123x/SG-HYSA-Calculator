import { ResultInterest } from "./interest_result";
import Profile from "./profile";

export interface CutoffInterest {
  Cutoff: number;
  InterestRatePercent: number;
}

export interface Interest {
  cutoffs: CutoffInterest[];
  baseRatePercent: number;
}

export type InterestFn = (_: Profile) => ResultInterest

