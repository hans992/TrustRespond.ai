import { processKnowledgeDocumentIngestion } from "./ingestion";

async function runWorkerTick() {
  const documentId = process.env.DEMO_DOCUMENT_ID;
  const orgId = process.env.DEMO_ORG_ID;
  const storagePath = process.env.DEMO_STORAGE_PATH;
  if (!documentId || !orgId || !storagePath) {
    console.log("Worker idle: set DEMO_DOCUMENT_ID, DEMO_ORG_ID, and DEMO_STORAGE_PATH to run ingestion tick.");
    return;
  }

  const result = await processKnowledgeDocumentIngestion({ documentId, orgId, storagePath });
  console.log("Worker ingestion completed", result);
}

void runWorkerTick();
