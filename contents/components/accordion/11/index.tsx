import { ChevronDownIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const items = [
  {
    collapsibles: [
      {
        content:
          "We offer several pricing tiers including free, starter, pro, and enterprise so you only pay for what you need.",
        title: "Which plans can I choose from?",
      },
      {
        content:
          "You can adjust seat counts and upgrade or downgrade between plans at any time from your billing settings.",
        title: "Can I change plans later?",
      },
    ],
    id: "1",
    title: "What pricing plans are available?",
  },
  {
    collapsibles: [
      {
        content:
          "You can cancel your subscription in a few clicks from the billing page. Your access remains active until the end of the paid period.",
        title: "How do I cancel my subscription?",
      },
      {
        content:
          "Once cancelled, you will not be billed again unless you decide to reactivate your subscription.",
        title: "Will I be billed after cancelling?",
      },
    ],
    id: "2",
    title: "Can I cancel my subscription anytime?",
  },
  {
    collapsibles: [
      {
        content:
          "We support major credit and debit cards, PayPal, and bank transfers for eligible annual contracts.",
        open: true,
        title: "Which payment methods are supported?",
      },
      {
        content:
          "All transactions are processed through a PCI-compliant provider and your payment details are never stored on our servers.",
        title: "How secure are my payments?",
      },
    ],
    id: "3",
    title: "What payment methods do you accept?",
  },
  {
    collapsibles: [
      {
        content:
          "Standard support includes 24/7 email assistance and access to our help center with guides and tutorials.",
        title: "What is included in standard support?",
      },
      {
        content:
          "Higher tiers include priority support, faster response times, and a dedicated account manager for enterprise customers.",
        title: "Do you offer priority or enterprise support?",
      },
    ],
    id: "4",
    title: "What kind of support do you provide?",
  },
];

export default function Component() {
  return (
    <div className="w-full max-w-md">
      <Accordion
        className="w-full -space-y-px rounded-none border-none"
        collapsible
        defaultValue="1"
        type="single"
      >
        {items.map((item) => (
          <AccordionItem
            className="bg-background has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative border outline-none first:rounded-t-md last:rounded-b-md last:border-b has-focus-visible:z-10 has-focus-visible:ring-[3px]"
            key={item.id}
            value={item.id}
          >
            <AccordionTrigger className="rounded-md text-sm outline-none hover:no-underline focus-visible:ring-0">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="p-0">
              {item.collapsibles.map((collapsible, _index) => (
                <CollapsibleDemo
                  content={collapsible.content}
                  key={collapsible.title}
                  open={collapsible.open}
                  title={collapsible.title}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function CollapsibleDemo({
  title,
  content,
  open,
}: {
  title: string;
  content: string;
  open?: boolean;
}) {
  return (
    <Collapsible className="border-t" defaultOpen={open}>
      <CollapsibleTrigger className="flex gap-2 py-2 text-sm font-medium [&[data-state=open]>svg]:rotate-180">
        <ChevronDownIcon
          aria-hidden="true"
          className="shrink-0 opacity-60 transition-transform duration-200"
          size={16}
        />
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="text-muted-foreground data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down mt-1 overflow-hidden ps-6 pb-4 text-sm transition-all">
        {content}
      </CollapsibleContent>
    </Collapsible>
  );
}
