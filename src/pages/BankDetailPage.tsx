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
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LanguageIcon from "@mui/icons-material/Language";
import { LineChart } from "@mui/x-charts/LineChart";
import { textColor, bgColor, primaryColor, lineColors } from "../consts/colors";
import { ThreePanelLayout } from "../Components/ThreePanelLayout";
import { bankInfo } from "../logic/constants";
import { slugToBankName, ERROR_SLUG } from "../logic/slugs";
import { resolveHistoryForChart, deriveCurrentFromHistory } from "../logic/history";
import { formatDate } from "../logic/dates";
import type Profile from "../types/profile";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useMobile } from "../hooks/useMobile";
import { jaroWinkler } from "../logic/fuzzyMatch";
import { dateFormatter } from "../consts/formatter";

interface BankDetailPageProps {
  profile: Profile;
}

const AUTO_REDIRECT_SECONDS = 5;
type ChartMode = "yearly" | "eir";

const TOGGLE_SX = {
  color: textColor,
  borderColor: `${textColor}40`,
  textTransform: "none" as const,
  fontSize: "0.8rem",
  "&.Mui-selected": { color: "#fff", backgroundColor: primaryColor },
  "&.Mui-selected:hover": { backgroundColor: primaryColor, opacity: 0.9 },
  "&:hover": { backgroundColor: `${primaryColor}18`, borderColor: primaryColor },
};

/**
 * Bank detail page at /bank/:slug.
 * Desktop side-by-side: chart (left) | history + description (right).
 * Chart supports Yearly Interest ($) or EIR (%) toggle.
 */
