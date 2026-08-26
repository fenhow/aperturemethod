import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Faq } from "@/components/ui/Faq";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { LastReviewed } from "@/components/ui/LastReviewed";
import { HOME_REVIEWED } from "@/lib/site";
import {
  SNAPSHOT_FEE,
  SNAPSHOT_CEILING,
  XRAY_FEE,
  XRAY_CREDIT_TERMS,
  COMPONENT_FEE,
  FULL_METHOD_FEE,
  ATLAS_FEE,
  ATLAS_TERMS,
} from "@/lib/pricing";

/**
 * The questions an owner asks before a first call.
 *
 * The site already answered most of these, spread across four pages. Someone
 * deciding whether to book will not go and find them, and neither will anything
 * summarising the site on their behalf. So they are answered here, on the page
 * people actually land on, in the words they would use to ask.
 *
 * Every figure is read from src/lib/pricing.ts rather than typed, so a price
 * change cannot leave a stale number sitting in an FAQ answer. The Faq
 * component emits the FAQPage structured data from this same array.
 *
 * Answers are deliberately plain text: they are read by a person on the page
 * and quoted verbatim in the schema, and anything that needs formatting to make
 * sense is not a clean answer.
 */
const faqs = [
  {
    q: "What does it cost?",
    a: `Everything is a fixed fee agreed before any work starts. The Business X-Ray is ${XRAY_FEE}, and it ${XRAY_CREDIT_TERMS}. Below ${SNAPSHOT_CEILING} the way in is the Aperture Snapshot at ${SNAPSHOT_FEE}. A single deep component is ${COMPONENT_FEE}. The full Method is ${FULL_METHOD_FEE}. Aperture Atlas, the live platform, starts at ${ATLAS_FEE}, and its terms are a ${ATLAS_TERMS}. No hourly billing, and no invoice you did not see coming.`,
  },
  {
    q: "Is my business the right size for this?",
    a: `It is built for owner-run companies doing roughly $5M to $20M in revenue, usually with more than one location, territory or profit centre: big enough that the decisions carry real money, small enough that a large consultancy is not interested and would not be worth it if they were. Below ${SNAPSHOT_CEILING} we offer one product rather than the whole ladder, the Aperture Snapshot at ${SNAPSHOT_FEE}, and if even that is not the right fit we will tell you so.`,
  },
  {
    q: "How long before I see anything useful?",
    a: "The Business X-Ray produces real findings in its first weeks. A full path from first data to an agreed plan usually runs six to ten weeks. A single component is typically a few weeks on its own. Nothing is held back until a final presentation: you see the work as it lands.",
  },
  {
    q: "Do I need clean, organised data to start?",
    a: "No, and almost nobody does. We work with what exists and improve it as we go. Messy books, a spreadsheet someone built two years ago and a point-of-sale system nobody has ever exported are all normal. What a business does not measure is information too, and it is often part of the answer.",
  },
  {
    q: "Who actually does the work?",
    a: "Fenwick How leads every engagement start to finish, and stays accountable for what reaches you. You are not handed to a junior team after the first conversation. Where a piece of work calls for a specialist, GIS build-out, valuation, tax or legal, he brings in someone vetted for it and still signs off on the result. The Method is what makes that workable at this size: every engagement runs the same five phases with the same instruments, so the analysis arrives structured rather than improvised. It is AI-assisted where that makes it faster or sharper, and every conclusion is reviewed and signed off by a person before it reaches you.",
  },
  {
    q: "Is my financial information safe?",
    a: "Yes. Data is handled on a least-access basis, stored securely, and covered by written terms signed before anything is sent. It is never sold, shared, or reused for another client. Everything built on it, the models, the dashboards and the working files, is yours to keep.",
  },
  {
    q: "What if I am not ready to commit to all of it?",
    a: `Start with the Business X-Ray and decide afterwards. It is fixed fee, low risk, and its whole job is to tell you which parts of the Method you actually need, including the possibility that you need less than you thought. It ${XRAY_CREDIT_TERMS}. If you would rather just ask a question first, that does not begin anything.`,
  },
];

export function HomeFaq() {
  return (
    <Section id="faq" tone="surface">
      <Reveal>
        <SectionHeading
          eyebrow="Before you book"
          title="What owners ask before the first call."
          lede="The seven that come up almost every time, answered plainly. If yours is not here, ask it and it will be answered by the person who would do the work."
        />
      </Reveal>

      <Reveal variant="up" delay={90} className="mt-10">
        <Faq items={faqs} />
      </Reveal>

      <Reveal delay={130} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <LinkArrow href="/contact">Ask a question of your own</LinkArrow>
        </p>
        <LastReviewed date={HOME_REVIEWED} />
      </Reveal>
    </Section>
  );
}
