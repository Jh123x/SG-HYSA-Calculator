import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RemoveIcon from "@mui/icons-material/Remove";
import type Profile from "../types/profile";

interface Props {
  open: boolean;
  currProfile: Profile;
  pendingProfile: Profile;
  onAccept: () => void;
  onReject: () => void;
}

interface FieldMeta {
  label: string;
  key: keyof Profile;
  isBoolean: boolean;
}

const FIELDS: FieldMeta[] = [
  { key: "Savings", label: "Savings", isBoolean: false },
  { key: "Age", label: "Age", isBoolean: false },
  { key: "Salary", label: "Salary", isBoolean: false },
  { key: "Spending", label: "Spending", isBoolean: false },
  { key: "Investment", label: "Investment", isBoolean: false },
  { key: "Insurance", label: "Insurance", isBoolean: false },
  { key: "GiroTransactions", label: "GIRO Txn", isBoolean: false },
  { key: "MonthlyAccIncrease", label: "Acc Increase", isBoolean: false },
  { key: "LoanInstallment", label: "Loan Install", isBoolean: false },
  { key: "OneTimeLoan", label: "One-time Loan", isBoolean: false },
  { key: "IsNTUCMember", label: "NTUC Member", isBoolean: true },
  { key: "ReferredCustomer", label: "Referred Customer", isBoolean: true },
  { key: "PayNowReceived", label: "PayNow Received", isBoolean: false },
  { key: "FXSpend", label: "FX Spend", isBoolean: false },
];

const fmtCurrency = (v: number): string =>
  v === 0 ? "$0" : `$${v.toLocaleString()}`;

const fmtValue = (v: Profile[keyof Profile], isBoolean: boolean): string => {
  if (isBoolean) return v ? "Yes" : "No";
  return fmtCurrency(v as number);
};

const diffIcon = (
  curr: Profile[keyof Profile],
  pending: Profile[keyof Profile],
  isBoolean: boolean,
) => {
  if (isBoolean) {
    if (curr === pending)
      return <RemoveIcon fontSize="inherit" sx={{ opacity: 0.4 }} />;
    return pending ? (
      <ArrowUpwardIcon fontSize="inherit" color="success" />
    ) : (
      <ArrowDownwardIcon fontSize="inherit" color="error" />
    );
  }
  const c = curr as number;
  const p = pending as number;
  if (c === p) return null;
  return p > c ? (
    <ArrowUpwardIcon fontSize="inherit" color="success" />
  ) : (
    <ArrowDownwardIcon fontSize="inherit" color="error" />
  );
};

const tableCellSx = {
  py: 0.6,
  px: 1.5,
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  fontSize: "0.82rem",
};

/**
 * Blocking modal shown when a shared profile URL would overwrite the
 * user's existing saved profile. Shows a field-by-field diff so the
 * user can decide whether to load the shared profile.
 */
export const SharedProfileDialog = ({
  open,
  currProfile,
  pendingProfile,
  onAccept,
  onReject,
}: Props) => {
  const diffs = FIELDS.filter(
    ({ key }) => currProfile[key] !== pendingProfile[key],
  );

  return (
    <Dialog open={open} onClose={onReject} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 0 }}>
        Shared Profile Detected
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          The shared profile has {diffs.length} field
          {diffs.length !== 1 ? "s" : ""} different from yours:
        </Typography>
        {diffs.length > 0 && (
          <Table size="small">
            <TableBody>
              {diffs.map(({ key, label, isBoolean }) => (
                <TableRow key={key}>
                  <TableCell sx={{ ...tableCellSx, fontWeight: 500 }}>
                    {label}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...tableCellSx,
                      textDecoration: "line-through",
                      opacity: 0.5,
                    }}
                  >
                    {fmtValue(currProfile[key], isBoolean)}
                  </TableCell>
                  <TableCell
                    sx={{ ...tableCellSx, width: 28, textAlign: "center" }}
                  >
                    {diffIcon(currProfile[key], pendingProfile[key], isBoolean)}
                  </TableCell>
                  <TableCell sx={{ ...tableCellSx, fontWeight: 600 }}>
                    {fmtValue(pendingProfile[key], isBoolean)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onReject} color="inherit">
          Keep Current
        </Button>
        <Button onClick={onAccept} variant="contained">
          Load Shared
        </Button>
      </DialogActions>
    </Dialog>
  );
};
