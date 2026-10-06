import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  Pin,
  Settings,
  Share2,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "All Orders",
    value: 122380,
    delta: 15.1,
    lastMonth: 105922,
    positive: true,
    prefix: "",
    suffix: "",
  },
  {
    title: "Order Created",
    value: 1902380,
    delta: -2.0,
    lastMonth: 2002098,
    positive: false,
    prefix: "",
    suffix: "",
  },
  {
    title: "Organic Sales",
    value: 98100000,
    delta: 0.4,
    lastMonth: 97800000,
    positive: true,
    prefix: "$",
    suffix: "M",
    format: (v: number) => `$${(v / 1_000_000).toFixed(1)}M`,
    lastFormat: (v: number) => `$${(v / 1_000_000).toFixed(1)}M`,
  },
  {
    title: "Active Users",
    value: 48210,
    delta: 3.7,
    lastMonth: 46480,
    positive: true,
    prefix: "",
    suffix: "",
  },
];

function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return n.toLocaleString("en-US");
  return n.toString();
}

export default function Page() {
  return (
    <div className="w-full bg-muted flex items-center justify-center px-4 py-10 lg:py-20">
      <div className="mx-auto grid max-w-7xl grow grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="shadow-none">
            <CardHeader>
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {stat.title}
              </CardTitle>
              <CardAction>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="bottom">
                    <DropdownMenuItem>
                      <Settings />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TriangleAlert /> Add Alert
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pin /> Pin to Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 /> Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <Trash />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            </CardHeader>
            <CardContent className="flex items-center gap-2.5 space-y-2.5">
              <span className="text-foreground text-2xl font-bold tracking-tight">
                {stat.format
                  ? stat.format(stat.value)
                  : stat.prefix + formatNumber(stat.value) + stat.suffix}
              </span>
              <Badge
                variant="outline"
                className={cn({
                  "text-green-500": stat.positive,
                  "text-destructive": !stat.positive,
                })}
              >
                {stat.delta > 0 ? <ArrowUp /> : <ArrowDown />}
                {stat.delta}%
              </Badge>
            </CardContent>
            <CardFooter className="text-muted-foreground border-t text-xs">
              Vs last month:{" "}
              <span className="text-foreground font-medium">
                {stat.lastFormat
                  ? stat.lastFormat(stat.lastMonth)
                  : stat.prefix + formatNumber(stat.lastMonth) + stat.suffix}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
