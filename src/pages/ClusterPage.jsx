import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import {
  getDomainConfig,
  getAutoBuyBranchKeyFromRoute,
} from "../lib/domainConfig";
import { titleFromSlug } from "../lib/routeHelpers";

const SITE_NAME = "AutoBuyScope";

function buildClusterDescription(familyTitle, domainTitle) {
  const text = `Browse ${familyTitle.toLowerCase()} car-buying decision guides in ${domainTitle}. Compare the specific price, condition, seller, timing, paperwork, inspection, or confidence issue that changes the buying decision.`;

  return text.length > 158 ? `${text.slice(0, 155)}...` : text;
}

export default function ClusterPage() {
  const { domainSlug, familySlug } = useParams();
  const [rows, setRows] = useState([]);
  const [debugBranchKey, setDebugBranchKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const domainConfig = useMemo(() => getDomainConfig(domainSlug), [domainSlug]);
  const domainTitle = domainConfig.label || titleFromSlug(domainSlug);
  const familyTitle = useMemo(() => titleFromSlug(familySlug), [familySlug]);

  useEffect(() => {
    let active = true;

    async function loadCluster() {
      try {
        setLoading(true);
        setError("");

        const branchKey = getAutoBuyBranchKeyFromRoute(domainSlug, familySlug);
        setDebugBranchKey(branchKey);

        const { data, error } = await supabase
          .from("branch_seed_overview")
          .select(
            "seed_id, branch_key, branch_label, topic_title, slug, sort_order, page_status, published_at"
          )
          .eq("page_status", "published")
          .eq("branch_key", branchKey)
          .order("sort_order", { ascending: true });

        if (error) throw error;

        if (!active) return;
        setRows(data ?? []);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load question set.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCluster();

    return () => {
      active = false;
    };
  }, [domainSlug, familySlug]);

  return (
    <main className="page-shell cluster-page autobuy-cluster-page">
      <Helmet>
        <title>{`${familyTitle} | ${domainTitle} | ${SITE_NAME}`}</title>
        <meta
          name="description"
          content={buildClusterDescription(familyTitle, domainTitle)}
        />
      </Helmet>

      <div className="page-width">
        <Header />

        <nav aria-label="Breadcrumb" className="decision-breadcrumbs cluster-breadcrumbs">
          <span className="decision-breadcrumbs__item">
            <Link to={`/${domainSlug}`} className="decision-breadcrumbs__link">
              {domainTitle}
            </Link>
            <span className="decision-breadcrumbs__sep" aria-hidden="true">
              →
            </span>
          </span>

          <span className="decision-breadcrumbs__item">
            <span className="decision-breadcrumbs__link">{familyTitle}</span>
          </span>
        </nav>

        <section className="cluster-hero">
          <p className="cluster-hero__eyebrow">Question set</p>

          <h1 className="cluster-hero__title">{familyTitle}</h1>

          <p className="cluster-hero__body">
            These guides focus on one car-buying decision family. Start with the
            question that best matches the vehicle, seller, price, timing
            pressure, paperwork issue, inspection concern, or confidence gap you
            are weighing.
          </p>
        </section>

<section className="cluster-compare-panel" aria-label="What this question set helps compare">
  <div className="cluster-compare-panel__label">This set helps compare</div>

  <div className="cluster-compare-panel__grid">
    <span>Price pressure</span>
    <span>Condition risk</span>
    <span>Seller signal</span>
    <span>Timing pressure</span>
  </div>
</section>

        <section className="cluster-list-section" aria-labelledby="cluster-guides-heading">
          <div className="section-rule">
            <span id="cluster-guides-heading" className="section-rule-label">
              Buying guides
            </span>
            <span className="section-rule-line" />
          </div>

          <p className="section-copy cluster-list-section__intro">
            Each guide narrows the decision to a specific buying situation:
            whether to buy, wait, negotiate, inspect further, finance, compare,
            or walk away.
          </p>

          {loading ? <p className="section-copy">Loading buying guides…</p> : null}
          {error ? <p className="section-copy">{error}</p> : null}

          {!loading && !error ? (
            <div className="cluster-list">
              {rows.map((row) => (
                <Link
                  key={row.seed_id}
                  to={`/p/${row.slug}`}
                  className="cluster-row"
                >
                  <div className="cluster-row__main">
                    <p className="cluster-row__title">{row.topic_title}</p>
                  </div>

                  <div className="cluster-row__arrow" aria-hidden="true">
                    →
                  </div>
                </Link>
              ))}

              {rows.length === 0 ? (
                <p className="section-copy">
                  No published car-buying guides in this question set yet.
                  Looking for branch key: <code>{debugBranchKey}</code>
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}