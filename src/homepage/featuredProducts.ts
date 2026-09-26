import type {
  FormulaCategory,
  FormulaRangeId,
  RangeTheme,
} from "../components/formulaTypes";
import {
  categories as herbCategories,
  theme as herbTheme,
} from "../herbaceutical/data";
import {
  categories as nutraCategories,
  theme as nutraTheme,
} from "../nutraceutical/data";
import {
  categories as organicCategories,
  theme as organicTheme,
} from "../organic/data";

export type RangeMeta = {
  id: FormulaRangeId;
  label: string;
  shortLabel: string;
  href: string;
  theme: RangeTheme;
};

/** Display order: Nutraceutical → Herbaceutical → Organic */
export const FEATURED_RANGES: RangeMeta[] = [
  {
    id: "nutraceutical",
    label: "Nutraceutical",
    shortLabel: "Nutraceutical",
    href: "/nutraceutical",
    theme: nutraTheme,
  },
  {
    id: "herbaceutical",
    label: "Herbaceutical",
    shortLabel: "Herbaceutical",
    href: "/herbaceutical",
    theme: herbTheme,
  },
  {
    id: "organic",
    label: "Organic",
    shortLabel: "Organic",
    href: "/organic",
    theme: organicTheme,
  },
];

const CATALOGS: Record<FormulaRangeId, FormulaCategory[]> = {
  nutraceutical: nutraCategories,
  herbaceutical: herbCategories,
  organic: organicCategories,
};

/** Full category list with formulas for a range. */
export function getCategoriesForRange(
  rangeId: FormulaRangeId,
): FormulaCategory[] {
  return CATALOGS[rangeId];
}

export function getRangeMeta(rangeId: FormulaRangeId): RangeMeta {
  return FEATURED_RANGES.find((r) => r.id === rangeId) ?? FEATURED_RANGES[0];
}

export function enquireHrefForRange(
  rangeId: FormulaRangeId,
  formula: string,
  category: string,
): string {
  const { theme } = getRangeMeta(rangeId);
  return `/contact?subject=${encodeURIComponent(
    `MOQ inquiry - ${theme.title}: ${category}`,
  )}&message=${encodeURIComponent(
    `I would like to enquire about manufacturing / MOQ for:\n${formula}\n\nRange: ${theme.title}\nCategory: ${category}`,
  )}`;
}
