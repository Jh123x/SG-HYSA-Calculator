/** Row in a bank's rate change history table. */
export interface BankHistoryRow {
  date: string;
  changeSummary: string;
  yearlyInterest: string;
  eir: string;
  sourceUrl?: string;
}

/** A bank with its resolved rate history rows. */
export interface BankHistoryGroup {
  slug: string;
  name: string;
  rows: BankHistoryRow[];
}
