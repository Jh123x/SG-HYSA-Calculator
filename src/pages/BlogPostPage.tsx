import { Container, Typography, Box, Button, Chip, Link as MuiLink, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { blogPosts } from "../data/blogPosts";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { bgColor, textColor, primaryColor } from "../consts/colors";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function blogPostStructuredData(
  slug: string,
  title: string,
  excerpt: string,
  date: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    datePublished: date,
    author: {
      "@type": "Organization",
      name: "SG HYSA Calculator",
      url: "https://hysa.jh123x.com",
    },
    url: `https://hysa.jh123x.com/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://hysa.jh123x.com/blog/${slug}`,
    },
  };
}

export const BlogPostPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const scriptRef = useRef<HTMLScriptElement>(null);
  const post = blogPosts.find((p) => p.slug === slug);

  useDocumentTitle(post ? `${post.title} — SG HYSA Calculator` : "Post Not Found");

  useEffect(() => {
    if (scriptRef.current && post) {
      scriptRef.current.textContent = JSON.stringify(
        blogPostStructuredData(post.slug, post.title, post.excerpt, post.date),
      );
    }
  }, [post?.slug, post?.title, post?.excerpt, post?.date]);

  if (!post) {
    return (
      <>
        <Helmet>
          <title>Post Not Found — SG HYSA Calculator</title>
          <meta name="description" content="The requested blog post could not be found." />
        </Helmet>
        <Container
          sx={{
            color: textColor,
            backgroundColor: bgColor,
            maxWidth: "1100px !important",
            py: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Post Not Found
          </Typography>
          <Typography variant="body1" sx={{ color: textColor, opacity: 0.7, mb: 3 }}>
            The blog post you're looking for doesn't exist or has been removed.
          </Typography>
          <Button
            onClick={() => navigate("/blog")}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="large"
            sx={{
              color: primaryColor,
              borderColor: primaryColor,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: `${primaryColor}18`,
                borderColor: primaryColor,
              },
            }}
          >
            Back to blog
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} — SG HYSA Calculator</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={`https://hysa.jh123x.com/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://hysa.jh123x.com/blog/${post.slug}`} />
      </Helmet>

      <script ref={scriptRef} type="application/ld+json" />

      <Container
        sx={{
          color: textColor,
          backgroundColor: bgColor,
          maxWidth: "800px !important",
          py: 3,
        }}
      >
        {/* Back link */}
        <Box sx={{ mb: 3 }}>
          <Button
            onClick={() => navigate("/blog")}
            startIcon={<ArrowBackIcon />}
            size="small"
            sx={{
              color: primaryColor,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: `${primaryColor}18` },
            }}
          >
            Back to blog
          </Button>
        </Box>

        {/* Post header */}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1.5 }}>
          {post.title}
        </Typography>

        {/* Meta line */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, flexWrap: "wrap" }}>
          <Typography variant="body2" sx={{ color: textColor, opacity: 0.5 }}>
            {formatDate(post.date)}
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

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

        {/* Post content */}
        <Box
          sx={{
            color: textColor,
            "& h2": {
              fontWeight: 600,
              fontSize: "1.3rem",
              mt: 3,
              mb: 1.5,
            },
            "& h3": {
              fontWeight: 600,
              fontSize: "1.1rem",
              mt: 2.5,
              mb: 1,
            },
            "& p": {
              lineHeight: 1.8,
              mb: 1.5,
              opacity: 0.85,
            },
            "& ul, & ol": {
              pl: 2.5,
              mb: 1.5,
            },
            "& li": {
              lineHeight: 1.8,
              mb: 0.5,
              opacity: 0.85,
            },
            "& a": {
              color: primaryColor,
              textDecoration: "underline",
            },
            "& table": {
              width: "100%",
              borderCollapse: "collapse",
              mb: 2,
            },
            "& th, & td": {
              border: "1px solid",
              borderColor: "rgba(255,255,255,0.15)",
              p: 1.5,
              textAlign: "left",
            },
            "& th": {
              fontWeight: 600,
              backgroundColor: `${primaryColor}18`,
            },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </Box>

        {/* Bottom back links */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4, mb: 2 }}>
          <Button
            onClick={() => navigate("/blog")}
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
            All blog posts
          </Button>
          <Button
            onClick={() => navigate("/")}
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

export default BlogPostPage;
