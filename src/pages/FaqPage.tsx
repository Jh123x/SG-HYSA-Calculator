import { Container, Typography, Box, Link as MuiLink } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";
import { FULL_FAQ } from "../data/faq";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { bgColor, textColor, primaryColor } from "../consts/colors";

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

export const FaqPage = () => {
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
          maxWidth: "800px !important",
          py: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" sx={{ color: textColor, opacity: 0.7, mb: 3 }}>
          Everything you need to know about High Yield Savings Accounts in Singapore.
          {" "}
          <MuiLink
            component={Link}
            to="/"
            sx={{ color: primaryColor, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            Back to calculator →
          </MuiLink>
        </Typography>

        <Box component="section" aria-label="FAQ list">
          {FULL_FAQ.map((item) => (
            <Box key={item.question}>
              <Typography variant="h6" component="h2" sx={questionSx}>
                {item.question}
              </Typography>
              <Typography variant="body1" sx={answerSx}>
                {item.answer}
              </Typography>

              {/* Sources */}
              {item.sources.length > 0 && (
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
                    {item.sources.map((src, i) => (
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
              {item.furtherReading && item.furtherReading.length > 0 && (
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
                    {item.furtherReading.map((src, i) => (
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
          ))}
        </Box>

        {/* Bottom CTA back to calculator */}
        <Box sx={{ textAlign: "center", mt: 4, mb: 2 }}>
          <MuiLink
            component={Link}
            to="/"
            sx={{
              color: primaryColor,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1.1rem",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            ← Back to the calculator
          </MuiLink>
        </Box>
      </Container>
    </>
  );
};
