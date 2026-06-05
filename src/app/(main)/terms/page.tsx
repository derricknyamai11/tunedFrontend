import { Navbar } from "../_components/Navbar";
import { Footer } from "../_components/Footer";

export default function Page() {
  const titles: Record<string, string> = {
    "terms": "Terms of Service",
    "privacy": "Privacy Policy",
    "refund-policy": "Refund Policy",
  };
  const key = "terms";
  return (
    <>
      <Navbar activeRoute="/terms" />
      <main id="main-content">
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="text-3xl font-black text-white">{titles[key] ?? "Policy"}</h1>
            <p className="text-slate-400 mt-3">Last updated: June 2026</p>
          </div>
        </section>
        <section className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 prose prose-slate">
            <p className="text-slate-600 text-lg">
              This page is being updated. Please contact us at{" "}
              <a href="mailto:info@tunedessays.com" className="text-emerald-600 underline">
                info@tunedessays.com
              </a>{" "}
              for the full policy document.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
