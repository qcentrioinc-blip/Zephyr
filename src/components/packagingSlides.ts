/** Shared finished-goods packaging slides for formula cards (after bottle). */
export const PACKAGING_SLIDE_PATHS = [
  "/packaging/jar.webp",
  "/packaging/pack-sachet.webp",
  "/packaging/blister.webp",
  "/packaging/bulk.webp",
  "/packaging/bottle.webp",
  "/packaging/alu-alu.webp",
  "/packaging/stick-pack.webp",
] as const;

export function buildFormulaSlides(bottleImage: string): string[] {
  return [bottleImage, ...PACKAGING_SLIDE_PATHS];
}
