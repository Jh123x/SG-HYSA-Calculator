import type { BlogPost } from "./blogPosts";

/**
 * Browser-compatible frontmatter parser.
 * Handles strings, numbers, booleans, and YAML arrays (list items under a key).
 */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const data: Record<string, unknown> = {};
  let body = raw;

  if (raw.startsWith("---")) {
    const endIndex = raw.indexOf("---", 3);
    if (endIndex !== -1) {
      const fmBlock = raw.slice(3, endIndex).trim();
      body = raw.slice(endIndex + 3).trim();
      let currentKey = "";

      for (const line of fmBlock.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Array continuation: "  - value"
        if (trimmed.startsWith("- ") && currentKey) {
          const arr = data[currentKey] as string[];
          arr.push(trimmed.slice(2).trim());
          continue;
        }

        const colonIdx = trimmed.indexOf(":");
        if (colonIdx === -1) continue;

        const key = trimmed.slice(0, colonIdx).trim();
        const value = trimmed.slice(colonIdx + 1).trim();
        currentKey = key;

        if (value === "") {
          data[key] = []; // start array
        } else if (value === "true") {
          data[key] = true;
        } else if (value === "false") {
          data[key] = false;
        } else if (/^-?\d+$/.test(value)) {
          data[key] = parseInt(value, 10);
        } else if (/^-?\d+\.\d+$/.test(value)) {
          data[key] = parseFloat(value);
        } else {
          // Strip surrounding quotes
          let cleaned = value;
          if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
            cleaned = cleaned.slice(1, -1);
          }
          data[key] = cleaned;
        }
      }
    }
  }
  return { data, content: body };
}

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
    const { data: frontmatter, content: body } = parseFrontmatter(content);

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
