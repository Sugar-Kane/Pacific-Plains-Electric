import Link from "next/link";
export function Mark() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M32 7v49M15 17h34M10 27h44M20 17v10M44 17v10M12 56h40M23 56l9-29 9 29"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <circle cx="15" cy="17" r="3" fill="currentColor" />
      <circle cx="49" cy="17" r="3" fill="currentColor" />
      <path
        d="M3 36c10-9 18-9 29-9s19 0 29 9"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Pacific Plains Electric home">
      <Mark />
      <span className="brand-text">
        <span className="brand-name">Pacific Plains</span>
        <span className="brand-sub">Electric</span>
      </span>
    </Link>
  );
}
