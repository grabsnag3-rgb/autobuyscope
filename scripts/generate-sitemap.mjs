import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://autobuyscope.com";

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://nwxcancqulxjwdiofyxy.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "sb_publishable_qeHpjmBA_STovuCQL-fjDQ_U5eOEoy-";

const AUTOBUY_VERTICALS = [
  "used",
  "money",
  "timing",
  "use-fit",
  "red-flags",
  "negotiation",
  "context",
  "reliability",
  "specialty",
  "compliance",
  "comparison",
  "confidence",
  "channel",
  "platform",
  "post-purchase",
  "safety",
];

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase env vars.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function xmlEscape(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildUrlTag(loc, lastmod) {
  return [
    "  <url>",
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${xmlEscape(lastmod)}</lastmod>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

function getDomainSlug(branchKey = "") {
  const key = String(branchKey || "");

  if (key.startsWith("autobuy_core_used_") || key === "autobuy_core_used") {
    return "used";
  }

  const match = key.match(/^autobuy_([^_]+)/);
  const raw = match?.[1] || "";

  const aliases = {
    usefit: "use-fit",
    redflags: "red-flags",
    postpurchase: "post-purchase",
  };

  return aliases[raw] || raw;
}

function getBranchPrefixForDomain(domainSlug = "") {
  const prefixes = {
    used: "autobuy_core_used",
    money: "autobuy_money",
    timing: "autobuy_timing",
    "use-fit": "autobuy_usefit",
    "red-flags": "autobuy_redflags",
    negotiation: "autobuy_negotiation",
    context: "autobuy_context",
    reliability: "autobuy_reliability",
    specialty: "autobuy_specialty",
    compliance: "autobuy_compliance",
    comparison: "autobuy_comparison",
    confidence: "autobuy_confidence",
    channel: "autobuy_channel",
    platform: "autobuy_platform",
    "post-purchase": "autobuy_postpurchase",
    safety: "autobuy_safety",
  };

  return prefixes[domainSlug] || `autobuy_${String(domainSlug).replace(/-/g, "_")}`;
}

function getFamilySlug(branchKey = "") {
  const domainSlug = getDomainSlug(branchKey);
  const prefix = getBranchPrefixForDomain(domainSlug);

  return String(branchKey || "")
    .replace(new RegExp(`^${prefix}_?`), "")
    .replace(/_/g, "-");
}

async function fetchAllAutoBuyRows() {
  const pageSize = 1000;
  let from = 0;
  let allRows = [];

  while (true) {
    const { data, error } = await supabase
      .from("branch_seed_overview")
      .select("branch_key, slug, page_status, published_at")
      .eq("page_status", "published")
      .ilike("branch_key", "autobuy_%")
      .range(from, from + pageSize - 1);

    if (error) throw error;

    const batch = data ?? [];
    allRows = [...allRows, ...batch];

    if (batch.length < pageSize) break;
    from += pageSize;
  }

  return allRows.filter((row) => {
    const domainSlug = getDomainSlug(row.branch_key);
    return AUTOBUY_VERTICALS.includes(domainSlug);
  });
}

async function main() {
  const urls = new Map();

  urls.set(`${SITE_URL}/`, {
    loc: `${SITE_URL}/`,
    lastmod: null,
  });

  urls.set(`${SITE_URL}/share-your-situation`, {
    loc: `${SITE_URL}/share-your-situation`,
    lastmod: null,
  });

  for (const vertical of AUTOBUY_VERTICALS) {
    const loc = `${SITE_URL}/${vertical}`;
    urls.set(loc, { loc, lastmod: null });
  }

  const rows = await fetchAllAutoBuyRows();

  for (const row of rows) {
    const branchKey = row.branch_key || "";
    const domainSlug = getDomainSlug(branchKey);
    const familySlug = getFamilySlug(branchKey);

    if (!AUTOBUY_VERTICALS.includes(domainSlug)) continue;

    if (familySlug) {
      const clusterLoc = `${SITE_URL}/${domainSlug}/${familySlug}`;
      urls.set(clusterLoc, {
        loc: clusterLoc,
        lastmod: row.published_at || null,
      });
    }

    if (row.slug) {
      const pageLoc = `${SITE_URL}/p/${row.slug}`;
      urls.set(pageLoc, {
        loc: pageLoc,
        lastmod: row.published_at || null,
      });
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...Array.from(urls.values())
      .sort((a, b) => a.loc.localeCompare(b.loc))
      .map((entry) => buildUrlTag(entry.loc, entry.lastmod)),
    "</urlset>",
    "",
  ].join("\n");

  const outputPath = path.resolve("public", "sitemap.xml");
  await fs.writeFile(outputPath, xml, "utf8");

  console.log(`Sitemap written to ${outputPath}`);
  console.log(`URL count: ${urls.size}`);
}

main().catch((error) => {
  console.error("Failed to generate sitemap:", error);
  process.exit(1);
});