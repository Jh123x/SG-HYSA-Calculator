import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Paper, useTheme, useMediaQuery } from '@mui/material';
import { bankInfo } from "../logic/constants.tsx"
import { textColor } from '../consts/colors.ts';
import Profile from '../types/profile.ts';

interface GraphData {
    [key: string]: number;
}

export const InterestGraph = ({ profile }: { profile: Profile }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery('(max-width:640px)');

    if (isSmallScreen) {
        return null;
    }

    // Generate savings data points
    const data: GraphData[] = Array.from({ length: 21 }, (_, i) => {
        const savings = i * 10000;
        const tmpProfile = {
            ...profile,
            Savings: savings
        }
        const dataPoint: GraphData = { savings };

        Object.entries(bankInfo).forEach(([key, value]) => {
            dataPoint[key] = value.interestFn(tmpProfile).toYearly();
        });

        return dataPoint;
    });

    const series = Object.keys(bankInfo)
        .filter(bankName => data.some(point => point[bankName] > 0))
        .map((bankName) => ({
            dataKey: bankName,
            label: bankName,
        }));

    return (
        <Paper sx={{
            padding: "30px",
            borderRadius: "10px",
            boxShadow: theme.shadows[3],
            backgroundColor: theme.palette.background.paper
        }}>
            <LineChart
                dataset={data}
                xAxis={[{
                    dataKey: 'savings',
                    label: 'Savings ($)',
                    scaleType: 'linear',
                    valueFormatter: (v) => `$${v / 1000}k`,
                }]}
                series={series}
                yAxis={[{
                    label: 'Yearly Interest ($)',
                    scaleType: 'linear',
                    valueFormatter: (v) => `$${v / 1000}k`,
                    position: 'left',
                    labelStyle: {
                        translate: "-20px"
                    },
                }]}
                height={500}
                margin={{ left: 70, right: 10, top: 30, bottom: 150 }}
                grid={{ vertical: true, horizontal: true }}
                slotProps={{
                    legend: {
                        direction: 'row',
                        position: { vertical: 'bottom', horizontal: 'middle' },
                        padding: 10,
                    },
                }}
                sx={{
                    '.MuiChartsAxis-label': {
                        fill: textColor,
                    },
                    '.MuiChartsAxis-tick': {
                        fill: textColor,
                    },
                    '.MuiChartsLegend-label': {
                        fill: textColor,
                    },
                }}
            />
        </Paper>
    );
};