export default function SignUpPage() {
  return (
    <main style={{ maxWidth: 420, margin: "60px auto", padding: 16 }}>
      <h1>Create account</h1>
      <form action="/api/auth/sign-up" method="post" style={{ display: "grid", gap: 12 }}>
        <input name="orgName" type="text" placeholder="Company name" required />
        <input name="email" type="email" placeholder="you@company.com" required />
        <input name="password" type="password" placeholder="Password" minLength={8} required />
        <button type="submit">Sign up</button>
      </form>
      <p>
        Already have an account? <a href="/auth/sign-in">Sign in</a>
      </p>
    </main>
  );
}
