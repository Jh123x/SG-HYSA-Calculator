import { RateSnapshot } from "./history";


export interface BankData {
  /** Human-readable display name (e.g. "UOB One Account") */
  name: string;
  /** Official product page URL */
  url: string;
  /** Plain-text remarks (no JSX — see module docstring for conventions) */
  remarks: string;
  /** Chronologically sorted rate snapshots (oldest first) */
  history: RateSnapshot[];
  /** Profile factors that affect this bank's interest rate (auto-derived) */
  factors?: string[];
}
