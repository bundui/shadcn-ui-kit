import { dashboardData } from "@/components/sections/dashboard-data";

export enum ProductTypeEnum {
  Pro = "pro",
  Template = "template",
  Team = "team",
  Enterprise = "enterprise",
}

export enum ProductTypeNamedEnum {
  Pro = "Pro",
  Template = "Template",
  Team = "Team",
  Enterprise = "Enterprise",
}

export interface Product {
  id: number;
  name?: string;
  full_name?: string;
  slug?: string;
  short_description?: string;
  long_description?: string;
  key: string;
  type: {
    key: ProductTypeEnum;
    name: ProductTypeNamedEnum;
  };
  title?: string;
  subtitle?: string;
  images?: ProductImage[];
  price?: string;
  old_price?: string;
  preview_url?: string;
  download_url?: string;
  github_url?: string;
  inTemplates?: boolean;
  version?: string;
  primitives?: string;
}

interface ProductImage {
  url: string;
  title: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Cosmic",
    title: "Cosmic - Next.js SaaS Landing Page Template",
    slug: "cosmic-landing-page-template",
    short_description: "A high converting landing page.",
    long_description:
      "Cosmic is a modern SaaS landing page template built with Next.js, Tailwind CSS, and shadcn/ui. It pairs conversion focused sections with dark mode support and a fully responsive design, so you can launch a polished, high converting product website in minutes instead of weeks.",
    key: "cosmic",
    subtitle: "Next.js SaaS Landing Page Template",
    images: [
      {
        url: "/images/templates/cosmic/01.png",
        title: "Light mode",
      },
      {
        url: "/images/templates/cosmic/02.png",
        title: "Dark mode",
      },
    ],
    price: "$49",
    preview_url: "https://cosmic.shadcnuikit.com",
    download_url:
      "https://github.com/bundui/cosmic/archive/refs/heads/main.zip",
    github_url: "https://github.com/bundui/cosmic",
    type: {
      key: ProductTypeEnum.Template,
      name: ProductTypeNamedEnum.Template,
    },
    inTemplates: true,
  },
  {
    id: 2,
    name: "Soho",
    title: "Soho - Next.js Chat App Template",
    slug: "soho-chat-app-template",
    short_description: "A template you can use to create chat-style apps.",
    long_description:
      "Soho is a chat app template built with the latest version of Next.js, Tailwind CSS, and shadcn/ui on Base UI primitives. It ships with real world messaging screens such as chat lists, conversation views, contact details, and settings, all responsive and dark mode ready, making it an ideal starting point for messaging and support products.",
    key: "soho",
    subtitle: "Next.js Chat App Template",
    images: [
      {
        url: "/images/templates/soho/01.png",
        title: "Chat list and messages",
      },
      {
        url: "/images/templates/soho/02.png",
        title: "Dark mode",
      },
      {
        url: "/images/templates/soho/03.png",
        title: "Contact list and details",
      },
      {
        url: "/images/templates/soho/04.png",
        title: "Chat is not selected",
      },
      {
        url: "/images/templates/soho/05.png",
        title: "Settings modal",
      },
      {
        url: "/images/templates/soho/06.png",
        title: "Incoming call modal",
      },
      {
        url: "/images/templates/soho/07.png",
        title: "Incoming call modal",
      },
      {
        url: "/images/templates/soho/08.png",
        title: "Incoming call modal",
      },
    ],
    price: "$49",
    preview_url: "https://soho.shadcnuikit.com",
    version: "2.0.0",
    primitives: "Base UI",
    download_url:
      "https://github.com/bundui/soho-nextjs/archive/refs/heads/main.zip",
    github_url: "https://github.com/bundui/soho-nextjs",
    type: {
      key: ProductTypeEnum.Template,
      name: ProductTypeNamedEnum.Template,
    },
    inTemplates: true,
  },
  {
    id: 3,
    name: "Neofolio",
    title: "Neofolio - Next.js Portfolio Template",
    slug: "neofolio-portfolio-template",
    short_description: "A dashboard style portfolio website template.",
    long_description:
      "Neofolio is a dashboard style portfolio website template built with Next.js, Tailwind CSS, and shadcn/ui. Showcase your projects, sell digital products, and present your experience through a clean, responsive interface with dark mode support. Ideal for developers, designers, and freelancers.",
    key: "neofolio",
    subtitle: "Next.js Portfolio Template",
    images: [
      {
        url: "/images/templates/neofolio/01.png",
        title: "Light mode",
      },
      {
        url: "/images/templates/neofolio/02.png",
        title: "Dark mode",
      },
    ],
    price: "$49",
    preview_url: "https://neofolio.shadcnuikit.com",
    download_url:
      "https://github.com/bundui/neofolio/archive/refs/heads/main.zip",
    github_url: "https://github.com/bundui/neofolio",
    type: {
      key: ProductTypeEnum.Template,
      name: ProductTypeNamedEnum.Template,
    },
    inTemplates: true,
  },
  {
    id: 7,
    name: "Waitly",
    title: "Waitly - Free Next.js Waitlist Template",
    subtitle: "Next.js Waitlist Template",
    slug: "waitly-free-waitlist-template",
    short_description: "A simple and useful waitlist template.",
    long_description:
      "Waitly is a free, open source waitlist template built with Next.js, Tailwind CSS, and shadcn/ui. Collect signups before launch with a clean landing page and email capture form, backed by dark mode and a fully responsive design that is easy to customize and deploy.",
    key: "waitly",
    images: [
      {
        url: "/images/templates/waitly/01.png",
        title: "Light",
      },
      {
        url: "/images/templates/waitly/02.png",
        title: "Dark",
      },
    ],
    price: "0",
    preview_url: "https://waitly.shadcnuikit.com",
    download_url:
      "https://github.com/bundui/waitly/archive/refs/heads/main.zip",
    github_url: "https://github.com/bundui/waitly",
    type: {
      key: ProductTypeEnum.Template,
      name: ProductTypeNamedEnum.Template,
    },
    inTemplates: true,
  },
  {
    id: 4,
    key: ProductTypeEnum.Pro,
    price: "$79",
    old_price: "$129",
    title: `Shadcn UI Kit ${ProductTypeNamedEnum.Pro}`,
    type: {
      key: ProductTypeEnum.Pro,
      name: ProductTypeNamedEnum.Pro,
    },
  },
  {
    id: 5,
    key: ProductTypeEnum.Team,
    price: "$199",
    old_price: "$399",
    title: `Shadcn UI Kit ${ProductTypeNamedEnum.Team}`,
    type: {
      key: ProductTypeEnum.Team,
      name: ProductTypeNamedEnum.Team,
    },
  },
  {
    id: 6,
    key: ProductTypeEnum.Enterprise,
    price: "$499",
    old_price: "$699",
    title: `Shadcn UI Kit ${ProductTypeNamedEnum.Enterprise}`,
    type: {
      key: ProductTypeEnum.Enterprise,
      name: ProductTypeNamedEnum.Enterprise,
    },
  },
  {
    id: 8,
    name: "Admin Dashboard",
    title: "Next.js Admin Dashboard Template",
    subtitle: "Next.js Admin Dashboard Template",
    key: "dashboard",
    short_description:
      `A Next.js template featuring ${dashboardData.dashboards.length} different dashboards and dozens of subpages.`,
    download_url:
      "https://github.com/bundui/shadcn-ui-kit-dashboard/archive/refs/heads/main.zip",
    github_url: "https://github.com/bundui/shadcn-ui-kit-dashboard",
    type: {
      key: ProductTypeEnum.Template,
      name: ProductTypeNamedEnum.Template,
    },
  },
];
