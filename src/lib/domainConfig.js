export const SITE_PREFIX = "autobuy_";

export const DOMAIN_CONFIG = {
  used: {
    key: "used",
    dbPrefix: "autobuy_core_used",
    label: "Used cars",
    motif: "inspection-grid",
    accent: "teal",
    domainIntro:
      "Used-car buying decisions around condition, mileage, vehicle history, inspection risk, and whether the deal is worth pursuing.",
    clusterIntro:
      "Browse used-car decision guides by condition, inspection concern, ownership history, mileage, and deal confidence.",
    families: {},
  },

  money: {
    key: "money",
    dbPrefix: "autobuy_money",
    label: "Money & financing",
    motif: "price-grid",
    accent: "teal",
    domainIntro:
      "Car-buying decisions around price, financing, monthly payment, total cost, fees, tradeoffs, and affordability.",
    clusterIntro:
      "Browse car-buying money guides by price, financing terms, payment pressure, fees, and total cost.",
    families: {},
  },

  timing: {
    key: "timing",
    dbPrefix: "autobuy_timing",
    label: "Timing",
    motif: "route-lines",
    accent: "blue",
    domainIntro:
      "When to buy, wait, revisit, walk away, or move quickly based on market timing, personal urgency, and deal pressure.",
    clusterIntro:
      "Browse timing guides for buying now, waiting, seasonal pressure, expiring offers, and deal urgency.",
    families: {},
  },

  "use-fit": {
    key: "use-fit",
    dbPrefix: "autobuy_usefit",
    label: "Use fit",
    motif: "fit-grid",
    accent: "teal",
    domainIntro:
      "Whether a vehicle fits your commute, family needs, cargo use, driving conditions, and ownership plans.",
    clusterIntro:
      "Browse use-fit guides by commute, family, cargo, climate, mileage, and daily-driving needs.",
    families: {},
  },

  "red-flags": {
    key: "red-flags",
    dbPrefix: "autobuy_redflags",
    label: "Red flags",
    motif: "warning-grid",
    accent: "red",
    domainIntro:
      "Warning signs that may change a car-buying decision, including title issues, seller behavior, inspection concerns, and deal pressure.",
    clusterIntro:
      "Browse red-flag guides by warning sign, documentation concern, seller pressure, and inspection risk.",
    families: {},
  },

  negotiation: {
    key: "negotiation",
    dbPrefix: "autobuy_negotiation",
    label: "Negotiation",
    motif: "counteroffer-grid",
    accent: "teal",
    domainIntro:
      "Decisions around counteroffers, dealer pressure, asking for repairs, price drops, add-ons, and when to walk away.",
    clusterIntro:
      "Browse negotiation guides by offer type, seller response, repair request, add-on pressure, and walk-away point.",
    families: {},
  },

  context: {
    key: "context",
    dbPrefix: "autobuy_context",
    label: "Buying context",
    motif: "context-map",
    accent: "blue",
    domainIntro:
      "Car-buying decisions shaped by personal situation, local market, urgency, vehicle availability, and outside constraints.",
    clusterIntro:
      "Browse buying-context guides by market condition, personal urgency, constraints, and deal situation.",
    families: {},
  },

  reliability: {
    key: "reliability",
    dbPrefix: "autobuy_reliability",
    label: "Reliability",
    motif: "reliability-grid",
    accent: "teal",
    domainIntro:
      "Reliability decisions around known issues, maintenance history, mileage, repairs, ownership risk, and long-term confidence.",
    clusterIntro:
      "Browse reliability guides by known problems, maintenance records, age, mileage, and future repair risk.",
    families: {},
  },

  specialty: {
    key: "specialty",
    dbPrefix: "autobuy_specialty",
    label: "Specialty vehicles",
    motif: "specialty-grid",
    accent: "blue",
    domainIntro:
      "Decisions for specialty, niche, enthusiast, work, performance, luxury, or unusual vehicles where normal buying rules may change.",
    clusterIntro:
      "Browse specialty-vehicle guides by niche use, unusual risk, ownership cost, inspection need, and resale concern.",
    families: {},
  },

  compliance: {
    key: "compliance",
    dbPrefix: "autobuy_compliance",
    label: "Compliance & paperwork",
    motif: "paperwork-grid",
    accent: "teal",
    domainIntro:
      "Title, registration, emissions, inspection, tax, warranty, and paperwork decisions that can affect whether a deal is safe.",
    clusterIntro:
      "Browse compliance guides by title status, registration issue, emissions, inspection, warranty, and paperwork concern.",
    families: {},
  },

  comparison: {
    key: "comparison",
    dbPrefix: "autobuy_comparison",
    label: "Comparison shopping",
    motif: "compare-grid",
    accent: "teal",
    domainIntro:
      "Choosing between vehicles, trims, model years, mileage levels, dealer offers, private listings, and competing tradeoffs.",
    clusterIntro:
      "Browse comparison guides by competing vehicle, trim, year, mileage, offer, and ownership tradeoff.",
    families: {},
  },

  confidence: {
    key: "confidence",
    dbPrefix: "autobuy_confidence",
    label: "Buyer confidence",
    motif: "confidence-grid",
    accent: "blue",
    domainIntro:
      "Decision guides for uncertainty, second thoughts, buyer hesitation, inspection doubt, deal pressure, and whether to keep looking.",
    clusterIntro:
      "Browse confidence guides by uncertainty type, hesitation, inspection doubt, deal pressure, and walk-away signals.",
    families: {},
  },

  channel: {
    key: "channel",
    dbPrefix: "autobuy_channel",
    label: "Buying channel",
    motif: "channel-grid",
    accent: "teal",
    domainIntro:
      "Whether to buy from a dealer, private seller, online retailer, auction, marketplace, or another channel.",
    clusterIntro:
      "Browse buying-channel guides by seller type, platform, negotiation room, inspection access, and transaction risk.",
    families: {},
  },

  platform: {
    key: "platform",
    dbPrefix: "autobuy_platform",
    label: "Platforms & listings",
    motif: "listing-grid",
    accent: "blue",
    domainIntro:
      "Decisions around online listings, marketplaces, pricing tools, vehicle history reports, photos, seller messages, and listing quality.",
    clusterIntro:
      "Browse platform guides by listing quality, pricing signal, seller response, report mismatch, and marketplace risk.",
    families: {},
  },

  "post-purchase": {
    key: "post-purchase",
    dbPrefix: "autobuy_postpurchase",
    label: "After purchase",
    motif: "postpurchase-grid",
    accent: "teal",
    domainIntro:
      "Post-purchase decisions around warranty, repairs, return windows, buyer remorse, dealer follow-up, and early ownership problems.",
    clusterIntro:
      "Browse post-purchase guides by warranty, early repairs, return window, paperwork, and buyer-remorse concern.",
    families: {},
  },

  safety: {
    key: "safety",
    dbPrefix: "autobuy_safety",
    label: "Safety",
    motif: "safety-grid",
    accent: "red",
    domainIntro:
      "Safety-related buying decisions around crash history, recalls, tires, brakes, warning lights, inspections, and family-use risk.",
    clusterIntro:
      "Browse safety guides by warning sign, inspection issue, recall, crash concern, tires, brakes, and risk tolerance.",
    families: {},
  },
};

