import { categories as blockCategories } from "@/app/(landing)/blocks/categories";
import { StackedImageCarousel } from "@/components/sections/stacked-image-carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { InfiniteSlider } from "../ui/infinite-slider";
import { ArrowUpRightIcon } from "lucide-react";
import { dashboardData } from "./dashboard-data";
import { TemplateStack } from "./template-stack";
import {
  blocksCount,
  componentsCount,
  examplesCount,
} from "@/lib/content-count";

export default function BentoSection() {
  return (
    <section>
      <div className="container border-x px-0">
        <div className="max-md:divide-y md:grid md:grid-cols-4">
          <div className="flex flex-col justify-between overflow-hidden p-4 md:col-span-2 md:col-start-1 md:row-span-2 md:row-start-1 md:border-e lg:p-6">
            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-end">
                <div className="space-y-2">
                  <h2 className="font-heading font-semibold text-xl">
                    Admin Dashboards, Pages & Components
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-balance">
                    Includes {dashboardData.dashboards.length} production-ready
                    admin dashboards,{" "}
                    {dashboardData.apps.length + dashboardData.aiApps.length} web
                    application templates, {dashboardData.subpages}+ additional
                    pages, and 100+ reusable components. It saves you dozens of
                    hours in development time and significantly reduces overall
                    project costs.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/admin-dashboard">
                    Explore it Now <ArrowUpRightIcon />
                  </Link>
                </Button>
              </div>
              <div className="font-heading font-semibold text-3xl lg:text-4xl">
                {dashboardData.dashboards.length +
                  dashboardData.apps.length +
                  dashboardData.aiApps.length +
                  dashboardData.subpages}
                + Pages
              </div>
              <div className="relative">
                <StackedImageCarousel
                  images={[
                    "/images/dashboard/crm.png",
                    "/images/dashboard/academy.png",
                    "/images/dashboard/analytics.png",
                    "/images/dashboard/crypto.png",
                    "/images/dashboard/hospital-management.png",
                    "/images/dashboard/project-management.png",
                    "/images/dashboard/ecommerce.png",
                    "/images/dashboard/finance.png",
                  ]}
                  alt="shadcn ui admin dashboard templates"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between md:col-span-2">
            <div className="space-y-3 p-4 lg:p-6">
              <div className="text-primary font-heading font-semibold text-3xl lg:text-4xl">
                {componentsCount.rounded +
                  blocksCount.rounded +
                  examplesCount.rounded}
                +
              </div>
              <div className="space-y-2">
                <h2 className="font-heading font-semibold text-xl">
                  Components, Blocks & Examples
                </h2>
                <p className="text-muted-foreground leading-relaxed text-balance">
                  Save time by using pre-built blocks and real-world examples
                  tailored for a wide range of use cases. No need to reinvent
                  common UI patterns, everything is prepared to help you move
                  faster and build smarter.{" "}
                  <Link
                    href="#components-section"
                    className="text-primary text-sm underline"
                  >
                    Explore now.
                  </Link>
                </p>
              </div>
            </div>
            <div className="space-y-4 pb-4">
              <InfiniteSlider
                speedOnHover={0}
                gap={24}
                speed={50}
                className="mask-x-from-80% mask-x-to-99%"
              >
                {blockCategories
                  .flatMap((c) => c.items)
                  .slice(0, 10)
                  .map((c, i) => (
                    <div key={i} className="shrink-0">
                      <Image
                        src={`/images${c.href}.png`}
                        alt={`shadcn ui ${c.title.toLowerCase()} block`}
                        width={300}
                        height={169}
                        className="aspect-video rounded-lg border object-cover dark:hidden"
                      />
                      <Image
                        src={`/images${c.href}-dark.png`}
                        alt={`shadcn ui ${c.title.toLowerCase()} block dark`}
                        width={300}
                        height={169}
                        className="hidden aspect-video rounded-lg border object-cover dark:block"
                      />
                    </div>
                  ))}
              </InfiniteSlider>
              <InfiniteSlider
                speedOnHover={0}
                gap={16}
                reverse
                speed={50}
                className="mask-x-from-80% mask-x-to-99%"
              >
                {blockCategories
                  .flatMap((c) => c.items)
                  .slice(10, 20)
                  .map((c, i) => (
                    <div key={i} className="shrink-0">
                      <Image
                        src={`/images${c.href}.png`}
                        alt={`shadcn ui ${c.title.toLowerCase()} block`}
                        width={300}
                        height={169}
                        className="aspect-video rounded-lg border object-cover dark:hidden"
                      />
                      <Image
                        src={`/images${c.href}-dark.png`}
                        alt={`shadcn ui ${c.title.toLowerCase()} block dark`}
                        width={300}
                        height={169}
                        className="hidden aspect-video rounded-lg border object-cover dark:block"
                      />
                    </div>
                  ))}
              </InfiniteSlider>
            </div>
          </div>

          <div className="space-y-8 border-e border-t p-4 md:col-span-2 md:col-start-1 md:row-start-3 lg:p-6">
            <div className="space-y-2 md:text-center">
              <h2 className="font-heading font-semibold text-xl">
                Fully Compatible with React
              </h2>
              <p className="text-muted-foreground leading-relaxed text-balance">
                All templates and components are fully compatible with React.
                Seamlessly integrate them into any React-based framework,
                including Vite, Next.js, Remix, or TanStack Start.
              </p>
            </div>
            <div className="mx-auto">
              <div className="relative mx-auto flex max-w-sm items-center justify-between">
                <div className="space-y-6">
                  <IntegrationCard position="left-top">
                    <Image
                      width={26}
                      height={26}
                      src="/reactjs-logo.svg"
                      alt="reactjs logo"
                    />
                  </IntegrationCard>
                  <IntegrationCard position="left-middle">
                    <Image
                      width={26}
                      height={26}
                      src="/nextjs-logo.svg"
                      alt="nextjs logo"
                    />
                  </IntegrationCard>
                  <IntegrationCard position="left-bottom">
                    <Image
                      width={26}
                      height={26}
                      src="/tailwindcss-logo.svg"
                      alt="tailwindcss logo"
                    />
                  </IntegrationCard>
                </div>
                <div className="mx-auto my-2 flex w-fit justify-center gap-2">
                  <div className="bg-muted relative z-20 rounded-2xl border p-1">
                    <IntegrationCard
                      className="shadow-black-950/10 dark:bg-background size-16 border-black/25 shadow-xl dark:border-white/25 dark:shadow-white/10"
                      isCenter={true}
                    >
                      <Image
                        width={26}
                        height={26}
                        src="/logo.png"
                        alt="shadcn ui kit logo"
                        className="rounded-md"
                      />
                    </IntegrationCard>
                  </div>
                </div>
                <div
                  role="presentation"
                  className="absolute inset-1/3 bg-[radial-gradient(var(--dots-color)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px] opacity-50 [--dots-color:black] dark:[--dots-color:white]"
                ></div>

                <div className="space-y-6">
                  <IntegrationCard position="right-top">
                    <Image
                      width={26}
                      height={26}
                      src="/typescript-logo.svg"
                      alt="typescript logo"
                    />
                  </IntegrationCard>
                  <IntegrationCard position="right-middle">
                    <Image
                      width={26}
                      height={26}
                      src="/images/tech/shadcn.svg"
                      alt="shadcn logo"
                    />
                  </IntegrationCard>
                  <IntegrationCard position="right-bottom">
                    <Image
                      width={26}
                      height={26}
                      src="/vitejs-logo.svg"
                      alt="vitejs logo"
                    />
                  </IntegrationCard>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-8 border-t p-4 md:col-span-2 md:col-start-3 md:row-start-3 lg:p-6">
            <div className="space-y-2">
              <h2 className="font-heading font-semibold text-xl">
                Beautiful & Functional Website Templates
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Explore professionally designed website templates to launch your
                MVP faster. Built with Next.js and Astro, these premium
                shadcn/ui templates are fully designed, production-ready, and
                optimized to help you get started immediately.{" "}
                <Link
                  href="/templates"
                  className="text-primary text-sm underline"
                >
                  Explore all templates.
                </Link>
              </p>
            </div>

            <TemplateStack />
          </div>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  children,
  className,
  position,
  isCenter = false,
}: {
  children: React.ReactNode;
  className?: string;
  position?:
    | "left-top"
    | "left-middle"
    | "left-bottom"
    | "right-top"
    | "right-middle"
    | "right-bottom";
  isCenter?: boolean;
}) => {
  return (
    <div
      className={cn(
        "bg-background relative flex size-12 rounded-xl border dark:bg-transparent",
        className,
      )}
    >
      <div
        className={cn(
          "relative z-20 m-auto size-fit *:size-6",
          isCenter && "*:size-8",
        )}
      >
        {children}
      </div>
      {position && !isCenter && (
        <div
          className={cn(
            "to-muted-foreground/25 absolute z-10 h-px bg-linear-to-r",
            position === "left-top" &&
              "top-1/2 left-full w-[130px] origin-left rotate-25",
            position === "left-middle" &&
              "top-1/2 left-full w-[120px] origin-left",
            position === "left-bottom" &&
              "top-1/2 left-full w-[130px] origin-left rotate-[-25deg]",
            position === "right-top" &&
              "top-1/2 right-full w-[130px] origin-right rotate-[-25deg] bg-linear-to-l",
            position === "right-middle" &&
              "top-1/2 right-full w-[120px] origin-right bg-linear-to-l",
            position === "right-bottom" &&
              "top-1/2 right-full w-[130px] origin-right rotate-25 bg-linear-to-l",
          )}
        />
      )}
    </div>
  );
};
