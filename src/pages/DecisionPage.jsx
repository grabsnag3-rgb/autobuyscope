import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import RelatedQuestions from "../components/RelatedQuestions";
import DecisionDisclaimer from "../components/DecisionDisclaimer";
import DecisionCTA from "../components/DecisionCTA";
import { supabase } from "../lib/supabase";
import { mapDecisionPayload } from "../decision/decisionMapper";
import { getAutoBuyDomainFromBranchKey } from "../lib/domainConfig";
import DecisionBreadcrumbs from "../decision/DecisionBreadcrumbs";
import DecisionHero from "../decision/DecisionHero";
import DecisionBottomLine from "../decision/DecisionBottomLine";
import DecisionFactors from "../decision/DecisionFactors";
import DecisionChanges from "../decision/DecisionChanges";
import DecisionNextStep from "../decision/DecisionNextStep";
import DecisionException from "../decision/DecisionException";
import DecisionPageBreak from "../decision/DecisionPageBreak";

const SITE_NAME = "AutoBuyScope";
const SITE_DESCRIPTION =
  "Car buying decision guides for used cars, financing, timing, negotiation, reliability, safety, and deal confidence.";

function buildDecisionDescription(page) {
  const text =
    page?.bottomLine ||
    page?.hero?.question ||
    "Practical car-buying guidance for price, condition, financing, seller risk, timing pressure, inspection concerns, and whether to walk away.";

  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

function normalizePayloadRelatedQuestions(items = []) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (typeof item === "string") {
        return {
          title: item,
          slug: "",
        };
      }

      return {
        title: item?.title || item?.question || "",
        slug: item?.slug || "",
      };
    })
    .filter((item) => item.title);
}

