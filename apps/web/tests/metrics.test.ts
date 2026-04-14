import { describe, expect, it } from "vitest";
import { computeNrr } from "../src/lib/metrics";

describe("computeNrr", () => {
  it("computes NRR as percentage", () => {
    expect(computeNrr(100, 20, 10)).toBeCloseTo(110, 5);
  });
});
