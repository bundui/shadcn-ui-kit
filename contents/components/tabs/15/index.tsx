import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BoxIcon, HouseIcon, PanelsTopLeftIcon } from "lucide-react";

export default function Component() {
  return (
    <Tabs
      className="w-full flex-row"
      defaultValue="tab-1"
      orientation="vertical"
    >
      <TabsList className="flex-col gap-1 bg-transparent">
        <TabsTrigger
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none!"
          value="tab-1"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none!"
          value="tab-2"
        >
          Projects
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none!"
          value="tab-3"
        >
          Packages
        </TabsTrigger>
      </TabsList>
      <div className="grow bg-muted rounded-md ">
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
