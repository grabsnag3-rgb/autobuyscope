import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import "./share-situation.css";

const BUYING_AREAS = [
  { value: "used", label: "Used cars" },
  { value: "money", label: "Money & financing" },
  { value: "timing", label: "Timing" },
  { value: "use-fit", label: "Use fit" },
  { value: "red-flags", label: "Red flags" },
  { value: "negotiation", label: "Negotiation" },
  { value: "context", label: "Buying context" },
  { value: "reliability", label: "Reliability" },
  { value: "specialty", label: "Specialty vehicles" },
  { value: "compliance", label: "Compliance & paperwork" },
  { value: "comparison", label: "Comparison shopping" },
  { value: "confidence", label: "Buyer confidence" },
  { value: "channel", label: "Buying channel" },
  { value: "platform", label: "Platforms & listings" },
  { value: "post-purchase", label: "After purchase" },
  { value: "safety", label: "Safety" },
];

export default function ShareSituationPage() {
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);

  const initialVertical = useMemo(() => {
    return searchParams.get("vertical") || "";
  }, [searchParams]);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="page-shell share-situation-page autobuy-share-page">
      <Helmet>
        <title>Share your car-buying situation | AutoBuyScope</title>
        <meta
          name="description"
          content="Share the vehicle, price, seller, inspection concern, financing issue, timing pressure, or car-buying decision you are trying to sort through."
        />
      </Helmet>

      <div className="page-width">
        <Header />

        <section className="share-situation-hero">
          <div className="section-label">Share your car-buying situation</div>

          <h1>Tell us what you&apos;re deciding before you buy.</h1>

          <p>
            AutoBuyScope is building clearer decision guides for used cars,
            financing, timing, negotiation, seller risk, reliability, paperwork,
            safety, and when to walk away. Share the vehicle, price, seller
            situation, and what feels unclear.
          </p>
        </section>

        {submitted ? (
          <section className="share-situation-success">
            <div className="section-label">Received</div>
            <h2>Thanks — this helps shape AutoBuyScope.</h2>
            <p>
              We cannot give individual legal, financial, insurance, mechanical,
              dealer, lender, or professional advice, but real car-buying
              situations help us build clearer examples, checklists, and
              decision guides.
            </p>
          </section>
        ) : (
          <form className="share-situation-form" onSubmit={handleSubmit}>
            <label>
              <span>Buying area</span>
              <select name="vertical" defaultValue={initialVertical}>
                <option value="">Choose one</option>
                {BUYING_AREAS.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Vehicle, optional</span>
              <input
                name="vehicle"
                placeholder="Example: 2018 Toyota Camry / used EV / rebuilt-title SUV"
              />
            </label>

            <label>
              <span>What is the buying situation?</span>
              <textarea
                name="situation"
                rows="5"
                placeholder="Example: The seller says the car is clean, but the service history is thin and the price is lower than similar listings."
              />
            </label>

            <label>
              <span>What are you trying to decide?</span>
              <textarea
                name="decision_question"
                rows="4"
                placeholder="Example: I am trying to decide whether to buy it, get an inspection, negotiate harder, wait, or walk away."
              />
            </label>

            <label>
              <span>Seller or channel</span>
              <select name="seller_channel" defaultValue="">
                <option value="">Choose one</option>
                <option value="dealer">Dealer</option>
                <option value="private_seller">Private seller</option>
                <option value="marketplace">Marketplace listing</option>
                <option value="online_retailer">Online retailer</option>
                <option value="auction">Auction or wholesale</option>
                <option value="friend_family">Friend, family, or known seller</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </label>

            <label>
              <span>Price, payment, or quote, optional</span>
              <input
                name="approximate_amount"
                placeholder="Example: $18,500 asking price / $420 monthly payment / $2,000 trade-in"
              />
            </label>

            <label>
              <span>Main concern</span>
              <select name="main_concern" defaultValue="">
                <option value="">Choose one</option>
                <option value="condition">Condition or inspection risk</option>
                <option value="price">Price or value</option>
                <option value="financing">Financing or monthly payment</option>
                <option value="paperwork">Title, registration, or paperwork</option>
                <option value="seller_pressure">Seller pressure or urgency</option>
                <option value="fit">Whether the vehicle fits my needs</option>
                <option value="reliability">Reliability or future repairs</option>
                <option value="safety">Safety</option>
                <option value="unsure">Not sure</option>
              </select>
            </label>

            <label>
              <span>Timing</span>
              <select name="timing" defaultValue="">
                <option value="">Choose one</option>
                <option value="urgent">I need a vehicle soon</option>
                <option value="active_deal">I am deciding on an active deal</option>
                <option value="shopping">I am still shopping</option>
                <option value="planning">Planning ahead</option>
                <option value="unsure">Not sure</option>
              </select>
            </label>

            <label>
              <span>Email, optional</span>
              <input name="email" type="email" placeholder="you@example.com" />
            </label>

            <button type="submit">Submit car-buying situation</button>
          </form>
        )}

        <p className="share-situation-disclaimer">
          AutoBuyScope does not provide legal, financial, insurance, mechanical,
          dealer, lender, tax, or professional advice. Submissions may be used to
          improve future examples, checklists, and car-buying decision guides.
        </p>
      </div>
    </main>
  );
}