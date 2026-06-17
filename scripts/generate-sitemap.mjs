#!/usr/bin/env node
/**
 * regenerates public/sitemap.xml from bank slugs defined in src/logic/constants.tsx.
 *
 * usage:
 *   node scripts/generate-sitemap.js
 *   npm run generate-sitemap
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

/** map bank display name → URL-safe slug (mirrors slugs.ts:bankNameToSlug) */
function bankNameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** extract bankInfo keys from constants.tsx using a text-level match */
function extractBankNames(constantsPath) {
  const src = readFileSync(constantsPath, "utf8");
  // Match bankInfo object keys like:
  //   "UOB One Account": {
  //   "OCBC 360 Account": {
  // but not the closing }, or comments
  const re = /^\s*"([^"]+)":\s*\{/gm;
  const names = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    names.push(m[1]);
  }
  return names;
}

function generate() {
  const constantsPath = resolve(ROOT, "src", "logic", "constants.tsx");
  const bankNames = extractBankNames(constantsPath);

  const today = new Date().toISOString().slice(0, 10);
  const base = "https://hysa.jh123x.com";

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset',
    '    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '    xmlns:xhtml="http://www.w3.org/1999/xhtml"',
    ">",
    "    <url>",
    `        <loc>${base}/</loc>`,
    `        <lastmod>${today}</lastmod>`,
    "        <changefreq>weekly</changefreq>",
    "        <priority>1.0</priority>",
    "    </url>",
    "    <url>",
    `        <loc>${base}/history</loc>`,
    `        <lastmod>${today}</lastmod>`,
    "        <changefreq>weekly</changefreq>",
    "        <priority>0.9</priority>",
    "    </url>",
    "    <url>",
    `        <loc>${base}/faq</loc>`,
    `        <lastmod>${today}</lastmod>`,
    "        <changefreq>weekly</changefreq>",
    "        <priority>0.8</priority>",
    "    </url>",
  ];

  for (const name of bankNames) {
    const slug = bankNameToSlug(name);
    lines.push(
      "    <url>",
      `        <loc>${base}/bank/${slug}</loc>`,
      "        <changefreq>weekly</changefreq>",
      "        <priority>0.8</priority>",
      "    </url>",
    );
  }

  lines.push("</urlset>", "");

  const outPath = resolve(ROOT, "public", "sitemap.xml");
  writeFileSync(outPath, lines.join("\n"), "utf8");
  console.log(`sitemap.xml written (${bankNames.length} bank slugs)`);
}

generate();
