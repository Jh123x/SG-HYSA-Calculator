import { Button, FormControl, Alert, Collapse, IconButton, TextField, Box, Checkbox, FormControlLabel, FormGroup, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import Profile, { NewProfile } from "../types/profile.ts";
import { STORE_KEY } from "../logic/constants.tsx";
import { Check, Close, HelpOutline } from "@mui/icons-material";
import { primaryColor, bgColor, textColor, dangerColor } from "../consts/colors.ts";

interface InputArg<Type> {
    label: Readonly<string>;
    tooltip: Readonly<string>;
    fn: (profile: Profile, value: Type) => Profile;
    getStateFromProfile: (profile: Profile) => Type;
}

interface Field<Type> {
    label: string
    onChange: (Type) => void
    value: Type | ""
    tooltip?: string
}

const makeDefaultNumber = (value?: number): number => (value === undefined || value === 0 ? 0 : value);

const numericalInputs: Array<InputArg<number>> = [
    {
        label: "Savings",
        tooltip: "To be deposited at bank",
        fn: (profile, v) => ({ ...profile, Savings: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.Savings),
    },
    {
        label: "Age",
        tooltip: "Current age",
        fn: (profile, v) => ({ ...profile, Age: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.Age),
    },
    {
        label: "Salary",
        tooltip: "Credited to bank monthly",
        fn: (profile, v) => ({ ...profile, Salary: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.Salary),
    },
    {
        label: "Investment",
        tooltip: "Pay to bank yearly",
        fn: (profile, v) => ({ ...profile, Investment: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.Investment),
    },
    {
        label: "Insurance",
        tooltip: "Pay to bank yearly",
        fn: (profile, v) => ({ ...profile, Insurance: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.Insurance),
    },
    {
        label: "Spending",
        tooltip: "On eligible cards monthly",
        fn: (profile, v) => ({ ...profile, Spending: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.Spending),
    },
    {
        label: "Giro Transactions",
        tooltip: "No. of GIRO Transactions",
        fn: (profile, v) => ({ ...profile, GiroTransactions: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.GiroTransactions),
    },
    {
        label: "Account Increment",
        tooltip: "Balance increase monthly",
        fn: (profile, v) => ({ ...profile, MonthlyAccIncrease: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.MonthlyAccIncrease),
    },
    {
        label: "Loan Installment",
        tooltip: "Monthly loan payment",
        fn: (profile, v) => ({ ...profile, LoanInstallment: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.LoanInstallment),
    },
];

const booleanInputs: Array<InputArg<boolean>> = [
    {
        label: "NTUC Member?",
        tooltip: "Is/Willing to be NTUC Member",
        fn: (profile, v) => ({ ...profile, IsNTUCMember: v }),
        getStateFromProfile: (profile: Profile) => profile.IsNTUCMember,
    },
];

export const FormInputs = ({
    currProfile,
    setCurrProfile,
}: {
    currProfile: Profile;
    setCurrProfile: (_: Profile) => void;
}) => {
    const [hideModel, setHideModal] = useState<boolean>(true);
    const [modelMsg, setModalMsg] = useState<string>("");

    const onSubmit = () => {
        localStorage.setItem(STORE_KEY, JSON.stringify(currProfile));
        setModalMsg("Save Success");
        setHideModal(false);
        setTimeout(() => {
            if (!hideModel) return;
            setHideModal(true);
        }, 1500);
    };

    const onClear = () => {
        setCurrProfile(NewProfile({}));
        setModalMsg("Cleared");
        setHideModal(false);
        setTimeout(() => {
            if (!hideModel) return;
            setHideModal(true);
        }, 1500);
    };

    return (
        <>
            <FormControl
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <FormGroup
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: "15px",
                        justifyContent: "center",
                    }}
                >
                    {numericalInputs.map(({ label, getStateFromProfile, fn, tooltip }) => {
                        const value = getStateFromProfile(currProfile);
                        return (
                            <InputNumberField
                                key={label.replace(" ", "_") + "_input_field"}
                                label={label}
                                tooltip={tooltip}
                                onChange={(value) => setCurrProfile(fn(currProfile, Number(value)))}
                                value={value}
                            />
                        );
                    })}
                    {
                        booleanInputs.map(({ label, getStateFromProfile, fn, tooltip }) => {
                            const value = getStateFromProfile(currProfile)
                            return <InputBooleanField
                                key={label.replace(" ", "_") + "_input_field"}
                                label={label}
                                tooltip={tooltip}
                                onChange={(value) => setCurrProfile(fn(currProfile, !value))}
                                value={value}
                            />
                        })
                    }

                </FormGroup>
            </FormControl>
            <Box
                textAlign="center"
                sx={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                }}
            >
                <Button
                    key="submit-btn"
                    sx={{
                        backgroundColor: primaryColor,
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        "&:hover": {
                            backgroundColor: "#0056b3",
                        },
                    }}
                    type="submit"
                    onClick={onSubmit}
                >
                    Save locally
                </Button>
                <Button
                    key="clear-btn"
                    sx={{
                        backgroundColor: dangerColor,
                        color: textColor,
                        padding: "10px 20px",
                        borderRadius: "8px",
                        "&:hover": {
                            backgroundColor: "#d32f2f",
                        },
                    }}
                    type="button"
                    onClick={onClear}
                >
                    Clear
                </Button>
            </Box>
            {!hideModel && <SaveAlert hideModel={hideModel} setHideModal={setHideModal} value={modelMsg} />}
        </>
    );
};

const SaveAlert = ({
    value,
    hideModel,
    setHideModal,
}: {
    value: string;
    hideModel: boolean;
    setHideModal: (boolean) => void;
}) => {
    return (
        <Collapse in={!hideModel}>
            <Alert
                severity="success"
                icon={<Check fontSize="inherit" />}
                sx={{
                    position: "fixed",
                    bottom: "10px",
                    right: "10px",
                    color: "#fff",
                    backgroundColor: primaryColor,
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
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
            >
                {value}
            </Alert>
        </Collapse>
    );
};

const InputBooleanField = ({ tooltip, value, label, onChange }: Field<boolean>) => {
    return (
        <Tooltip
            title={tooltip}
            placement="top"
            enterTouchDelay={0}
            leaveTouchDelay={3000}
        >
            <Box
                sx={{
                    width: { xs: "100%", sm: "250px" },
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={value === "" ? false : value}
                            onChange={() => onChange(value)}
                            sx={{
                                color: textColor,
                                '&.Mui-checked': { color: primaryColor, },
                                '& .MuiSvgIcon-root': {
                                    fontSize: { xs: "1.2rem", sm: "1.4rem" },
                                },
                            }}
                        />
                    }
                    label={label}
                    sx={{
                        width: "100%",
                        margin: 0,
                        backgroundColor: bgColor,
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        transition: 'all 0.2s ease-in-out',
                        '@media (hover: hover)': {
                            '&:hover': {
                                borderColor: primaryColor,
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                        },
                        '& .MuiFormControlLabel-label': {
                            color: textColor,
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            fontWeight: 500,
                        },
                    }}
                />
            </Box>
        </Tooltip>
    )
}

const InputNumberField = ({ label, onChange, value, tooltip }: Field<number>) => {
    const [inputValue, setInputValue] = useState<string>(value === 0 ? "" : value.toString());
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        // If empty string or 0, pass 0 to parent
        if (newValue === "" || newValue === "0") {
            onChange(0);
            return;
        }

        // Convert to number and validate
        const numValue = Number(newValue);
        if (!isNaN(numValue) && numValue >= 0) {
            onChange(numValue);
        }
    };

    return (
        <TextField
            label={<div
                style={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <Typography>{label}</Typography>
                {isFocused && (
                    <Tooltip title={tooltip} placement="right">
                        <HelpOutline
                            fontSize="small"
                            sx={{
                                p: "0px 5px",
                                transition: 'opacity 0.2s ease-in-out',
                            }}
                        />
                    </Tooltip>
                )}
            </div>}
            type="number"
            variant="outlined"
            placeholder={tooltip}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            sx={{
                width: { xs: "100%", sm: "250px" },
                backgroundColor: bgColor,
                borderRadius: "8px",
                "& .MuiInputBase-root": {
                    borderRadius: "8px",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                },
                "& .MuiInputLabel-root": {
                    color: textColor,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                },
                "& .MuiOutlinedInput-root": {
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: primaryColor,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: primaryColor,
                    },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                    color: primaryColor,
                },
            }}
            onChange={handleChange}
            value={inputValue}
        />
    );
};
