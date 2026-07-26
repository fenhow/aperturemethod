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
  "HOME-IND-healthcare": {
    src: "/slots/HOME-IND-healthcare-v2.jpg",
    alt: "A clinician-owned healthcare practice",
  },
  "HOME-IND-industrial-manufacturing": {
    src: "/slots/HOME-IND-industrial-manufacturing-v2.jpg",
    alt: "An owner-run manufacturing and fabrication business",
  },
  "HOME-IND-professional-services": {
    src: "/slots/HOME-IND-professional-services-v2.jpg",
    alt: "A founder-led professional services firm",
  },
  "HOME-IND-retail-consumer": {
    src: "/slots/HOME-IND-retail-consumer-v2.jpg",
    alt: "A multi-location retail and consumer business",
  },
  "HOME-INSIGHT-1": {
    src: "/slots/HOME-INSIGHT-1.jpg",
    alt: "A handwritten profit analysis beside a laptop dashboard and calculator",
  },
  "HOME-INSIGHT-2": {
    src: "/slots/HOME-INSIGHT-2.jpg",
    alt: "A business owner using AI tools on a tablet over financial reports",
  },
  "HOME-INSIGHT-3": {
    src: "/slots/HOME-INSIGHT-3.jpg",
    alt: "A strategic-priorities whiteboard beside a profitable-growth planner",
  },
};

export function getSlotImage(id?: string): SlotImage | undefined {
  return id ? slotImages[id] : undefined;
}
