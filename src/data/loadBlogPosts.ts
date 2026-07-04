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
 * Parse YAML frontmatter from markdown content.
 * Handles: strings, numbers, booleans, arrays (one per line with leading `- `).
 */
function parseFrontmatter(raw: string): { frontmatter: Record<string, unknown>; body: string } {
  const frontmatter: Record<string, unknown> = {};
  let body = raw;

  if (raw.startsWith("---")) {
    const endIndex = raw.indexOf("---", 3);
    if (endIndex !== -1) {
      const fmBlock = raw.slice(3, endIndex).trim();
      body = raw.slice(endIndex + 3).trim();

      for (const line of fmBlock.split("\n")) {
        const colonIndex = line.indexOf(":");
        if (colonIndex === -1) continue;

        const key = line.slice(0, colonIndex).trim();
        const valueStr = line.slice(colonIndex + 1).trim();

        if (valueStr === "") {
          // Array value: collect subsequent lines starting with `- `
          const values: string[] = [];
          const remainingLines = fmBlock.split("\n");
          const lineIndex = remainingLines.indexOf(line);
          if (lineIndex !== -1) {
            for (let i = lineIndex + 1; i < remainingLines.length; i++) {
              const trimmed = remainingLines[i].trim();
              if (trimmed.startsWith("- ")) {
                values.push(trimmed.slice(2).trim());
              } else if (trimmed.startsWith("-")) {
                values.push(trimmed.slice(1).trim());
              } else {
                break;
              }
            }
          }
          frontmatter[key] = values;
        } else if (valueStr === "true") {
          frontmatter[key] = true;
        } else if (valueStr === "false") {
          frontmatter[key] = false;
        } else if (/^\d+$/.test(valueStr)) {
          frontmatter[key] = parseInt(valueStr, 10);
        } else if (/^\d+\.\d+$/.test(valueStr)) {
          frontmatter[key] = parseFloat(valueStr);
        } else {
          // Remove surrounding quotes if present
          let cleaned = valueStr;
          if (
            (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
            (cleaned.startsWith("'") && cleaned.endsWith("'"))
          ) {
            cleaned = cleaned.slice(1, -1);
          }
          frontmatter[key] = cleaned;
        }
      }
    }
  }

  return { frontmatter, body };
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
    const { frontmatter, body } = parseFrontmatter(content);

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
