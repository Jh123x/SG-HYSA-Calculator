import type Profile from "../types/profile";
import { NewProfile } from "../types/profile";

/**
 * Map of Profile field names to compact URL parameter keys.
 * Order: most commonly shared fields first for nicer URLs.
 */
const FIELD_TO_PARAM: Record<keyof Profile, string> = {
  Savings: "s",
  Salary: "sal",
  Spending: "sp",
  Age: "a",
  Investment: "inv",
  Insurance: "ins",
  GiroTransactions: "giro",
  MonthlyAccIncrease: "inc",
  LoanInstallment: "loan",
  OneTimeLoan: "otl",
  IsNTUCMember: "ntuc",
};

/** Reverse map: param key → Profile field name */
const PARAM_TO_FIELD: Record<string, keyof Profile> = Object.fromEntries(
  Object.entries(FIELD_TO_PARAM).map(([field, param]) => [param, field as keyof Profile]),
);

const defaultProfile = NewProfile({});

/** Whether a field value is at its default (and can be omitted from the URL). */
const isDefault = (field: keyof Profile, value: number | boolean): boolean => {
  return value === defaultProfile[field];
};

/**
 * Serialize a Profile to a query string, omitting fields at their default values.
 * Returns only the `?key=value` portion (or empty string if nothing to serialize).
 */
export const profileToSearch = (profile: Profile): string => {
  const params = new URLSearchParams();

  for (const field of Object.keys(FIELD_TO_PARAM) as (keyof Profile)[]) {
    const value = profile[field];
    if (isDefault(field, value)) continue;

    if (typeof value === "boolean") {
      if (value) params.set(FIELD_TO_PARAM[field], "1");
    } else {
      params.set(FIELD_TO_PARAM[field], String(value));
    }
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

/**
 * Parse a raw query string (with or without leading `?`) into a Profile,
 * merging with defaults for any missing fields.
 */
export const searchToProfile = (rawSearch: string): Profile => {
  const params = new URLSearchParams(
    rawSearch.startsWith("?") ? rawSearch.slice(1) : rawSearch,
  );

  const profile = NewProfile({});

  for (const paramKey of Object.keys(PARAM_TO_FIELD)) {
    const raw = params.get(paramKey);
    if (raw === null) continue;

    const field = PARAM_TO_FIELD[paramKey];
    const num = Number(raw);
    if (isNaN(num) || num < 0) continue; // ignore non-numeric / negative values

    if (typeof profile[field] === "boolean") {
      (profile as unknown as Record<string, unknown>)[field] = num !== 0;
    } else {
      (profile as unknown as Record<string, unknown>)[field] = num;
    }
  }

  return profile;
};

/**
 * Serialize a Profile to a full shareable URL (absolute).
 */
export const profileToUrl = (profile: Profile): string => {
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const search = profileToSearch(profile);
  return `${origin}${pathname}${search}`;
};
