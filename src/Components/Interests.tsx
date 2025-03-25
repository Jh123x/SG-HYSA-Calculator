import React, { ReactElement } from "react"
import { Container, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material"
import { ResultProp } from "../types/props"
import { primaryColor, bgColor, textColor } from "../consts/colors.ts"
import Profile from "../types/profile.ts"
import { bankInfo } from "../logic/constants.tsx"
import { InterestGraph } from "./InterestGraph.tsx"
import { ResultInterest } from "../types/interest_result.ts"

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}



export const Result = ({ profile }: { profile: Profile }) => {
    const results: Record<string, ResultProp> = {}
    for (const [name, info] of Object.entries(bankInfo)) {
        results[name] = {
            interest: info.interestFn(profile),
            url: info.url,
            remarks: info.remarks,
            lastUpdated: info.lastUpdated,
        }
    }

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
                            <ThemedHeader key="account_name">Account Name</ThemedHeader>
                            <ThemedHeader key="yearly_interest">Yearly Interest</ThemedHeader>
                            <ThemedHeader key="effective_interest"><>Effective Interest<br />Rate (EIR)</></ThemedHeader>
                            <ThemedHeader key="webpage">Webpage</ThemedHeader>
                            <ThemedHeader key="remark">Remarks</ThemedHeader>
                            <ThemedHeader key="updated_at">Updated at</ThemedHeader>
                        </ThemedTableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(results).map(([bankName, interest]) => displayResult(bankName, interest))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="caption" sx={{ color: textColor, margin: "10px 0px", display: "block", textAlign: "center" }}>
                * Interest rates on their respective websites are subject to change without notice
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
            "&:hover": { backgroundColor: primaryColor },
            transition: "background-color 0.3s ease",
        }}
    >
        {children}
    </TableCell>
}

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