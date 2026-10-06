import { Button } from "@/components/ui/button";
import { ChevronDownIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Highlighter } from "@/components/ui/highlighter";
import { Avatar, AvatarImage } from "../ui/avatar";

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center">
      <div className="bg-muted/50 container mx-auto border-x py-10 lg:py-16">
        <div className="mx-auto max-w-4xl space-y-4">
          <h1 className="font-heading mx-auto max-w-4xl text-4xl leading-tight font-semibold text-balance md:text-5xl lg:text-6xl">
            Build faster with pre-built assets using the{" "}
            <Highlighter
              action="highlight"
              color="oklch(0.47 0.29 275.2 / 0.25)"
            >
              Shadcn UI Kit
            </Highlighter>
          </h1>
          <p className="text-muted-foreground mb-8 text-balance md:text-xl/relaxed">
            Launch your projects faster with <b>admin dashboards</b>,{" "}
            <b>website templates</b>, <b>components</b>, production-ready{" "}
            <b>blocks</b>, and pre-built real-world <b>examples</b>. Stop
            building everything from scratch. All components support both{" "}
            <b>Radix UI</b> and <b>Base UI</b>. Built specifically for{" "}
            <b>shadcn/ui</b>, <b>Tailwind CSS</b>, and <b>React</b>.
          </p>

          <div className="flex items-center justify-center gap-3 lg:flex-row">
            <Button asChild size="lg">
              <Link href="https://shadcnuikit.com/pricing">Get All Access</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg">
                  Browse Products <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44">
                <DropdownMenuItem className="p-0">
                  <Link className="block w-full p-2" href="/admin-dashboard">
                    Admin Dashboards
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link className="block w-full p-2" href="/components">
                    Components
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link className="block w-full p-2" href="/blocks">
                    Blocks
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link className="block w-full p-2" href="/examples">
                    Examples
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link className="block w-full p-2" href="/templates">
                    Templates
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link
                    className="block w-full p-2"
                    href="https://shadcnuikit.com/mcp"
                  >
                    MCP Server
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link
            href="#reviews"
            className="hover:bg-muted/50 mx-auto flex w-fit items-center justify-center rounded-full border p-1.5 transition-colors md:mt-8"
          >
            <div className="bg-muted flex -space-x-1.5">
              <Avatar className="ring-background rounded-full ring-1">
                <AvatarImage
                  alt="Avatar 01"
                  src="https://i.pravatar.cc/150?img=1"
                />
              </Avatar>
              <Avatar className="ring-background rounded-full ring-1">
                <AvatarImage
                  alt="Avatar 02"
                  src="https://i.pravatar.cc/150?img=2"
                />
              </Avatar>
              <Avatar className="ring-background rounded-full ring-1">
                <AvatarImage
                  alt="Avatar 03"
                  src="https://i.pravatar.cc/150?img=3"
                />
              </Avatar>
              <Avatar className="ring-background rounded-full ring-1">
                <AvatarImage
                  alt="Avatar 04"
                  src="https://i.pravatar.cc/150?img=4"
                />
              </Avatar>
            </div>
            <div className="text-muted-foreground flex flex-col items-center px-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1 *:size-4">
                  <StarIcon className="fill-orange-400 stroke-orange-400" />
                  <StarIcon className="fill-orange-400 stroke-orange-400" />
                  <StarIcon className="fill-orange-400 stroke-orange-400" />
                  <StarIcon className="fill-orange-400 stroke-orange-400" />
                  <StarIcon className="fill-orange-400 stroke-orange-400" />
                </div>
                <span className="text-muted-foreground px-0 font-normal">
                  4.9
                </span>
              </div>
              2K+ premium customers
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
