export const metadata = {
  title: "Imprint",
  description: "Legal imprint and contact information for Rati Agrawal.",
  alternates: {
    canonical: "/imprint",
  },
};

export default function ImprintPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <p className="eyebrow">Rati Agrawal</p>
        <h1>Imprint</h1>
        <p>
          Replace this page with your legal entity details, registered address, and jurisdictional
          requirements before launch.
        </p>
        <p>
          Suggested fields: business name, owner, address, contact email, registration number, VAT
          details, and responsible party for editorial content.
        </p>
      </div>
    </main>
  );
}
