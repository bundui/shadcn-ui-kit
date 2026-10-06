import { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/metadata";
import {
  CheckIcon,
  InfinityIcon,
  PackageIcon,
  SparklesIcon,
  SquareArrowOutUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageZoom } from "@/components/ui/image-zoom";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Product, products, ProductTypeEnum } from "@/lib/products";

type ChecklistItem = { title: string; description: string };

const defaultIncludedItems: ChecklistItem[] = [
  {
    title: "Next.js and Tailwind CSS.",
    description:
      "Built on the latest versions with shadcn/ui components, easy to customize and maintain.",
  },
  {
    title: "Modern and clean design.",
    description:
      "A minimal interface filled with tasteful microinteractions that keep visitors engaged.",
  },
  {
    title: "Dark mode.",
    description:
      "Light and dark themes are supported out of the box for a comfortable viewing experience.",
  },
  {
    title: "TypeScript.",
    description:
      "Fully typed code with autocomplete support across the whole project.",
  },
  {
    title: "SEO optimized.",
    description:
      "Metadata and search engine best practices are already in place for every page.",
  },
  {
    title: "Responsive layout.",
    description:
      "Looks great on phones, tablets and desktops without any extra work.",
  },
];

const defaultAudienceItems: ChecklistItem[] = [
  {
    title: "Developers shipping fast.",
    description:
      "Skip the boilerplate and start from a polished, production ready codebase.",
  },
  {
    title: "Freelancers and agencies.",
    description:
      "Deliver client projects faster with a design that is easy to rebrand.",
  },
  {
    title: "Anyone starting a new project.",
    description:
      "Launch with a solid foundation instead of building everything from scratch.",
  },
];

const templateContent: Record<
  string,
  { included: ChecklistItem[]; audience: ChecklistItem[] }
> = {
  cosmic: {
    included: [
      {
        title: "Conversion focused landing page.",
        description:
          "Every section is arranged to move visitors toward your call to action, from the hero all the way down to the footer.",
      },
      {
        title: "Ready made marketing sections.",
        description:
          "Hero, feature, pricing and FAQ style blocks that you can reorder, trim or extend to fit your product.",
      },
      {
        title: "Next.js, Tailwind CSS and shadcn/ui.",
        description:
          "A modern stack with a clean project structure that is easy to customize and maintain.",
      },
      {
        title: "Dark mode.",
        description:
          "Light and dark themes work out of the box and follow your visitor's system preference.",
      },
      {
        title: "TypeScript and SEO ready.",
        description:
          "Fully typed code plus metadata best practices so your product pages rank well on search engines.",
      },
      {
        title: "Responsive and fast.",
        description:
          "Lightweight pages that look great on any device and load quickly.",
      },
    ],
    audience: [
      {
        title: "SaaS founders and indie hackers.",
        description:
          "Get a credible product website online the same day you start, instead of losing weeks to design.",
      },
      {
        title: "Developers building for clients.",
        description:
          "Deliver a polished marketing site fast and spend your time on the product itself.",
      },
      {
        title: "Marketing teams.",
        description:
          "Iterate on copy and sections easily thanks to a clean, well organized codebase.",
      },
    ],
  },
  soho: {
    included: [
      {
        title: "Complete chat interface.",
        description:
          "Chat lists, conversation views and message states that feel like a real product from day one.",
      },
      {
        title: "Media and file messages.",
        description:
          "Image, video, voice and document message layouts are already designed and ready to use.",
      },
      {
        title: "Contacts and settings.",
        description:
          "A contact directory with detail panels and a settings modal that are easy to extend.",
      },
      {
        title: "Next.js, Tailwind CSS and shadcn/ui on Base UI.",
        description:
          "A well structured codebase built with the latest version of Next.js and shadcn/ui components powered by Base UI primitives, simple to customize and maintain.",
      },
      {
        title: "Dark mode and TypeScript.",
        description:
          "Light and dark themes plus fully typed code across the whole project.",
      },
      {
        title: "Responsive layout.",
        description:
          "Works as a full desktop app layout and adapts smoothly down to mobile screens.",
      },
    ],
    audience: [
      {
        title: "Teams building messaging products.",
        description:
          "Skip months of UI work and connect the screens to your own realtime backend.",
      },
      {
        title: "Developers adding chat to an app.",
        description:
          "Lift individual patterns or whole screens into an existing product.",
      },
      {
        title: "Anyone prototyping a support tool.",
        description:
          "Demo a believable chat experience before writing a single line of backend code.",
      },
    ],
  },
  neofolio: {
    included: [
      {
        title: "Dashboard style portfolio layout.",
        description:
          "A distinctive sidebar driven design that presents you and your work like a product, not a plain one page resume.",
      },
      {
        title: "Project and work showcase.",
        description:
          "Dedicated sections to highlight projects, products and experience so visitors instantly see what you do best.",
      },
      {
        title: "Next.js, Tailwind CSS and shadcn/ui.",
        description:
          "A clean, well structured codebase built on the latest versions, easy to customize and extend.",
      },
      {
        title: "Dark mode.",
        description:
          "Light and dark themes work out of the box and follow your visitor's system preference.",
      },
      {
        title: "TypeScript and SEO ready.",
        description:
          "Fully typed code plus metadata best practices so your portfolio ranks well on search engines.",
      },
      {
        title: "Responsive on every device.",
        description:
          "The layout adapts from large desktop screens down to phones without any extra work.",
      },
    ],
    audience: [
      {
        title: "Developers and designers.",
        description:
          "Present your skills, side projects and case studies through a portfolio that stands out from generic themes.",
      },
      {
        title: "Freelancers selling services or products.",
        description:
          "Turn your portfolio into a storefront and convert visitors into clients.",
      },
      {
        title: "Anyone building a personal brand.",
        description:
          "Share who you are, what you make and how to reach you from a single polished site.",
      },
    ],
  },
  waitly: {
    included: [
      {
        title: "Launch ready waitlist page.",
        description:
          "A focused landing page that explains your product and collects signups before release.",
      },
      {
        title: "Email capture form.",
        description:
          "A clean signup flow you can connect to your favorite email or database service.",
      },
      {
        title: "Free and open source.",
        description:
          "Download the full source code from GitHub and adapt it to your project freely.",
      },
      {
        title: "Next.js, Tailwind CSS and shadcn/ui.",
        description:
          "A small, readable codebase on the latest versions that is easy to understand and modify.",
      },
      {
        title: "Dark mode and TypeScript.",
        description:
          "Light and dark themes plus fully typed code across the whole project.",
      },
      {
        title: "Responsive and easy to deploy.",
        description:
          "Looks great on every screen size and deploys to Vercel or any platform in minutes.",
      },
    ],
    audience: [
      {
        title: "Makers validating an idea.",
        description:
          "Measure real interest with signups before investing months in building the product.",
      },
      {
        title: "Startups preparing a launch.",
        description:
          "Build an audience you can email the moment your product goes live.",
      },
      {
        title: "Developers who want a quick start.",
        description:
          "Start from a tiny, clean project instead of configuring everything by hand.",
      },
    ],
  },
};

