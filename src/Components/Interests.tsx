import { type ReactElement, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableSortLabel,
} from "@mui/material";
import type { ResultProp } from "../types/props";
import { primaryColor, bgColor, textColor } from "../consts/colors";
import type Profile from "../types/profile";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory } from "../logic/history";
import { InterestGraph } from "./InterestGraph";
import { LocalLink } from "./LocalLink";

type SortableColumns =
  | "name"
  | "yearlyInterest"
  | "effectiveInterest"
  | undefined;

/** Shared styling for all data table cells */
const cellSx = {
  color: textColor,
  backgroundColor: bgColor,
  padding: "10px 15px",
};

export const Result = ({ profile }: { profile: Profile }) => {
  const [orderBy, setOrderBy] = useState<SortableColumns>(undefined);
  const [order, setOrder] = useState<"asc" | "desc" | undefined>("desc");

  const results: Record<string, ResultProp> = {};
  for (const [name, info] of Object.entries(bankInfo)) {
    const { interestFn, lastUpdated } = deriveCurrentFromHistory(info.history);
    results[name] = {
      interest: interestFn(profile),
      url: info.url,
      remarks: info.remarks,
      lastUpdated,
    };
  }

  const handleSort = (column: SortableColumns) => {
    if (orderBy === column) {
      const nextOrder =
        order === "asc" ? "desc" : order === "desc" ? undefined : "asc";
      setOrder(nextOrder);
      if (nextOrder === undefined) setOrderBy(undefined);
      return;
    }
    setOrderBy(column);
    setOrder("asc");
  };

  const sortedResults = Object.entries(results).sort((a, b) => {
    switch (orderBy) {
      case "name":
        return order === "asc"
          ? a[0].localeCompare(b[0])
          : b[0].localeCompare(a[0]);
      case "yearlyInterest":
        return order === "asc"
          ? a[1].interest.toYearly() - b[1].interest.toYearly()
          : b[1].interest.toYearly() - a[1].interest.toYearly();
      case "effectiveInterest":
        return order === "asc"
          ? a[1].interest.toYearlyPercent() - b[1].interest.toYearlyPercent()
          : b[1].interest.toYearlyPercent() - a[1].interest.toYearlyPercent();
      default:
        return 0;
    }
  });

  const sortIconSx = { "& .MuiTableSortLabel-icon": { color: `${textColor} !important` } };

  return (
    <Container
      sx={{
        color: primaryColor,
        width: "100%",
        maxWidth: "100%",
        padding: "20px",
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "10px",
          overflow: "auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                color: textColor,
                backgroundColor: bgColor,
                "&:hover": { backgroundColor: bgColor },
              }}
            >
              <TableCell sx={{ ...cellSx, cursor: "pointer" }}>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleSort("name")}
                  sx={sortIconSx}
                >
                  Account Name
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ ...cellSx, cursor: "pointer" }}>
                <TableSortLabel
                  active={orderBy === "yearlyInterest"}
                  direction={orderBy === "yearlyInterest" ? order : "asc"}
                  onClick={() => handleSort("yearlyInterest")}
                  sx={sortIconSx}
                >
                  Yearly Interest
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ ...cellSx, cursor: "pointer" }}>
                <TableSortLabel
                  active={orderBy === "effectiveInterest"}
                  direction={orderBy === "effectiveInterest" ? order : "asc"}
                  onClick={() => handleSort("effectiveInterest")}
                  sx={sortIconSx}
                >
                  Effective Interest
                  <br />
                  Rate (EIR)
                </TableSortLabel>
              </TableCell>
              <TableCell sx={cellSx}>Webpage</TableCell>
              <TableCell sx={cellSx}>Remarks</TableCell>
              <TableCell sx={cellSx}>Updated at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedResults.map(([bankName, interest]) =>
              displayResult(bankName, interest),
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography
        variant="caption"
        sx={{
          color: textColor,
          margin: "10px 0px",
          display: "block",
          textAlign: "left",
        }}
      >
        * Interest rates on their respective websites are subject to change
        without notice
        <br />
        ** Please do your own research before making any decisions, the numbers
        here serve as a guide.
        <br />
        *** Please ask around in your friend group for referrals to get
        additional bonuses, you can use the my referral code if your friends do
        not have any.
      </Typography>
      <InterestGraph profile={profile} />
    </Container>
  );
};

const displayResult = (bankName: string, info: ResultProp) => (
  <TableRow
    key={bankName}
    sx={{
      color: textColor,
      backgroundColor: bgColor,
      "&:hover": { backgroundColor: primaryColor, opacity: 0.1 },
    }}
  >
    <TableCell sx={cellSx}>{bankName}</TableCell>
    <TableCell sx={cellSx}>
      ${info.interest.toYearly().toFixed(2) ?? "0"}
    </TableCell>
    <TableCell sx={cellSx}>
      {info.interest.toYearlyPercent().toFixed(2) ?? "0"}%
    </TableCell>
    <TableCell sx={cellSx}>
      <LocalLink href={info.url}>Website</LocalLink>
    </TableCell>
    <TableCell sx={cellSx}>{info.remarks}</TableCell>
    <TableCell sx={cellSx}>{info.lastUpdated}</TableCell>
  </TableRow>
);
