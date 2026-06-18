import { useState, useCallback } from "react";
import { Button, Box } from "@mui/material";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { primaryColor, textColor, bgColor } from "../consts/colors";
import type Profile from "../types/profile";
import { profileToUrl } from "../logic/profileUrl";

interface ShareButtonProps {
  profile: Profile;
  onCopied?: () => void;
}

export const ShareButton = ({ profile, onCopied }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = profileToUrl(profile);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / non-HTTPS contexts
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    }
  }, [profile, onCopied]);

  return (
    <Button
      type="button"
      onClick={handleShare}
      startIcon={copied ? <CheckIcon /> : <ShareOutlinedIcon />}
      sx={{
        backgroundColor: copied ? "#2e7d32" : bgColor,
        color: textColor,
        padding: "10px 20px",
        borderRadius: "8px",
        border: `1px solid ${copied ? "#2e7d32" : primaryColor}`,
        "&:hover": {
          backgroundColor: copied
            ? "#2e7d32"
            : "rgba(255,255,255,0.08)",
        },
      }}
    >
      {copied ? "Copied!" : "Share"}
    </Button>
  );
};
