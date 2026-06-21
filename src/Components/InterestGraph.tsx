import { ChartsReferenceLine } from "@mui/x-charts";
import { Paper, Typography } from "@mui/material";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory } from "../logic/history";
import { lineColors, textColor, bgColor } from "../consts/colors";
import type Profile from "../types/profile";
import {
  InterestVsSavingsChart,
  type ChartLine,
} from "./InterestVsSavingsChart";

const AST_RINKS_SX = {
  color: textColor,
  display: "block",
  textAlign: "center",
  marginTop: "10px",
  opacity: 0.8,
};

const BUILT_IN_NOTES = [
  "Graph shows interest rates for savings from $0 to $200,000, covering typical savings account ranges",
];

interface InterestGraphProps {
  profile: Profile;
  /** Fixed pixel height, or "fill" to expand to container */
  height?: number | "fill";
  /**
   * Additional footnote strings to display below the built-in graph note.
   * All notes are consolidated and numbered with ascending asterisks (*, **, ***, …).
   */
  footnotes?: string[];
}

/**
 * Savings-vs-yearly-interest chart in a Paper card.
 *
 * Renders a line chart for all accounts with historical data and appends
 * consolidated footnotes (built-in + caller-supplied) at the bottom.
 */
export const InterestGraph = ({
  profile,
  height = 500,
  footnotes,
}: InterestGraphProps) => {
  const lines: ChartLine[] = Object.entries(bankInfo)
    .filter(([, value]) => value.history.length > 0)
    .map(([slug, value], idx) => {
      const { interestFn } = deriveCurrentFromHistory(value.history);
      return {
        dataKey: slug,
        label: value.name,
        interestFn,
        color: lineColors[idx % lineColors.length],
      };
    });

  const allNotes = [...BUILT_IN_NOTES, ...(footnotes ?? [])];

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: "10px",
        backgroundColor: bgColor,
        height: height === "fill" ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <InterestVsSavingsChart
        lines={lines}
        profile={profile}
        height={height === "fill" ? undefined : height}
        containerSx={
          height === "fill"
            ? { flex: 1, minHeight: 0, overflow: "hidden" }
            : undefined
        }
      >
        <ChartsReferenceLine
          x={profile.Savings}
          label="Your savings"
          lineStyle={{
            stroke: lineColors[0],
            strokeWidth: 1,
            strokeDasharray: "6 3",
          }}
        />
      </InterestVsSavingsChart>

      {allNotes.length > 0 && (
        <Typography variant="caption" sx={AST_RINKS_SX}>
          {allNotes.map((note, i) => (
            <span key={i}>
              {"*".repeat(i + 1)} {note}
              {i < allNotes.length - 1 && <br />}
            </span>
          ))}
        </Typography>
      )}
    </Paper>
  );
};
