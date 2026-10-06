"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  Search,
  ShieldCheck,
  UserMinus,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ROLES = ["Owner", "Editor", "Analyst", "Guest"] as const;
type Role = (typeof ROLES)[number];
type Presence = "online" | "idle" | "offline";

type Member = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  presence: Presence;
  lastSeen: string;
};

const initialMembers: Member[] = [
  {
    id: "m1",
    name: "Aria Lindqvist",
    email: "aria@northwind.io",
    avatar: "https://i.pravatar.cc/100?img=47",
    role: "Owner",
    presence: "online",
    lastSeen: "2026-10-04T09:12:00Z",
  },
  {
    id: "m2",
    name: "Tomas Okafor",
    email: "tomas@northwind.io",
    avatar: "https://i.pravatar.cc/100?img=12",
    role: "Editor",
    presence: "online",
    lastSeen: "2026-10-04T08:55:00Z",
  },
  {
    id: "m3",
    name: "Lena Moreau",
    email: "lena@northwind.io",
    avatar: "https://i.pravatar.cc/100?img=32",
    role: "Analyst",
    presence: "idle",
    lastSeen: "2026-10-03T17:40:00Z",
  },
  {
    id: "m4",
    name: "Kenji Arai",
    email: "kenji@northwind.io",
    avatar: "https://i.pravatar.cc/100?img=68",
    role: "Editor",
    presence: "offline",
    lastSeen: "2026-09-29T11:05:00Z",
  },
  {
    id: "m5",
    name: "Priya Raman",
    email: "priya@northwind.io",
    avatar: "https://i.pravatar.cc/100?img=26",
    role: "Analyst",
    presence: "online",
    lastSeen: "2026-10-04T09:01:00Z",
  },
  {
    id: "m6",
    name: "Felix Brandt",
    email: "felix@partner.studio",
    avatar: "https://i.pravatar.cc/100?img=33",
    role: "Guest",
    presence: "offline",
    lastSeen: "2026-09-21T14:30:00Z",
  },
];

const roleHints: Record<Role, string> = {
  Owner: "Full access and billing",
  Editor: "Create and edit content",
  Analyst: "View reports and export",
  Guest: "Read only, shared items",
};

