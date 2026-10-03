import Link from "next/link";
export default function NotFound() {
  return (
    <section className="error-page container">
      <span className="eyebrow">404 · PAGE NOT FOUND</span>
      <h1>Let’s get you back on track.</h1>
      <p>That page isn’t here. Explore our services or get in touch.</p>
      <div className="actions">
        <Link className="button" href="/">
          Back home
        </Link>
        <Link className="button outline" href="/contact">
          Contact us
        </Link>
      </div>
    </section>
  );
}
