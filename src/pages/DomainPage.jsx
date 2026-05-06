import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import {
  getDomainConfig,
  getAutoBuyBranchPrefixForDomain,
  getAutoBuyFamilySlugFromBranchKey,
} from "../lib/domainConfig";
import { titleFromSlug } from "../lib/routeHelpers";

const SITE_NAME = "AutoBuyScope";

function cleanFamilyLabel(label) {
  return String(label || "")
    .replace(/\bOr\b/g, "or")
    .replace(/\bAnd\b/g, "and")
    .replace(/\bVs\b/g, "vs")
    .replace(/\s+/g, " ")
    .trim();
}

function familyLabelFromBranch(row) {
  const label = row.branch_label || "";

  if (label.includes("→")) {
    const parts = label.split("→").map((part) => part.trim());
    return cleanFamilyLabel(parts[parts.length - 1] || parts[0]);
  }

  const familySlug = getAutoBuyFamilySlugFromBranchKey(row.branch_key);
  return cleanFamilyLabel(titleFromSlug(familySlug));
}

function buildDomainDescription(domainTitle, domainConfig) {
  const text =
    domainConfig.domainIntro ||
    `Browse ${domainTitle.toLowerCase()} car-buying decision guides on AutoBuyScope.`;

  return text.length > 158 ? `${text.slice(0, 155)}...` : text;
}

export default function DomainPage() {
  const { domainSlug } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const domainConfig = useMemo(() => getDomainConfig(domainSlug), [domainSlug]);
  const domainTitle = domainConfig.label || titleFromSlug(domainSlug);
  const branchPrefix = useMemo(
    () => getAutoBuyBranchPrefixForDomain(domainSlug),
    [domainSlug]
  );

  useEffect(() => {
    let active = true;

    async function loadDomain() {
      try {
        setLoading(true);
        setError("");

        const { data, error } = await supabase
          .from("branch_seed_overview")
          .select("branch_key, branch_label, page_id, page_status")
          .eq("page_status", "published")
          .ilike("branch_key", `${branchPrefix}_%`);

        if (error) throw error;

        if (!active) return;
        setRows(data ?? []);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load buying area.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDomain();

    return () => {
      active = false;
    };
  }, [branchPrefix]);

  const families = useMemo(() => {
    const map = new Map();

    for (const row of rows) {
      if (!row.branch_key) continue;

      if (!map.has(row.branch_key)) {
        const familySlug = getAutoBuyFamilySlugFromBranchKey(row.branch_key);
        const familyLabel = familyLabelFromBranch(row);

        map.set(row.branch_key, {
          branchKey: row.branch_key,
          familySlug,
          familyLabel,
          href: `/${domainSlug}/${familySlug}`,
          pageCount: 0,
          description:
            domainConfig.families?.[familyLabel] ??
            "Use this question set to compare the specific price, condition, seller, timing, paperwork, or confidence issue that changes the buying decision.",
        });
      }

      if (row.page_id) {
        map.get(row.branch_key).pageCount += 1;
      }
    }

    return Array.from(map.values()).sort((a, b) =>
      a.familyLabel.localeCompare(b.familyLabel)
    );
  }, [rows, domainConfig, domainSlug]);

  return (
    <main className="page-shell domain-page autobuy-domain-page">
      <Helmet>
        <title>{`${domainTitle} | ${SITE_NAME}`}</title>
        <meta
          name="description"
          content={buildDomainDescription(domainTitle, domainConfig)}
        />
      </Helmet>

      <div className="page-width">
        <Header />

        <section className="domain-hero">
          <p className="domain-hero__eyebrow">Buying area</p>
          <h1 className="domain-hero__title">{domainTitle}</h1>
          <p className="domain-hero__body">{domainConfig.domainIntro}</p>
        </section>

        <section className="domain-list-section" aria-labelledby="domain-question-sets">
          <div className="section-rule">
            <span id="domain-question-sets" className="section-rule-label">
              Question sets
            </span>
            <span className="section-rule-line" />
          </div>

          <p className="section-copy domain-list-section__intro">
            Each question set groups car-buying decisions by the thing that
            changes the call: condition, price, seller behavior, paperwork,
            inspection access, financing terms, timing pressure, or confidence.
          </p>

          {loading ? <p className="section-copy">Loading buying area…</p> : null}
          {error ? <p className="section-copy">{error}</p> : null}

          {!loading && !error ? (
            <div className="domain-list">
              {families.map((item) => (
                <Link
                  key={item.branchKey}
                  to={item.href}
                  className="domain-row"
                >
                  <div className="domain-row__main">
                    <h2 className="domain-row__title">{item.familyLabel}</h2>
                    <p className="domain-row__body">{item.description}</p>

                    <p className="domain-row__meta">
                      {item.pageCount.toLocaleString()} buying guides
                    </p>
                  </div>

                  <div className="domain-row__arrow" aria-hidden="true">
                    →
                  </div>
                </Link>
              ))}

              {families.length === 0 ? (
                <p className="section-copy">
                  No published car-buying question sets yet.
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}