export default function DecisionPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        setLoading(true);
        setError("");

        const { data: publishedRow, error: publishedError } = await supabase
          .from("pages")
          .select("*")
          .eq("slug", slug)
          .eq("page_status", "published")
          .single();

        if (publishedError) {
          throw new Error(`Published page query failed: ${publishedError.message}`);
        }

        const parsedPayload =
          typeof publishedRow.page_payload === "string"
            ? JSON.parse(publishedRow.page_payload)
            : publishedRow.page_payload ?? {};

        const { data: branchSeedRow, error: branchSeedError } = await supabase
          .from("branch_seed_overview")
          .select("*")
          .eq("seed_id", publishedRow.seed_id)
          .single();

        if (branchSeedError) {
          throw new Error(`Branch seed query failed: ${branchSeedError.message}`);
        }

        const branchKey = branchSeedRow.branch_key || "";

        if (!branchKey.startsWith("autobuy_")) {
          throw new Error("This page does not belong to AutoBuyScope.");
        }

        const { data: relationshipRows, error: relationshipError } = await supabase
          .from("page_relationships")
          .select("target_page_id, relationship_type, rank")
          .eq("source_page_id", publishedRow.id)
          .order("rank", { ascending: true });

        if (relationshipError) {
          throw new Error(`Relationship query failed: ${relationshipError.message}`);
        }

        let relatedQuestions = [];

        if (relationshipRows?.length) {
          const targetIds = relationshipRows
            .map((row) => row.target_page_id)
            .filter(Boolean);

          if (targetIds.length) {
            const { data: targetPages, error: targetPagesError } = await supabase
              .from("pages")
              .select("id, title, slug, page_status, seed_id")
              .in("id", targetIds)
              .eq("page_status", "published");

            if (targetPagesError) {
              throw new Error(`Related target query failed: ${targetPagesError.message}`);
            }

            const targetSeedIds = (targetPages ?? [])
              .map((target) => target.seed_id)
              .filter(Boolean);

            let allowedTargetSeedIds = new Set();

            if (targetSeedIds.length) {
              const { data: targetSeedRows, error: targetSeedError } = await supabase
                .from("branch_seed_overview")
                .select("seed_id, branch_key")
                .in("seed_id", targetSeedIds);

              if (targetSeedError) {
                throw new Error(`Related target seed query failed: ${targetSeedError.message}`);
              }

              allowedTargetSeedIds = new Set(
                (targetSeedRows ?? [])
                  .filter((row) => String(row.branch_key || "").startsWith("autobuy_"))
                  .map((row) => row.seed_id)
              );
            }

            const targetMap = new Map(
              (targetPages ?? [])
                .filter((target) => allowedTargetSeedIds.has(target.seed_id))
                .map((target) => [target.id, target])
            );

            relatedQuestions = relationshipRows
              .map((row) => {
                const target = targetMap.get(row.target_page_id);
                if (!target?.slug) return null;

                return {
                  title: target.title,
                  slug: target.slug,
                };
              })
              .filter(Boolean);
          }
        }

        /*
          Fallback:
          If page_relationships has not been generated yet, preserve payload
          related_questions. These may show as non-clickable unless they include slugs.
        */
        if (!relatedQuestions.length) {
          relatedQuestions = normalizePayloadRelatedQuestions(
            parsedPayload.related_questions ?? []
          );
        }

        const merged = {
          ...parsedPayload,
          related_questions: relatedQuestions,
          id: publishedRow.id,
          page_id: publishedRow.id,
          seed_id: publishedRow.seed_id,
          slug: publishedRow.slug,
          title: publishedRow.title ?? parsedPayload.title ?? "",
          branch_key: branchKey,
          branch_label: branchSeedRow.branch_label,
          question_pattern: branchSeedRow.question_pattern,
          scenario: branchSeedRow.scenario,
          modifier: branchSeedRow.modifier,
        };

        if (!active) return;
        setPage(mapDecisionPayload(merged));
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load page.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPage();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="page-shell decision-page autobuy-decision-page">
        <Helmet>
          <title>{`Loading… | ${SITE_NAME}`}</title>
          <meta name="description" content={SITE_DESCRIPTION} />
        </Helmet>

        <div className="page-width decision-page-width">
          <Header />
          <p className="section-copy">Loading buying guide…</p>
        </div>
      </main>
    );
  }

  if (error || !page) {
    return (
      <main className="page-shell decision-page autobuy-decision-page">
        <Helmet>
          <title>{`Page not found | ${SITE_NAME}`}</title>
          <meta name="description" content={SITE_DESCRIPTION} />
        </Helmet>

        <div className="page-width decision-page-width">
          <Header />
          <p className="section-copy">Could not load this buying guide.</p>
          {error ? <p className="section-copy">{error}</p> : null}
        </div>
      </main>
    );
  }

  const vertical = getAutoBuyDomainFromBranchKey(page.branch_key);

  return (
    <main className="page-shell decision-page autobuy-decision-page">
      <Helmet>
        <title>{`${page.title} | ${SITE_NAME}`}</title>
        <meta name="description" content={buildDecisionDescription(page)} />
      </Helmet>

      <div className="page-width decision-page-width">
        <Header />
        <DecisionBreadcrumbs crumbs={page.matrix.crumbs} />

        <article className="decision-guide">
          <div className="decision-top-sequence">
            <DecisionHero hero={page.hero} />
            <DecisionBottomLine bottomLine={page.bottomLine} />
          </div>

          <DecisionPageBreak />

          <div className="decision-article stack-md">
            <DecisionFactors factors={page.keyFactors} />
            <DecisionChanges items={page.whatChangesTheAnswer} />
            <DecisionNextStep nextStep={page.nextStep} />
            <DecisionException exception={page.exception} />
          </div>
        </article>

        <DecisionCTA
          variant="decision-inline"
          vertical={vertical}
          pageId={page.page_id ?? page.id}
          sourceSlug={page.slug}
        />

        <RelatedQuestions items={page.relatedQuestions} />
        <DecisionDisclaimer />
      </div>
    </main>
  );
}