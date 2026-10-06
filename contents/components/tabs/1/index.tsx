import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Component() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <div className="bg-muted rounded-lg p-4">
        <TabsContent value="overview">
          <p className="text-xs">Content for Tab 1</p>
        </TabsContent>
        <TabsContent value="analytics">
          <p className="text-xs">Content for Tab 2</p>
        </TabsContent>
        <TabsContent value="reports">
          <p className="text-xs">Content for Tab 3</p>
        </TabsContent>
      </div>
    </Tabs>
  );
}
