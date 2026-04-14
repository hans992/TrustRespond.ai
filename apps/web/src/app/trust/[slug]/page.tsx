import { notFound } from "next/navigation";
import { trustCenterPages } from "@/lib/mock-store";

export default function TrustCenterPublicPage({ params }: { params: { slug: string } }) {
  const page = trustCenterPages.find((p) => p.slug === params.slug && p.isPublished);
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
