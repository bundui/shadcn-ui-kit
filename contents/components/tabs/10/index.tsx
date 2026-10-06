import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Component() {
  return (
    <Tabs defaultValue="tab-1">
      <TabsList className="mx-auto flex h-auto! w-full max-w-xs bg-transparent">
        <TabsTrigger
          className="group data-[state=active]:bg-muted flex-1 flex-col p-3 text-xs data-[state=active]:shadow-none!"
          value="tab-1"
        >
          <Badge className="mb-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50">
            3
          </Badge>
          Overview
        </TabsTrigger>
        <TabsTrigger
          className="group data-[state=active]:bg-muted flex-1 flex-col p-3 text-xs data-[state=active]:shadow-none!"
          value="tab-2"
        >
          <Badge className="mb-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50">
            0
          </Badge>
          Projects
        </TabsTrigger>
        <TabsTrigger
          className="group data-[state=active]:bg-muted flex-1 flex-col p-3 text-xs data-[state=active]:shadow-none!"
          value="tab-3"
        >
          <Badge className="mb-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50">
            7
          </Badge>
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
