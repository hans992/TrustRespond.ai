export default function SignInPage() {
  return (
    <main style={{ maxWidth: 420, margin: "60px auto", padding: 16 }}>
      <h1>Sign in</h1>
      <form action="/api/auth/sign-in" method="post" style={{ display: "grid", gap: 12 }}>
        <input name="email" type="email" placeholder="you@company.com" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Sign in</button>
      </form>
      <p>
        Need an account? <a href="/auth/sign-up">Sign up</a>
      </p>
    </main>
  );
}
