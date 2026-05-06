import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase";
import HomeSearch from "../components/HomeSearch";
import {
  AUTOBUY_VERTICALS,
  getAutoBuyDomainFromBranchKey,
} from "../lib/domainConfig";
import AutoBuySignalPanel from "../components/AutoBuySignalPanel";

const SITE_NAME = "AutoBuyScope";
const SITE_DESCRIPTION =
  "Car buying decision guides for used cars, financing, timing, negotiation, reliability, safety, and deal confidence.";

export default function HomePage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchAllPublishedRows() {
      const pageSize = 1000;
      let from = 0;
      let allRows = [];

      while (true) {
        const { data, error } = await supabase
          .from("branch_seed_overview")
          .select("branch_key, page_id, page_status")
          .eq("page_status", "published")
          .ilike("branch_key", "autobuy_%")
          .range(from, from + pageSize - 1);

        if (error) throw error;

        const batch = data ?? [];
        allRows = [...allRows, ...batch];

        if (batch.length < pageSize) break;
        from += pageSize;
      }

      return allRows;
    }

    async function loadHome() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchAllPublishedRows();

        if (!active) return;
        setRows(data ?? []);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load homepage.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadHome();

    return () => {
      active = false;
    };
  }, []);

  const verticalStats = useMemo(() => {
    const stats = new Map();

    for (const vertical of AUTOBUY_VERTICALS) {
      stats.set(vertical.key, {
        pageCount: 0,
        branchKeys: new Set(),
      });
    }

    for (const row of rows) {
      const branchKey = row.branch_key || "";
      const verticalKey = getAutoBuyDomainFromBranchKey(branchKey);

      if (!stats.has(verticalKey)) continue;

      const item = stats.get(verticalKey);

      if (row.page_id) {
        item.pageCount += 1;
      }

      if (branchKey) {
        item.branchKeys.add(branchKey);
      }
    }

    return stats;
  }, [rows]);

  const verticalCards = useMemo(() => {
    return AUTOBUY_VERTICALS.map((vertical) => {
      const stats = verticalStats.get(vertical.key);

      return {
        ...vertical,
        pageCount: stats?.pageCount ?? 0,
        branchCount: stats?.branchKeys?.size ?? 0,
      };
    });
  }, [verticalStats]);

  return (
    <main className="page-shell homepage-shell autobuy-homepage">
      <Helmet>
        <title>{SITE_NAME}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
      </Helmet>

      <div className="page-width">
        <div className="home-stack">
          <section className="home-hero">
            <div className="home-hero-art home-axis-x" />

            <div className="home-brand-slab">
              <div className="home-brand-slab-inner">
                <div className="home-brand-slab__copy">
                  <div className="home-brand-kicker">
                    Car buying decision guides
                  </div>

                  <div className="home-brand-name">AutoBuyScope</div>

                  <p className="home-brand-deck">
                    Practical answers for used cars, financing, timing,
                    negotiation, reliability, safety, and whether to walk away.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <AutoBuySignalPanel />

          <HomeSearch />

          <section className="home-live-domain" aria-labelledby="autobuy-library-heading">
            <div className="section-rule">
              <span className="section-rule-label">
                Buy it, wait, negotiate, inspect further, finance it, or walk away.
              </span>
              <span className="section-rule-line" />
            </div>

            <div className="home-domain-link home-domain-link--static">
              <div className="home-domain-main">
                <h2 id="autobuy-library-heading" className="home-domain-title">
                  Car buying decision library
                </h2>

                <p className="home-domain-body">
                  Browse structured decision guides for price, condition,
                  financing, seller risk, title issues, inspection concerns,
                  timing pressure, and deal confidence.
                </p>
              </div>

              <Link to="/share-your-situation" className="home-domain-cta">
                Share your car-buying situation
              </Link>
            </div>
          </section>

          <section className="home-featured" aria-labelledby="autobuy-areas-heading">
            <div className="section-rule">
              <span id="autobuy-areas-heading" className="section-rule-label">
                Buying areas
              </span>
              <span className="section-rule-line" />
            </div>

            <p className="section-copy home-featured__intro">
              Start with the area that matches the decision you are weighing:
              vehicle condition, price, financing, paperwork, seller channel,
              inspection risk, timing pressure, or buyer confidence.
            </p>

            {loading ? <p className="section-copy">Loading buying areas…</p> : null}
            {error ? <p className="section-copy">{error}</p> : null}

            {!loading && !error ? (
              <div className="home-vertical-grid home-vertical-grid--dense">
                {verticalCards.map((vertical) => (
                  <Link
                    key={vertical.key}
                    to={`/${vertical.key}`}
                    className="home-vertical-card"
                  >
                    <div className="home-vertical-card__top">
                      <h3>{vertical.label}</h3>
                      <span aria-hidden="true">→</span>
                    </div>

                    <p>{vertical.description || vertical.domainIntro}</p>

                    <div className="home-vertical-card__meta">
                      <span>{vertical.pageCount.toLocaleString()} guides</span>
                      <span>
                        {vertical.branchCount.toLocaleString()} question sets
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}