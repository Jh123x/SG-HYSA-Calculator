import type Profile from "../../types/profile";
import { bankInfo } from "../../logic/constants";
import { parseISODate } from "../../logic/dates";

/** A single (date, yearlyInterest, eir) point for one bank. */
export interface BankPoint {
  date: string;
  yearlyInterest: number;
  eir: number;
}

/**
 * Collect all (date, yearlyInterest, eir) tuples for each selected bank,
 * grouped by bank name and sorted chronologically.
 */
export function collectBankPoints(
  selectedBanks: string[],
  profile: Profile,
): Record<string, BankPoint[]> {
  const bankPoints: Record<string, BankPoint[]> = {};

  for (const bankName of selectedBanks) {
    const info = bankInfo[bankName];
    if (!info) continue;

    bankPoints[bankName] = info.history
      .map((snapshot) => {
        const result = snapshot.interestFn(profile);
        return {
          date: snapshot.effectiveDate,
          yearlyInterest: result.toYearly(),
          eir: parseFloat(result.toYearlyPercent().toFixed(2)),
        };
      })
      .sort(
        (a, b) =>
          parseISODate(a.date).getTime() - parseISODate(b.date).getTime(),
      );
  }

  return bankPoints;
}

/**
 * Collect all unique dates across all selected banks and return them
 * sorted chronologically.
 */
export function collectAllDates(bankPoints: Record<string, BankPoint[]>): string[] {
  return [
    ...new Set(
      Object.values(bankPoints).flatMap((pts) => pts.map((p) => p.date)),
    ),
  ].sort(
    (a, b) => parseISODate(a).getTime() - parseISODate(b).getTime(),
  );
}

/**
 * Build the dataset array for the comparison chart.
 *
 * Each row has a Date column and one yearlyInterest / eir column per bank.
 * Forward-fill: for each date, use the latest bank point with date ≤ current date.
 * Back-fill: if no point ≤ date, use the bank's earliest known rate.
 */
export function buildComparisonDataset(
  selectedBanks: string[],
  bankPoints: Record<string, BankPoint[]>,
  allDates: string[],
): Record<string, number | Date | null>[] {
  if (allDates.length === 0) return [];

  return allDates.map((date) => {
    const row: Record<string, number | Date | null> = {
      date: parseISODate(date),
    };

    for (const bankName of selectedBanks) {
      const pts = bankPoints[bankName];
      if (!pts || pts.length === 0) continue;

      // Forward-fill: find latest point with date ≤ current date
      let valueYearly: number | null = null;
      let valueEir: number | null = null;
      for (let i = pts.length - 1; i >= 0; i--) {
        if (pts[i].date <= date) {
          valueYearly = pts[i].yearlyInterest;
          valueEir = pts[i].eir;
          break;
        }
      }

      // Back-fill: use earliest known rate
      if (valueYearly === null) {
        valueYearly = pts[0].yearlyInterest;
        valueEir = pts[0].eir;
      }

      row[`${bankName}_yearlyInterest`] = valueYearly;
      row[`${bankName}_eir`] = valueEir;
    }

    return row;
  });
}
