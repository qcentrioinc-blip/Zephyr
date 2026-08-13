export interface FormulaItem {
  id: string;
  formula: string;
  image: string;
  description?: string;
  benefits?: string[];
  gallery?: string[];
}

export interface FormulaCategory {
  name: string;
  categoryImage: string;
  formulas: FormulaItem[];
}

export interface RangeTheme {
  title: string;
  subtitle: string;
  accent: string;
  accentSoft: string;
  bg: string;
  border: string;
  heroImage: string;
  overlay: string;
}

export type FormulaRangeId = "herbaceutical" | "nutraceutical" | "organic";
