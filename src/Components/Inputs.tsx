import { Container, TextField, Checkbox, Grid2, FormControlLabel, Box, Typography, Button, FormControl } from "@mui/material";
import React, { useEffect, useState } from "react";
import Profile from "../logic/profile.ts";
import { STORE_KEY } from "../logic/constants.ts";

export const FormInputs = () => {
    const [state, setState] = useState<Profile>(
        {
            Age: 0,
            Salary: 0,
            Investment: 0,
            Insurance: 0,
        },
    )

    useEffect(() => localStorage.setItem(STORE_KEY, JSON.stringify(state)), [state])

    return <Grid2 justifyContent="center">
        <FormControl>
            <AgeInput updateAge={(age) => setState({ ...state, Age: age })} />
            <SalaryInput updateSalary={(salary) => setState({ ...state, Salary: salary })} />
            <InsuranceInput updateInsurance={(insurance) => setState({ ...state, Insurance: insurance })} />
            <InvestmentInput updateInvestment={(investment) => setState({ ...state, Investment: investment })} />
            <Button type="submit" onClick={() => localStorage.setItem(STORE_KEY, JSON.stringify(state))}>Submit</Button>
        </FormControl>
    </Grid2>
}

const AgeInput = ({ updateAge }) => {
    return <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1 } }}
        display="flex"
        flex="row"
    >
        <Typography variant="h6">Current Age</Typography>
        <TextField
            id="outlined-number"
            label="Current Age"
            type="number"
            onChange={e => updateAge(parseInt(e.target.value ?? 0))}
            slotProps={{
                inputLabel: { shrink: true },
            }}
        />
    </Box>
};

const SalaryInput = ({ updateSalary }) => (
    <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1 } }}
        display="flex"
        flex="row"
    >
        <Typography variant="h6">Monthly Salary Credit Amount</Typography>
        <TextField
            id="outlined-number"
            label="Monthly Salary"
            type="number"
            onChange={e => updateSalary(parseInt(e.target.value ?? 0))}
            slotProps={{
                inputLabel: {
                    shrink: true,
                },
            }}
        />
    </Box>
)

const InsuranceInput = ({ updateInsurance }) => {
    const [isSelected, setSelected] = useState(true)
    return <Container>
        <Grid2 display="flex" flexDirection="row">
            <FormControlLabel control={<Checkbox onChange={() => setSelected(!isSelected)} />} label="Willing to Insure" />
            <TextField
                hidden={isSelected}
                disabled={isSelected}
                id="outlined-number"
                label="Insurance Amount"
                type="number"
                onChange={e => updateInsurance(parseInt(e.target.value ?? 0))}
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                }}
            />
        </Grid2>
    </Container>
}

const InvestmentInput = ({ updateInvestment }) => {
    const [isSelected, setSelected] = useState(true)
    return <Container>
        <Grid2 display="flex" flexDirection="row">
            <FormControlLabel control={<Checkbox onChange={() => setSelected(!isSelected)} />} label="Willing to Invest" />
            <TextField
                hidden={isSelected}
                disabled={isSelected}
                id="outlined-number"
                label="Investment Amount"
                type="number"
                onChange={e => updateInvestment(parseInt(e.target.value ?? 0))}
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                }}
            />
        </Grid2>
    </Container>
}