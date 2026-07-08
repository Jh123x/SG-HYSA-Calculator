import { ChartsReferenceLine } from "@mui/x-charts";
import { Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory } from "../logic/history";
import { lineColors, textColor, bgColor, mutedColor, borderColor } from "../consts/theme";
import type Profile from "../types/profile";
import {
  InterestVsSavingsChart,
  type ChartLine,
} from "./InterestVsSavingsChart";

const ASTERISKS_SX = {
  color: textColor,
  display: "block",
  textAlign: "left",
  marginTop: "10px",
  opacity: 0.8,
};

const BUILT_IN_NOTES = [
  "Graph shows interest rates for savings from $0 to $200,000, covering typical savings account ranges",
  "Interest rates on their respective websites are subject to change without notice.",
  "Please do your own research before making any decisions.",
  "Ask for referrals to get additional bonuses.",
];

interface InterestGraphProps {
  profile: Profile;
  /** Fixed pixel height, or "fill" to expand to container */
  height?: number | "fill";
}

/**
 * Savings-vs-yearly-interest chart in a Paper card.
 *
 * Renders a line chart for all accounts with historical data and appends
 * consolidated footnotes at the bottom.
 */
export const InterestGraph = ({
  profile,
  height = 500,
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

  return (
    <Paper
      sx={{
        p: 2,

        height: height === "fill" ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
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
      </motion.div>

      <Typography variant="caption" sx={ASTERISKS_SX}>
        {BUILT_IN_NOTES.map((note, i) => (
          <span key={i}>
            {"*".repeat(i + 1)} {note}
            {i < BUILT_IN_NOTES.length - 1 && <br />}
          </span>
        ))}
      </Typography>
    </Paper>
  );
};
