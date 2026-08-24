/** Canonical paths under public/packaging — keep in sync with files on disk. */
export const PACKAGING_IMAGES = {
  tablet: "/packaging/tablet.webp",
  capsule: "/packaging/capsule.webp",
  powder: "/packaging/powder.webp",
  gummy: "/packaging/gummy.webp",
  jelly: "/packaging/jelly.webp",
  jar: "/packaging/jar.jpg",
  sachets: "/packaging/Sachets.svg",
  blisters: "/packaging/Blisters.jpg",
  bulkPacks: "/packaging/Bulk packs.jpg",
  bottlePacks: "/packaging/Bottle packs.jpg",
  aluAlu: "/packaging/Alu Alu.jpg",
  stickPack: "/packaging/Stick-pack.svg",
} as const;

/** Shared finished-goods packaging slides for formula cards (after bottle). */
export const PACKAGING_SLIDE_PATHS = [
  PACKAGING_IMAGES.jar,
  PACKAGING_IMAGES.sachets,
  PACKAGING_IMAGES.blisters,
  PACKAGING_IMAGES.bulkPacks,
  PACKAGING_IMAGES.bottlePacks,
  PACKAGING_IMAGES.aluAlu,
  PACKAGING_IMAGES.stickPack,
] as const;

export function buildFormulaSlides(bottleImage: string): string[] {
  return [bottleImage, ...PACKAGING_SLIDE_PATHS];
}
