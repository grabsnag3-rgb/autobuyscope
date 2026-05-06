import "./auto-buy-signal-panel.css";

const SIGNALS = [
  ["Condition", "Verify"],
  ["Price", "Compare"],
  ["Seller", "Read pressure"],
  ["Paperwork", "Confirm"],
];

export default function AutoBuySignalPanel() {
  return (
    <aside className="auto-buy-signal" aria-label="Deal signal preview">
      <div className="auto-buy-signal__top">
        <span>Deal signal</span>
        <span className="auto-buy-signal__status">Pre-buy check</span>
      </div>

      <div className="auto-buy-signal__dial" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="auto-buy-signal__rows">
        {SIGNALS.map(([label, value]) => (
          <div key={label} className="auto-buy-signal__row">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="auto-buy-signal__move">
        <span>Next move</span>
        <strong>Inspect before commitment</strong>
      </div>
    </aside>
  );
}