import { ChevronRight, LockIcon } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import ComponentsSidebar from "./components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Content from "@/app/(landing)/content";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (slug[0] === "blog") {
    return (
      <div className="prose prose-headings:mt-8 prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-h1:text-5xl prose-h1:font-semibold prose-h2:text-3xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg w-full max-w-full border-x">
        <div className="mx-auto max-w-3xl lg:py-14">{children}</div>
      </div>
    );
  }

  return (
    <Content>
      <SidebarProvider className="xl:items-start">
        <div className="flex w-full flex-col items-start xl:flex-row xl:gap-8">
          <div className="-mt-2 hidden h-[calc(100dvh-(--spacing(30)))] xl:sticky xl:top-26 xl:block">
            <ScrollArea className="h-full w-full border-r pt-4">
              <ComponentsSidebar />
            </ScrollArea>
          </div>

          <div className="mx-auto w-full max-w-full px-0">
            <div className="w-full min-w-0 grow py-8">
              {children}
              <Card className="from-background mt-4 bg-linear-to-r to-pink-100 shadow-none lg:mt-8 lg:pb-0 dark:to-pink-950">
                <CardHeader className="block lg:grid">
                  <CardTitle>
                    <h5 className="flex items-center gap-3 text-lg font-semibold lg:text-2xl">
                      <LockIcon className="size-5 opacity-50" /> Unlock Premium
                      Examples
                    </h5>
                  </CardTitle>
                  <CardDescription className="text-base">
                    Get full control of shadcn/ui components, blocks and
                    instances, including future additions.
                  </CardDescription>
                  <CardAction className="hidden lg:flex">
                    <Button asChild>
                      <Link href="https://shadcnuikit.com/pricing">
                        Unlock Now <ChevronRight />
                      </Link>
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="block lg:hidden">
                    <Button className="w-full lg:w-auto" size="lg" asChild>
                      <Link href="https://shadcnuikit.com/pricing">
                        Unlock Now <ChevronRight />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </Content>
  );
}
