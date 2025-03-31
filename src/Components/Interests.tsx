import React, { ReactElement, useState } from "react"
import { Container, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TableSortLabel } from "@mui/material"
import { ResultProp } from "../types/props"
import { primaryColor, bgColor, textColor } from "../consts/colors.ts"
import Profile from "../types/profile.ts"
import { bankInfo } from "../logic/constants.tsx"
import { InterestGraph } from "./InterestGraph.tsx"

type SortableColumns = 'name' | 'yearlyInterest' | 'effectiveInterest' | undefined;

export const Result = ({ profile }: { profile: Profile }) => {
    const [orderBy, setOrderBy] = useState<SortableColumns>(undefined);
    const [order, setOrder] = useState<'asc' | 'desc' | undefined>('desc');

    const results: Record<string, ResultProp> = {}
    for (const [name, info] of Object.entries(bankInfo)) {
        results[name] = {
            interest: info.interestFn(profile),
            url: info.url,
            remarks: info.remarks,
            lastUpdated: info.lastUpdated,
        }
    }

    const handleSort = (column: SortableColumns) => {
        if (orderBy === column) {
            // Cycle through 'asc', 'desc', and ''
            const nextOrder = order === 'asc' ? 'desc' : order === 'desc' ? undefined : 'asc';
            setOrder(nextOrder);
            if (nextOrder === undefined) {
                setOrderBy(undefined); // Disable sorting
            }
            return
        }

        setOrderBy(column);
        setOrder('asc'); // Default to 'asc' when switching columns
    };

    const sortedResults = Object.entries(results).sort((a, b) => {
        switch (orderBy) {
            case 'name':
                return order === 'asc'
                    ? a[0].localeCompare(b[0])
                    : b[0].localeCompare(a[0]);
            case 'yearlyInterest':
                return order === 'asc'
                    ? a[1].interest.toYearly() - b[1].interest.toYearly()
                    : b[1].interest.toYearly() - a[1].interest.toYearly();
            case 'effectiveInterest':
                return order === 'asc'
                    ? a[1].interest.toYearlyPercent() - b[1].interest.toYearlyPercent()
                    : b[1].interest.toYearlyPercent() - a[1].interest.toYearlyPercent();
            default:
                return 0;
        }
    });

    return (
        <Container sx={{
            color: primaryColor,
            width: "100%",
            maxWidth: "100%",
            padding: "20px",
        }}>
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: "10px",
                    overflow: "auto",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}>
                <Table>
                    <TableHead>
                        <ThemedTableRow>
                            <ThemedHeader key="account_name">
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleSort('name')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: `${textColor} !important`,
                                        },
                                    }}
                                >
                                    Account Name
                                </TableSortLabel>
                            </ThemedHeader>
                            <ThemedHeader key="yearly_interest">
                                <TableSortLabel
                                    active={orderBy === 'yearlyInterest'}
                                    direction={orderBy === 'yearlyInterest' ? order : 'asc'}
                                    onClick={() => handleSort('yearlyInterest')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: `${textColor} !important`,
                                        },
                                    }}
                                >
                                    Yearly Interest
                                </TableSortLabel>
                            </ThemedHeader>
                            <ThemedHeader key="effective_interest">
                                <TableSortLabel
                                    active={orderBy === 'effectiveInterest'}
                                    direction={orderBy === 'effectiveInterest' ? order : 'asc'}
                                    onClick={() => handleSort('effectiveInterest')}
                                    sx={{
                                        '& .MuiTableSortLabel-icon': {
                                            color: `${textColor} !important`,
                                        },
                                    }}
                                >
                                    Effective Interest<br />Rate (EIR)
                                </TableSortLabel>
                            </ThemedHeader>
                            <ThemedHeader key="webpage">Webpage</ThemedHeader>
                            <ThemedHeader key="remark">Remarks</ThemedHeader>
                            <ThemedHeader key="updated_at">Updated at</ThemedHeader>
                        </ThemedTableRow>
                    </TableHead>
                    <TableBody>
                        {sortedResults.map(([bankName, interest]) => displayResult(bankName, interest))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="caption" sx={{ color: textColor, margin: "10px 0px", display: "block", textAlign: "center" }}>
                * Interest rates on their respective websites are subject to change without notice
                <br />
                ** Please do your own research before making any decisions, the numbers here serve as a guide.
            </Typography>
            <InterestGraph profile={profile} />
        </Container>
    )
}

const displayResult = (bankName: string, info: ResultProp) => {
    const lastUpdated = info.lastUpdated
    return (
        <ThemedTableRow key={bankName}>
            <ThemedTableCell>{bankName}</ThemedTableCell>
            <ThemedTableCell>{info.interest.toYearly() ?? 0}</ThemedTableCell>
            <ThemedTableCell>{info.interest.toYearlyPercent().toFixed(2) ?? ""}</ThemedTableCell>
            <ThemedTableCell>
                <Link href={info.url} target="_blank" sx={{ color: primaryColor, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                    Official Website
                </Link>
            </ThemedTableCell>
            <ThemedTableCell>{info.remarks}</ThemedTableCell>
            <ThemedTableCell>{lastUpdated}</ThemedTableCell>
        </ThemedTableRow>
    )
}

const ThemedHeader = ({ children }: { children: ReactElement | string }) => {
    return <TableCell
        sx={{
            color: textColor,
            backgroundColor: bgColor,
            padding: "10px 15px",
            "&:hover": { backgroundColor: primaryColor },
            transition: "background-color 0.3s ease",
            cursor: "pointer",
        }}
    >
        {children}
    </TableCell>
};

const ThemedTableRow = ({ children, bankName }: { children: Array<ReactElement>, bankName?: string }) => (
    <TableRow
        key={bankName}
        sx={{
            color: textColor,
            backgroundColor: bgColor,
            "&:hover": { backgroundColor: "#f5f5f5" },
            transition: "background-color 0.3s ease",
        }}
    >
        {children}
    </TableRow>
)

const ThemedTableCell = ({ children }: { children: string | number | ReactElement }) => (
    <TableCell
        sx={{
            color: textColor,
            backgroundColor: bgColor,
            padding: "10px 15px",
            borderBottom: "1px solid #e0e0e0",
        }}
    >
        {children}
    </TableCell>
)