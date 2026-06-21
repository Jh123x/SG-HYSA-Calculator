import { ChartsReferenceLine } from "@mui/x-charts";
import { Paper, Typography } from "@mui/material";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory } from "../logic/history";
import { lineColors, textColor } from "../consts/colors";
import type Profile from "../types/profile";
import {
  InterestVsSavingsChart,
  type ChartLine,
} from "./InterestVsSavingsChart";

const HEIGHT_SX = {
  ".MuiLineElement-root": { display: "none" },
};

const AST_RINKS_SX = {
  color: textColor,
  display: "block",
  textAlign: "center",
  marginTop: "10px",
  opacity: 0.8,
};

export const InterestGraph = ({
  profile,
  height = 500,
}: {
  profile: Profile;
  /** Fixed pixel height, or "fill" to expand to container */
  height?: number | "fill";
}) => {
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
        padding: { xs: "12px", sm: "20px" },
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "background.paper",
        height: height === "fill" ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <InterestVsSavingsChart
        lines={lines}
        profile={profile}
        height={height === "fill" ? undefined : height}
        containerSx={height === "fill" ? { flex: 1, minHeight: 0 } : undefined}
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
      <Typography variant="caption" sx={AST_RINKS_SX}>
        * Graph shows interest rates for savings from $0 to $200,000, covering
        typical savings account ranges
      </Typography>
    </Paper>
  );
};
