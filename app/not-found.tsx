import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page you were looking for has moved, disappeared, or never existed.</p>
        <Link href="/" className="text-link">
          Return home
        </Link>
      </div>
    </main>
  );
}
