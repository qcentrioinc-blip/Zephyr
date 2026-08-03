/** Shared finished-goods packaging slides for formula cards (after bottle). */
export const PACKAGING_SLIDE_PATHS = [
  "/Homepage/production/jar.webp",
  "/Homepage/production/pack-sachet.webp",
  "/Homepage/production/blister.webp",
  "/Homepage/production/bulk.webp",
  "/Homepage/production/bottle.webp",
  "/Homepage/production/alu-alu.webp",
  "/Homepage/production/stick-pack.webp",
] as const;

export function buildFormulaSlides(bottleImage: string): string[] {
  return [bottleImage, ...PACKAGING_SLIDE_PATHS];
}
