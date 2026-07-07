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
 * Geckoboard-style metric card for displaying bank interest rate data.
 *
 * Displays bank name, effective interest rate (EIR), yearly interest earned,
 * remarks with tooltip, and action buttons for details/website.
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
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
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
          fontSize: "0.9rem",
          color: mutedColor,
          fontWeight: 500,
          lineHeight: 1.3,
          mb: 0.5,
        }}
      >
        {name}
      </Typography>

      {/* EIR */}
      <Typography
        variant="h2"
        sx={{
          fontSize: "2.5rem",
          fontWeight: 700,
          color: textColor,
          lineHeight: 1.1,
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
          letterSpacing: "0.05em",
        }}
      >
        Effective Rate
      </Typography>

      {/* Yearly Interest */}
      <Typography
        sx={{
          fontSize: "1.3rem",
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
          letterSpacing: "0.05em",
        }}
      >
        Yearly Interest
      </Typography>

      {/* Remarks */}
      {remarks && (
        <Tooltip title={typeof remarks === "string" ? remarks : ""} arrow>
          <Typography
            variant="body2"
            sx={{
              color: mutedColor,
              fontSize: "0.75rem",
              mt: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {truncatedRemarks}
          </Typography>
        </Tooltip>
      )}

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          mt: "auto",
          pt: 0.5,
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
            sx={{ color: primaryColor }}
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
              sx={{ color: primaryColor }}
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
