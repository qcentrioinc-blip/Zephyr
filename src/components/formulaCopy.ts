import type { FormulaRangeId } from "./formulaTypes";

const RANGE_LABEL: Record<FormulaRangeId, string> = {
  herbaceutical: "Herbaceutical",
  nutraceutical: "Nutraceutical",
  organic: "Organic",
};

const CATEGORY_BENEFITS: Record<string, string[]> = {
  "Joint Care": [
    "Botanical actives suited to mobility and joint-support positioning",
    "Flexible tablet, capsule, and powder formats for US retail channels",
    "GMP-aligned documentation for distributor and retailer onboarding",
  ],
  Immunity: [
    "Vitamin, mineral, and botanical stacks for seasonal immune positioning",
    "Stable shelf-life profiles for national distribution programs",
    "Label-ready ingredient decks for US supplement facts panels",
  ],
  Digestive: [
    "Probiotic, enzyme, and fiber formats for gut-health portfolios",
    "Moisture-controlled packaging options for sensitive actives",
    "Process validation support for commercial scale-up",
  ],
  Energy: [
    "B-vitamin and adaptogen blends for daily energy positioning",
    "Low-MOQ pilot runs before full private-label rollout",
    "Finished-goods packaging aligned to club, e-commerce, and retail",
  ],
  Sleep: [
    "Melatonin and botanical calm blends for evening-use programs",
    "Batch traceability and COA support for quality teams",
    "Child-resistant and retail-ready pack formats on request",
  ],
  "Heart Health": [
    "Omega, plant sterol, and antioxidant formulas for cardiovascular positioning",
    "USP-aligned ingredient sourcing where specified",
    "Commercial batch records for audit-ready partners",
  ],
  "Weight Management": [
    "Fiber, protein, and metabolic-support blends for weight-wellness lines",
    "Clean-label and organic-compliant options where required",
    "Flexible MOQ tiers for test markets and national launches",
  ],
  "Skin & Beauty": [
    "Collagen, biotin, and antioxidant complexes for beauty-from-within lines",
    "Stable dosage forms for long retail shelf programs",
    "Marketing-ready pack shots using standard Zephyr bottle renders",
  ],
  "Men's Health": [
    "Targeted mineral and botanical stacks for men's wellness portfolios",
    "Tablet and softgel-ready process routes",
    "US-focused label and claims review support during brief stage",
  ],
  "Women's Health": [
    "Prenatal, hormonal balance, and daily wellness formulas",
    "Allergen-control and cross-contamination protocols in licensed facility",
    "Pilot-to-scale manufacturing under one CDMO partner",
  ],
  "Organic": [
    "Certified organic-compliant manufacturing workflows",
    "Clean-label ingredient decks for natural retail channels",
    "Transparent supply documentation for US organic positioning",
  ],
};

const DEFAULT_BENEFITS = [
  "Private-label and contract manufacturing for US brand owners",
  "Multiple finished-goods packaging formats from a single partner",
  "Quality systems aligned to dietary supplement GMP expectations",
  "MOQ planning from pilot batch through commercial volume",
];

function pickBenefits(category: string): string[] {
  const direct = CATEGORY_BENEFITS[category];
  if (direct) return direct;

  for (const [key, benefits] of Object.entries(CATEGORY_BENEFITS)) {
    if (
      category.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(category.toLowerCase())
    ) {
      return benefits;
    }
  }

  return DEFAULT_BENEFITS;
}

export function buildFormulaDescription(
  formula: string,
  category: string,
  rangeId: FormulaRangeId,
): string {
  const range = RANGE_LABEL[rangeId];
  return `${formula} is offered as a ${range.toLowerCase()} formulation within our ${category} catalog. Zephyr supports US private-label and contract manufacturing programs with batch release documentation, flexible dosage formats, and finished-goods packaging options. Formulation briefs can be aligned to your target channel, label claims review, and commercial MOQ requirements without retail pricing on this catalog.`;
}

export function buildFormulaBenefits(
  formula: string,
  category: string,
  rangeId: FormulaRangeId,
): string[] {
  const base = pickBenefits(category);
  const rangeNote =
    rangeId === "organic"
      ? "Organic and clean-label positioning for US natural products retail"
      : rangeId === "herbaceutical"
        ? "Botanical ingredient story suitable for herbaceutical brand lines"
        : "Commercial nutraceutical manufacturing for vitamins and specialty supplements";

  return [
    rangeNote,
    ...base.slice(0, 3),
    `Formula reference: ${formula.split("+")[0]?.trim() ?? formula} and supporting actives`,
  ].slice(0, 5);
}

export function getFormulaDetails(
  formula: string,
  category: string,
  rangeId: FormulaRangeId,
  existing?: { description?: string; benefits?: string[] },
) {
  return {
    description:
      existing?.description ??
      buildFormulaDescription(formula, category, rangeId),
    benefits:
      existing?.benefits?.length
        ? existing.benefits
        : buildFormulaBenefits(formula, category, rangeId),
  };
}
