import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ExternalLinkIcon,
  MoreHorizontalIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

export default function CardComponent() {
  return (
    <Card className="w-full max-w-xs shadow-none">
      <CardHeader>
        <CardTitle>Need a help in Claim?</CardTitle>
        <CardAction className="-me-2 -mt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontalIcon aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Team Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon aria-hidden="true" />
                  <span>Manage members</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon aria-hidden="true" />
                  <span>Team preferences</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ExternalLinkIcon aria-hidden="true" />
                <span>Open dashboard</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
        <CardDescription>
          Go to this step by step guideline process on how to certify for your
          weekly benefits:
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
