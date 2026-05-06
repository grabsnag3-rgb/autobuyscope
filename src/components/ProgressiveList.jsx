import { useState } from "react";

export default function ProgressiveList({
  items = [],
  initialCount = 3,
  className = "",
  listClassName = "",
  itemClassName = "",
  renderItem,
  expandLabel = "Show more",
  collapseLabel = "Show less",
}) {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = Array.isArray(items)
    ? items.filter((item) => item)
    : [];

  if (!visibleItems.length) return null;

  const shownItems = expanded
    ? visibleItems
    : visibleItems.slice(0, initialCount);

  const hasMore = visibleItems.length > initialCount;

  return (
    <div className={`progressive-list ${expanded ? "is-expanded" : ""} ${className}`}>
      <ul className={listClassName}>
        {shownItems.map((item, index) => (
          <li key={`${String(item)}-${index}`} className={itemClassName}>
            {renderItem ? renderItem(item, index) : item}
          </li>
        ))}
      </ul>

      {hasMore ? (
        <button
          type="button"
          className="progressive-list__button"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded
            ? collapseLabel
            : `${expandLabel} (${visibleItems.length - initialCount})`}
        </button>
      ) : null}
    </div>
  );
}