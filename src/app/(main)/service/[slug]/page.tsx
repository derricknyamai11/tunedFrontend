import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ServiceHero } from "./_components/ServiceHero";
import { ServiceDetails } from "./_components/ServiceDetails";
import { RelatedContentSection } from "./_components/RelatedContentSection";
import { 
  fetchServiceBySlug, 
  fetchAcademicLevels 
} from "@/lib/services/service.service";
import { RelatedContentSkeleton } from "./_components/ServiceSkeletons";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await fetchServiceBySlug(slug);

  if (!result.ok) {
    return {
      title: "Service Not Found | TunedEssays",
    };
  }

  const service = result.data;
  return {
    title: `${service.name} Services | TunedEssays`,
    description: service.description ?? undefined,
    openGraph: {
      title: `${service.name} Specialist Services`,
      description: service.description ?? undefined,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;

  const [serviceResult, levelsResult] = await Promise.all([
    fetchServiceBySlug(slug),
    fetchAcademicLevels(),
  ]);

  if (!serviceResult.ok) {
    if (serviceResult.error.status === 404) notFound();
    throw new Error(serviceResult.error.message);
  }

  const service = serviceResult.data;
  const levels = levelsResult.ok ? levelsResult.data : [];

  return (
    <>
      <Navbar activeRoute={`/service/${slug}`} />
      
      <main id="main-content">
        <ServiceHero service={service} levels={levels} />
        
        <ServiceDetails service={service} />
        
        <Suspense fallback={<RelatedContentSkeleton />}>
          <RelatedContentSection serviceId={service.id} />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

