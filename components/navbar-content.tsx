"use client";

import { ModeToggle } from "@/components/theme-toggle";
import { ArrowRightIcon, GithubIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Search from "./search";
import { SheetLeftBar } from "@/components/leftbar";
import { Logo } from "@/components/logo";
import { NavMenu } from "./nav-menu";
import { cn } from "@/lib/utils";
import { useIsFullContentPage } from "@/components/site-data-provider";

export function NavbarContent() {
  const isFullContentPage = useIsFullContentPage();

  return (
    <>
      <Link
        href="https://shadcnuikit.com"
        target="_blank"
        className="z-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 border-b bg-black px-2 py-2.5 text-center text-xs text-white md:text-sm dark:bg-purple-950"
      >
        <span className="text-balance">
          ✨ Get 700+ premium blocks, admin dashboards and templates with
          Shadcn UI Kit Pro.
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2 py-1 text-xs font-medium hover:bg-white/30">
          Explore Pro
          <ArrowRightIcon className="size-3" />
        </span>
      </Link>
      <div
        className={cn(
          "relative container mx-auto flex items-center justify-between gap-2 py-3",
          {
            "max-w-full px-4": isFullContentPage,
            "border-x": !isFullContentPage,
          },
        )}
      >
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-12">
            <Logo />
            <div className="text-muted-foreground hidden items-center gap-0 text-sm font-medium xl:flex">
              <NavMenu />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="hidden gap-1 sm:flex">
              <Search />
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://github.com/shadcn-ui-kit"
                  target="_blank"
                  aria-label="GitHub"
                >
                  <GithubIcon />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://x.com/TobyBelhome"
                  target="_blank"
                  className="text-foreground"
                  aria-label="X (Twitter)"
                >
                  <svg
                    className="size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    shapeRendering="geometricPrecision"
                    textRendering="geometricPrecision"
                    imageRendering="optimizeQuality"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    viewBox="0 0 512 462.799"
                  >
                    <path
                      fillRule="nonzero"
                      fill="currentColor"
                      d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
                    />
                  </svg>
                </Link>
              </Button>
              <ModeToggle />
            </div>
            <div className="ms-2 flex items-center gap-2">
              <Button asChild>
                <Link href="https://shadcnuikit.com/pricing">
                  <span className="-end-0.5 -top-0.5 block size-2 animate-pulse rounded-full bg-green-400 dark:bg-green-500"></span>
                  Get All Access
                </Link>
              </Button>
            </div>
            <SheetLeftBar />
          </div>
        </div>

        {!isFullContentPage && (
          <div className="pointer-events-none absolute right-0 bottom-0 left-0 hidden items-center justify-between xl:flex">
            <span className="bg-muted border-background block size-3 -translate-x-1/2 translate-y-1/2 rounded-full border-3"></span>
            <span className="bg-muted border-background block size-3 translate-x-1/2 translate-y-1/2 rounded-full border-3"></span>
          </div>
        )}
      </div>
    </>
  );
}
