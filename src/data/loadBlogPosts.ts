import matter from "gray-matter";
import type { BlogPost } from "./blogPosts";

interface RawBlogFile {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  content: string;
}

/**
 * Load all blog markdown files using Vite's import.meta.glob.
 * Parses frontmatter and converts markdown body to HTML.
 */
function loadBlogPostsFromFiles(): BlogPost[] {
  // Vite glob import — all `.md` files in `./blog/` loaded as raw strings
  const modules = import.meta.glob<string>("./blog/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  });

  const posts: BlogPost[] = [];

  for (const [_path, rawContent] of Object.entries(modules)) {
    const content = typeof rawContent === "string" ? rawContent : "";
    const { data: frontmatter, content: body } = matter(content);

    const slug = frontmatter.slug as string;
    const title = frontmatter.title as string;
    const excerpt = frontmatter.excerpt as string;
    const date = frontmatter.date as string;
    const tags = (frontmatter.tags as string[]) ?? [];

    if (!slug || !title || !date) {
      console.warn(`Skipping blog post file — missing required frontmatter fields`);
      continue;
    }

    posts.push({
      slug,
      title,
      excerpt: excerpt ?? "",
      date,
      tags,
      content: body,
    });
  }

  return posts;
}

const blogPosts: BlogPost[] = loadBlogPostsFromFiles();

export const sortedBlogPosts = [...blogPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export { blogPosts };
