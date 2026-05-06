import ExpandableText from "../components/ExpandableText";

export default function DecisionBottomLine({ bottomLine }) {
  if (!bottomLine) return null;

  return (
    <section className="decision-bottom-line">
      <div className="decision-bottom-line__inner">
        <p className="decision-bottom-line__eyebrow">Bottom line</p>

        <ExpandableText
          collapsedLines={7}
          className="decision-bottom-line__text"
          expandLabel="Read full bottom line"
          collapseLabel="Collapse"
        >
          {bottomLine}
        </ExpandableText>
      </div>
    </section>
  );
}