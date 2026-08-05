import { useNavigate } from "react-router";
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
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, sm: 3 },
        borderBottom: `1px solid ${borderColor}`,
        flexShrink: 0,
        position: "relative",
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
        onMouseEnter={() => prefetchRoute("/")}
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
        <Box component="h1" sx={{ height: 0, overflow: "hidden", m: 0 }}>
          High Yield Savings Account Calculator Singapore — Compare the Best Rates
        </Box>
      </Box>
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
    </Box >
  );
};
