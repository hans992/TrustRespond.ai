import "@trustrespond/parsers/pdf-node-polyfills";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NODE_ENV !== "production") return;

  const { validateEnv } = await import("@trustrespond/config");
  validateEnv(process.env as Record<string, string | undefined>);
}
