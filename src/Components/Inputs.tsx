import { Button, FormControl, Typography, Alert, Collapse, IconButton, TextField, Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React, { useState } from "react";
import Profile, { NewProfile } from "../types/profile.ts";
import { STORE_KEY } from "../logic/constants.tsx";
import { Check, Close } from "@mui/icons-material";
import { primaryColor, bgColor, textColor, dangerColor } from "../consts/colors.ts";

interface InputArg<Type> {
    label: string
    inputType?: React.HTMLInputTypeAttribute
    fn: (profile: Profile, value: Type) => Profile
    getStateFromProfile: (profile: Profile) => Type
}

const makeDefaultValue = (value?: number): number => value === undefined || value === 0 ? 0 : value

const attrs: Array<InputArg<number>> = [
    {
        label: "Savings (To be deposited at bank)",
        inputType: "number",
        fn: (profile, v) => { return { ...profile, Savings: v } },
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.Savings),
    },
    {
        label: "Age",
        inputType: "number",
        fn: (profile, v) => { return { ...profile, Age: v } },
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.Age),
    },
    {
        label: "Salary (Must be credited to bank monthly)",
        inputType: "number",
        fn: (profile, v) => { return { ...profile, Salary: v } },
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.Salary),
    },
    {
        label: "Investment (Willing to spend with bank yearly)",
        inputType: "number",
        fn: (profile, v) => { return { ...profile, Investment: v } },
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.Investment),
    },
    {
        label: "Insurance (Willing to spend with bank yearly)",
        inputType: "number",
        fn: (profile, v) => { return { ...profile, Insurance: v } },
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.Insurance),
    },
    {
        label: "Spending (On eligible cards monthly)",
        inputType: "number",
        fn: (profile, v) => { return { ...profile, Spending: v } },
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.Spending),
    },
    {
        label: "Giro Transactions (Monthly)",
        inputType: "number",
        fn: (profile, v) => { return { ...profile, GiroTransactions: v } },
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.GiroTransactions),
    },
    {
        label: "Monthly Account Value Increment",
        inputType: "number",
        fn: (profile, v) => { return { ...profile, MonthlyAccIncrease: v } },
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.MonthlyAccIncrease),
    },
    {
        label: "Monthly Loan Installment from bank",
        inputType: "number",
        fn: (profile, v) => { return { ...profile, LoanInstallment: v } },
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.LoanInstallment),
    }
]

export const FormInputs = ({
    currProfile,
    setCurrProfile,
}: {
    currProfile: Profile,
    setCurrProfile: (_: Profile) => void
}) => {
    const [hideModel, setHideModal] = useState<boolean>(true);
    const [modelMsg, setModalMsg] = useState<string>("");

    const onSubmit = () => {
        localStorage.setItem(STORE_KEY, JSON.stringify(currProfile))
        setModalMsg("Save Success")
        setHideModal(false)
        setTimeout(() => {
            if (!hideModel) return
            setHideModal(true)
        }, 1500)
    }

    const onClear = () => {
        setCurrProfile(NewProfile({}))
        setModalMsg("Cleared")
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
            This is a calculator to show you which banks in Singapore have the best interest rates.
            <br />
            Key in your information below and view the interest you will get every year.
        </Typography>
        <FormControl >
            <FormGroup
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                }}
            >
                {attrs.map(
                    ({ label, inputType, getStateFromProfile, fn }) => {
                        const value = getStateFromProfile(currProfile)
                        return <InputField
                            label={label}
                            key={label.replace(" ", "_") + "_input_field"}
                            textKey={label.replace(" ", "_")}
                            inputType={inputType}
                            onChange={(value) => setCurrProfile(fn(currProfile, Number(value)))}
                            value={value === 0 ? '' : value}
                        />
                    }
                )}
            </FormGroup>
            <FormGroup
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                }}
            >
                <FormControlLabel
                    control={<Checkbox
                        onChange={() => setCurrProfile({
                            ...currProfile,
                            IsNTUCMember: !currProfile.IsNTUCMember,
                        })}
                    />}
                    label="NTUC Member"
                    sx={{ color: textColor }}
                />
            </FormGroup>
        </FormControl>
        <Box textAlign='center' sx={{
            height: "100%",
            padding: "0px",
            margin: "0px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "auto",
        }}>
            <Button
                key="submit-btn"
                sx={{
                    backgroundColor: primaryColor,
                    color: textColor,
                    margin: '10px',
                    textAlign: "center",
                }}
                type="submit"
                onClick={onSubmit}>
                Save locally
            </Button>
            <Button
                key="clear-btn"
                sx={{
                    backgroundColor: dangerColor,
                    color: textColor,
                    margin: '10px',
                    textAlign: "center",
                }}
                type="button"
                onClick={onClear}
            >
                Clear
            </Button>
        </Box>
        {!hideModel && <SaveAlert hideModel={hideModel} setHideModal={setHideModal} value={modelMsg} />}
    </>
}

const SaveAlert = ({
    value,
    hideModel,
    setHideModal,
}: {
    value: string,
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
        >{value}</Alert >
    </Collapse >
}

interface Field {
    label: string
    onChange: (string) => any
    value: number | ''
    inputType?: React.HTMLInputTypeAttribute
    subTest?: string
    textKey: string
}

const InputField = ({ label, inputType, onChange, value, textKey }: Field) => {
    return <TextField
        label={label}
        type={inputType ?? ''}
        variant="filled"
        key={textKey}
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
                ":focus": {
                    color: primaryColor,
                }
            }
        }}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        slotProps={{
            inputLabel: { shrink: true },
        }}
    />
}