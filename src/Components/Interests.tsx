import React, { ReactElement } from "react"
import { Container, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { ResultProp } from "../types/props"
import { primaryColor, bgColor, textColor } from "../consts/colors.ts"
import Profile from "../types/profile.ts"
import { bankInfo } from "../logic/constants.tsx"

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

    return <Container sx={{ color: primaryColor, width: "100%", maxWidth: "100%" }}>
        <TableContainer>
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
        <Typography variant="caption" sx={{ color: textColor, margin: "10px 0px" }}>
            * Interest rates on their respective websites are subject to change without notice
        </Typography>
    </Container>
}

const displayResult = (bankName: string, info: ResultProp) => {
    const lastUpdated = info.lastUpdated
    return <ThemedTableRow key={bankName}>
        <ThemedTableCell>{bankName}</ThemedTableCell>
        <ThemedTableCell>{info.interest.toYearly() ?? 0}</ThemedTableCell>
        <ThemedTableCell>{info.interest.toYearlyPercent().toFixed(2) ?? ""}</ThemedTableCell>
        <ThemedTableCell>
            <Link href={info.url} target="_blank" sx={{ color: textColor }}>Official Website</Link>
        </ThemedTableCell>
        <ThemedTableCell>{info.remarks}</ThemedTableCell>
        <ThemedTableCell>{lastUpdated}</ThemedTableCell>
    </ThemedTableRow>
}

const ThemedTableRow = ({ children, bankName }: {
    children: Array<ReactElement>
    bankName?: string
}) => <TableRow key={bankName} sx={{ color: textColor, backgroundColor: bgColor }}>{children}</TableRow>

const ThemedTableCell = ({ children }: {
    children: string | number | ReactElement
}) => <TableCell sx={{ color: textColor, backgroundColor: bgColor }}>{children}</TableCell>