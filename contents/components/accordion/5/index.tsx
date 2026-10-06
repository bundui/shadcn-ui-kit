import { AtSignIcon, CommandIcon, EclipseIcon, ZapIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    content:
      "Our platform offers flexible pricing plans to suit teams of all sizes. You can start with our free tier and upgrade as your needs grow. All plans include core features with additional benefits for premium subscribers.",
    icon: CommandIcon,
    id: "1",
    title: "What pricing plans are available?",
  },
  {
    content:
      "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you won't be charged for the next cycle.",
    icon: EclipseIcon,
    id: "2",
    title: "Can I cancel my subscription anytime?",
  },
  {
    content:
      "We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely through our encrypted payment gateway to ensure your financial information is protected.",
    icon: ZapIcon,
    id: "3",
    title: "What payment methods do you accept?",
  },
  {
    content:
      "Our support team is available 24/7 via email and live chat. Premium plan subscribers get priority support with faster response times. We also maintain a comprehensive knowledge base with tutorials and documentation.",
    icon: AtSignIcon,
    id: "4",
    title: "What kind of support do you provide?",
  },
];

export default function Component() {
  return (
    <div className="w-full max-w-md">
      <Accordion
        className="rounded-none border-none **:data-[slot=accordion-content]:px-0"
        collapsible
        type="single"
      >
        {items.map((item) => (
          <AccordionItem
            className="data-open:bg-transparent!"
            key={item.id}
            value={item.id}
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-3">
                <item.icon
                  aria-hidden="true"
                  className="shrink-0 opacity-60"
                  size={16}
                />
                <span>{item.title}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground ps-11">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
