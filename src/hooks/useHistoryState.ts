import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type Profile from "../types/profile";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory, resolveHistoryForChart } from "../logic/history";
import { isValidSlug, ALL_SLUGS } from "../logic/slugs";
import { formatDate } from "../logic/dates";
import { MAX_COMPARISON_BANKS } from "../consts/keys";
import type { BankHistoryGroup } from "./useHistoryState.types";

export type { BankHistoryGroup };

// ── Constants ──────────────────────────────────────────────────────

const BANKS_PARAM = "banks";
const BANKS_SESSION_KEY = "history_selected_banks";

// ── Helpers ────────────────────────────────────────────────────────

function parseBanks(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && isValidSlug(s));
}

function readSessionBanks(): string[] {
  try {
    const stored = sessionStorage.getItem(BANKS_SESSION_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s): s is string => typeof s === "string" && isValidSlug(s),
    );
  } catch {
    return [];
  }
}

// ── Derived data hook ──────────────────────────────────────────────

function useHistoryData(profile: Profile, selectedBanks: string[]) {
  const bankEirs = useMemo(() => {
    const eirs: Record<string, string> = {};
    for (const [slug, info] of Object.entries(bankInfo)) {
      const { interestFn } = deriveCurrentFromHistory(info.history);
      eirs[slug] = interestFn(profile).toYearlyPercent().toFixed(2);
    }
    return eirs;
  }, [profile]);

  const sortedOptions = useMemo(
    () =>
      [...ALL_SLUGS].sort(
        (a, b) => parseFloat(bankEirs[b] ?? "0") - parseFloat(bankEirs[a] ?? "0"),
      ),
    [bankEirs],
  );

  const displayNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [slug, info] of Object.entries(bankInfo)) map[slug] = info.name;
    return map;
  }, []);

  const isMaxed = selectedBanks.length >= MAX_COMPARISON_BANKS;

  const bankHistories: BankHistoryGroup[] = useMemo(() => {
    const result: BankHistoryGroup[] = [];
    for (const slug of selectedBanks) {
      const info = bankInfo[slug];
      if (!info) continue;
      const resolved = resolveHistoryForChart(info.history, profile);
      result.push({
        slug,
        name: info.name,
        rows: [...resolved].reverse().map((snapshot) => {
          const isTbd = snapshot.date.getTime() === 0;
          return {
            date: isTbd ? "TBD" : formatDate(snapshot.date),
            changeSummary: snapshot.changeSummary,
            yearlyInterest: isTbd
              ? "—"
              : `$${snapshot.yearlyInterest.toFixed(2)}`,
            eir: isTbd ? "—" : `${snapshot.eir.toFixed(2)}%`,
            sourceUrl: snapshot.sourceUrl,
          };
        }),
      });
    }
    return result;
  }, [selectedBanks, profile]);

  return { bankEirs, sortedOptions, displayNames, isMaxed, bankHistories };
}

// ── Public hook ────────────────────────────────────────────────────

/**
 * Shared state for the History tab — bank selection, collapse, URL sync.
 *
 * Eliminates ~40 lines of duplication between Desktop and Mobile variants.
 */
export function useHistoryState(profile: Profile) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBanks, setSelectedBanks] =
    useState<string[]>(readSessionBanks);
  const [collapsedBanks, setCollapsedBanks] = useState<Set<string>>(new Set());

  // One-shot URL param → state sync
  const urlBanks = useMemo(
    () =>
      searchParams.get(BANKS_PARAM)
        ? parseBanks(searchParams.get(BANKS_PARAM)!)
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (urlBanks && urlBanks.length > 0) {
      setSelectedBanks(urlBanks);
      sessionStorage.setItem(BANKS_SESSION_KEY, JSON.stringify(urlBanks));
      const next = new URLSearchParams(searchParams);
      next.delete(BANKS_PARAM);
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBankChange = useCallback(
    (banks: string[]) => {
      setSelectedBanks(banks);
      sessionStorage.setItem(BANKS_SESSION_KEY, JSON.stringify(banks));
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (banks.length > 0) next.set(BANKS_PARAM, banks.join(","));
          else next.delete(BANKS_PARAM);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const toggleCollapse = useCallback((slug: string) => {
    setCollapsedBanks((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }, []);

  const { bankEirs, sortedOptions, displayNames, isMaxed, bankHistories } =
    useHistoryData(profile, selectedBanks);

  return {
    navigate,
    selectedBanks,
    collapsedBanks,
    handleBankChange,
    toggleCollapse,
    bankEirs,
    sortedOptions,
    displayNames,
    isMaxed,
    bankHistories,
  } as const;
}
