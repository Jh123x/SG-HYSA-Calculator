import { Container, Typography, Box, Button, Link as MuiLink, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useRef, useEffect } from "react";
import { sortedBlogPosts, getWordCount, getReadingTime } from "../data/blogPosts";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { bgColor, textColor, primaryColor } from "../consts/colors";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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

  // Group posts by year, sorted descending
  const years = new Map<number, typeof sortedBlogPosts>();
  for (const post of sortedBlogPosts) {
    const year = new Date(post.date).getFullYear();
    if (!years.has(year)) years.set(year, []);
    years.get(year)!.push(post);
  }
  const sortedYears = Array.from(years.keys()).sort((a, b) => b - a);

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
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            HYSA Blog
          </Typography>
          <Typography variant="body1" sx={{ color: textColor, opacity: 0.7 }}>
            Tips, guides, and comparisons about Singapore High Yield Savings Accounts.{" "}
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

        {/* Posts grouped by year */}
        {sortedYears.map((year) => (
          <Box key={year} sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5, color: primaryColor }}>
              {year}
            </Typography>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

            {years.get(year)!.map((post, idx) => {
              const wordCount = getWordCount(post.content);
              const readingTime = getReadingTime(wordCount);
              const wcStr = wordCount.toLocaleString("en-US");

              return (
                <Box key={post.slug} sx={{ mb: idx < years.get(year)!.length - 1 ? 3 : 0 }}>
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
                        color: textColor,
                        textDecoration: "none",
                        "&:hover": { color: primaryColor, textDecoration: "underline" },
                        transition: "color 0.2s",
                      }}
                    >
                      {post.title}
                    </MuiLink>
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: textColor, opacity: 0.5, mb: 1 }}
                  >
                    {formatDate(post.date)} &middot; {wcStr} words &middot; {readingTime} mins
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: textColor, opacity: 0.75, lineHeight: 1.6 }}
                  >
                    {post.excerpt}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        ))}

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
