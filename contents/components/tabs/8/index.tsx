import {
  BoxIcon,
  ChartLine,
  HouseIcon,
  PanelsTopLeftIcon,
  SettingsIcon,
  UsersRoundIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Component() {
  return (
    <Tabs defaultValue="tab-1" className="min-w-full gap-0">
      <ScrollArea>
        <TabsList className="text-foreground mb-2 h-auto gap-2 rounded-none bg-transparent px-0 py-1">
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
            value="tab-1"
          >
            <HouseIcon
              aria-hidden="true"
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
            />
            Overview
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
            value="tab-2"
          >
            <PanelsTopLeftIcon
              aria-hidden="true"
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
            />
            Projects
            <Badge
              className="bg-primary/15 in-data-[state=active]:bg-muted/20 in-data-[state=active]:text-primary-foreground ms-1.5 min-w-5 px-1"
              variant="secondary"
            >
              3
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
            value="tab-3"
          >
            <BoxIcon
              aria-hidden="true"
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
            />
            Packages
            <Badge className="in-data-[state=active]:bg-muted/20 ms-1.5">
              New
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
            value="tab-5"
          >
            <ChartLine
              aria-hidden="true"
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
            />
            Insights
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
            value="tab-6"
          >
            <SettingsIcon
              aria-hidden="true"
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
            />
            Settings
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="bg-muted rounded-lg p-4">
        <TabsContent value="tab-1">
          <p className="text-xs">Content for Tab 1</p>
        </TabsContent>
        <TabsContent value="tab-2">
          <p className="text-xs">Content for Tab 2</p>
        </TabsContent>
        <TabsContent value="tab-3">
          <p className="text-xs">Content for Tab 3</p>
        </TabsContent>
        <TabsContent value="tab-5">
          <p className="text-xs">Content for Tab 5</p>
        </TabsContent>
        <TabsContent value="tab-6">
          <p className="text-xs">Content for Tab 6</p>
        </TabsContent>
      </div>
    </Tabs>
  );
}
