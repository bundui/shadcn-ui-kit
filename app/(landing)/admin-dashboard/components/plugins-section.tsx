import {
  Calendar,
  BarChart3,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  Columns2,
  Command,
  Database,
  Layout,
  Library,
  Loader2,
  Moon,
  MousePointer2,
  Move,
  Table,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type ToolkitItem = {
  title: string;
  description: string;
  image?: string;
  icon?: LucideIcon;
  href?: string;
};

const toolkit: ToolkitItem[] = [
  {
    image: "/images/tech/shadcn.svg",
    title: "Shadcn UI",
    description:
      "Every page is built on core shadcn/ui primitives, keeping the code simple and easy to customize.",
    href: "https://ui.shadcn.com",
  },
  {
    image: "/nextjs-logo.svg",
    title: "Next.js 16",
    description:
      "Powered by the Next.js App Router, with a clean structure that is easy to manage and optimize.",
    href: "https://nextjs.org",
  },
  {
    image: "/tailwindcss-logo.svg",
    title: "Tailwind CSS 4",
    description:
      "Utility classes follow a careful, readable order, keeping the styling easy to understand and maintain.",
    href: "https://tailwindcss.com",
  },
  {
    image: "/typescript-logo.svg",
    title: "TypeScript",
    description:
      "Full TypeScript support ensures strong type safety, fewer bugs and faster development.",
    href: "https://www.typescriptlang.org",
  },
  {
    icon: Move,
    title: "Dnd Kit",
    description:
      "A lightweight, performant, accessible and extensible drag & drop toolkit for React.",
    href: "https://dndkit.com",
  },
  {
    icon: Table,
    title: "TanStack Table",
    description:
      "Headless UI for building powerful tables & datagrids with full control over markup and styles.",
    href: "https://tanstack.com/table",
  },
  {
    icon: Layout,
    title: "Tiptap",
    description:
      "A headless, framework-agnostic rich text editor framework that's extendable and highly customizable.",
    href: "https://tiptap.dev",
  },
  {
    icon: Command,
    title: "cmdk",
    description:
      "A fast, composable command menu for React. Press a shortcut and jump to any page or action instantly.",
    href: "https://cmdk.paco.me",
  },
  {
    icon: Calendar,
    title: "date-fns",
    description:
      "Modern JavaScript date utility library providing a comprehensive toolset for manipulating dates.",
    href: "https://date-fns.org",
  },
  {
    icon: Library,
    title: "Lucide React",
    description:
      "Beautiful & consistent icon toolkit made by the community, seamlessly integrated for React.",
    href: "https://lucide.dev",
  },
  {
    icon: MousePointer2,
    title: "Motion",
    description:
      "A production-ready motion library for React that makes creating animations easy and declarative.",
    href: "https://www.framer.com/motion",
  },
  {
    icon: Moon,
    title: "Next Themes",
    description:
      "An abstraction for themes in your React app. Perfect dark mode implementation in just a few lines.",
    href: "https://github.com/pacocoursey/next-themes",
  },
  {
    icon: Loader2,
    title: "Nextjs Toploader",
    description:
      "A Next.js Top Loading Bar component that shows a progress bar between route changes.",
    href: "https://github.com/TheSGJ/nextjs-toploader",
  },
  {
    icon: Calendar,
    title: "React DayPicker",
    description:
      "Flexible and customizable date picker component for React, with built-in accessibility and localization.",
    href: "https://daypicker.dev",
  },
  {
    icon: ClipboardCheck,
    title: "React Hook Form",
    description:
      "Performant and flexible forms with easy validation, powering the form-heavy pages across the dashboards.",
    href: "https://react-hook-form.com",
  },
  {
    icon: Columns2,
    title: "Resizable Panels",
    description:
      "Draggable, resizable panel groups for React, used to build flexible split layouts like mail and file apps.",
    href: "https://github.com/bvaughn/react-resizable-panels",
  },
  {
    icon: BarChart3,
    title: "Recharts",
    description:
      "A composable charting library built on React components, designed to be simple and easy to customize.",
    href: "https://recharts.org",
  },
  {
    icon: Bell,
    title: "Sonner",
    description:
      "An opinionated toast notification library for React, delivering clean and accessible feedback messages.",
    href: "https://sonner.emilkowal.ski",
  },
  {
    icon: CheckCircle2,
    title: "Zod Form",
    description:
      "TypeScript-first schema validation for forms, API responses and environment variables.",
    href: "https://zod.dev",
  },
  {
    icon: Database,
    title: "Zustand",
    description:
      "A small, fast and scalable bearbones state-management solution using simplified flux principles.",
    href: "https://zustand-demo.pmnd.rs",
  },
];

const cellClasses =
  "flex h-full flex-col items-center gap-2 border-b p-6 text-center last:border-b-0 sm:border-e sm:max-lg:nth-[2n]:border-e-0 sm:max-lg:nth-last-[-n+2]:border-b-0 lg:nth-[4n]:border-e-0 lg:nth-last-[-n+4]:border-b-0";

function ToolkitCell({ item }: { item: ToolkitItem }) {
  return (
    <>
      <span className="mb-2 inline-flex size-12 shrink-0 items-center justify-center rounded-full border">
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            width={24}
            height={24}
            className={cn("size-6 object-contain", {
              "dark:invert": item.title.includes("Shadcn"),
            })}
          />
        ) : item.icon ? (
          <item.icon className="size-5" />
        ) : null}
      </span>
      <h3 className="font-heading font-semibold md:text-lg">{item.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed text-balance">
        {item.description}
      </p>
    </>
  );
}

export default function PluginsSection() {
  return (
    <section>
      <div className="container border-x px-0">
        <header className="px-4 pt-8 pb-10 text-center md:pt-16">
          <Badge variant="outline">Powerful Toolkit</Badge>
          <h2 className="font-heading font-semibold mt-2 text-2xl md:text-3xl">
            Customized Plugins and Add-ons
          </h2>
        </header>

        <div className="grid border-t sm:grid-cols-2 lg:grid-cols-4">
          {toolkit.map((item) =>
            item.href ? (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(cellClasses, "hover:bg-muted/50 transition-colors")}
              >
                <ToolkitCell item={item} />
              </a>
            ) : (
              <div key={item.title} className={cellClasses}>
                <ToolkitCell item={item} />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
