import { ChartsReferenceLine } from "@mui/x-charts";
import { Paper, useTheme, useMediaQuery, Box, Typography } from "@mui/material";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory } from "../logic/history";
import { lineColors, textColor } from "../consts/colors";
import type Profile from "../types/profile";
import {
  InterestVsSavingsChart,
  type ChartLine,
} from "./InterestVsSavingsChart";

export const InterestGraph = ({ profile }: { profile: Profile }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width:640px)");

  if (isSmallScreen) {
    return (
      <Paper
        sx={{
          padding: "20px",
          borderRadius: "10px",
          boxShadow: theme.shadows[3],
          backgroundColor: theme.palette.background.paper,
          textAlign: "center",
        }}
      >
        <Box sx={{ py: 4 }}>
          <Typography variant="body1" color={textColor}>
            Please view on a larger screen to see the interest comparison graph.
          </Typography>
        </Box>
      </Paper>
    );
  }

  const lines: ChartLine[] = Object.entries(bankInfo)
    .filter(([, value]) => value.history.length > 0)
    .map(([name, value], idx) => {
      const { interestFn } = deriveCurrentFromHistory(value.history);
      return {
        dataKey: name,
        label: name,
        interestFn,
        color: lineColors[idx % lineColors.length],
      };
    });

  return (
    <Paper
      sx={{
        padding: "30px",
        borderRadius: "10px",
        boxShadow: theme.shadows[3],
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <InterestVsSavingsChart lines={lines} profile={profile} height={500}>
        <ChartsReferenceLine
          x={profile.Savings}
          label="Your savings"
          lineStyle={{
            stroke: lineColors[0],
            strokeWidth: 2,
            strokeDasharray: "6 3",
          }}
        />
      </InterestVsSavingsChart>
      <Typography
        variant="caption"
        sx={{
          color: textColor,
          display: "block",
          textAlign: "center",
          marginTop: "10px",
          opacity: 0.8,
        }}
      >
        * Graph shows interest rates for savings from $0 to $200,000, covering
        typical savings account ranges
      </Typography>
    </Paper>
  );
};
