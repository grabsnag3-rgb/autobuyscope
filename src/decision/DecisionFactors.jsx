import SectionRule from "../components/SectionRule";
import ProgressiveList from "../components/ProgressiveList";

export default function DecisionFactors({ factors = [] }) {
  const visibleFactors = Array.isArray(factors)
    ? factors.filter((factor) => factor?.label || factor?.body)
    : [];

  if (!visibleFactors.length) return null;

  return (
    <section className="decision-factors" aria-labelledby="decision-factors-heading">
      <SectionRule label="What to check first" />

      <ProgressiveList
        items={visibleFactors}
        initialCount={3}
        listClassName="list-reset decision-factors__list"
        itemClassName="decision-factor"
        expandLabel="Show more checks"
        collapseLabel="Show fewer checks"
        renderItem={(factor) => (
          <>
            {factor.label ? (
              <h2 className="decision-factor__title">{factor.label}</h2>
            ) : null}

            {factor.body ? (
              <p className="decision-factor__body">{factor.body}</p>
            ) : null}
          </>
        )}
      />
    </section>
  );
}