import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Paper, useTheme, useMediaQuery, Box, Typography } from "@mui/material";
import { bankInfo } from "../logic/constants";
import { textColor } from "../consts/colors";
import type Profile from "../types/profile";

interface GraphData {
  [key: string]: number;
}

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

  const data: GraphData[] = Array.from({ length: 21 }, (_, i) => {
    const savings = i * 10_000;
    const tmpProfile = {
      ...profile,
      Savings: savings,
    };
    const dataPoint: GraphData = { savings };

    Object.entries(bankInfo).forEach(([key, value]) => {
      dataPoint[key] = value.interestFn(tmpProfile).toYearly();
    });

    return dataPoint;
  });

  // Add user's actual data point
  const userPoint: GraphData = { savings: profile.Savings };
  Object.entries(bankInfo).forEach(([key, value]) => {
    userPoint[key] = value.interestFn(profile).toYearly();
  });

  const insertIndex = data.findIndex(
    (point) => point.savings > profile.Savings,
  );
  if (insertIndex >= 0) {
    data.splice(insertIndex, 0, userPoint);
  } else {
    data.push(userPoint);
  }

  const series = Object.keys(bankInfo)
    .filter((bankName) => data.some((point) => point[bankName] > 0))
    .map((bankName) => ({
      dataKey: bankName,
      label: bankName,
    }));

  return (
    <Paper
      sx={{
        padding: "30px",
        borderRadius: "10px",
        boxShadow: theme.shadows[3],
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <LineChart
        dataset={data}
        xAxis={[
          {
            dataKey: "savings",
            label: "Savings ($)",
            scaleType: "linear",
            valueFormatter: (v) => `$${v / 1000}k`,
          },
        ]}
        series={series}
        yAxis={[
          {
            label: "Yearly Interest ($)",
            scaleType: "linear",
            valueFormatter: (v) => `$${v / 1000}k`,
            position: "left",
            labelStyle: {
              translate: "-20px",
            },
          },
        ]}
        height={500}
        margin={{ left: 70, right: 10, top: 30, bottom: 150 }}
        grid={{ vertical: true, horizontal: true }}
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "bottom", horizontal: "middle" },
            padding: 10,
          },
        }}
        sx={{
          ".MuiChartsAxis-label": {
            fill: textColor,
          },
          ".MuiChartsAxis-tick": {
            fill: textColor,
          },
          ".MuiChartsLegend-label": {
            fill: textColor,
          },
        }}
      />
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
