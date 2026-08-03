/** Shared finished-goods packaging slides for formula cards (after bottle). */
export const PACKAGING_SLIDE_PATHS = [
  "/Homepage/production/branded/jar.png",
  "/Homepage/production/branded/pack-sachet.png",
  "/Homepage/production/branded/blister.png",
  "/Homepage/production/branded/bulk.png",
  "/Homepage/production/branded/bottle.png",
  "/Homepage/production/branded/alu-alu.png",
  "/Homepage/production/branded/stick-pack.png",
] as const;

export function buildFormulaSlides(bottleImage: string): string[] {
  return [bottleImage, ...PACKAGING_SLIDE_PATHS];
}
