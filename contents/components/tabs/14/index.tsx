import { BoxIcon, HouseIcon, PanelsTopLeftIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Component() {
  return (
    <Tabs
      className="w-full flex-row"
      defaultValue="tab-1"
      orientation="vertical"
    >
      <TabsList className="text-foreground flex-col gap-1">
        <TabsTrigger value="tab-1">
          <HouseIcon
            aria-hidden="true"
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
          />
          Overview
        </TabsTrigger>
        <TabsTrigger value="tab-2">
          <PanelsTopLeftIcon
            aria-hidden="true"
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
          />
          Projects
        </TabsTrigger>
        <TabsTrigger value="tab-3">
          <BoxIcon
            aria-hidden="true"
            className="-ms-0.5 me-1.5 opacity-60"
            size={16}
          />
          Packages
        </TabsTrigger>
      </TabsList>
      <div className="grow rounded-md border text-start">
        <TabsContent value="tab-1">
          <p className="text-muted-foreground px-4 py-3 text-xs">
            Content for Tab 1
          </p>
        </TabsContent>
        <TabsContent value="tab-2">
          <p className="text-muted-foreground px-4 py-3 text-xs">
            Content for Tab 2
          </p>
        </TabsContent>
        <TabsContent value="tab-3">
          <p className="text-muted-foreground px-4 py-3 text-xs">
            Content for Tab 3
          </p>
        </TabsContent>
      </div>
    </Tabs>
  );
}
