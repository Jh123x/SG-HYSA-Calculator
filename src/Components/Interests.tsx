import React, { ReactElement } from "react"
import { Container, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material"
import { ResultProp } from "../types/props"
import { primaryColor, bgColor, textColor } from "../consts/colors.ts"
import Profile from "../types/profile.ts"
import { bankInfo } from "../logic/constants.tsx"
import { InterestGraph } from "./InterestGraph.tsx"

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
                            <ThemedTableCell>Account Name</ThemedTableCell>
                            <ThemedTableCell>Yearly Interest</ThemedTableCell>
                            <ThemedTableCell><>Effective Interest<br />Rate (EIR)</></ThemedTableCell>
                            <ThemedTableCell>Webpage</ThemedTableCell>
                            <ThemedTableCell>Remarks</ThemedTableCell>
                            <ThemedTableCell>Updated at</ThemedTableCell>
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