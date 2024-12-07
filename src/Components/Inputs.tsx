import { TextField, Button, FormControl, Typography, Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import Profile from "../types/profile.ts";
import { STORE_KEY } from "../logic/constants.ts";


interface InputArg<Type> {
    label: string
    inputType?: React.HTMLInputTypeAttribute
    key: string
    fn: (profile: Profile, value: Type) => Profile
    getDefault: (profile: Profile) => Type | undefined
}

const makeDefaultValue = (value?: number): number | undefined => value === undefined || value === 0 ? undefined : value

const attrs: Array<InputArg<number>> = [
    {
        label: "Savings",
        inputType: "number",
        key: "savings",
        fn: (profile, v) => { return { ...profile, Savings: v } },
        getDefault: (profile: Profile) => makeDefaultValue(profile.Savings),
    },
    {
        label: "Age",
        inputType: "number",
        key: "age",
        fn: (profile, v) => { return { ...profile, Age: v } },
        getDefault: (profile: Profile) => makeDefaultValue(profile.Age),
    },
    {
        label: "Salary",
        inputType: "number",
        key: "salary",
        fn: (profile, v) => { return { ...profile, Salary: v } },
        getDefault: (profile: Profile) => makeDefaultValue(profile.Salary),
    },
    {
        label: "Investment (Willing to spend with bank)",
        inputType: "number",
        key: "investment",
        fn: (profile, v) => { return { ...profile, Investment: v } },
        getDefault: (profile: Profile) => makeDefaultValue(profile.Investment),
    },
    {
        label: "Insurance (Willing to spend with bank)",
        inputType: "number",
        key: "insurance",
        fn: (profile, v) => { return { ...profile, Insurance: v } },
        getDefault: (profile: Profile) => makeDefaultValue(profile.Insurance),
    },
    {
        label: "Spending (On eligible cards)",
        inputType: "number",
        key: "spending",
        fn: (profile, v) => { return { ...profile, Spending: v } },
        getDefault: (profile: Profile) => makeDefaultValue(profile.Spending),
    },
    {
        label: "Giro Transactions (Monthly)",
        inputType: "number",
        key: "giro",
        fn: (profile, v) => { return { ...profile, GiroTransactions: v } },
        getDefault: (profile: Profile) => makeDefaultValue(profile.GiroTransactions),
    },
    {
        label: "Monthly Account Value Increment",
        inputType: "number",
        key: "monthly-acc-value",
        fn: (profile, v) => { return { ...profile, MonthlyAccIncrease: v } },
        getDefault: (profile: Profile) => makeDefaultValue(profile.MonthlyAccIncrease),
    },
]

const defaultValue = {
    Age: 0,
    Salary: 0,
    Savings: 0,
    Investment: 0,
    Insurance: 0,
    Spending: 0,
    GiroTransactions: 0,
    MonthlyAccIncrease: 0,
}

export const FormInputs = ({ updateResult }) => {
    const [hideModel, setHideModal] = useState<boolean>(true);
    const localData = localStorage.getItem(STORE_KEY) ?? ""
    const localValue = localData ? JSON.parse(localData) : undefined
    const [state, setState] = useState<Profile>(localValue ?? defaultValue)

    useEffect(() => updateResult(state), [state, updateResult])
    const onSubmit = () => {
        localStorage.setItem(STORE_KEY, JSON.stringify(state))
        setHideModal(false)
        setTimeout(() => { setHideModal(true) }, 3000)
    }

    return <>
        <Typography variant="h4" >
            High Yield Savings Account Calculator
        </Typography>
        <Typography variant="h6" >
            This is a calculator to show you which banks in Singapore have the best interest rates.
            Key in your information below and view the interest you will get every year.
        </Typography>
        <FormControl sx={{ width: '100%' }} >
            {attrs.map(
                ({ label, inputType, getDefault, fn }) => <Input
                    label={label}
                    key={label.replace(" ", "_")}
                    inputType={inputType}
                    onChange={(value) => setState(fn(state, value))}
                    defaultValue={getDefault(state)}
                />
            )}
            <Button
                key="submit-btn"
                sx={{ backgroundColor: '#555' }}
                type="submit"
                onClick={onSubmit}>
                Save locally
            </Button>
        </FormControl>
        {hideModel && <Alert severity="success">Save Success</Alert>}
    </>
}

interface Field {
    label: string
    onChange: (string) => any
    defaultValue?: number
    inputType?: React.HTMLInputTypeAttribute
    subTest?: string
    key?: string
}

const Input = (props: Field) => {
    return <TextField
        label={props.label}
        type={props.inputType ?? ''}
        variant="filled"
        sx={{
            color: '#000',
            backgroundColor: '#555',
            width: '100%'
        }}
        onChange={(e) => props.onChange(e.target.value)}
        value={props.defaultValue}
        slotProps={{
            inputLabel: {
                shrink: true,
            },
        }}
    />
}