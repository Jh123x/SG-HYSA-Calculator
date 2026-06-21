import {
  Button,
  FormControl,
  TextField,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import type Profile from "../types/profile";
import { NewProfile } from "../types/profile";
import { STORE_KEY } from "../consts/keys";
import { HelpOutlined } from "@mui/icons-material";
import {
  primaryColor,
  bgColor,
  textColor,
  dangerColor,
} from "../consts/colors";
import type { Field } from "./types";
import { WebAlert } from "./Alert";
import { booleanInputs, numericalInputs } from "./InputValues";
import { ShareButton } from "./ShareButton";
import { SharedProfileDialog } from "./SharedProfileDialog";
import { NotificationStack } from "./NotificationStack";
import type { AlertColor } from "@mui/material";

interface Notification {
  id: number;
  message: string;
  severity: AlertColor;
}

interface FormInput {
  currProfile: Profile;
  setCurrProfile: (_: Profile) => void;
  pendingUrlProfile: Profile | null;
  onAcceptShared: () => void;
  onRejectShared: () => void;
}

export const FormInputs = ({
  currProfile,
  setCurrProfile,
  pendingUrlProfile,
  onAcceptShared,
  onRejectShared,
}: FormInput) => {
  const [profile, setProfile] = useState<Profile>(currProfile);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(currProfile));
    setProfile(currProfile);
  }, [currProfile]);

  const addNotification = useCallback(
    (message: string, severity: AlertColor, duration = 3000) => {
      const id = nextId.current++;
      setNotifications((prev) => [...prev, { id, message, severity }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    },
    [],
  );

  const dismissNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const onClear = () => {
    setCurrProfile(NewProfile({}));
    addNotification("Cleared", "info");
  };

  return (
    <>
      <SharedProfileDialog
        open={pendingUrlProfile !== null}
        currProfile={currProfile}
        pendingProfile={pendingUrlProfile ?? currProfile}
        onAccept={onAcceptShared}
        onReject={onRejectShared}
      />
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
            gap: { xs: "10px", sm: "15px" },
            justifyContent: "center",
          }}
        >
          {numericalInputs.map(
            ({ label, getStateFromProfile, fn, tooltip }) => {
              const value = getStateFromProfile(profile);
              return (
                <InputNumberField
                  key={label.replace(" ", "_") + "_input_field"}
                  label={label}
                  tooltip={tooltip}
                  onChange={(value) =>
                    setCurrProfile(fn(profile, Number(value)))
                  }
                  value={value}
                />
              );
            },
          )}
          {booleanInputs.map(({ label, getStateFromProfile, fn, tooltip }) => {
            const value = getStateFromProfile(profile);
            return (
              <InputBooleanField
                key={label.replace(" ", "_") + "_input_field"}
                label={label}
                tooltip={tooltip}
                onChange={(value) => setCurrProfile(fn(profile, !value))}
                value={value}
              />
            );
          })}
        </FormGroup>
      </FormControl>
      <Box
        sx={{
          marginTop: "20px",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "flex-end",
          alignItems: { xs: "stretch", sm: "center" },
          gap: "10px",
        }}
      >
        <Chip
          icon={<LockOutlinedIcon />}
          label="All data stays on your device"
          size="small"
          variant="outlined"
          sx={{
            color: textColor,
            borderColor: "rgba(255,255,255,0.15)",
            opacity: 0.8,
            fontSize: "0.75rem",
            alignSelf: { xs: "center", sm: "auto" },
            mr: { sm: "auto" },
          }}
        />
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
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
          <ShareButton
            profile={currProfile}
            onCopied={() =>
              addNotification("Profile URL copied to clipboard!", "success")
            }
          />
        </Box>
      </Box>
      <NotificationStack>
        {notifications.map((n) => (
          <WebAlert
            key={n.id}
            hideModel={false}
            severity={n.severity}
            onClose={() => dismissNotification(n.id)}
          >
            {n.message}
          </WebAlert>
        ))}
      </NotificationStack>
    </>
  );
};

const InputBooleanField = ({
  tooltip,
  value,
  label,
  onChange,
}: Field<boolean>) => {
  return (
    <Tooltip
      title={tooltip}
      placement="top"
      enterTouchDelay={0}
      leaveTouchDelay={3000}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "200px" },
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
                "&.Mui-checked": { color: primaryColor },
                "& .MuiSvgIcon-root": {
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
            border: "1px solid rgba(0, 0, 0, 0.12)",
            transition: "all 0.2s ease-in-out",
            "@media (hover: hover)": {
              "&:hover": {
                borderColor: primaryColor,
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            },
            "& .MuiFormControlLabel-label": {
              color: textColor,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontWeight: 500,
            },
          }}
        />
      </Box>
    </Tooltip>
  );
};

const InputNumberField = ({
  label,
  onChange,
  value,
  tooltip,
}: Field<number>) => {
  const [inputValue, setInputValue] = useState<string>(
    value === 0 ? "" : value.toString(),
  );
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if (value === 0) {
      setInputValue("");
      return;
    }
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue === "" || newValue === "0") {
      onChange(0);
      return;
    }

    const numValue = Number(newValue);
    if (isNaN(numValue)) return;
    if (numValue <= 0) return;
    onChange(numValue);
  };

  return (
    <TextField
      label={
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Typography>{label}</Typography>
          {(isFocused || value !== 0) && (
            <Tooltip title={tooltip} placement="right">
              <HelpOutlined
                fontSize="small"
                sx={{
                  p: "0px 5px",
                  transition: "opacity 0.2s ease-in-out",
                }}
              />
            </Tooltip>
          )}
        </div>
      }
      type="number"
      variant="outlined"
      placeholder={tooltip}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      sx={{
        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
          { display: "none" },
        "& input[type=number]": { MozAppearance: "textfield" },
        width: { xs: "100%", sm: "200px" },
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
