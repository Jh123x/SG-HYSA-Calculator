import React from "react"
import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { ResultProp } from "../types/props"

export const Result = ({ results }: {
    results: Record<string, ResultProp>
}) => {
    return <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Bank Name</TableCell>
                    <TableCell>Yearly Interest</TableCell>
                    <TableCell>Remarks</TableCell>
                    <TableCell>Webpage</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.entries(results).map(([bankName, interest]) => displayResult(bankName, interest))}
            </TableBody>
        </Table>
    </TableContainer>
}

const displayResult = (bankName: string, info: ResultProp) => {
    return <TableRow
        key={bankName}
        sx={{
            color: '#000',
            backgroundColor: '#555',
            width: '100%'
        }}>
        <TableCell>{bankName}</TableCell>
        <TableCell>{info.interest.toYearly()}</TableCell>
        <TableCell>{info.remarks}</TableCell>
        <TableCell><Link href={info.url} target="_blank">Official Website</Link></TableCell>
    </TableRow>
}