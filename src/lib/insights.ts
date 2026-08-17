/**
 * Insights content: pillars and articles (Step 12). Article bodies are stored
 * as simple blocks so they render consistently and move cleanly into a CMS.
 * The flagship is written in full; two more are seeded. The rest of the
 * editorial plan is added over time.
 */

export const pillars: { name: string; desc: string }[] = [
  { name: "Know Your Numbers", desc: "Diagnostics, profit, pricing, and the data behind good decisions." },
  { name: "Know Your Customers", desc: "Segmentation, retention, and where the next customers are." },
  { name: "Practical AI & Modernization", desc: "AI and technology, framed by what they do, not the hype." },
  { name: "Deciding & Growing", desc: "Prioritization, roadmaps, and making strategy stick." },
  { name: "The Owner's Seat", desc: "Family business, succession, and professionalizing: the human side." },
];

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "pull"; text: string }
  | { type: "note"; text: string };

export type Article = {
  slug: string;
  title: string;
  pillar: string;
  excerpt: string;
  readingTime: string;
  date: string;
  featured?: boolean;
  body: Block[];
};

export const articles: Article[] = [
  {
    slug: "where-do-you-actually-make-money",
    title: "Where do you actually make money?",
    pillar: "Know Your Numbers",
    excerpt:
      "Most owners can tell you their revenue to the dollar. Far fewer can tell you which products, customers, and locations actually earn it, and that gap is where good businesses quietly lose money.",
    readingTime: "6 min read",
    date: "July 2026",
    featured: true,
    body: [
      { type: "p", text: "Ask a business owner how things are going, and the answer almost always comes back as one number: revenue. Sales are up, sales are flat, sales are down. It's the figure on the dashboard, the one that comes up at the family dinner, the number that feels like the score at the end of the game." },
      { type: "p", text: "But revenue is not profit. And profit, the single line at the bottom of the P&L, hides more than it shows. It tells you the business made money last year. It doesn't tell you why, or which parts of the business carried the rest." },
      { type: "p", text: "So here's a question worth sitting with. If you had to rank your products, your customers, and your locations from most profitable to least, not by revenue, by actual profit, after the real cost of serving each one, could you? Most owners can't. Not because they aren't sharp. Because no one ever built them the view." },
      { type: "p", text: "That missing view is expensive." },
      { type: "h2", text: "The quiet cross-subsidy" },
      { type: "p", text: "In nearly every business we look at, the same pattern appears. One part of the business is quietly subsidizing another." },
      { type: "p", text: "A few products earn most of the margin, while a long tail earns almost nothing, or loses money once you count the cost of stocking, making, and handling them. A handful of customers are a genuine pleasure and a genuine profit; others consume time, discounts, rush jobs, and hand-holding until they cost more than they pay. One location looks busy and feels like the flagship right up until you account for the rent, the labor, and the manager's time it really takes to run." },
      { type: "p", text: "None of this shows up in revenue. And it often doesn't show up in the P&L either, because the P&L adds everything together. The winners and the losers are blended into one comfortable number at the bottom. The business is profitable overall, so the parts that are bleeding stay invisible." },
      { type: "pull", text: "A business can be profitable overall and still be profitable in spite of itself." },
      { type: "h2", text: "An illustration" },
      { type: "note", text: "Illustrative example: representative of the work, not a specific client." },
      { type: "p", text: "Picture a small café group, three locations, the kind of business that feels like it's doing fine. Revenue is up year over year. The owner assumes the busiest store is the best one and is already thinking about a fourth." },
      { type: "p", text: "Separate the numbers, though, and a different story surfaces. The busy store carries higher rent and labor that eat most of its margin; it's turning the most cash and keeping the least. Two of the most popular menu items, once you count the labor to make them, are sold at a loss on every order. And a slower, unglamorous location is quietly the most profitable of the three." },
      { type: "p", text: "Nothing here is a disaster. That's the point. The business works. But the owner is about to make a seven-figure expansion decision based on the store that feels best rather than the one that is best, and is subsidizing two menu items without knowing it. The fix isn't dramatic. It's a repricing, a menu change, and a better site decision. But you can't make any of those moves until you can see them." },
      { type: "h2", text: "Why it stays hidden" },
      { type: "p", text: "If this is so common, why don't more owners see it? Three reasons, usually. The data is scattered: the pieces of the answer live in the point-of-sale system, the accounting software, and a spreadsheet someone built two years ago, and no one has joined them up. It's nobody's job: the owner is running the business, the bookkeeper is closing the books, and no one's role is to sit between them and ask, “where do we actually make money?” And the tools that would answer it are built for bigger companies, which is exactly the gap that leaves capable owners flying on instinct." },
      { type: "h2", text: "How to actually find out" },
      { type: "p", text: "You don't need a data-science team to answer this. You need to do three honest things. Pick the unit that matters: products, customers, locations, jobs, whatever your business is really made of. Load the real costs, not just the obvious ones, but the labor and time to deliver, the discounts and returns, the freight, the cost to serve the difficult account. Then rank them, from most profitable to least. The picture is almost always a little uncomfortable, and immediately useful." },
      { type: "p", text: "That ranked view is the heart of what we call a Profit Map: a plain picture of where money is made and lost across the business. It isn't exotic analysis. It's ordinary, rigorous work, the kind large companies do as a matter of course and most owner-run businesses have simply never had built for them." },
      { type: "h2", text: "What it changes" },
      { type: "p", text: "Once you can see it, the moves tend to be obvious, and often quick. Reprice or retire the products that lose money. Protect and grow the ones that carry the business. Stop spending marketing to win more of the customers who cost you. Put the next location where the profit is, not where the traffic feels good. These aren't turnarounds. They're adjustments. And because they use money you're already leaving on the table, they usually show up fast, without selling a single extra unit." },
      { type: "h2", text: "Try this before you do anything formal" },
      { type: "p", text: "You can start this week, on the back of an envelope. Take your ten best-selling products, or your ten biggest customers. For each one, estimate, honestly, what it truly costs you to deliver, hidden costs included. You'll feel the pattern before you can prove it. That instinct is the beginning. The numbers are what turn it into a decision." },
      { type: "p", text: "Revenue tells you the business is moving. It doesn't tell you where it's making money. The owners who find that out, and act on it, often discover they don't need to sell more to earn more. They need to see clearly." },
    ],
  },
  {
    slug: "revenue-is-not-profit",
    title: "Revenue is not profit: the number most owners track wrong.",
    pillar: "Know Your Numbers",
    excerpt:
      "Sales are up, but is the business actually keeping more? The number most owners watch is the one that hides the most.",
    readingTime: "3 min read",
    date: "July 2026",
    body: [
      { type: "p", text: "Ask most owners how the business is doing and the answer is a revenue figure. It's the number on the dashboard and the one that feels like the score." },
      { type: "p", text: "But revenue only tells you how much came in, not how much you kept, or which parts of the business kept it. Two companies with identical revenue can have wildly different profit, and the same company can grow revenue while quietly losing ground on margin." },
      { type: "h2", text: "What to watch instead" },
      { type: "p", text: "Start with profit by the thing your business is really made of: product, customer, location, or job. Not the single line at the bottom of the P&L, which blends your best and worst work into one comfortable number, but a ranked view of where money is actually made and lost." },
      { type: "p", text: "That view almost always holds a surprise: a handful of things carry the business, and a long tail earns little or loses money. Once you can see it, the moves are usually obvious, and it's the same shift The Aperture Method™ starts with, turning revenue you can count into profit you can act on." },
    ],
  },
  {
    slug: "what-can-ai-do-for-my-business",
    title: "What can AI actually do for a business like mine?",
    pillar: "Practical AI & Modernization",
    excerpt:
      "Cut through the hype. For an owner-run business, AI is less about robots and more about answers you already have the data for.",
    readingTime: "3 min read",
    date: "July 2026",
    body: [
      { type: "p", text: "“Use AI” is advice every owner has heard and almost none has been told how to follow. The word does a lot of hiding: it can mean anything from a chatbot to a forecasting model, which is exactly why it feels like hype." },
      { type: "p", text: "For a business doing a few million in revenue, the honest version is smaller and more useful than the headlines. AI is good at finding patterns in data you already have: which customers are likely to leave, which are ready to buy more, what a realistic forecast looks like, and where demand clusters on a map." },
      { type: "h2", text: "Where it helps, and where it doesn't" },
      { type: "p", text: "Used well, it does the work of an analyst you couldn't otherwise afford, surfacing signals a person would take weeks to find. Used badly, it produces confident answers from thin or messy data. The difference is judgment: every output should be reviewed by a person, and if you can't explain why a recommendation makes sense, you shouldn't act on it." },
      { type: "p", text: "That's our rule. AI supports the decision; you and we still make it. Framed that way, it stops being hype and starts being a practical tool, one that finally fits a business your size." },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
