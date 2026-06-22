import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { primaryColor, textColor } from "../consts/colors";
import { useMobile } from "../hooks/useMobile";
import type { FaqEntry } from "../data/faq";

const ACTIVE_DOT = "●";
const INACTIVE_DOT = "○";

const chipSx = {
  color: textColor,
  borderColor: `${textColor}30`,
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.8rem",
  whiteSpace: "nowrap",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: `${primaryColor}25`,
    borderColor: primaryColor,
    color: "#fff",
  },
};

const activeChipSx = {
  ...chipSx,
  backgroundColor: `${primaryColor}30`,
  borderColor: primaryColor,
  color: "#fff",
  fontWeight: 600,
};

const tocLinkSx = (isActive: boolean) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 1,
  py: 0.6,
  px: 1.5,
  borderRadius: 1,
  cursor: "pointer",
  color: isActive ? "#fff" : `${textColor}B3`,
  backgroundColor: isActive ? `${primaryColor}20` : "transparent",
  fontWeight: isActive ? 600 : 400,
  fontSize: "0.85rem",
  lineHeight: 1.4,
  transition: "all 0.15s ease",
  textDecoration: "none",
  borderLeft: isActive ? `3px solid ${primaryColor}` : "3px solid transparent",
  "&:hover": {
    backgroundColor: `${primaryColor}15`,
    color: "#fff",
  },
});

/** Slugify a question for use as an anchor ID */
export function questionId(question: string): string {
  return `faq-${question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

interface FaqTocProps {
  entries: FaqEntry[];
}

/**
 * Table of Contents strip for FAQ questions.
 *
 * Desktop: sticky sidebar with per-question links and active-section tracking.
 * Mobile:  horizontal scrollable chip bar above the content.
 *
 * Uses IntersectionObserver to highlight the currently visible question.
 */
export const FaqToc = ({ entries }: FaqTocProps) => {
  const { isMobile } = useMobile();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const tocRef = useRef<HTMLDivElement>(null);

  // ── Active section tracking ────────────────────────────────────
  useEffect(() => {
    const ids = entries.map((e) => questionId(e.question));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entriesObs) => {
        // Find the first entry that's intersecting (closest to top)
        const visible = entriesObs
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const idx = elements.indexOf(visible[0].target as HTMLElement);
          if (idx >= 0) setActiveIndex(idx);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entries]);

  // ── Scroll handler ─────────────────────────────────────────────
  const scrollTo = useCallback((index: number) => {
    const id = questionId(entries[index].question);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [entries]);

  // ── Mobile: horizontal chip bar ────────────────────────────────
  if (isMobile) {
    return (
      <Box
        ref={tocRef}
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          pb: 1.5,
          mb: 1,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          mx: -1,
          px: 1,
        }}
        role="tablist"
        aria-label="FAQ topics"
      >
        {entries.map((entry, i) => (
          <Chip
            key={entry.question}
            label={`${i + 1}. ${entry.question.length > 40 ? `${entry.question.slice(0, 38)}…` : entry.question}`}
            onClick={() => scrollTo(i)}
            variant="outlined"
            size="small"
            sx={i === activeIndex ? activeChipSx : chipSx}
            role="tab"
            aria-selected={i === activeIndex}
          />
        ))}
      </Box>
    );
  }

  // ── Desktop: sticky sidebar ────────────────────────────────────
  return (
    <Box
      component="nav"
      aria-label="FAQ table of contents"
      sx={{
        position: "sticky",
        top: 24,
        alignSelf: "flex-start",
        width: 260,
        flexShrink: 0,
        maxHeight: "calc(100vh - 140px)",
        overflowY: "auto",
        px: 0.5,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: `${textColor}80`,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontWeight: 600,
          display: "block",
          mb: 1,
          px: 1.5,
        }}
      >
        On this page
      </Typography>

      {entries.map((entry, i) => (
        <Box
          key={entry.question}
          onClick={() => scrollTo(i)}
          sx={tocLinkSx(i === activeIndex)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              scrollTo(i);
            }
          }}
          aria-current={i === activeIndex ? "true" : undefined}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.7rem",
              mt: 0.25,
              flexShrink: 0,
              color: i === activeIndex ? primaryColor : `${textColor}60`,
              fontFamily: "monospace",
            }}
          >
            {i === activeIndex ? ACTIVE_DOT : INACTIVE_DOT}
          </Typography>
          <span>{entry.question}</span>
        </Box>
      ))}
    </Box>
  );
};
