"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { MoreHorizontal, Search, Pencil, Trash2, Lock, Unlock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export type UserRow = {
  id: string;
  full_name: string;
  email: string;
  role: { id: string; name: string };
  avatar_url?: string;
  created_at: string;
  is_locked?: boolean;
};

interface UsersDataTableProps {
  data: UserRow[];
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (pageIndex: number) => void;
  search: string;
  onSearchChange: (search: string) => void;
  loading?: boolean;
  onEdit: (user: UserRow) => void;
  onDelete: (user: UserRow) => void;
  onToggleLock?: (user: UserRow, is_locked: boolean) => void;
  role?: string | null;
}

export default function UsersDataTable({
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  search,
  onSearchChange,
  loading,
  onEdit,
  onDelete,
  onToggleLock,
  role,
}: UsersDataTableProps) {
  const columns: ColumnDef<UserRow>[] = [
    {
      accessorKey: "full_name",
      header: "Tên hiển thị",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.avatar_url || ""} />
            <AvatarFallback>
              {row.original.full_name?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.original.full_name || "N/A"}</div>
        </div>
      )
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email || "N/A"
    },
    {
      accessorKey: "role",
      header: "Vai trò",
      cell: ({ row }) => {
        const roleName = row.original.role?.name || "N/A";
        return <span className="capitalize">{roleName}</span>;
      }
    },
    {
      accessorKey: "created_at",
      header: "Ngày tạo",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString("vi-VN")
    },
    {
      accessorKey: "is_locked",
      header: "Trạng thái",
      cell: ({ row }) => {
        const locked = row.original.is_locked;
        return (
          <span className={`inline-flex font-bold items-center px-3 py-1 rounded-full text-[11px] tracking-wide  shadow-sm border ${locked
              ? "bg-red-500/10 text-red-600 border-red-500 dark:text-red-400"
              : "bg-emerald-500/10 text-emerald-600 border-emerald-500 dark:text-emerald-400"
            }`}>
            {locked ? (
              <span className="inline-flex items-center gap-1.5 text-red-600 ">
                <Image src="/icons/lock.png" alt="Lock" width={15} height={15} />
                Đã khóa
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-green-600 ">
                <Image src="/icons/circle.png" alt="Unlock" width={10} height={10} />
                Hoạt động
              </span>
            )}
          </span>
        );
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-secondary transition-colors">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-2xl border-border/50 shadow-xl rounded-[20px] w-52 p-2">
              <DropdownMenuLabel className="font-bold text-foreground px-2">Hành động</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onClick={() => onEdit(user)} className="rounded-xl cursor-pointer hover:bg-secondary focus:bg-secondary transition-colors font-medium">
                <Pencil className="mr-2 size-4 text-blue-500" /> Chỉnh sửa
              </DropdownMenuItem>
              {onToggleLock && (
                <DropdownMenuItem onClick={() => onToggleLock(user, !user.is_locked)} className="rounded-xl cursor-pointer hover:bg-secondary focus:bg-secondary transition-colors font-medium">
                  {user.is_locked ? (
                    <><Unlock className="mr-2 size-4 text-emerald-500" /> Mở khóa tài khoản</>
                  ) : (
                    <><Lock className="mr-2 size-4 text-amber-500" /> Khóa tài khoản</>
                  )}
                </DropdownMenuItem>
              )}
              {role === "admin" && (
                <>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={() => onDelete(user)} className="text-red-600 rounded-xl cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-600 transition-colors font-medium">
                    <Trash2 className="mr-2 size-4" /> Xóa tài khoản
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize
      }
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative max-w-sm w-full group">
          <Image src="/icons/search.png" alt="Search" width={20} height={20} className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Tìm kiếm email, tên..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-10 rounded-full h-11 bg-background/50 border-border/50 hover:bg-secondary transition-colors focus-visible:ring-primary/30 shadow-md"
          />
        </div>
      </div>
      <div className="rounded-[24px] border border-border/50 bg-card/50 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-border/50">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="font-bold text-foreground h-14">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không tìm thấy kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2">
        <div className="text-sm font-medium text-muted-foreground bg-secondary/50 px-4 py-1.5 rounded-full border border-border/50 w-full sm:w-auto text-center">
          Trang <span className="text-foreground font-bold">{pageIndex + 1}</span> / {pageCount || 1}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={!table.getCanPreviousPage() || loading}
            className="rounded-full px-5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-40 disabled:bg-muted/50"
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={!table.getCanNextPage() || loading}
            className="rounded-full px-5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-40 disabled:bg-muted/50"
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
