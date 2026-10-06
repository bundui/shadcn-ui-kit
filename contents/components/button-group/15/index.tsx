import { cn } from "@/lib/utils";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const statuses = [
  { value: "1", label: "In Progress", color: "bg-violet-500" },
  { value: "2", label: "Completed", color: "bg-green-500" },
  { value: "3", label: "Pending", color: "bg-primary" },
  { value: "4", label: "Cancelled", color: "bg-yellow-500" },
  { value: "5", label: "Rejected", color: "bg-destructive" },
];

export default function ButtonGroupComponent() {
  return (
    <ButtonGroup className="max-w-xs">
      <Select defaultValue="2">
        <SelectTrigger className="min-w-36">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <span className="flex items-center gap-2">
                  <span className={cn("size-1.5 rounded-full", status.color)} />
                  <span>{status.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input placeholder="Task title" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">
            <PlusIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add new task</p>
        </TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
}
