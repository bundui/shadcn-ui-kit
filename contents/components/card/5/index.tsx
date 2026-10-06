import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabItem {
  name: string;
  value: string;
  content: string;
}

const tabs: TabItem[] = [
  {
    name: "Overview",
    value: "overview",
    content:
      "Get a comprehensive view of your project metrics, recent activity, and key performance indicators. Monitor your progress and stay on top of important updates."
  },
  {
    name: "Analytics",
    value: "analytics",
    content:
      "Dive deep into your data with detailed analytics and insights. Track trends, identify patterns, and make data-driven decisions to optimize your workflow."
  },
  {
    name: "Settings",
    value: "settings",
    content:
      "Customize your preferences and configure your workspace. Manage integrations, adjust notification settings, and personalize your experience to match your needs."
  }
];

export default function Component() {
  return (
    <Tabs defaultValue={tabs[0].value}>
      <Card className="w-full max-w-xl gap-0 py-0 shadow-none">
        <div className="border-b px-4">
          <TabsList variant="line" className="w-full gap-2 px-0">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <CardContent className="py-6">
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <p className="text-muted-foreground text-sm leading-relaxed">{tab.content}</p>
            </TabsContent>
          ))}
        </CardContent>
      </Card>
    </Tabs>
  );
}