export const BankDetailPage = ({ profile }: BankDetailPageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useMobile();
  const bankName = slug ? slugToBankName(slug) : ERROR_SLUG;
  const [chartMode, setChartMode] = useState<ChartMode>("eir");

  // Closest-match suggestion when bank slug is unknown
  const [suggestion, setSuggestion] = useState<{ bankName: string; slug: string } | null>(null);
  const [countdown, setCountdown] = useState(AUTO_REDIRECT_SECONDS);

  useDocumentTitle(
    bankName !== ERROR_SLUG && bankInfo[slug ?? ""]
      ? `${bankInfo[slug ?? ""]!.name} Interest Rate History & EIR Trends`
      : "Bank Detail — SG HYSA Calculator",
  );

  const handleBack = () => {
    if (location.key === "default") navigate("/", { replace: true });
    else navigate(-1);
  };

  // Unknown bank — find closest match
  useEffect(() => {
    if (bankName === ERROR_SLUG || !bankInfo[slug ?? ""]) {
      if (!slug) { navigate("/", { replace: true }); return; }
      let bestSlug = "/", bestName = "Home", bestSimilarity = jaroWinkler(slug, "/");
      for (const [bankSlug, info] of Object.entries(bankInfo)) {
        const sim = jaroWinkler(slug, bankSlug);
        if (sim > bestSimilarity) { bestSimilarity = sim; bestSlug = bankSlug; bestName = info.name; }
      }
      setSuggestion({ bankName: bestName, slug: bestSlug });
      setCountdown(AUTO_REDIRECT_SECONDS);
    } else {
      setSuggestion(null);
    }
  }, [bankName, slug, navigate]);

  // Auto-redirect countdown
  useEffect(() => {
    if (!suggestion) return;
    if (countdown <= 0) { navigate(suggestion.slug === "/" ? "/" : `/bank/${suggestion.slug}`, { replace: true }); return; }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [suggestion, countdown, navigate]);

  if (suggestion) {
    const isHome = suggestion.slug === "/";
    return (
      <Box component="article" aria-label={isHome ? "Redirecting to home" : "Bank suggestion"} sx={{ mt: 3, textAlign: "center" }}>
        <Paper sx={{ p: 4, borderRadius: "10px", backgroundColor: bgColor }}>
          <Typography variant="h5" sx={{ color: textColor, mb: 2, fontWeight: 600 }}>Bank not found</Typography>
          {isHome ? (
            <Typography variant="body1" sx={{ color: textColor, mb: 3 }}>The bank you&apos;re looking for could not be found. You will be redirected to the homepage.</Typography>
          ) : (
            <Typography variant="body1" sx={{ color: textColor, mb: 3 }}>
              Did you mean <Link to={`/bank/${suggestion.slug}`} style={{ color: primaryColor, fontWeight: 600 }}>{suggestion.bankName}</Link>?
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: textColor, opacity: 0.7 }}>Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...</Typography>
        </Paper>
      </Box>
    );
  }

  if (bankName === ERROR_SLUG || !bankInfo[slug ?? ""]) return null;

  const info = bankInfo[slug ?? ""];
  const resolved = resolveHistoryForChart(info.history, profile);

  // Build chart datasets
  const chartData = resolved
    .filter((r) => r.date.getTime() !== 0)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((r) => ({
      date: r.date,
      yearlyInterest: r.yearlyInterest,
      eir: r.eir,
    }));

  // Add today's point
  const { interestFn: latestFn } = deriveCurrentFromHistory(info.history);
  const todayVal = latestFn(profile);
  chartData.push({
    date: new Date(),
    yearlyInterest: todayVal.toYearly(),
    eir: todayVal.toYearlyPercent(),
  });

  const d = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const todayStr = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  const isYearly = chartMode === "yearly";
  const dataKey = isYearly ? "yearlyInterest" : "eir";
  const yLabel = isYearly ? "Yearly Interest ($)" : "EIR (%)";
  const yFormatter = isYearly
    ? (v: number) => `$${v.toFixed(0)}`
    : (v: number) => `${v.toFixed(2)}%`;

  const renderChart = () => {
    if (chartData.length === 0) return null;
    return (
      <Paper
        component="section"
        aria-label="Interest rate trend chart"
        sx={{
          p: 2,
          borderRadius: "10px",
          backgroundColor: bgColor,
          height: "40vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
          <ToggleButtonGroup value={chartMode} exclusive onChange={(_e, v) => v && setChartMode(v)} size="small">
            <ToggleButton value="yearly" sx={TOGGLE_SX}>Yearly $</ToggleButton>
            <ToggleButton value="eir" sx={TOGGLE_SX}>EIR (%)</ToggleButton>
          </ToggleButtonGroup>
          <Chip label={`Today: ${todayStr}`} size="small" variant="outlined" sx={{ color: textColor, borderColor: `${textColor}30` }} />
        </Box>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <LineChart
            dataset={chartData}
            xAxis={[{ dataKey: "date", label: "Date", scaleType: "time" as const, tickLabelStyle: { angle: 45, textAnchor: "start" as const, fontSize: 11 }, valueFormatter: dateFormatter }]}
            series={[{ dataKey, label: info.name, color: lineColors[0], showMark: true, curve: "stepAfter", valueFormatter: (v: number | null) => v !== null ? (isYearly ? `$${v.toFixed(2)}` : `${v.toFixed(2)}%`) : "" }]}
            yAxis={[{ label: yLabel, scaleType: "linear", min: 0, valueFormatter: yFormatter }]}
            height={isMobile ? 300 : undefined}
            grid={{ vertical: true, horizontal: true }}
            sx={{ ".MuiChartsAxis-label": { fill: textColor }, ".MuiChartsAxis-tick": { fill: textColor }, ".MuiChartsLegend-label": { fill: textColor }, "& .MuiChartsSurface-root": { background: "transparent" }, width: "100%", ...(isMobile ? {} : { height: "100%" }) }}
          />
        </Box>
        <Typography variant="caption" sx={{ color: textColor, display: "block", textAlign: "left", mt: 1, opacity: 0.6 }}>
          * Interest rate changes over time. EIR is calculated based on your current savings amount (${profile.Savings.toLocaleString()}).
          <br />
          ** The &ldquo;updated at&rdquo; date reflects when this calculator was updated, which may differ from the date the bank published the change.
        </Typography>
      </Paper>
    );
  };

  const renderHistorySection = () => (
    <Paper component="section" aria-label="Rate change history and bank details" sx={{ p: 2, borderRadius: "10px", backgroundColor: bgColor }}>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ color: textColor, textTransform: "none", mb: 1.5, "&:hover": { color: primaryColor } }}>Back</Button>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1 }}>
        <Typography variant="h5" component="h2" sx={{ color: textColor, fontWeight: 700, mb: 0.5 }}>{info.name}</Typography>
        {info.url && (
          <Tooltip title="Visit official website">
            <IconButton href={info.url} target="_blank" rel="noopener noreferrer" sx={{ color: primaryColor }}><LanguageIcon /></IconButton>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
        {resolved.length > 0 && resolved[resolved.length - 1].date.getTime() !== 0 && (
          <Chip label={`Current EIR: ${resolved[resolved.length - 1].eir.toFixed(2)}%`} size="small" sx={{ backgroundColor: primaryColor, color: "#fff", fontWeight: 600 }} />
        )}
        <Chip label={`${info.history.length} rate snapshot${info.history.length !== 1 ? "s" : ""}`} size="small" variant="outlined" sx={{ color: textColor, borderColor: `${textColor}30` }} />
      </Box>

      <Typography variant="body2" sx={{ color: textColor, opacity: 0.75, mb: 1.5 }}>{info.remarks}</Typography>

      <Typography variant="h6" sx={{ color: textColor, fontWeight: 600, mb: 1 }}>Rate Change History</Typography>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: textColor, fontWeight: 600, backgroundColor: bgColor }}>Date</TableCell>
              <TableCell sx={{ color: textColor, fontWeight: 600, backgroundColor: bgColor }}>What Changed</TableCell>
              <TableCell sx={{ color: textColor, fontWeight: 600, textAlign: "right", backgroundColor: bgColor }}>Yearly Interest</TableCell>
              <TableCell sx={{ color: textColor, fontWeight: 600, textAlign: "right", backgroundColor: bgColor }}>EIR</TableCell>
              <TableCell sx={{ color: textColor, fontWeight: 600, width: 60, textAlign: "center", backgroundColor: bgColor }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resolved.sort((a, b) => b.date.getTime() - a.date.getTime()).map((snapshot, idx) => {
              const isTbd = snapshot.date.getTime() === 0;
              return (
                <TableRow key={idx}>
                  <TableCell sx={{ color: textColor }}>{isTbd ? "TBD" : formatDate(snapshot.date)}</TableCell>
                  <TableCell sx={{ color: textColor }}>{snapshot.changeSummary}</TableCell>
                  <TableCell sx={{ color: textColor, textAlign: "right" }}>{isTbd ? "—" : `$${snapshot.yearlyInterest.toFixed(2)}`}</TableCell>
                  <TableCell sx={{ color: textColor, textAlign: "right" }}>{isTbd ? "—" : `${snapshot.eir.toFixed(2)}%`}</TableCell>
                  <TableCell sx={{ color: textColor, textAlign: "center", p: 0.5 }}>
                    {snapshot.sourceUrl && (
                      <Tooltip title="Visit source page">
                        <IconButton size="small" href={snapshot.sourceUrl} target="_blank" rel="noopener noreferrer" sx={{ color: primaryColor }}><OpenInNewIcon fontSize="small" /></IconButton>
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
    <Box component="article" aria-label={`${info.name} interest rate details`} sx={{ height: isMobile ? undefined : "100%", overflow: isMobile ? undefined : "hidden" }}>
      <ThreePanelLayout
        bottomLeft={renderChart()}
        bottomRight={renderHistorySection()}
      />
    </Box>
  );
};
