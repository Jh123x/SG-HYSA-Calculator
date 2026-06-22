import { Container, Typography, Box, Link as MuiLink, Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { FULL_FAQ } from "../data/faq";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useMobile } from "../hooks/useMobile";
import { bgColor, textColor, primaryColor } from "../consts/colors";
import { FaqToc, questionId } from "../Components/FaqToc";
import type { FaqEntry } from "../data/faq";

/**
 * FAQPage structured data — visible Q&A that Google can surface as rich results.
 * https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
function faqStructuredData(): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FULL_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

const questionSx = {
  color: textColor,
  fontWeight: 600,
  mb: 0.5,
  pt: 3,
  pb: 0,
};

const answerSx = {
  color: textColor,
  opacity: 0.85,
  mb: 1,
  lineHeight: 1.7,
};

const sourceLinkSx = {
  color: primaryColor,
  textDecoration: "none",
  fontWeight: 500,
  "&:hover": { textDecoration: "underline" },
};

/** Shared display for a single FAQ entry with scroll anchor. */
const FaqEntrySection = ({ entry }: { entry: FaqEntry }) => (
  <Box
    id={questionId(entry.question)}
    sx={{ scrollMarginTop: { xs: 16, sm: 24 } }}
  >
    <Typography variant="h6" component="h2" sx={questionSx}>
      {entry.question}
    </Typography>
    <Typography variant="body1" sx={answerSx}>
      {entry.answer}
    </Typography>

    {/* Sources */}
    {entry.sources.length > 0 && (
      <Box
        sx={{
          borderLeft: "2px solid",
          borderColor: primaryColor,
          pl: 2,
          mb: 1.5,
          opacity: 0.85,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: textColor,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "block",
            mb: 0.5,
          }}
        >
          Sources
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
          {entry.sources.map((src, i) => (
            <Box component="li" key={i} sx={{ mb: 0.5 }}>
              <MuiLink
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={sourceLinkSx}
              >
                {src.label}
                <OpenInNewIcon
                  sx={{ fontSize: "0.75rem", ml: 0.3, verticalAlign: "middle" }}
                />
              </MuiLink>
              <Typography
                variant="caption"
                component="span"
                sx={{ color: textColor, opacity: 0.55, ml: 0.5 }}
              >
                — {src.confirms}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    )}

    {/* Further Reading */}
    {entry.furtherReading && entry.furtherReading.length > 0 && (
      <Box
        sx={{
          borderLeft: "2px solid",
          borderColor: "rgba(255,255,255,0.15)",
          pl: 2,
          mb: 2,
          opacity: 0.8,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: textColor,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "block",
            mb: 0.5,
          }}
        >
          Further Reading
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
          {entry.furtherReading.map((src, i) => (
            <Box component="li" key={i} sx={{ mb: 0.5 }}>
              <MuiLink
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={sourceLinkSx}
              >
                {src.label}
                <OpenInNewIcon
                  sx={{ fontSize: "0.75rem", ml: 0.3, verticalAlign: "middle" }}
                />
              </MuiLink>
              <Typography
                variant="caption"
                component="span"
                sx={{ color: textColor, opacity: 0.55, ml: 0.5 }}
              >
                — {src.confirms}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    )}
  </Box>
);

/** Renders the full list of FAQ entries with scroll anchors. */
const FaqContent = ({ entries }: { entries: FaqEntry[] }) => (
  <Box component="section" aria-label="FAQ list">
    {entries.map((entry) => (
      <FaqEntrySection key={entry.question} entry={entry} />
    ))}
  </Box>
);

export const FaqPage = () => {
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  useDocumentTitle("FAQ — SG HYSA Calculator");

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData()),
        }}
      />

      <Container
        sx={{
          color: textColor,
          backgroundColor: bgColor,
          maxWidth: "1100px !important",
          py: 3,
        }}
      >
        {/* Page header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" sx={{ color: textColor, opacity: 0.7 }}>
            Everything you need to know about High Yield Savings Accounts in Singapore.
            {" "}
            <Button
              onClick={() => navigate("/")}
              startIcon={<ArrowBackIcon />}
              size="small"
              sx={{
                color: primaryColor,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: `${primaryColor}18` },
              }}
            >
              Back to calculator
            </Button>
          </Typography>
        </Box>

        {/* Two-column layout: TOC sidebar + content */}
        {isMobile ? (
          <>
            <FaqToc entries={FULL_FAQ} />
            <FaqContent entries={FULL_FAQ} />
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: 4,
              alignItems: "flex-start",
            }}
          >
            <FaqToc entries={FULL_FAQ} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <FaqContent entries={FULL_FAQ} />
            </Box>
          </Box>
        )}

        {/* Bottom CTA back to calculator */}
        <Box sx={{ textAlign: "center", mt: 4, mb: 2 }}>
          <Button
            onClick={() => navigate("/")}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="large"
            sx={{
              color: primaryColor,
              borderColor: primaryColor,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: `${primaryColor}18`,
                borderColor: primaryColor,
              },
            }}
          >
            Back to calculator
          </Button>
        </Box>
      </Container>
    </>
  );
};
