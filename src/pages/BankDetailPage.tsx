import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LanguageIcon from "@mui/icons-material/Language";
import { LineChart } from "@mui/x-charts/LineChart";
import { textColor, bgColor, primaryColor, lineColors } from "../consts/colors";
import { bankInfo } from "../logic/constants";
import { slugToBankName, ERROR_SLUG } from "../logic/slugs";
import { resolveHistoryForChart } from "../logic/history";
import { formatDate } from "../logic/dates";
import type Profile from "../types/profile";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { jaroWinkler } from "../logic/fuzzyMatch";
import { dateFormatter } from "../consts/formatter";

interface BankDetailPageProps {
  profile: Profile;
}

/** Seconds before auto-redirecting to the suggested bank. */
const AUTO_REDIRECT_SECONDS = 5;

/**
 * Bank detail page at /bank/:slug.
 *
 * Desktop side-by-side: EIR chart (left) | History table + description (right)
 * Mobile: stacked vertically.
 */
export const BankDetailPage = ({ profile }: BankDetailPageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isNarrow = useMediaQuery("(max-width:900px)");
  const bankName = slug ? slugToBankName(slug) : ERROR_SLUG;

  // Closest-match suggestion when bank slug is unknown
  const [suggestion, setSuggestion] = useState<{
    bankName: string;
    slug: string;
  } | null>(null);
  const [countdown, setCountdown] = useState(AUTO_REDIRECT_SECONDS);

  useDocumentTitle(
    bankName !== ERROR_SLUG && bankInfo[slug ?? ""]
      ? `${bankInfo[slug ?? ""]!.name} Interest Rate History & EIR Trends`
      : "Bank Detail — SG HYSA Calculator",
  );

  /**
   * Navigate back one step in history. When the user arrived directly
   * (e.g. typed the URL, opened a bookmark, or followed a link from
   * another site), there is no prior history entry — redirect to the
   * homepage instead of leaving the user stranded.
   *
   * React Router assigns key="default" to the initial page load entry;
   * all in-app navigations get a unique generated key.
   */
  const handleBack = () => {
    if (location.key === "default") {
      navigate("/", { replace: true });
    } else {
      navigate(-1);
    }
  };

  // Unknown bank — find closest match (including home page) by Jaro-Winkler similarity
  useEffect(() => {
    if (bankName === ERROR_SLUG || !bankInfo[slug ?? ""]) {
      if (!slug) {
        navigate("/", { replace: true });
        return;
      }

      let bestSlug = "/";
      let bestName = "Home";
      let bestSimilarity = jaroWinkler(slug, "/");

      for (const [bankSlug, info] of Object.entries(bankInfo)) {
        const sim = jaroWinkler(slug, bankSlug);
        if (sim > bestSimilarity) {
          bestSimilarity = sim;
          bestSlug = bankSlug;
          bestName = info.name;
        }
      }

      setSuggestion({ bankName: bestName, slug: bestSlug });
      setCountdown(AUTO_REDIRECT_SECONDS);
    } else {
      setSuggestion(null);
    }
  }, [bankName, slug, navigate]);

  // Auto-redirect countdown when a suggestion is shown
  useEffect(() => {
    if (!suggestion) return;
    if (countdown <= 0) {
      navigate(suggestion.slug === "/" ? "/" : `/bank/${suggestion.slug}`, {
        replace: true,
      });
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [suggestion, countdown, navigate]);

  // Show "Did you mean?" suggestion when a close match exists
  if (suggestion) {
    const isHome = suggestion.slug === "/";

    return (
      <Box
        component="article"
        aria-label={isHome ? "Redirecting to home" : "Bank suggestion"}
        sx={{ mt: 3, textAlign: "center" }}
      >
        <Paper
          sx={{
            p: 4,
            borderRadius: "10px",
            backgroundColor: bgColor,
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: textColor, mb: 2, fontWeight: 600 }}
          >
            Bank not found
          </Typography>
          {isHome ? (
            <Typography variant="body1" sx={{ color: textColor, mb: 3 }}>
              The bank you&apos;re looking for could not be found. You will be
              redirected to the homepage.
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ color: textColor, mb: 3 }}>
              Did you mean{" "}
              <Link
                to={`/bank/${suggestion.slug}`}
                style={{ color: primaryColor, fontWeight: 600 }}
              >
                {suggestion.bankName}
              </Link>
              ?
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: textColor, opacity: 0.7 }}>
            Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (bankName === ERROR_SLUG || !bankInfo[slug ?? ""]) {
    return null;
  }

  const info = bankInfo[slug ?? ""];
  const resolved = resolveHistoryForChart(info.history, profile);

  // Build time-series dataset for EIR chart (sorted chronologically,
  // excluding TBD entries where date is epoch zero)
  const eirChartData = resolved
    .filter((r) => r.date.getTime() !== 0)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((r) => ({
      date: r.date,
      eir: r.eir,
    }));

  // Current date for display
  const todayStr = new Date().toLocaleDateString("en-SG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // ── EIR Chart ──────────────────────────────────────────────────────

  const renderChart = () => {
    if (eirChartData.length === 0) return null;

    return (
      <Paper
        component="section"
        aria-label="Interest rate trend chart"
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: "10px",
          backgroundColor: bgColor,
          height: "fit-content",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: textColor, fontWeight: 600 }}
          >
            Interest Rate Over Time
          </Typography>
          <Chip
            label={`Today: ${todayStr}`}
            size="small"
            variant="outlined"
            sx={{ color: textColor, borderColor: `${textColor}30` }}
          />
        </Box>
        <LineChart
          dataset={eirChartData}
          xAxis={[
            {
              dataKey: "date",
              label: "Date",
              scaleType: "time" as const,
              tickLabelStyle: {
                angle: 45,
                textAnchor: "start" as const,
                fontSize: 11,
              },
              valueFormatter: dateFormatter,
            },
          ]}
          series={[
            {
              dataKey: "eir",
              label: info.name,
              color: lineColors[0],
              showMark: true,
              curve: "stepAfter",
              valueFormatter: (v: number | null) =>
                v !== null ? `${v.toFixed(2)}%` : "",
            },
          ]}
          yAxis={[
            {
              label: "EIR (%)",
              scaleType: "linear",
              min: 0,
              valueFormatter: (v: number) => `${v.toFixed(1)}%`,
            },
          ]}
          height={isNarrow ? 300 : 340}
          grid={{ vertical: true, horizontal: true }}
          sx={{
            ".MuiChartsAxis-label": { fill: textColor },
            ".MuiChartsAxis-tick": { fill: textColor },
            ".MuiChartsLegend-label": { fill: textColor },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: textColor,
            display: "block",
            textAlign: "left",
            mt: 1,
            opacity: 0.6,
          }}
        >
          * Interest rate changes over time. EIR is calculated based on your
          current savings amount (${profile.Savings.toLocaleString()}).
          <br />
          ** The &ldquo;updated at&rdquo; date reflects when this calculator
          was updated, which may differ from the date the bank published the
          change.
        </Typography>
      </Paper>
    );
  };

  // ── Rate Change History (includes description + bank info) ────────

  const renderHistorySection = () => (
    <Paper
      component="section"
      aria-label="Rate change history and bank details"
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: "10px",
        backgroundColor: bgColor,
      }}
    >
      {/* Bank name + description merged into this section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ color: textColor, fontWeight: 700, mb: 0.5 }}
        >
          {info.name}
        </Typography>
        {info.url && (
          <Tooltip title="Visit official website">
            <IconButton
              href={info.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: primaryColor }}
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
        {resolved.length > 0 &&
          resolved[resolved.length - 1].date.getTime() !== 0 && (
            <Chip
              label={`Current EIR: ${resolved[resolved.length - 1].eir.toFixed(2)}%`}
              size="small"
              sx={{
                backgroundColor: primaryColor,
                color: "#fff",
                fontWeight: 600,
              }}
            />
          )}
        <Chip
          label={`${info.history.length} rate snapshot${info.history.length !== 1 ? "s" : ""}`}
          size="small"
          variant="outlined"
          sx={{ color: textColor, borderColor: `${textColor}30` }}
        />
      </Box>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{ color: textColor, opacity: 0.75, mb: 2.5 }}
      >
        {info.remarks}
      </Typography>

      {/* Rate change history table */}
      <Typography
        variant="h6"
        sx={{ color: textColor, fontWeight: 600, mb: 1.5 }}
      >
        Rate Change History
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: textColor, fontWeight: 600 }}>
                Date
              </TableCell>
              <TableCell sx={{ color: textColor, fontWeight: 600 }}>
                What Changed
              </TableCell>
              <TableCell
                sx={{ color: textColor, fontWeight: 600, textAlign: "right" }}
              >
                Yearly Interest
              </TableCell>
              <TableCell
                sx={{ color: textColor, fontWeight: 600, textAlign: "right" }}
              >
                EIR
              </TableCell>
              <TableCell
                sx={{
                  color: textColor,
                  fontWeight: 600,
                  width: 60,
                  textAlign: "center",
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resolved
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((snapshot, idx) => {
                const isTbd = snapshot.date.getTime() === 0;
                return (
                  <TableRow key={idx}>
                    <TableCell sx={{ color: textColor }}>
                      {isTbd ? "TBD" : formatDate(snapshot.date)}
                    </TableCell>
                    <TableCell sx={{ color: textColor }}>
                      {snapshot.changeSummary}
                    </TableCell>
                    <TableCell sx={{ color: textColor, textAlign: "right" }}>
                      {isTbd ? "—" : `$${snapshot.yearlyInterest.toFixed(2)}`}
                    </TableCell>
                    <TableCell sx={{ color: textColor, textAlign: "right" }}>
                      {isTbd ? "—" : `${snapshot.eir.toFixed(2)}%`}
                    </TableCell>
                    <TableCell
                      sx={{ color: textColor, textAlign: "center", p: 0.5 }}
                    >
                      {snapshot.sourceUrl && (
                        <Tooltip title="Visit source page">
                          <IconButton
                            size="small"
                            href={snapshot.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: primaryColor }}
                          >
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  return (
    <Box
      component="article"
      aria-label={`${info.name} interest rate details`}
      sx={{ mt: 1 }}
    >
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{
          color: textColor,
          mb: 2,
          textTransform: "none",
          "&:hover": { color: primaryColor },
        }}
      >
        Back
      </Button>

      {/* ── Side-by-side: chart (left) | history + description (right) ── */}
      {isNarrow ? (
        /* Mobile: stacked */
        <>
          {renderChart()}
          <Box sx={{ mt: 3 }}>{renderHistorySection()}</Box>
        </>
      ) : (
        /* Desktop: side by side */
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: "0 0 48%", minWidth: 0 }}>
            {renderChart()}
          </Box>
          <Box sx={{ flex: "1 1 52%", minWidth: 0 }}>
            {renderHistorySection()}
          </Box>
        </Box>
      )}
    </Box>
  );
};
