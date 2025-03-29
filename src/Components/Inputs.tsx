import { Button, FormControl, TextField, Box, Checkbox, FormControlLabel, FormGroup, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Profile, { NewProfile } from "../types/profile.ts";
import { STORE_KEY } from "../logic/constants.tsx";
import { HelpOutline } from "@mui/icons-material";
import { primaryColor, bgColor, textColor, dangerColor } from "../consts/colors.ts";
import { Field } from "./types.ts";
import { WebAlert } from "./Alert.tsx";
import { booleanInputs, numericalInputs } from "./InputValues.ts";


export const FormInputs = ({
    currProfile,
    setCurrProfile,
}: {
    currProfile: Profile;
    setCurrProfile: (_: Profile) => void;
}) => {
    const [hideModel, setHideModal] = useState<boolean>(true);
    const [modelMsg, setModalMsg] = useState<string>("");
    const [profile, setProfile] = useState<Profile>(currProfile);

    useEffect(() => {
        localStorage.setItem(STORE_KEY, JSON.stringify(currProfile))
        setProfile(currProfile)
    }, [currProfile])

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
                        const value = getStateFromProfile(profile);
                        return (
                            <InputNumberField
                                key={label.replace(" ", "_") + "_input_field"}
                                label={label}
                                tooltip={tooltip}
                                onChange={(value) => setCurrProfile(fn(profile, Number(value)))}
                                value={value}
                            />
                        );
                    })}
                    {
                        booleanInputs.map(({ label, getStateFromProfile, fn, tooltip }) => {
                            const value = getStateFromProfile(profile)
                            return <InputBooleanField
                                key={label.replace(" ", "_") + "_input_field"}
                                label={label}
                                tooltip={tooltip}
                                onChange={(value) => setCurrProfile(fn(profile, !value))}
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
            {!hideModel && <WebAlert hideModel={hideModel} severity={"info"} onClose={() => setHideModal(true)} >{modelMsg}</WebAlert>}
        </>
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
    const [inputValue, setInputValue] = useState<string>(value === 0 ? "" : value.toString())
    const [isFocused, setIsFocused] = useState<boolean>(false)

    useEffect(() => {
        if (value === 0) {
            setInputValue("")
            return
        }
        setInputValue(value.toString())

    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setInputValue(newValue)

        if (newValue === "" || newValue === "0") {
            onChange(0)
            return
        }

        const numValue = Number(newValue)
        if (isNaN(numValue)) return
        if (numValue <= 0) return
        onChange(numValue)
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
                {(isFocused || value !== 0) && (
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
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': { display: 'none' },
                '& input[type=number]': { MozAppearance: 'textfield' },
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
