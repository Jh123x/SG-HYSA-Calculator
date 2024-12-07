import React from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { ResultInterest } from "../types/interest_result"

interface ResultProp {
    results: Record<string, ResultInterest>
}

export const Result = ({ results }: ResultProp) => {
    return <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Bank Name</TableCell>
                    <TableCell>Yearly Interest</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.entries(results).map(([bankName, interest]) => displayResult(bankName, interest))}
            </TableBody>
        </Table>
    </TableContainer>
}

const displayResult = (bankName: string, interest: ResultInterest) => {
    return <TableRow
        key={bankName}
        sx={{
            color: '#000',
            backgroundColor: '#555',
            width: '100%'
        }}>
        <TableCell>{bankName}</TableCell>
        <TableCell>{interest.toYearly()}</TableCell>
    </TableRow>
}