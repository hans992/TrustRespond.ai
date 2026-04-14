export default function WorkspacePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>TrustRespond Workspace</h1>
      <p>Upload source security docs, process questionnaires, and publish a trust center.</p>
      <ul>
        <li>Knowledge base ingestion queue and status</li>
        <li>Questionnaire processing and confidence review</li>
        <li>Billing usage and quota controls</li>
      </ul>
      <section style={{ marginTop: 24 }}>
        <h2>Knowledge Base Upload (PDF)</h2>
        <form action="/api/knowledge/upload" method="post" encType="multipart/form-data">
          <input name="file" type="file" accept=".pdf,application/pdf" required />
          <button type="submit">Upload PDF</button>
        </form>
      </section>
      <section style={{ marginTop: 24 }}>
        <h2>Questionnaire Upload</h2>
        <form action="/api/questionnaires/upload" method="post" encType="multipart/form-data">
          <input name="prospectName" type="text" placeholder="Prospect name" />
          <input name="file" type="file" accept=".xlsx,.csv,.docx" required />
          <button type="submit">Upload Questionnaire</button>
        </form>
      </section>
    </main>
  );
}
