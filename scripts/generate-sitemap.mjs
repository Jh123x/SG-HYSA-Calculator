#!/usr/bin/env node
/**
 * regenerates public/sitemap.xml from the bank registry.
 *
 * usage:
 *   node scripts/generate-sitemap.mjs
 *   npm run generate-sitemap
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

/**
 * Extract bank slugs from src/data/banks.ts using a text-level match.
 * Pure data file is simple JS so a regex approach is reliable here.
 */
function extractBankSlugs(banksPath) {
  const src = readFileSync(banksPath, "utf8");
  // Match keys in the `banks` object like:
  //   "uob-one-account": {
  //   "ocbc-360-account": {
  const re = /^\s*"([^"]+)":\s*\{/gm;
  const slugs = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    slugs.push(m[1]);
  }
  return slugs;
}

function generate() {
  const banksPath = resolve(ROOT, "src", "data", "banks.ts");
  const bankSlugs = extractBankSlugs(banksPath);

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

  for (const slug of bankSlugs) {
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
  console.log(`sitemap.xml written (${bankSlugs.length} bank slugs)`);
}

generate();
