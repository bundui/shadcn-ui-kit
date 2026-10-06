import { BoxIcon, HouseIcon, PanelsTopLeftIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Component() {
  return (
    <Tabs defaultValue="tab-1" className="gap-2">
      <TabsList className="gap-2 rounded-none bg-transparent h-auto! p-0">
        <TabsTrigger
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-border relative h-auto flex-col px-4 py-2 text-xs data-[state=active]:shadow-none!"
          value="tab-1"
        >
          <HouseIcon
            aria-hidden="true"
            className="mb-1.5 opacity-60"
            size={16}
          />
          Overview
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-border relative h-auto flex-col px-4 py-2 text-xs data-[state=active]:shadow-none!"
          value="tab-2"
        >
          <PanelsTopLeftIcon
            aria-hidden="true"
            className="mb-1.5 opacity-60"
            size={16}
          />
          Projects
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-border relative h-auto flex-col px-4 py-2 text-xs data-[state=active]:shadow-none!"
          value="tab-3"
        >
          <BoxIcon aria-hidden="true" className="mb-1.5 opacity-60" size={16} />
          Packages
        </TabsTrigger>
      </TabsList>
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
