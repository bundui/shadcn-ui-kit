import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Component() {
  return (
    <Tabs
      className="w-full flex-row"
      defaultValue="tab-1"
      orientation="vertical"
    >
      <TabsList
        className="flex-col rounded-none bg-transparent p-0"
        variant="line"
      >
        <TabsTrigger className="after:right-auto after:left-0" value="tab-1">Overview</TabsTrigger>
        <TabsTrigger className="after:right-auto after:left-0" value="tab-2">Projects</TabsTrigger>
        <TabsTrigger className="after:right-auto after:left-0" value="tab-3">Packages</TabsTrigger>
      </TabsList>
      <div className="bg-muted rounded-lg p-4 w-full">
        <TabsContent value="tab-1">
          <p className="text-xs">
            Content for Tab 1
          </p>
        </TabsContent>
        <TabsContent value="tab-2">
          <p className="text-xs">
            Content for Tab 2
          </p>
        </TabsContent>
        <TabsContent value="tab-3">
          <p className="text-xs">
            Content for Tab 3
          </p>
        </TabsContent>
      </div>
    </Tabs>
  );
}
