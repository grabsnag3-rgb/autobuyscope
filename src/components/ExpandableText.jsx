import { useState } from "react";

export default function ExpandableText({
  children,
  collapsedLines = 6,
  expandLabel = "Read more",
  collapseLabel = "Show less",
  className = "",
}) {
  const [expanded, setExpanded] = useState(false);

  if (!children) return null;

  return (
    <div className={`expandable-text ${expanded ? "is-expanded" : ""} ${className}`}>
      <div
        className="expandable-text__content"
        style={
          expanded
            ? undefined
            : {
                WebkitLineClamp: collapsedLines,
              }
        }
      >
        {children}
      </div>

      <button
        type="button"
        className="expandable-text__button"
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? collapseLabel : expandLabel}
      </button>
    </div>
  );
}