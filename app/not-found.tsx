import Link from "next/link";
export default function NotFound() {
  return (
    <section className="error-page container">
      <span className="eyebrow">Error 404</span>
      <h1>Page not found</h1>
      <p>The page may have moved. Try the home page or browse our services.</p>
      <div className="actions">
        <Link className="button" href="/">
          Back home
        </Link>
        <Link className="button outline" href="/services">
          View services
        </Link>
      </div>
    </section>
  );
}
