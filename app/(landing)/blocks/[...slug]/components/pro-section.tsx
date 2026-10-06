import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChevronRight, LockIcon } from "lucide-react";
import Link from "next/link";

export default function ProSection() {
  return (
    <Card className="from-background mt-4 mb-4 bg-linear-to-r to-pink-100 shadow-none lg:mt-8 lg:mb-8 lg:pb-0 dark:to-pink-950">
      <CardHeader className="block lg:grid">
        <CardTitle>
          <h5 className="flex items-center gap-3 text-lg font-semibold lg:text-2xl">
            <LockIcon className="size-5 opacity-50" /> Unlock Premium Blocks &
            Sections
          </h5>
        </CardTitle>
        <CardDescription className="text-base">
          Get full control of shadcn/ui components, blocks and instances,
          including future additions.
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
  );
}
