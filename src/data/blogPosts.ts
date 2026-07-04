export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  content: string;
}

export function getWordCount(content: string): number {
  return content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
}

export function getReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}

export { blogPosts, sortedBlogPosts } from "./loadBlogPosts";
