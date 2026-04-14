import { notFound } from "next/navigation";
import { trustCenterPages } from "@/lib/mock-store";

export default async function TrustCenterPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = trustCenterPages.find((p) => p.slug === slug && p.isPublished);
  if (!page) {
    notFound();
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>{page.title}</h1>
      <p>{page.description}</p>
      <p>NDA required: {page.ndaRequired ? "Yes" : "No"}</p>
    </main>
  );
}
