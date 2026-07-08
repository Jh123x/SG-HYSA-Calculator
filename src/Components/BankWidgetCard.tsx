import { useNavigate } from "react-router-dom";
import {
  Paper,
  Box,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LanguageIcon from "@mui/icons-material/Language";
import { primaryColor, accentGreen, textColor, mutedColor } from "../consts/theme";

export interface BankWidgetCardProps {
  slug: string;
  name: string;
  eir: number;
  yearlyInterest: number;
  remarks?: string | React.ReactElement;
  url?: string;
  onClick: () => void;
}

/**
 * Apple-inspired metric card for displaying bank interest rate data.
 *
 * Clean typography, spring-like hover, minimal chrome.
 */
export const BankWidgetCard = ({
  slug,
  name,
  eir,
  yearlyInterest,
  remarks,
  url,
  onClick,
}: BankWidgetCardProps) => {
  const navigate = useNavigate();

  const truncatedRemarks =
    typeof remarks === "string" && remarks.length > 50
      ? `${remarks.slice(0, 50)}…`
      : remarks;

  return (
    <Paper
      sx={{
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        height: 210,
        cursor: "pointer",
        transition: "transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)",
        "&:hover": {
          transform: "scale(1.01)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        },
        "&:active": {
          transform: "scale(0.985)",
          transition: "transform 0.1s ease",
        },
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${name} — ${eir.toFixed(2)}% EIR`}
    >
      {/* Bank Name */}
      <Typography
        sx={{
          fontSize: "0.85rem",
          color: mutedColor,
          fontWeight: 500,
          lineHeight: 1.3,
        }}
      >
        {name}
      </Typography>

      {/* EIR */}
      <Typography
        variant="h2"
        sx={{
          fontSize: "2.25rem",
          fontWeight: 700,
          color: textColor,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}
      >
        {eir.toFixed(2)}%
      </Typography>
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.7rem",
          color: mutedColor,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        Effective Rate
      </Typography>

      {/* Yearly Interest */}
      <Typography
        sx={{
          fontSize: "1.15rem",
          fontWeight: 600,
          color: accentGreen,
          mt: 1,
        }}
      >
        ${yearlyInterest.toFixed(2)}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          fontSize: "0.7rem",
          color: mutedColor,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        Yearly Interest
      </Typography>

      {/* Remarks */}
      <Typography
        variant="body2"
        sx={{
          color: mutedColor,
          fontSize: "0.75rem",
          mt: 0.5,
          minHeight: "1.1em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "100%",
        }}
      >
        {remarks ? (
          <Tooltip title={typeof remarks === "string" ? remarks : ""} arrow>
            <span>{truncatedRemarks}</span>
          </Tooltip>
        ) : null}
      </Typography>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          mt: "auto",
          pt: 0.75,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip title="View details" placement="top">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/bank/${slug}`);
            }}
            sx={{
              color: mutedColor,
              "&:hover": { color: primaryColor },
              transition: "color 0.15s ease",
            }}
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {url && (
          <Tooltip title="Visit official website" placement="top">
            <IconButton
              size="small"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              sx={{
                color: mutedColor,
                "&:hover": { color: primaryColor },
                transition: "color 0.15s ease",
              }}
            >
              <LanguageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
};

export default BankWidgetCard;
