import { Container, Typography, Box, Button, Chip, Link as MuiLink } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useRef, useEffect } from "react";
import { sortedBlogPosts } from "../data/blogPosts";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { bgColor, textColor, primaryColor } from "../consts/colors";

const blogListingStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "HYSA Blog — SG HYSA Calculator",
  description:
    "Tips, guides, and comparisons about Singapore High Yield Savings Accounts. Learn how to maximise your savings interest with expert analysis.",
  url: "https://hysa.jh123x.com/blog",
  blogPost: sortedBlogPosts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `https://hysa.jh123x.com/blog/${post.slug}`,
  })),
});

export const BlogIndexPage = () => {
  const navigate = useNavigate();
  const scriptRef = useRef<HTMLScriptElement>(null);
  useDocumentTitle("HYSA Blog — SG HYSA Calculator");

  useEffect(() => {
    if (scriptRef.current) {
      scriptRef.current.textContent = JSON.stringify(blogListingStructuredData());
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>HYSA Blog — SG HYSA Calculator</title>
        <meta
          name="description"
          content="Tips, guides, and comparisons about Singapore High Yield Savings Accounts. Learn how to maximise your savings interest with expert analysis."
        />
        <meta property="og:title" content="HYSA Blog — SG HYSA Calculator" />
        <meta
          property="og:description"
          content="Tips, guides, and comparisons about Singapore High Yield Savings Accounts. Learn how to maximise your savings interest with expert analysis."
        />
        <meta property="og:url" content="https://hysa.jh123x.com/blog" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://hysa.jh123x.com/blog" />
      </Helmet>

      <script ref={scriptRef} type="application/ld+json" />

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
            HYSA Blog
          </Typography>
          <Typography variant="body1" sx={{ color: textColor, opacity: 0.7 }}>
            Tips, guides, and comparisons about Singapore High Yield Savings Accounts.
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

        {/* Post list */}
        <Box component="section" aria-label="Blog posts">
          {sortedBlogPosts.map((post) => (
            <Box
              key={post.slug}
              sx={{
                mb: 3,
                p: 2.5,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "rgba(255,255,255,0.1)",
                "&:hover": {
                  borderColor: primaryColor,
                  backgroundColor: `${primaryColor}0d`,
                },
                transition: "border-color 0.2s, background-color 0.2s",
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                sx={{ fontWeight: 600, mb: 0.5 }}
              >
                <MuiLink
                  href={`/blog/${post.slug}`}
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    navigate(`/blog/${post.slug}`);
                  }}
                  sx={{
                    color: primaryColor,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {post.title}
                </MuiLink>
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ color: textColor, opacity: 0.5 }}
                >
                  {new Date(post.date).toLocaleDateString("en-SG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
                {post.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      color: primaryColor,
                      borderColor: primaryColor,
                      backgroundColor: `${primaryColor}18`,
                      fontWeight: 500,
                      fontSize: "0.7rem",
                    }}
                    variant="outlined"
                  />
                ))}
              </Box>

              <Typography
                variant="body2"
                sx={{ color: textColor, opacity: 0.75, lineHeight: 1.6 }}
              >
                {post.excerpt}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Bottom CTA */}
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

export default BlogIndexPage;