const presenceMeta: Record<Presence, { label: string; dot: string }> = {
  online: { label: "Online", dot: "bg-green-500" },
  idle: {
    label: "Idle",
    dot: "bg-background ring-2 ring-inset ring-muted-foreground",
  },
  offline: { label: "Offline", dot: "bg-muted-foreground/40" },
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

function RoleMenu({
  value,
  onChange,
  name,
}: {
  value: Role;
  onChange: (role: Role) => void;
  name: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1 pr-2 pl-2.5 text-xs"
          aria-label={`Change role for ${name}, currently ${value}`}
        >
          {value === "Owner" && <ShieldCheck className="size-3.5" />}
          {value}
          <ChevronDown className="text-muted-foreground size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Workspace role
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onChange(next as Role)}
        >
          {ROLES.map((role) => (
            <DropdownMenuRadioItem
              key={role}
              value={role}
              className="items-start"
            >
              <div className="flex flex-col">
                <span>{role}</span>
                <span className="text-muted-foreground text-xs font-normal">
                  {roleHints[role]}
                </span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function TeamMembersTable() {
  const [members, setMembers] = React.useState<Member[]>(initialMembers);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [query, setQuery] = React.useState("");

  const updateRole = React.useCallback((ids: string[], role: Role) => {
    setMembers((prev) =>
      prev.map((m) => (ids.includes(m.id) ? { ...m, role } : m)),
    );
  }, []);

  const columns = React.useMemo<ColumnDef<Member>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            disabled={!table.getRowModel().rows.length}
            aria-label="Select all members"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={`Select ${row.original.name}`}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Member",
        cell: ({ row }) => {
          const member = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarImage src={member.avatar} alt="" />
                <AvatarFallback>{initials(member.name)}</AvatarFallback>
                <AvatarBadge className={presenceMeta[member.presence].dot} />
              </Avatar>
              <div className="min-w-0">
                <div className="truncate font-medium">{member.name}</div>
                <div className="text-muted-foreground truncate text-xs">
                  {member.email}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        filterFn: (row, columnId, value: string) =>
          value === "all" || row.getValue(columnId) === value,
        cell: ({ row }) => (
          <RoleMenu
            value={row.original.role}
            name={row.original.name}
            onChange={(role) => updateRole([row.original.id], role)}
          />
        ),
      },
      {
        accessorKey: "presence",
        header: "Status",
        cell: ({ row }) => {
          const meta = presenceMeta[row.original.presence];
          return (
            <span className="inline-flex items-center gap-2 text-sm">
              <span className={cn("size-2 rounded-full", meta.dot)} />
              {meta.label}
            </span>
          );
        },
      },
      {
        accessorKey: "lastSeen",
        header: "Last active",
        cell: ({ row }) =>
          row.original.presence === "online" ? (
            <span className="text-muted-foreground text-sm">Now</span>
          ) : (
            <span className="text-muted-foreground text-sm tabular-nums">
              {dateFormat.format(new Date(row.original.lastSeen))}
            </span>
          ),
      },
    ],
    [updateRole],
  );

  const table = useReactTable({
    data: members,
    columns,
    state: { rowSelection, columnFilters, globalFilter: query },
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setQuery,
    globalFilterFn: (row, _columnId, value: string) => {
      const needle = value.trim().toLowerCase();
      if (!needle) return true;
      return (
        row.original.name.toLowerCase().includes(needle) ||
        row.original.email.toLowerCase().includes(needle)
      );
    },
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const roleFilter =
    (table.getColumn("role")?.getFilterValue() as string) ?? "all";
  const selectedIds = Object.keys(rowSelection).filter(
    (id) => rowSelection[id],
  );
  const onlineCount = members.filter((m) => m.presence === "online").length;
  const rows = table.getRowModel().rows;

  const removeSelected = () => {
    setMembers((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
    setRowSelection({});
  };

  return (
    <Card className="mx-auto w-full max-w-4xl gap-0 py-0 shadow-none">
      <CardHeader className="gap-1 border-b py-5">
        <CardTitle>Workspace members</CardTitle>
        <CardDescription>
          {members.length} people, {onlineCount} online right now. Change a role
          from its pill.
        </CardDescription>
      </CardHeader>

      <div className="flex flex-col gap-2 border-b px-6 py-3 sm:flex-row sm:items-center">
        {selectedIds.length > 0 ? (
          <div className="flex min-h-9 flex-1 flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setRowSelection({})}
              aria-label="Clear selection"
            >
              <X />
            </Button>
            <span className="text-sm font-medium">
              {selectedIds.length} selected
            </span>
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <Select
                onValueChange={(role) => {
                  updateRole(selectedIds, role as Role);
                  setRowSelection({});
                }}
              >
                <SelectTrigger
                  size="sm"
                  className="w-36"
                  aria-label="Set role for selected"
                >
                  <SelectValue placeholder="Set role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="destructive" size="sm" onClick={removeSelected}>
                <UserMinus />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <>
            <InputGroup className="sm:max-w-64">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or email"
                aria-label="Search members"
              />
            </InputGroup>
            <Select
              value={roleFilter}
              onValueChange={(value) =>
                table.getColumn("role")?.setFilterValue(value)
              }
            >
              <SelectTrigger
                className="w-full sm:ml-auto sm:w-40"
                aria-label="Filter by role"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all">All roles</SelectItem>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "text-muted-foreground first:w-10 first:pl-6 last:pr-6",
                    header.column.id === "presence" && "hidden sm:table-cell",
                    header.column.id === "lastSeen" && "hidden md:table-cell",
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "py-3 first:pl-6 last:pr-6",
                      cell.column.id === "presence" && "hidden sm:table-cell",
                      cell.column.id === "lastSeen" && "hidden md:table-cell",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-40 p-0">
                <Empty className="gap-3 p-4 whitespace-normal">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Users />
                    </EmptyMedia>
                    <EmptyTitle className="text-base">
                      No members match
                    </EmptyTitle>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuery("");
                        setColumnFilters([]);
                      }}
                    >
                      Reset filters
                    </Button>
                  </EmptyContent>
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
