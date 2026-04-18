import { Suspense } from "react";
import { ReviewPageContent } from "@/components/app/review/ReviewPageContent";

export default function ReviewPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-4xl px-6 py-10 text-slate-400">Loading review…</main>}>
      <ReviewPageContent />
    </Suspense>
  );
}
