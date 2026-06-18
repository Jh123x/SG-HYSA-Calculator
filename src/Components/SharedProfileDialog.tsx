import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface Props {
  open: boolean;
  onAccept: () => void;
  onReject: () => void;
}

/**
 * Confirmation dialog shown when a shared profile URL would overwrite
 * the user's existing saved profile.
 */
export const SharedProfileDialog = ({ open, onAccept, onReject }: Props) => (
  <Dialog open={open} onClose={onReject} aria-labelledby="shared-profile-dialog">
    <DialogTitle id="shared-profile-dialog">
      Shared profile detected
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        This link contains a shared profile. Loading it will replace your
        current saved inputs. Do you want to load the shared profile?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onReject} color="inherit">
        Keep my profile
      </Button>
      <Button onClick={onAccept} variant="contained" autoFocus>
        Load shared profile
      </Button>
    </DialogActions>
  </Dialog>
);
