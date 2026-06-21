import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
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
  alpha,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link, ArrowForward } from "@mui/icons-material";
import type { ResultProp } from "../types/props";
import { primaryColor, bgColor, textColor } from "../consts/colors";
import type Profile from "../types/profile";
import { bankInfo } from "../logic/constants";
import { deriveCurrentFromHistory } from "../logic/history";
import { InterestGraph } from "../Components/InterestGraph";
import { FaqAccordion } from "../Components/FaqAccordion";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ThemeButton } from "../Components/ThemeButton";

type SortableColumns = "name" | "yearlyInterest" | "effectiveInterest";

const cellSx = {
  color: textColor,
  backgroundColor: bgColor,
  padding: "10px 15px",
};

interface Props {
  profile: Profile;
}

/**
 * Current Rates tab — sortable table of all banks with their current EIR.
 * Actions column provides links to the official website and bank detail page.
 */
export const CurrentRatesTab = ({ profile }: Props) => {
  const navigate = useNavigate();
  const [orderBy, setOrderBy] = useState<SortableColumns | undefined>(
    undefined,
  );
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  useDocumentTitle(
    "Compare Singapore High Yield Savings Accounts — Current Rates",
  );

  const results: Record<string, ResultProp> = {};
  for (const [slug, info] of Object.entries(bankInfo)) {
    const { interestFn, lastUpdated } = deriveCurrentFromHistory(info.history);
    results[slug] = {
      interest: interestFn(profile),
      url: info.url,
      remarks: info.remarks,
      lastUpdated,
    };
  }

  const handleSort = (column: SortableColumns) => {
    if (orderBy === column) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(column);
      setOrder("asc");
    }
  };

  const sortedResults = Object.entries(results).sort((a, b) => {
    switch (orderBy) {
      case "name":
        return order === "asc"
          ? (bankInfo[a[0]]?.name ?? a[0]).localeCompare(
              bankInfo[b[0]]?.name ?? b[0],
            )
          : (bankInfo[b[0]]?.name ?? b[0]).localeCompare(
              bankInfo[a[0]]?.name ?? a[0],
            );
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

  const sortIconSx = {
    "& .MuiTableSortLabel-icon": { color: `${textColor} !important` },
  };

  return (
    <Container
      sx={{
        color: primaryColor,
        width: "100%",
        maxWidth: "100%",
        padding: "20px",
      }}
    >
      <Box component="section" aria-label="Current interest rates comparison">
        <Typography
          variant="h5"
          component="h2"
          sx={{ color: textColor, mb: 2, fontWeight: 600 }}
        >
          Compare Singapore High Yield Savings Accounts
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "10px",
            overflow: "auto",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Table aria-label="High yield savings account interest rate comparison table">
            <TableHead>
              <TableRow
                sx={{
                  color: textColor,
                  backgroundColor: bgColor,
                  "&:hover": { backgroundColor: bgColor },
                }}
              >
                <TableCell
                  sx={{
                    ...cellSx,
                    cursor: "pointer",
                    "&:hover": { backgroundColor: primaryColor },
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleSort("name")}
                    sx={sortIconSx}
                  >
                    Account Name
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    ...cellSx,
                    cursor: "pointer",
                    "&:hover": { backgroundColor: primaryColor },
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "yearlyInterest"}
                    direction={orderBy === "yearlyInterest" ? order : "asc"}
                    onClick={() => handleSort("yearlyInterest")}
                    sx={sortIconSx}
                  >
                    Yearly Interest
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    ...cellSx,
                    cursor: "pointer",
                    "&:hover": { backgroundColor: primaryColor },
                    transition: "background-color 0.3s ease",
                  }}
                >
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
                <TableCell sx={cellSx}>Remarks</TableCell>
                <TableCell sx={cellSx}>Updated at</TableCell>
                <TableCell sx={cellSx}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedResults.map(([slug, interest]) => (
                <TableRow
                  key={slug}
                  sx={{
                    color: textColor,
                    backgroundColor: bgColor,
                    "&:hover": { backgroundColor: alpha(primaryColor, 0.1) },
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                    {bankInfo[slug]?.name ?? slug}
                  </TableCell>
                  <TableCell sx={cellSx}>
                    ${(interest.interest.toYearly() ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell sx={cellSx}>
                    {(interest.interest.toYearlyPercent() ?? 0).toFixed(2)}%
                  </TableCell>
                  <TableCell sx={cellSx}>{interest.remarks}</TableCell>
                  <TableCell sx={cellSx}>{interest.lastUpdated}</TableCell>
                  <TableCell sx={cellSx}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "center",
                      }}
                    >
                      <ThemeButton
                        size="small"
                        tooltip="Official Website"
                        aria-label={`Visit ${bankInfo[slug]?.name ?? slug} official website`}
                        href={interest.url}
                      >
                        <Link fontSize="small" />
                      </ThemeButton>
                      <ThemeButton
                        tooltip="Detailed History"
                        size="small"
                        aria-label={`View ${bankInfo[slug]?.name ?? slug} rate history`}
                        onClick={() => navigate(`/bank/${slug}`)}
                      >
                        <ArrowForward fontSize="small" />
                      </ThemeButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <InterestGraph profile={profile} />

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

      <FaqAccordion />
    </Container>
  );
};
