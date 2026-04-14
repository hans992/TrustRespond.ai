const path = require("path");
const { loadTrustRespondEnv } = require("../playwright.env.cjs");
const { seedE2eUser } = require("./fixtures/seed-e2e-user.cjs");
const { generateFixtures } = require("./fixtures/generate-fixtures.cjs");

module.exports = async function globalSetup() {
  loadTrustRespondEnv();
  await seedE2eUser();
  const outDir = path.join(__dirname, "fixtures", "generated");
  await generateFixtures(outDir);
};
