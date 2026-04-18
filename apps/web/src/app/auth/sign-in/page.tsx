import { SignInForm } from "@/components/auth/SignInForm";

type SearchParams = { error?: string };

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? decodeURIComponent(error) : null;

  return <SignInForm serverError={errorMessage} />;
}