export const AUTOBUY_VERTICALS = Object.values(DOMAIN_CONFIG);

export function getDomainConfig(domainSlug = "") {
  return (
    DOMAIN_CONFIG[domainSlug] || {
      key: domainSlug,
      dbPrefix: `autobuy_${String(domainSlug).replace(/-/g, "_")}`,
      label: domainSlug
        ? domainSlug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "Car buying",
      motif: "inspection-grid",
      accent: "teal",
      domainIntro:
        "Browse practical car-buying decision guides for price, timing, inspection risk, negotiation, paperwork, and whether to walk away.",
      clusterIntro:
        "Browse this branch of AutoBuyScope decision guides and move into individual car-buying questions from here.",
      families: {},
    }
  );
}

export function getAutoBuyDomainFromBranchKey(branchKey = "") {
  const key = String(branchKey || "");

  if (key.startsWith("autobuy_core_used_") || key === "autobuy_core_used") {
    return "used";
  }

  const match = key.match(/^autobuy_([^_]+)/);
  const raw = match?.[1] || "";

  const aliases = {
    usefit: "use-fit",
    redflags: "red-flags",
    postpurchase: "post-purchase",
  };

  return aliases[raw] || raw;
}

export function getAutoBuyBranchPrefixForDomain(domainSlug = "") {
  const config = getDomainConfig(domainSlug);
  return config.dbPrefix;
}

export function getAutoBuyFamilySlugFromBranchKey(branchKey = "") {
  const domainSlug = getAutoBuyDomainFromBranchKey(branchKey);
  const prefix = getAutoBuyBranchPrefixForDomain(domainSlug);

  return String(branchKey || "")
    .replace(new RegExp(`^${prefix}_?`), "")
    .replace(/_/g, "-");
}

export function getAutoBuyBranchKeyFromRoute(domainSlug = "", familySlug = "") {
  const prefix = getAutoBuyBranchPrefixForDomain(domainSlug);
  const familyPart = String(familySlug || "").replace(/-/g, "_");

  return familyPart ? `${prefix}_${familyPart}` : prefix;
}