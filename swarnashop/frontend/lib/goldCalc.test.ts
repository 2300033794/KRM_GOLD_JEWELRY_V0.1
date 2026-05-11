import { describe, expect, it } from "vitest";
import { calculateGoldPrice } from "./goldCalc";

describe("calculateGoldPrice", () => {
  it("matches the specified formula", () => {
    const result = calculateGoldPrice({
      weightGrams: 10,
      goldRatePerGram: 7000,
      makingChargePerc: 10,
      wastagePerc: 2,
      gstPerc: 3,
    });
    expect(result.goldValue).toBe(70000);
    expect(result.makingAmt).toBe(7000);
    expect(result.wastageAmt).toBe(1400);
    expect(result.subtotal).toBe(78400);
    expect(result.gstAmt).toBe(2352);
    expect(result.finalPrice).toBe(80752);
  });
});
