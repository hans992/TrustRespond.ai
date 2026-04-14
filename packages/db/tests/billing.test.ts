import { describe, expect, it } from "vitest";
import { TIER_QUOTA_LIMITS } from "../src/index";

describe("TIER_QUOTA_LIMITS", () => {
  it("matches starter plan expectation for tests", () => {
    expect(TIER_QUOTA_LIMITS.starter).toBe(10);
    expect(TIER_QUOTA_LIMITS.free).toBe(1);
    expect(TIER_QUOTA_LIMITS.pro).toBeNull();
  });
});
