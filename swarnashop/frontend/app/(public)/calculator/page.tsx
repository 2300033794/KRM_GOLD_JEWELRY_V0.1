import { GoldCalculator } from "@/components/calculator/gold-calculator";
import { PageShell } from "@/components/layout/page-shell";

export default function CalculatorPage() {
  return (
    <PageShell title="Gold Calculator">
      <GoldCalculator />
    </PageShell>
  );
}
