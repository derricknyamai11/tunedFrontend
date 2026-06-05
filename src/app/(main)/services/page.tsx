import { Navbar } from "../_components/Navbar";
import { Footer } from "../_components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | TunedEssays",
  description: "Professional academic writing services — essays, research papers, dissertations, editing and more.",
};

interface Service { id: string; name: string; slug: string; description: string | null; is_active: boolean; category?: { name: string } | string | null; }
interface Category { id: string; name: string; description: string | null; }

async function fetchServicesData(): Promise<{ categories: Category[]; services: Service[] }> {
  const base = process.env.BACKEND_API_URL || "http://localhost:5000";
  try {
    const [catRes, svcRes] = await Promise.all([
      fetch(`${base}/api/services/categories`, { next: { revalidate: 3600 } }),
      fetch(`${base}/api/services`, { next: { revalidate: 3600 } }),
    ]);
    const catData = catRes.ok ? await catRes.json() : { data: [] };
    const svcData = svcRes.ok ? await svcRes.json() : { data: [] };
    return {
      categories: Array.isArray(catData.data) ? catData.data : [],
      services: Array.isArray(svcData.data) ? svcData.data : [],
    };
  } catch {
    return { categories: [], services: [] };
  }
}

const SERVICE_ICONS: Record<string, string> = {
  essay: "✍️", research: "🔬", dissertation: "📚", editing: "✏️",
  proofreading: "🔍", analysis: "📊", presentation: "🎯", coursework: "📝",
  ai: "🤖", case: "📋", report: "📄", literature: "📖",
};

function getIcon(name: string): string {
  const key = name.toLowerCase().split(" ")[0] ?? "";
  return SERVICE_ICONS[key] ?? "📄";
}

function getCategoryName(category: Service["category"]): string {
  if (!category) return "General";
  if (typeof category === "string") return category;
  if (typeof category === "object" && category.name) return category.name;
  return "General";
}

export default async function ServicesPage() {
  const { categories, services } = await fetchServicesData();

  // Group services by category
  const grouped = new Map<string, { cat: string; services: Service[] }>();
  services.filter((s) => s.is_active).forEach((svc) => {
    const cat = getCategoryName(svc.category);
    if (!grouped.has(cat)) grouped.set(cat, { cat, services: [] });
    grouped.get(cat)!.services.push(svc);
  });

  return (
    <>
      <Navbar activeRoute="/services" />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-slate-900 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/20 uppercase tracking-widest mb-6">
              Our Services
            </span>
            <h1 className="text-4xl font-black text-white tracking-tight sm:text-5xl mb-4">
              Expert Academic <span className="text-emerald-500">Writing Services</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Professional writing, editing, and academic support across all subjects and levels.
              100% original, plagiarism-free work delivered on time.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {grouped.size === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <div className="text-5xl mb-4">📚</div>
                <p className="text-lg">Services loading… Please try refreshing.</p>
              </div>
            ) : (
              Array.from(grouped.values()).map(({ cat, services: svcs }) => (
                <div key={cat} className="mb-16">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">{cat}</h2>
                  <div className="h-1 w-16 bg-emerald-500 rounded mb-8" />
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {svcs.map((svc) => (
                      <Link
                        key={svc.id}
                        href={`/service/${svc.slug}` as never}
                        className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-200"
                      >
                        <div className="text-3xl">{getIcon(svc.name)}</div>
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{svc.name}</h3>
                          {svc.description && (
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{svc.description}</p>
                          )}
                        </div>
                        <span className="mt-auto text-xs font-semibold text-emerald-600 group-hover:underline">
                          View details →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* CTA */}
            <div className="mt-16 rounded-3xl bg-slate-900 px-8 py-12 text-center">
              <h2 className="text-2xl font-black text-white mb-3">Can&apos;t find what you need?</h2>
              <p className="text-slate-400 mb-6">Contact us — we handle custom academic writing requests too.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href={"/order" as never} className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3 text-sm font-bold text-slate-900 hover:bg-emerald-400 transition-colors">
                  Place an Order
                </Link>
                <Link href={"/contact" as never} className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-8 py-3 text-sm font-bold text-white hover:border-emerald-500 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
