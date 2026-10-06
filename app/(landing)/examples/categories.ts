export const categories = [
  {
    title: "Cards",
    href: "/examples/cards",
    items: [
      {
        title: "Shadcn Review Card Examples",
        sidebarTitle: "Review Cards",
        description:
          "Rating summaries, star breakdowns, and write-a-review CTAs in compact card layouts. Add social proof to product and landing pages with these shadcn/ui components.",
        href: "/examples/cards/review",
        components: [
          {
            href: "/examples/cards/review/4",
            title: "Review Card 4",
            isPro: false,
            registryName: "review-card4",
          },
          {
            href: "/examples/cards/review/5",
            title: "Review Card 5",
            isPro: false,
            registryName: "review-card5",
          },
          {
            href: "/examples/cards/review/6",
            title: "Review Card 6",
            isPro: false,
            registryName: "review-card6",
          },
          {
            href: "/examples/cards/review/7",
            title: "Review Card 7",
            isPro: false,
            registryName: "review-card7",
          },
          {
            href: "/examples/cards/review/8",
            title: "Review Card 8",
            isPro: false,
            registryName: "review-card8",
          },
          {
            href: "/examples/cards/review/9",
            title: "Review Card 9",
            isPro: false,
            registryName: "review-card9",
          },
          {
            href: "/examples/cards/review/10",
            title: "Review Card 10",
            isPro: false,
            registryName: "review-card10",
          },
          {
            href: "/examples/cards/review/11",
            title: "Review Card 11",
            isPro: false,
            registryName: "review-card11",
          },
          {
            href: "/examples/cards/review/12",
            title: "Review Card 12",
            isPro: false,
            registryName: "review-card12",
          },
          {
            href: "/examples/cards/review/13",
            title: "Review Card 13",
            isPro: false,
            registryName: "review-card13",
          },
        ],
      },
    ],
  },
  {
    title: "Date Picker",
    href: "/examples/date-picker",
    items: [
      {
        title: "Use Cases",
        sidebarTitle: "Use Cases",
        description:
          "Calendar and date-range pickers with presets like today, last 7 days, this month. Copy these shadcn/ui patterns for filters and booking flows.",
        href: "/examples/date-picker/use-cases",
        components: [
          {
            href: "/examples/date-picker/use-cases/1",
            title: "Date Picker 1",
            isPro: false,
            registryName: "date-picker-example1",
          },
          {
            href: "/examples/date-picker/use-cases/2",
            title: "Date Picker 2",
            isPro: false,
            registryName: "date-picker-example2",
          },
          {
            href: "/examples/date-picker/use-cases/3",
            title: "Date Picker 3",
            isPro: false,
            registryName: "date-picker-example3",
          },
          {
            href: "/examples/date-picker/use-cases/4",
            title: "Date Picker 4",
            isPro: false,
            registryName: "date-picker-example4",
          },
        ],
      },
    ],
  },
];

export type Category = (typeof categories)[number]["items"][number];
