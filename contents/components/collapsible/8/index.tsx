import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CodeIcon } from "lucide-react";

export default function CollapsibleComponent() {
  return (
    <Collapsible className="bg-muted/50 w-full max-w-md rounded-lg border">
      <CollapsibleTrigger className="flex w-full items-center gap-2 p-4 text-sm font-medium">
        <CodeIcon className="h-4 w-4" /> View code
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        <pre className="bg-background rounded-md p-3 text-xs">
          <code>{`function hello() {
    console.log("Hello, World!");
}`}</code>
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
}
