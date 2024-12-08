import React, { ReactElement } from "react"
import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { ResultProp } from "../types/props"

export const Result = ({ results }: {
    results: Record<string, ResultProp>
}) => {
    return <TableContainer
        sx={{
            padding: "5px 0px",
            borderRadius: "10px"
        }}
    >
        <Table>
            <TableHead>
                <ThemedTableCell>
                    <TableCell>Bank Name</TableCell>
                    <TableCell>Yearly Interest</TableCell>
                    <TableCell>Remarks</TableCell>
                    <TableCell>Webpage</TableCell>
                </ThemedTableCell>
            </TableHead>
            <TableBody>
                {Object.entries(results).map(([bankName, interest]) => displayResult(bankName, interest))}
            </TableBody>
        </Table>
    </TableContainer>
}

const displayResult = (bankName: string, info: ResultProp) => {
    return <ThemedTableCell key={bankName}>
        <TableCell>{bankName}</TableCell>
        <TableCell>{info.interest.toYearly() ?? 0}</TableCell>
        <TableCell>{info.remarks}</TableCell>
        <TableCell><Link href={info.url} target="_blank">Official Website</Link></TableCell>
    </ThemedTableCell>
}

const ThemedTableCell = ({ children, bankName }: {
    children: Array<ReactElement>
    bankName?: string
}) => <TableRow
    key={bankName}
    sx={{
        color: '#000',
        backgroundColor: '#555',
        width: '100%'
    }}>{children}</TableRow>
