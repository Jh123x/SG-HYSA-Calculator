import { Button, Alert, Collapse } from "@mui/material";
import { Close } from "@mui/icons-material";

interface Props {
  open: boolean;
  onAccept: () => void;
  onReject: () => void;
}

/**
 * Non-blocking notification card shown when a shared profile URL would
 * overwrite the user's existing saved profile. Styled consistently with
 * the existing WebAlert notification cards.
 */
export const SharedProfileDialog = ({ open, onAccept, onReject }: Props) => (
  <Collapse in={open}>
    <Alert
      severity="warning"
      sx={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        maxWidth: "400px",
        color: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 1300,
      }}
      action={
        <>
          <Button
            size="small"
            color="inherit"
            onClick={onReject}
            sx={{ color: "#fff" }}
          >
            Keep mine
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={onAccept}
            sx={{
              color: "#fff",
              borderColor: "rgba(255,255,255,0.5)",
              ml: 1,
            }}
          >
            Load
          </Button>
        </>
      }
    >
      Shared profile detected — load it?
    </Alert>
  </Collapse>
);
