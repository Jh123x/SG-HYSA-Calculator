import { Article, GitHub, Link, RssFeed } from "@mui/icons-material";
import { ThemeButton } from "./ThemeButton";
import { Grid } from "@mui/material";

const Socials = () => (
  <Grid
    sx={{
      textAlign: "center",
    }}
  >
    <ThemeButton href="https://jh123x.com">
      <Link />
    </ThemeButton>
    <ThemeButton href="/sitemap.xml">
      <RssFeed />
    </ThemeButton>
    <ThemeButton href="https://jh123x.com/blog/2024/high-yield-saving-accounts/">
      <Article />
    </ThemeButton>
    <ThemeButton href="https://github.com/jh123x/SG-HYSA-Calculator">
      <GitHub />
    </ThemeButton>
  </Grid>
);

export default Socials;
