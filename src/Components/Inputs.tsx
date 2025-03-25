import { Button, FormControl, Alert, Collapse, IconButton, TextField, Box, Checkbox, FormControlLabel, FormGroup, Tooltip } from "@mui/material";
import React, { useState } from "react";
import Profile, { NewProfile } from "../types/profile.ts";
import { STORE_KEY } from "../logic/constants.tsx";
import { Check, Close } from "@mui/icons-material";
import { primaryColor, bgColor, textColor, dangerColor } from "../consts/colors.ts";

interface InputArg<Type> {
    label: string;
    inputType?: React.HTMLInputTypeAttribute;
    tooltip: string;
    fn: (profile: Profile, value: Type) => Profile;
    getStateFromProfile: (profile: Profile) => Type;
}

const makeDefaultValue = (value?: number): number => (value === undefined || value === 0 ? 0 : value);

const attrs: Array<InputArg<number>> = [
    {
        label: "Savings",
        tooltip: "To be deposited at bank",
        inputType: "number",
        fn: (profile, v) => ({ ...profile, Savings: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.Savings),
    },
    {
        label: "Age",
        inputType: "number",
        tooltip: "Current age",
        fn: (profile, v) => ({ ...profile, Age: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.Age),
    },
    {
        label: "Salary",
        tooltip: "Credited to bank monthlys",
        inputType: "number",
        fn: (profile, v) => ({ ...profile, Salary: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.Salary),
    },
    {
        label: "Investment",
        tooltip: "Pay to bank yearly",
        inputType: "number",
        fn: (profile, v) => ({ ...profile, Investment: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.Investment),
    },
    {
        label: "Insurance",
        tooltip: "Pay to bank yearly",
        inputType: "number",
        fn: (profile, v) => ({ ...profile, Insurance: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.Insurance),
    },
    {
        label: "Spending",
        inputType: "number",
        tooltip: "On eligible cards monthly",
        fn: (profile, v) => ({ ...profile, Spending: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.Spending),
    },
    {
        label: "Giro Transactions",
        inputType: "number",
        tooltip: "No. of GIRO Transactions",
        fn: (profile, v) => ({ ...profile, GiroTransactions: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.GiroTransactions),
    },
    {
        label: "Account Increment",
        inputType: "number",
        tooltip: "Balance increase monthly",
        fn: (profile, v) => ({ ...profile, MonthlyAccIncrease: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.MonthlyAccIncrease),
    },
    {
        label: "Loan Installment",
        inputType: "number",
        tooltip: "Monthly loan payment",
        fn: (profile, v) => ({ ...profile, LoanInstallment: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultValue(profile.LoanInstallment),
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
                    {attrs.map(({ label, inputType, getStateFromProfile, fn, tooltip }) => {
                        const value = getStateFromProfile(currProfile);
                        return (
                            <InputField
                                label={label}
                                key={label.replace(" ", "_") + "_input_field"}
                                textKey={label.replace(" ", "_")}
                                inputType={inputType}
                                tooltip={tooltip}
                                onChange={(value) => setCurrProfile(fn(currProfile, Number(value)))}
                                value={value}
                            />
                        );
                    })}
                    <Tooltip
                        title="Is/Willing to join NTUC membership"
                        placement="top"
                        arrow
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
                                        checked={currProfile.IsNTUCMember}
                                        onChange={() =>
                                            setCurrProfile({
                                                ...currProfile,
                                                IsNTUCMember: !currProfile.IsNTUCMember,
                                            })
                                        }
                                        sx={{
                                            color: textColor,
                                            '&.Mui-checked': {
                                                color: primaryColor,
                                            },
                                            '& .MuiSvgIcon-root': {
                                                fontSize: { xs: "1.2rem", sm: "1.4rem" },
                                            },
                                        }}
                                    />
                                }
                                label="NTUC Member"
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

interface Field {
    label: string
    onChange: (string) => any
    value: number | ""
    inputType?: React.HTMLInputTypeAttribute
    textKey: string
    tooltip?: string
}

const InputField = ({ label, inputType, onChange, value, textKey, tooltip }: Field) => {
    return (
        <TextField
            label={label}
            type={inputType ?? ""}
            variant="outlined"
            key={textKey}
            placeholder={tooltip}
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
            onChange={(e) => onChange(e.target.value)}
            value={value}
        />
    );
};
