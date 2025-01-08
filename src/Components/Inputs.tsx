import { Button, FormControl, Typography, Alert, Collapse, IconButton, TextField, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Profile from "../types/profile.ts";
import { STORE_KEY } from "../logic/constants.tsx";
import { Check, Close } from "@mui/icons-material";
import { primaryColor, bgColor, textColor } from "../consts/colors.ts";

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
        label: "Savings (To be deposited at bank)",
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
        label: "Salary (Must be credited to bank monthly)",
        inputType: "number",
        key: "salary",
        fn: (profile, v) => { return { ...profile, Salary: v } },
        getDefault: (profile: Profile) => makeDefaultValue(profile.Salary),
    },
    {
        label: "Investment (Willing to spend with bank yearly)",
        inputType: "number",
        key: "investment",
        fn: (profile, v) => { return { ...profile, Investment: v } },
        getDefault: (profile: Profile) => makeDefaultValue(profile.Investment),
    },
    {
        label: "Insurance (Willing to spend with bank yearly)",
        inputType: "number",
        key: "insurance",
        fn: (profile, v) => { return { ...profile, Insurance: v } },
        getDefault: (profile: Profile) => makeDefaultValue(profile.Insurance),
    },
    {
        label: "Spending (On eligible cards monthly)",
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
    {
        label: "Monthly Loan Installment from bank",
        inputType: "number",
        key: "loan_installment",
        fn: (profile, v) => { return { ...profile, LoanInstallment: v } },
        getDefault: (profile: Profile) => makeDefaultValue(profile.LoanInstallment),
    }
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
        setTimeout(() => {
            if (!hideModel) return
            setHideModal(true)
        }, 1500)
    }

    return <>
        <Typography variant="h4" sx={{ margin: "10px 0px", color: textColor }}>
            High Yield Savings Account Calculator
        </Typography>
        <Typography variant="body1" sx={{ margin: "10px 0px", color: textColor }}>
            <p>
                This is a calculator to show you which banks in Singapore have the best interest rates.
                <br />
                Key in your information below and view the interest you will get every year.
                <br />
                The interests is last updated on 2024-12-19.
            </p>
        </Typography>
        <FormControl sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
        }} >
            {attrs.map(
                ({ label, inputType, getDefault, fn }) => <InputField
                    label={label}
                    key={label.replace(" ", "_")}
                    inputType={inputType}
                    onChange={(value) => setState(fn(state, Number(value)))}
                    defaultValue={getDefault(state)}
                />
            )}
        </FormControl>
        <Box textAlign='center'>
            <Button
                key="submit-btn"
                sx={{
                    backgroundColor: primaryColor,
                    color: textColor,
                    width: '50%',
                    justifySelf: 'center',
                    margin: '20px',
                }}
                type="submit"
                onClick={onSubmit}>
                Save locally
            </Button>
        </Box>
        {!hideModel && <SaveAlert hideModel={hideModel} setHideModal={setHideModal} />}
    </>
}

const SaveAlert = ({
    hideModel,
    setHideModal,
}: {
    hideModel: boolean,
    setHideModal: (boolean) => void
}) => {
    return <Collapse in={!hideModel}>
        <Alert
            severity="success"
            icon={<Check fontSize="inherit" />}
            sx={{
                position: "fixed",
                top: "7vh",
                right: "20px",
                color: textColor,
                backgroundColor: primaryColor,
            }}
            action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setHideModal(true)}
                >
                    <Close fontSize="inherit" />
                </IconButton>
            }
        > Save Success</Alert >
    </Collapse >
}

interface Field {
    label: string
    onChange: (string) => any
    defaultValue?: number
    inputType?: React.HTMLInputTypeAttribute
    subTest?: string
    key?: string
}

const InputField = ({ label, inputType, onChange, defaultValue, key }: Field) => {
    return <TextField
        label={label}
        type={inputType ?? ''}
        variant="filled"
        key={key}
        sx={{
            backgroundColor: bgColor,
            width: '25vh',
            minWidth: '25vh',
            margin: "3px",
            padding: "2px",
            input: {
                color: textColor,
                backgroundColor: bgColor,
            },
            label: {
                color: textColor,
                ":focus":{
                    color: primaryColor,
                }
            }
        }}
        onChange={(e) => onChange(e.target.value)}
        value={defaultValue}
        slotProps={{
            inputLabel: { shrink: true },
        }}
    />
}