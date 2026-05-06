import SectionRule from "../components/SectionRule";
import ProgressiveList from "../components/ProgressiveList";

export default function DecisionChanges({ items = [] }) {
  const visibleItems = Array.isArray(items)
    ? items.filter((item) => String(item || "").trim())
    : [];

  if (!visibleItems.length) return null;

  return (
    <section className="decision-changes" aria-labelledby="decision-changes-heading">
      <SectionRule label="What changes the call" />

      <ProgressiveList
        items={visibleItems}
        initialCount={2}
        listClassName="list-reset decision-changes__list"
        itemClassName="decision-changes__item"
        expandLabel="Show more signals"
        collapseLabel="Show fewer signals"
        renderItem={(item) => (
          <div className="decision-changes__row">
            <span className="decision-changes__marker" aria-hidden="true" />
            <span className="decision-changes__text">{item}</span>
          </div>
        )}
      />
    </section>
  );
}