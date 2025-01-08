import React, { ReactElement } from "react"
import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { ResultProp } from "../types/props"
import { primaryColor, bgColor, textColor } from "../consts/colors.ts"

export const Result = ({ results }: {
    results: Record<string, ResultProp>
}) => {
    return <>
        <TableContainer
            sx={{
                margin: "10px 0px",
                color: primaryColor,
            }}
        >
            <Table>
                <TableHead>
                    <ThemedTableRow>
                        <ThemedTableCell>Bank Name</ThemedTableCell>
                        <ThemedTableCell>Yearly Interest</ThemedTableCell>
                        <ThemedTableCell>EIR (%)</ThemedTableCell>
                        <ThemedTableCell>Remarks</ThemedTableCell>
                        <ThemedTableCell>Webpage</ThemedTableCell>
                        <ThemedTableCell>Last Updated</ThemedTableCell>
                    </ThemedTableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(results).map(([bankName, interest]) => displayResult(bankName, interest))}
                </TableBody>
            </Table>
        </TableContainer>
        <Typography variant="caption" sx={{ color: textColor }}>
            * EIR: Effective Interest Rate
        </Typography>
    </>
}

const displayResult = (bankName: string, info: ResultProp) => {
    return <ThemedTableRow key={bankName}>
        <ThemedTableCell>{bankName}</ThemedTableCell>
        <ThemedTableCell>{info.interest.toYearly() ?? 0}</ThemedTableCell>
        <ThemedTableCell>{info.interest.toYearlyPercent().toFixed(2) ?? ""}</ThemedTableCell>
        <ThemedTableCell>{info.remarks}</ThemedTableCell>
        <ThemedTableCell>
            <Link href={info.url} target="_blank" sx={{ color: textColor }}>
                Official Website
            </Link>
        </ThemedTableCell>
        <ThemedTableCell>{info.lastUpdated.toDateString()}</ThemedTableCell>
    </ThemedTableRow>
}

const ThemedTableRow = ({ children, bankName }: {
    children: Array<ReactElement>
    bankName?: string
}) => <TableRow
    key={bankName}
    sx={{ color: textColor, backgroundColor: bgColor }}>{children}</TableRow>

const ThemedTableCell = ({ children }) => <TableCell
    sx={{ color: textColor, backgroundColor: bgColor }}
>
    {children}
</TableCell>