import type { ReactElement } from "react";
import type { ResultInterest } from "./interest_result";

export interface ResultProp {
  interest: ResultInterest;
  url: string;
  remarks: string | ReactElement;
  lastUpdated: string;
}
