import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

const items = [
  {
    content:
      "Our platform offers flexible pricing plans to suit teams of all sizes. You can start with our free tier and upgrade as your needs grow. All plans include core features with additional benefits for premium subscribers.",
    id: "1",
    sub: "Choose the right subscription for your needs",
    title: "What pricing plans are available?",
  },
  {
    content:
      "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you won't be charged for the next cycle.",
    id: "2",
    sub: "Full control over your billing cycle",
    title: "Can I cancel my subscription anytime?",
  },
  {
    content:
      "We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely through our encrypted payment gateway to ensure your financial information is protected.",
    id: "3",
    sub: "Secure and flexible payment options",
    title: "What payment methods do you accept?",
  },
  {
    content:
      "Our support team is available 24/7 via email and live chat. Premium plan subscribers get priority support with faster response times. We also maintain a comprehensive knowledge base with tutorials and documentation.",
    id: "4",
    sub: "Priority help for premium customers",
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
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-4 text-left text-sm font-semibold transition-all outline-none focus-visible:ring-[3px] [&[data-state=open]>svg]:rotate-180">
                <span className="flex flex-col space-y-1">
                  <span>{item.title}</span>
                  {item.sub && (
                    <span className="text-muted-foreground text-sm font-normal">
                      {item.sub}
                    </span>
                  )}
                </span>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                  size={16}
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="text-muted-foreground">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
