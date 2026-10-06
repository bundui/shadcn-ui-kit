import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon, UserPlusIcon } from "lucide-react";

export default function CardComponent() {
  return (
    <Card className="w-full max-w-md shadow-none">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Invite your team members to collaborate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput type="search" placeholder="Search team..." />
        </InputGroup>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserPlusIcon />
            </EmptyMedia>
            <EmptyTitle>No team members found</EmptyTitle>
            <EmptyDescription>
              We couldn&apos;t find any team members matching your search. Try
              adjusting your filters or invite a new member.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Invite Member</Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}
