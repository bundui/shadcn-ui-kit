"use client";

import * as React from "react";
import {
  Banknote,
  Check,
  CheckCheck,
  CreditCard,
  Landmark,
  ReceiptText,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ClaimStatus = "reimbursed" | "approved" | "pending";
type PayoutMethod = "payroll" | "card" | "bank";
type Category = "Travel" | "Meals" | "Software" | "Equipment";

type Claim = {
  id: string;
  employee: string;
  category: Category;
  submitted: string;
  method: PayoutMethod;
  status: ClaimStatus;
  amount: number;
};

const initialClaims: Claim[] = [
  { id: "EXP-2041", employee: "Maya Holloway", category: "Travel", submitted: "2026-10-02", method: "payroll", status: "pending", amount: 1184.3 },
  { id: "EXP-2040", employee: "Daniel Osei", category: "Meals", submitted: "2026-10-01", method: "card", status: "approved", amount: 86.5 },
  { id: "EXP-2039", employee: "Lucia Ferraro", category: "Equipment", submitted: "2026-09-29", method: "bank", status: "pending", amount: 649 },
  { id: "EXP-2038", employee: "Ben Kowalski", category: "Software", submitted: "2026-09-27", method: "card", status: "reimbursed", amount: 240 },
  { id: "EXP-2037", employee: "Grace Adeyemi", category: "Travel", submitted: "2026-09-25", method: "bank", status: "approved", amount: 932.75 },
  { id: "EXP-2036", employee: "Oscar Lindahl", category: "Meals", submitted: "2026-09-24", method: "payroll", status: "reimbursed", amount: 54.2 },
  { id: "EXP-2035", employee: "Priya Raman", category: "Equipment", submitted: "2026-09-22", method: "payroll", status: "pending", amount: 389.99 },
];

const statusMeta: Record<ClaimStatus, { label: string; className: string; dot: string }> = {
  reimbursed: {
    label: "Reimbursed",
    className: "text-green-600 dark:text-green-400",
    dot: "bg-green-600 dark:bg-green-400",
  },
  approved: {
    label: "Approved",
    className: "text-foreground",
    dot: "bg-primary",
  },
  pending: {
    label: "Pending",
    className: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

const methodMeta: Record<PayoutMethod, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  payroll: { label: "Payroll", icon: Banknote },
  card: { label: "Card refund", icon: CreditCard },
  bank: { label: "Bank transfer", icon: Landmark },
};

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const sum = (items: Claim[]) => items.reduce((total, claim) => total + claim.amount, 0);

export default function ExpenseClaimsTable() {
  const [claims, setClaims] = React.useState<Claim[]>(initialClaims);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const selectedClaims = claims.filter((claim) => selected.includes(claim.id));
  const allSelected = claims.length > 0 && selected.length === claims.length;
  const someSelected = selected.length > 0 && !allSelected;
  const openClaims = claims.filter((claim) => claim.status !== "reimbursed");
  const payableSelected = selectedClaims.filter((claim) => claim.status !== "reimbursed").length;
  const pendingSelected = selectedClaims.filter((claim) => claim.status === "pending").length;

  const toggleRow = (id: string, checked: boolean) =>
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)));

  const toggleAll = (checked: boolean) => setSelected(checked ? claims.map((claim) => claim.id) : []);

  const approveSelected = () => {
    setClaims((prev) =>
      prev.map((claim) =>
        selected.includes(claim.id) && claim.status === "pending" ? { ...claim, status: "approved" } : claim,
      ),
    );
    setSelected([]);
  };

  const reimburseSelected = () => {
    setClaims((prev) =>
      prev.map((claim) => (selected.includes(claim.id) ? { ...claim, status: "reimbursed" } : claim)),
    );
    setSelected([]);
  };

  const deleteSelected = () => {
    setClaims((prev) => prev.filter((claim) => !selected.includes(claim.id)));
    setSelected([]);
    setConfirmOpen(false);
  };

  const reset = () => {
    setClaims(initialClaims);
    setSelected([]);
  };

  return (
    <Card className="mx-auto w-full max-w-4xl shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Expense claims</CardTitle>
        <CardDescription>
          {openClaims.length > 0
            ? `${currency.format(sum(openClaims))} waiting to be reimbursed across ${openClaims.length} ${openClaims.length === 1 ? "claim" : "claims"}`
            : "Every claim has been reimbursed"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div
          className={cn(
            "bg-muted/50 flex min-h-12 flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2",
            selected.length === 0 && "hidden",
          )}
          aria-live="polite"
        >
          <p className="text-sm">
            <span className="font-medium">{selected.length} selected</span>
            <span className="text-muted-foreground"> · {currency.format(sum(selectedClaims))}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="outline" onClick={approveSelected} disabled={pendingSelected === 0}>
              <Check />
              Approve
            </Button>
            <Button size="sm" onClick={reimburseSelected} disabled={payableSelected === 0}>
              <CheckCheck />
              Reimburse
            </Button>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" aria-label="Delete selected claims">
                  <Trash2 />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete {selected.length} {selected.length === 1 ? "claim" : "claims"}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {currency.format(sum(selectedClaims))} in expense claims will be removed from this list. You
                    can restore the sample data afterwards.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={deleteSelected}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setSelected([])}
              aria-label="Clear selection"
            >
              <X />
            </Button>
          </div>
        </div>

        {claims.length === 0 ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ReceiptText />
              </EmptyMedia>
              <EmptyTitle>No claims left</EmptyTitle>
              <EmptyDescription>You removed every expense claim from this list.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" onClick={reset}>
                <RotateCcw />
                Restore sample claims
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected || (someSelected && "indeterminate")}
                    onCheckedChange={(value) => toggleAll(value === true)}
                    aria-label="Select all claims"
                  />
                </TableHead>
                <TableHead className="text-muted-foreground">Employee</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Payout</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Submitted</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => {
                const isSelected = selected.includes(claim.id);
                const status = statusMeta[claim.status];
                const method = methodMeta[claim.method];
                const MethodIcon = method.icon;
                return (
                  <TableRow key={claim.id} data-state={isSelected ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(value) => toggleRow(claim.id, value === true)}
                        aria-label={`Select ${claim.id} from ${claim.employee}`}
                      />
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <div className="flex min-w-0 flex-col">
                        <span className="font-medium">{claim.employee}</span>
                        <span className="text-muted-foreground text-xs">
                          {claim.id}
                          <span className="hidden sm:inline"> · {claim.category}</span>
                          <span className={cn("sm:hidden", status.className)}> · {status.label}</span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <MethodIcon className="size-4" />
                        {method.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">
                      {formatDate(claim.submitted)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className={cn("gap-1.5", status.className)}>
                        <span className={cn("size-1.5 rounded-full", status.dot)} aria-hidden />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {currency.format(claim.amount)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow className="hover:bg-transparent">
                <TableCell />
                <TableCell className="font-medium">Total</TableCell>
                <TableCell className="hidden md:table-cell" />
                <TableCell className="hidden sm:table-cell" />
                <TableCell className="hidden sm:table-cell" />
                <TableCell className="text-right font-medium tabular-nums">
                  {currency.format(sum(claims))}
                </TableCell>
              </TableRow>
            </TableFooter>
            <TableCaption className="text-left">
              {claims.length} claims, {claims.length - openClaims.length} reimbursed. Select rows to
              approve, reimburse or remove them in bulk.
            </TableCaption>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
