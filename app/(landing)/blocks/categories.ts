export const categories = [
  {
    title: "Marketing",
    href: "/blocks/marketing",
    items: [
      {
        title: "Shadcn Hero Sections",
        sidebarTitle: "Hero Section",
        description:
          "Beautiful shadcn/ui hero section examples designed to capture attention and drive conversions. These hero components feature compelling call-to-actions, stunning visuals, and conversion-focused designs perfect for landing pages, SaaS products, and modern websites. Built with shadcn/ui components for seamless integration.",
        href: "/blocks/marketing/hero-sections",
        components: [
          {
            href: "/blocks/marketing/hero-sections/1",
            title: "Hero Section 1",
            description:
              "Centered hero with a small announcement badge, headline, short text, and two buttons.",
            isPro: false,
            registryName: "hero1",
          },
        ],
      },
      {
        title: "Shadcn Newsletter Sections",
        sidebarTitle: "Newsletter Sections",
        description:
          "Grow your email list with conversion-optimized shadcn/ui newsletter section components. These beautifully designed newsletter forms feature compelling copy, strategic placement, and modern designs that maximize sign-ups and subscriber engagement. Built with shadcn/ui form components for seamless integration and validation.",
        href: "/blocks/marketing/newsletter-sections",
        components: [
          {
            href: "/blocks/marketing/newsletter-sections/1",
            title: "Newsletter Section 1",
            description:
              "Newsletter signup with headline, short text, and email input plus button.",
            isPro: false,
            registryName: "newsletter1",
          },
          {
            href: "/blocks/marketing/newsletter-sections/3",
            title: "Newsletter Section 3",
            description: "Email signup section with optional headline and CTA.",
            isPro: false,
            registryName: "newsletter3",
          },
        ],
      },
      {
        title: "Shadcn How It Works Sections",
        sidebarTitle: "How It Works",
        description:
          "How it works section components built with shadcn/ui to guide visitors through a process or set of steps. These blocks use numbered steps, icons, and short descriptions to reduce friction, build confidence, and help users understand the journey before signing up or purchasing.",
        href: "/blocks/marketing/how-it-works",
        components: [
          {
            href: "/blocks/marketing/how-it-works/9",
            title: "How It Works 9",
            description:
              "2x2 grid layout with four steps each showing a number, heading, description, and an inline UI mockup card below.",
            isPro: false,
            registryName: "how-it-works9",
          },
        ],
      },
      {
        title: "Shadcn FAQ Sections",
        sidebarTitle: "FAQs",
        description:
          "Frequently asked questions section components built with shadcn/ui to address common customer concerns and reduce support load. These accordion-based FAQ layouts are clean, accessible, and easy to customize for any product or service.",
        href: "/blocks/marketing/faqs",
        components: [
          {
            href: "/blocks/marketing/faqs/1",
            title: "FAQ 1",
            description:
              "Centered FAQ section with a label, headline, description, and accordion list of questions.",
            isPro: false,
            registryName: "faq1",
          },
        ],
      },
    ],
  },
  {
    title: "Dashboard UI",
    href: "/blocks/dashboard-ui",
    items: [
      {
        title: "Shadcn Login Form Blocks",
        sidebarTitle: "Signin Forms",
        description:
          "Secure and responsive authentication components built with React, TypeScript, and shadcn/ui, featuring integrated Zod validation, type-safe state management, and seamless social login options. These performance-optimized Tailwind CSS blocks are designed to streamline the user sign-in process, ensuring a professional and high-conversion entry point for your web applications.",
        href: "/blocks/dashboard-ui/sign-in-forms",
        components: [
          {
            href: "/blocks/dashboard-ui/sign-in-forms/1",
            title: "Sign In Form 1",
            description: "Login form with email, password, and submit button.",
            isPro: false,
            registryName: "signin-form1",
          },
        ],
      },
      {
        title: "Shadcn Stat Cards Blocks",
        sidebarTitle: "Stat Cards",
        description:
          "Dashboard stat card components built with shadcn/ui to display key metrics, KPIs, and analytics at a glance. These stat cards feature clean layouts, trend indicators, and optional charts perfect for admin panels, SaaS dashboards, and data-heavy applications.",
        href: "/blocks/dashboard-ui/stat-cards",
        components: [
          {
            href: "/blocks/dashboard-ui/stat-cards/1",
            title: "Stat Card 1",
            description: "Card with metric value, label, and optional trend.",
            isPro: false,
            registryName: "stat-card1",
          },
        ],
      },
      {
        title: "Shadcn Modal Dialogs Blocks",
        sidebarTitle: "Modal Dialogs",
        description:
          "Modal and dialog components built with shadcn/ui for confirmations, forms, and focused content. These dialog patterns include login flows, share links, and command palettes with accessible markup and smooth animations for modern web apps.",
        href: "/blocks/dashboard-ui/modal-dialogs",
        components: [
          {
            href: "/blocks/dashboard-ui/modal-dialogs/16",
            title: "Modal Dialog 16",
            description:
              "Confirmation dialog with icon, message, and dismiss button.",
            isPro: false,
            registryName: "dashboard-modal12",
            height: 550,
          },
        ],
      },
      {
        title: "Shadcn Tables Blocks",
        sidebarTitle: "Tables",
        description:
          "High-performance data table components built with React, TypeScript, and shadcn/ui, featuring integrated TanStack Table support, type-safe filtering, and seamless pagination. These modular Tailwind CSS blocks are designed to handle complex datasets with ease, providing a professional and responsive administrative interface for your web applications.",
        href: "/blocks/dashboard-ui/tables",
        components: [
          {
            href: "/blocks/dashboard-ui/tables/1",
            title: "Table 1",
            description:
              "Recent invoices table with status filters, amount sorting and row actions.",
            feature: "Status filter, amount sorting and row actions",
            isPro: false,
            isBgMuted: true,
            isNew: true,
            registryName: "tables1",
          },
          {
            href: "/blocks/dashboard-ui/tables/2",
            title: "Table 2",
            description:
              "Quote summary table with quantity steppers, annual discount toggle and live totals.",
            feature: "Quantity steppers with live quote totals",
            isPro: false,
            isBgMuted: true,
            isNew: true,
            registryName: "tables2",
          },
          {
            href: "/blocks/dashboard-ui/tables/3",
            title: "Table 3",
            description:
              "Launch checklist table with inline status menus, completion checkboxes and progress.",
            feature: "Inline status menus and checklist progress",
            isPro: false,
            isBgMuted: true,
            isNew: true,
            registryName: "tables3",
          },
          {
            href: "/blocks/dashboard-ui/tables/4",
            title: "Table 4",
            description:
              "Product catalog table with search, sortable columns and a working row actions menu.",
            feature: "Searchable catalog with working row actions",
            isPro: false,
            isBgMuted: true,
            isNew: true,
            registryName: "tables4",
          },
          {
            href: "/blocks/dashboard-ui/tables/5",
            title: "Table 5",
            description:
              "Team members table with inline role changes, search, role filter and bulk actions.",
            feature: "Inline role changes and bulk actions",
            isPro: false,
            isBgMuted: true,
            isNew: true,
            registryName: "tables5",
          },
          {
            href: "/blocks/dashboard-ui/tables/6",
            title: "Table 6",
            description:
              "Issue tracker table with status tabs, inline status changes, sorting and pagination.",
            feature: "Status tabs, column toggle and pagination",
            isPro: false,
            isBgMuted: true,
            isNew: true,
            registryName: "tables6",
          },
          {
            href: "/blocks/dashboard-ui/tables/7",
            title: "Table 7",
            description:
              "Expense claims table with row selection, bulk approve or reimburse, and a live total footer.",
            feature: "Bulk approve and live total footer",
            isPro: false,
            isBgMuted: true,
            registryName: "tables7",
          },
        ],
      },
    ],
  },
  {
    title: "Application UI",
    href: "/blocks/application-ui",
    items: [
      {
        title: "Shadcn UI Todo App Blocks",
        sidebarTitle: "Todo App",
        description:
          "Todo app blocks built with shadcn/ui: task lists with status tabs, priorities, due dates, assignees and drag to reorder, plus sheets for adding and editing tasks with subtasks and comments.",
        href: "/blocks/application-ui/todo-app",
        isNew: true,
        components: [
          {
            href: "/blocks/application-ui/todo-app/1",
            title: "Todo App 1",
            description:
              "Simple todo list with an add task input, checkable task cards, delete buttons, a remaining count and a quote.",
            feature: "Simple checklist",
            isPro: false,
            isNew: true,
            registryName: "todo-app1",
          },
        ],
      },
    ],
  },
];

export type Category = (typeof categories)[number]["items"][number];
