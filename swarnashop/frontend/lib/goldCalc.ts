export interface GoldCalcInput {
  weightGrams: number;
  goldRatePerGram: number;
  makingChargePerc: number;
  wastagePerc: number;
  gstPerc: number;
}

export interface GoldCalcBreakdown {
  goldValue: number;
  makingAmt: number;
  wastageAmt: number;
  subtotal: number;
  gstAmt: number;
  finalPrice: number;
}

export function calculateGoldPrice(input: GoldCalcInput): GoldCalcBreakdown {
  const goldValue = input.weightGrams * input.goldRatePerGram;
  const makingAmt = goldValue * (input.makingChargePerc / 100);
  const wastageAmt = goldValue * (input.wastagePerc / 100);
  const subtotal = goldValue + makingAmt + wastageAmt;
  const gstAmt = subtotal * (input.gstPerc / 100);
  const finalPrice = subtotal + gstAmt;
  return { goldValue, makingAmt, wastageAmt, subtotal, gstAmt, finalPrice };
}