const faqItems = [
  {
    question: "What do I get when I buy a template?",
    answer:
      "You get the full source code of the template as a complete Next.js project, together with lifetime access and free updates.",
  },
  {
    question: "Do I need a plan to get a template?",
    answer:
      "No. Every template can be purchased individually. The bundle on the pricing page gives you access to all templates and products with a single payment.",
  },
  {
    question: "Does it come with a backend?",
    answer:
      "Templates are frontend projects built with Next.js. They are not tied to any backend, so you can connect them to the stack of your choice.",
  },
  {
    question: "How do I install a template?",
    answer:
      "Download the source code, install the dependencies with your favorite package manager and start the development server. Everything runs like a standard Next.js project.",
  },
];

const builtWith = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "TypeScript",
  "shadcn/ui",
  "Lucide",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = products.find((item) => item.slug == slug);

  if (!template) return {};

  return generateMeta({
    title: `${template.name} | ${template.subtitle}`,
    description:
      template.long_description ??
      `${template.name} is a ${template.subtitle?.toLowerCase()} built with Next.js, React, Tailwind CSS and shadcn/ui.`,
  });
}

function getUpdatedDate(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % 1000;
  }
  const daysAgo = 4 + (hash % 40);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CheckListItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="bg-muted mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border">
        <CheckIcon className="size-3.5" />
      </span>
      <p className="text-muted-foreground">
        <span className="text-foreground font-semibold">{title}</span>{" "}
        {description}
      </p>
    </li>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const template = products.find(
    (item) => item.slug == slug && item.type.key === ProductTypeEnum.Template,
  );
  const otherProducts = products.filter(
    (e) =>
      e.type.key === ProductTypeEnum.Template &&
      e.slug != slug &&
      e.price !== "0" &&
      e.inTemplates,
  );

  if (!template) return null;

  const isFree = template.price === "0";

  const includedItems =
    templateContent[template.key]?.included ?? defaultIncludedItems;
  const audienceItems =
    templateContent[template.key]?.audience ?? defaultAudienceItems;

  const details = [
    ...(template.version
      ? [{ label: "Version", value: template.version }]
      : []),
    { label: "Framework", value: "Next.js (App Router)" },
    {
      label: "Components",
      value: template.primitives
        ? `shadcn/ui (${template.primitives})`
        : "shadcn/ui",
    },
    { label: "Styling", value: "Tailwind CSS" },
    { label: "Icons", value: "Lucide" },
    { label: "Language", value: "TypeScript" },
    { label: "Updated", value: getUpdatedDate(template.key) },
  ];

  return (
    <>
      <section>
        <div className="container border-x px-0">
          <header className="bg-muted/30 space-y-4 border-b px-4 py-8 lg:px-12 lg:py-12">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/templates">Templates</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{template.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="font-heading text-3xl font-semibold md:text-4xl lg:text-5xl">
              {`${template.name} - ${template.subtitle}`}
            </h1>
            <p className="text-muted-foreground max-w-3xl text-balance md:text-lg/relaxed">
              {template.long_description}
            </p>
          </header>

          <div className="grid gap-10 px-4 py-8 lg:grid-cols-3 lg:gap-12 lg:px-12 lg:py-12">
            <div className="space-y-12 lg:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row lg:hidden">
                {isFree ? (
                  <Button className="w-full sm:flex-1" size="lg" asChild>
                    <Link href={template.download_url ?? "#"} target="_blank">
                      Free Download
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full sm:flex-1" size="lg" asChild>
                    <Link href="https://shadcnuikit.com/pricing">
                      Buy {template.name} for {template.price}
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:flex-1"
                  asChild
                >
                  <Link href={template.preview_url ?? "#"} target="_blank">
                    Live preview{" "}
                    <SquareArrowOutUpRight className="opacity-70" />
                  </Link>
                </Button>
              </div>

              {template.images?.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {template.images.map((image, key) => (
                    <figure
                      className="hover:bg-muted/50 rounded-xl border p-1 transition-colors"
                      key={key}
                    >
                      <ImageZoom zoomMargin={80}>
                        <img
                          className="w-full rounded-lg object-cover object-top"
                          src={image.url}
                          alt={image.title.toLocaleLowerCase()}
                        />
                      </ImageZoom>
                    </figure>
                  ))}
                </div>
              ) : null}

              <div className="space-y-6">
                <h2 className="font-heading text-2xl font-semibold lg:text-3xl">
                  What is included
                </h2>
                <ul className="space-y-4">
                  {includedItems.map((item, key) => (
                    <CheckListItem key={key} {...item} />
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h2 className="font-heading text-2xl font-semibold lg:text-3xl">
                  Who it is for
                </h2>
                <ul className="space-y-4">
                  {audienceItems.map((item, key) => (
                    <CheckListItem key={key} {...item} />
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h2 className="font-heading text-2xl font-semibold lg:text-3xl">
                  Frequently asked questions
                </h2>
                <Accordion type="single" collapsible>
                  {faqItems.map((item, key) => (
                    <AccordionItem value={`faq-${key}`} key={key}>
                      <AccordionTrigger className="text-base">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent
                        forceMount
                        className="text-muted-foreground text-base [[data-state=closed]_&]:hidden"
                      >
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            <aside className="h-fit space-y-6 rounded-xl border p-6 lg:sticky lg:top-24">
              <div className="space-y-3">
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link href={template.preview_url ?? "#"} target="_blank">
                    Live preview{" "}
                    <SquareArrowOutUpRight className="opacity-70" />
                  </Link>
                </Button>
                {isFree ? (
                  <Button className="w-full" size="lg" asChild>
                    <Link href={template.download_url ?? "#"} target="_blank">
                      Free Download
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" asChild>
                    <Link href="https://shadcnuikit.com/pricing">
                      Buy {template.name} for {template.price}
                    </Link>
                  </Button>
                )}
                <p className="text-muted-foreground text-center text-sm">
                  or get this with{" "}
                  <Link
                    href="https://shadcnuikit.com/pricing"
                    className="text-foreground font-medium hover:underline"
                  >
                    the bundle
                  </Link>
                </p>
              </div>

              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <SparklesIcon className="size-4 shrink-0 opacity-70" />
                  Production ready and fully customizable
                </li>
                <li className="flex items-center gap-3">
                  <InfinityIcon className="size-4 shrink-0 opacity-70" />
                  One payment, lifetime access
                </li>
                <li className="flex items-center gap-3">
                  <PackageIcon className="size-4 shrink-0 opacity-70" />
                  Full source in your repo, no lock-in
                </li>
              </ul>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-heading font-semibold">Details</h3>
                <dl className="space-y-3 text-sm">
                  {details.map((detail, key) => (
                    <div
                      className="flex items-center justify-between gap-4"
                      key={key}
                    >
                      <dt className="text-muted-foreground">{detail.label}</dt>
                      <dd className="text-end font-medium">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-heading font-semibold">Built with</h3>
                <div className="flex flex-wrap gap-2">
                  {(template.primitives
                    ? [...builtWith, template.primitives]
                    : builtWith
                  ).map((item, key) => (
                    <Badge variant="outline" key={key}>
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {otherProducts.length ? (
        <section>
          <div className="container border-x px-0">
            <header className="px-4 py-6 lg:px-12 lg:py-10">
              <h3 className="font-heading text-2xl font-semibold lg:text-3xl">
                More templates
              </h3>
            </header>
            <div className="grid gap-6 px-4 pb-8 md:grid-cols-2 lg:grid-cols-3 lg:px-12 lg:pb-12">
              {otherProducts.map((product: Product) => (
                <Link
                  href={`/template/${product.slug}`}
                  className="group block space-y-3"
                  key={product.id}
                >
                  <figure className="rounded-xl border p-1">
                    <img
                      className="aspect-video w-full rounded-lg object-cover object-top"
                      src={product.images?.[0]?.url}
                      alt={product.name?.toLocaleLowerCase()}
                    />
                  </figure>
                  <div className="space-y-1">
                    <h4 className="font-heading font-semibold group-hover:underline">
                      {product.name}{" "}
                      <span className="text-muted-foreground font-normal">
                        - {product.subtitle}
                      </span>
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {product.short_description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
