import { BoxIcon, HouseIcon, PanelsTopLeftIcon } from "lucide-react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Component() {
  return (
    <Tabs defaultValue="tab-1">
      <ScrollArea>
        <TabsList className="mb-1 bg-transparent">
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
      </div>
    </Tabs>
  );
}
