import type Profile from "../types/profile";
import { NewProfile } from "../types/profile";

/** All Profile field names, derived from the type at runtime. */
const PROFILE_FIELDS = Object.keys(NewProfile({})) as (keyof Profile)[];

const defaults = NewProfile({});

/**
 * Serialize a Profile to a query string, omitting fields at their default values.
 * Returns only the `?key=value` portion (or empty string if nothing to serialize).
 *
 * Uses the Profile field name directly as the URL parameter key (e.g. ?Savings=50000).
 */
export const profileToSearch = (profile: Profile): string => {
  const params = new URLSearchParams();

  for (const field of PROFILE_FIELDS) {
    const value = profile[field];
    if (value === defaults[field]) continue;

    if (typeof value === "boolean") {
      params.set(field, value ? "1" : "0");
    } else {
      params.set(field, String(value));
    }
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

/**
 * Parse a raw query string (with or without leading `?`) into a Profile,
 * merging with defaults for any missing fields.
 *
 * Only URL params whose key matches a Profile field name are processed —
 * unrecognized params are silently ignored.
 */
export const searchToProfile = (rawSearch: string): Profile => {
  const params = new URLSearchParams(
    rawSearch.startsWith("?") ? rawSearch.slice(1) : rawSearch,
  );

  const profile = NewProfile({});

  for (const field of PROFILE_FIELDS) {
    const raw = params.get(field);
    if (raw === null) continue;

    const num = Number(raw);
    if (isNaN(num) || num < 0) continue;

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
