/**
 * Real photography, keyed by image-slot code. When a slot appears here,
 * <ImagePlaceholder id="THAT-CODE" /> renders the real photo instead of the
 * placeholder badge — no per-page edits needed.
 *
 * To add one: put the optimized file at public/slots/<CODE>.jpg and add a line
 * below with a short, descriptive alt.
 */
export type SlotImage = { src: string; alt: string };

export const slotImages: Record<string, SlotImage> = {
  "HOME-PLATFORM": {
    src: "/slots/HOME-PLATFORM.png",
    alt: "Fenwick How reviewing analytics at his desk",
  },
};

export function getSlotImage(id?: string): SlotImage | undefined {
  return id ? slotImages[id] : undefined;
}
