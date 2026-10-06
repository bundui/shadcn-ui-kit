"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const items = [
  {
    id: 1,
    title: "What is this service?",
    description: "Learn about our platform",
    content:
      "This is a comprehensive platform that provides various tools and features to help you manage your projects efficiently."
  },
  {
    id: 2,
    title: "How do I get started?",
    description: "Quick start guide",
    content:
      "To get started, simply create an account, verify your email, and follow the onboarding process. You'll be up and running in minutes."
  },
  {
    id: 3,
    title: "What are the pricing plans?",
    description: "View our pricing options",
    content:
      "We offer three pricing tiers: Basic (free), Pro ($29/month), and Enterprise (custom pricing). Each plan includes different features and limits."
  },
  {
    id: 4,
    title: "How can I contact support?",
    description: "Get help when you need it",
    content:
      "You can reach our support team via email at support@example.com, through our live chat, or by submitting a ticket in your dashboard."
  }
];

export default function CollapsibleComponent() {
  const [openId, setOpenId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full max-w-sm space-y-2">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <Collapsible
            key={item.id}
            open={isOpen}
            onOpenChange={() => handleToggle(item.id)}
            className="space-y-2">
            <div className="flex items-center justify-between rounded-md border px-4 py-3">
              <div className="space-y-1">
                <div className="text-sm font-semibold">{item.title}</div>
                <p className="text-muted-foreground text-xs">{item.description}</p>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <div className="rounded-md border px-4 py-3 text-sm">{item.content}</div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
