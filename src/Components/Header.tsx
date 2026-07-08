import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import { primaryColor, mutedColor, borderColor, textColor } from "../consts/theme";
import { useMobile } from "../hooks/useMobile";
import { prefetchRoute } from "../data/prefetch";

/**
 * Minimalist Geckoboard-style Header:
 * - 44px compact Box with bottom border
 * - Left: diamond icon + "HYSA Calculator" text (icon only on mobile)
 * - Right: "FAQs" text button (no icon)
 */
export const Header = () => {
  const navigate = useNavigate();
  const { isCompact } = useMobile();

  return (
    <Box
      component="header"
      sx={{
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        borderBottom: `1px solid ${borderColor}`,
        flexShrink: 0,
      }}
    >
      {/* Left: icon + text */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <SavingsOutlinedIcon
          sx={{
            fontSize: 20,
            color: primaryColor,
            flexShrink: 0,
          }}
        />
        {!isCompact && (
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.9rem",
              color: textColor,
            }}
          >
            HYSA Calculator
          </Typography>
        )}
        {/* Visually hidden h1 for SEO */}
        <Typography
          component="h1"
          sx={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          SG High Yield Savings Accounts
        </Typography>
      </Box>

      {/* Right: FAQs text button */}
      <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Button
          onClick={() => navigate("/faq")}
          onMouseEnter={() => prefetchRoute("/faq")}
          size={isCompact ? "small" : "small"}
          sx={{
            color: mutedColor,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.85rem",
            minWidth: 0,
            "&:hover": { color: primaryColor },
          }}
        >
          FAQs
        </Button>
      </Box>
    </Box>
  );
};
