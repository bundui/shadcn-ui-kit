"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

const users = [
  {
    id: "1",
    name: "Adam Smith",
    avatar: "https://i.pravatar.cc/150?u=1",
    initials: "AS",
  },
  {
    id: "2",
    name: "Ruth Johnson",
    avatar: "https://i.pravatar.cc/150?u=2",
    initials: "RJ",
  },
  {
    id: "3",
    name: "Taylor Davis",
    avatar: "https://i.pravatar.cc/150?u=3",
    initials: "TD",
  },
  {
    id: "4",
    name: "Emily Wilson",
    avatar: "https://i.pravatar.cc/150?u=4",
    initials: "EW",
  },
];

export default function DrawerComponent() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">Add Task</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="font-normal">Add Task</DrawerTitle>
            <DrawerDescription>
              New tasks are added to the default category.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 p-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Task Name</Label>
              <Input id="name" placeholder="Enter task name here" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue id="assignee" placeholder="Select someone" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Avatar className="size-6">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-foreground">{user.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toLocaleDateString() : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DrawerFooter>
            <Button type="submit">Add</Button>
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
