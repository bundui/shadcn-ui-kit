"use client";

import { useState } from "react";
import {
  ChevronDownIcon,
  SettingsIcon,
  UserIcon,
  BellIcon,
  ShieldIcon,
  CreditCardIcon,
  HelpCircleIcon
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function CollapsibleComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Menu
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <BellIcon className="h-4 w-4" />
          Notifications
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCardIcon className="h-4 w-4" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="p-1">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setIsOpen(!isOpen);
                }}
                className="w-full">
                <ShieldIcon className="h-4 w-4" />
                Settings
                <ChevronDownIcon
                  className={`ml-auto h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </DropdownMenuItem>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6">
              <div className="space-y-1 py-1">
                <DropdownMenuItem className="pl-4">General</DropdownMenuItem>
                <DropdownMenuItem className="pl-4">Privacy</DropdownMenuItem>
                <DropdownMenuItem className="pl-4">Security</DropdownMenuItem>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="p-1">
          <Collapsible open={isHelpOpen} onOpenChange={setIsHelpOpen}>
            <CollapsibleTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setIsHelpOpen(!isHelpOpen);
                }}
                className="w-full">
                <HelpCircleIcon className="h-4 w-4" />
                Help
                <ChevronDownIcon
                  className={`ml-auto h-4 w-4 transition-transform duration-200 ${isHelpOpen ? "rotate-180" : ""}`}
                />
              </DropdownMenuItem>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6">
              <div className="space-y-1 py-1">
                <DropdownMenuItem className="pl-4">Documentation</DropdownMenuItem>
                <DropdownMenuItem className="pl-4">Support</DropdownMenuItem>
                <DropdownMenuItem className="pl-4">FAQ</DropdownMenuItem>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
