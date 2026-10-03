"use client";
import { business } from "@/config/business";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="error-page container">
      <h1>Something didn’t load.</h1>
      <p>Please try again, or call us for help.</p>
      <div className="actions">
        <button className="button" onClick={reset}>
          Try again
        </button>
        <a className="button outline" href={business.workPhone.tel}>
          Call {business.workPhone.display}
        </a>
      </div>
    </section>
  );
}
