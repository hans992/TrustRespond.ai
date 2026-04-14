import { describe, expect, it } from "vitest";
import { BillingService } from "../src/index";

describe("BillingService", () => {
  it("decrements starter quota usage", () => {
    const billing = new BillingService();
    const result = billing.reserveQuestionnaireUsage("org_1", "starter");
    expect(result.used).toBe(1);
    expect(result.remaining).toBe(9);
  });
});
