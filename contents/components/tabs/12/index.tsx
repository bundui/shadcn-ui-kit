import { BoxIcon, HouseIcon, PanelsTopLeftIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Component() {
  return (
    <Tabs className="w-full flex-row" defaultValue="tab-1" orientation="vertical">
      <TabsList className="flex-col">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <TabsTrigger className="p-3" value="tab-1">
                  <HouseIcon aria-hidden="true" size={16} />
                </TabsTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs" side="right">
              Overview
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <TabsTrigger className="group p-3" value="tab-2">
                  <span className="relative">
                    <PanelsTopLeftIcon aria-hidden="true" size={16} />
                    <Badge className="border-background absolute -top-2.5 left-full size-4 -translate-x-1.5 px-0.5 text-[10px]/[.875rem] transition-opacity group-data-[state=inactive]:opacity-50">
                      3
                    </Badge>
                  </span>
                </TabsTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs" side="right">
              Projects
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <TabsTrigger className="p-3" value="tab-3">
                  <BoxIcon aria-hidden="true" size={16} />
                </TabsTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs" side="right">
              Packages
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TabsList>
      <div className="grow rounded-md border text-start">
        <TabsContent value="tab-1">
          <p className="text-muted-foreground px-4 py-3 text-xs">Content for Tab 1</p>
        </TabsContent>
        <TabsContent value="tab-2">
          <p className="text-muted-foreground px-4 py-3 text-xs">Content for Tab 2</p>
        </TabsContent>
        <TabsContent value="tab-3">
          <p className="text-muted-foreground px-4 py-3 text-xs">Content for Tab 3</p>
        </TabsContent>
      </div>
    </Tabs>
  );
}
