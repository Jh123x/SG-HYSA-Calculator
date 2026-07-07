import {
  Button,
  TextField,
  Box,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import type Profile from "../types/profile";
import { NewProfile } from "../types/profile";
import { STORE_KEY } from "../consts/keys";
import { primaryColor, textColor, mutedColor, dangerColor } from "../consts/theme";
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
  /** Content to render on the left side of the Clear/Share action bar */
  leftChildren?: React.ReactNode;
}

// The three core numeric inputs to show in the compact row
const COMPACT_INPUTS = ["Savings", "Salary", "Age"];

export const FormInputs = ({
  currProfile,
  setCurrProfile,
  pendingUrlProfile,
  onAcceptShared,
  onRejectShared,
  leftChildren,
}: FormInput) => {
  const [profile, setProfile] = useState<Profile>(currProfile);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [expanded, setExpanded] = useState(false);
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
    setExpanded(false);
  };

  // Filter inputs for compact row vs expanded
  const compactNumericalFields = numericalInputs.filter((f) =>
    COMPACT_INPUTS.includes(f.label),
  );
  const expandedNumericalFields = numericalInputs.filter(
    (f) => !COMPACT_INPUTS.includes(f.label),
  );

  return (
    <>
      <SharedProfileDialog
        open={pendingUrlProfile !== null}
        currProfile={currProfile}
        pendingProfile={pendingUrlProfile ?? currProfile}
        onAccept={onAcceptShared}
        onReject={onRejectShared}
      />

      {/* Compact inline row: 3 core inputs + More button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {compactNumericalFields.map(
          ({ label, getStateFromProfile, fn, tooltip }) => {
            const value = getStateFromProfile(profile);
            return (
              <InputNumberField
                key={`compact_${label.replace(" ", "_")}`}
                label={label}
                tooltip={tooltip}
                onChange={(v) => setCurrProfile(fn(profile, Number(v)))}
                value={value}
              />
            );
          },
        )}
        <Button
          onClick={() => setExpanded(!expanded)}
          variant="text"
          size="small"
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            color: mutedColor,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.8rem",
            whiteSpace: "nowrap",
            minWidth: 0,
            px: 1,
            "&:hover": { color: primaryColor },
          }}
        >
          {expanded ? "Less" : "More"}
        </Button>
      </Box>

      {/* Expanded section: additional numeric + boolean toggles */}
      {expanded && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            width: "100%",
            mt: 1.5,
          }}
        >
          {/* Additional numeric fields */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
            }}
          >
            {expandedNumericalFields.map(
              ({ label, getStateFromProfile, fn, tooltip }) => {
                const value = getStateFromProfile(profile);
                return (
                  <InputNumberField
                    key={`expanded_${label.replace(" ", "_")}`}
                    label={label}
                    tooltip={tooltip}
                    onChange={(v) => setCurrProfile(fn(profile, Number(v)))}
                    value={value}
                  />
                );
              },
            )}
          </Box>

          {/* Boolean toggles */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
            }}
          >
            {booleanInputs.map(
              ({ label, getStateFromProfile, fn, tooltip }) => {
                const value = getStateFromProfile(profile);
                return (
                  <InputBooleanField
                    key={label.replace(" ", "_")}
                    label={label}
                    tooltip={tooltip}
                    onChange={(v) => setCurrProfile(fn(profile, !v))}
                    value={value}
                  />
                );
              },
            )}
          </Box>
        </Box>
      )}

      {/* Action bar: Clear + Share + leftChildren */}
      <Box
        sx={{
          mt: 1.5,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 1,
        }}
      >
        {/* Left: tab toggle (passed from TabbedContent) + privacy chip */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          {leftChildren}
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
            }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button
            key="clear-btn"
            sx={{
              backgroundColor: dangerColor,
              color: textColor,
              padding: "6px 16px",
              borderRadius: "8px",
              fontSize: "0.8rem",
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
          display: "flex",
          alignItems: "center",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={value === "" ? false : value}
              onChange={() => onChange(value)}
              size="small"
              sx={{
                color: mutedColor,
                "&.Mui-checked": { color: primaryColor },
                "& .MuiSvgIcon-root": {
                  fontSize: "1.1rem",
                },
              }}
            />
          }
          label={label}
          sx={{
            margin: 0,
            "& .MuiFormControlLabel-label": {
              color: textColor,
              fontSize: "0.8rem",
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
      label={label}
      type="number"
      variant="outlined"
      size="small"
      placeholder={tooltip}
      sx={{
        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
          { display: "none" },
        "& input[type=number]": { MozAppearance: "textfield" },
        width: { xs: "100%", sm: 140 },
        "& .MuiInputBase-root": {
          fontSize: "0.85rem",
        },
        "& .MuiInputLabel-root": {
          fontSize: "0.8rem",
        },
      }}
      onChange={handleChange}
      value={inputValue}
    />
  );
};
