import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ACCORDION_FAQ, FULL_FAQ } from "../data/faq";
import { primaryColor, bgColor, textColor } from "../consts/colors";

const accordionSx = {
  backgroundColor: bgColor,
  color: textColor,
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px !important",
  mb: 1,
  "&:before": { display: "none" },
  "&.Mui-expanded": {
    margin: "0 0 8px 0",
  },
};

const summarySx = {
  "& .MuiAccordionSummary-content": {
    fontWeight: 500,
  },
};

export const FaqAccordion = () => {
  const navigate = useNavigate();

  return (
    <Box component="section" aria-label="Frequently asked questions" sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ color: textColor, mb: 2, fontWeight: 600 }}
      >
        Frequently Asked Questions
      </Typography>

      {ACCORDION_FAQ.map((item) => (
        <Accordion key={item.question} sx={accordionSx}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: primaryColor }} />}
            sx={summarySx}
          >
            {item.question}
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ color: textColor, opacity: 0.85 }}>
              {item.answer}
            </Typography>
            {item.sources.length > 0 && (
              <Box component="details" sx={{ mt: 1.5, fontSize: "0.82rem" }}>
                <Box
                  component="summary"
                  sx={{
                    color: primaryColor,
                    cursor: "pointer",
                    fontWeight: 500,
                    "&:hover": { opacity: 0.8 },
                  }}
                >
                  {item.sources.length} source{item.sources.length > 1 ? "s" : ""}
                </Box>
                <Box component="ul" sx={{ mt: 0.5, pl: 2.5, mb: 0 }}>
                  {item.sources.map((src, i) => (
                    <Box component="li" key={i} sx={{ mb: 0.5 }}>
                      <Link
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: primaryColor,
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {src.label}
                      </Link>
                      <Typography
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
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="outlined"
          endIcon={<OpenInNewIcon />}
          onClick={() => navigate("/faq")}
          sx={{
            borderColor: primaryColor,
            color: primaryColor,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              borderColor: primaryColor,
              backgroundColor: "rgba(149, 80, 255, 0.08)",
            },
          }}
        >
          See all {FULL_FAQ.length} FAQs
        </Button>
      </Box>
    </Box>
  );
};
