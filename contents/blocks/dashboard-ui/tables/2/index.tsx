"use client";

import * as React from "react";
import { Minus, Plus, RotateCcw, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type LineItem = {
  sku: string;
  name: string;
  unit: string;
  price: number;
  qty: number;
};

const initialItems: LineItem[] = [
  {
    sku: "SRV-ONB",
    name: "Onboarding workshop",
    unit: "session",
    price: 480,
    qty: 1,
  },
  {
    sku: "LIC-PRO",
    name: "Pro workspace seats",
    unit: "seat / yr",
    price: 96,
    qty: 12,
  },
  { sku: "SRV-MIG", name: "Data migration", unit: "hour", price: 85, qty: 6 },
  {
    sku: "ADD-SSO",
    name: "Single sign-on add-on",
    unit: "year",
    price: 240,
    qty: 1,
  },
];

const TAX_RATE = 0.08;
const DISCOUNT_RATE = 0.1;
const MAX_QTY = 99;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function QuoteSummaryTable() {
  const [items, setItems] = React.useState(initialItems);
  const [annual, setAnnual] = React.useState(true);

  const setQty = (sku: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.sku === sku
          ? { ...item, qty: Math.min(MAX_QTY, Math.max(1, item.qty + delta)) }
          : item,
      ),
    );
  };

  const removeItem = (sku: string) =>
    setItems((prev) => prev.filter((item) => item.sku !== sku));

  const renderStepper = (item: LineItem, className?: string) => (
    <ButtonGroup className={className} aria-label={`Quantity for ${item.name}`}>
      <Button
        variant="outline"
        size="icon-xs"
        onClick={() =>
          item.qty <= 1 ? removeItem(item.sku) : setQty(item.sku, -1)
        }
        aria-label={item.qty <= 1 ? `Remove ${item.name}` : "Decrease quantity"}
      >
        {item.qty <= 1 ? <Trash2 /> : <Minus />}
      </Button>
      <ButtonGroupText className="bg-background w-8 justify-center px-0 text-xs tabular-nums dark:bg-transparent">
        {item.qty}
      </ButtonGroupText>
      <Button
        variant="outline"
        size="icon-xs"
        onClick={() => setQty(item.sku, 1)}
        disabled={item.qty >= MAX_QTY}
        aria-label="Increase quantity"
      >
        <Plus />
      </Button>
    </ButtonGroup>
  );

  const isPristine =
    items.length === initialItems.length &&
    items.every((item, index) => item.qty === initialItems[index].qty);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = annual ? subtotal * DISCOUNT_RATE : 0;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + tax;

  return (
    <Card className="mx-auto w-full max-w-3xl shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Quote Q-2318</CardTitle>
        <CardDescription>
          Prepared for Larkspur Analytics, valid until Oct 31, 2026
        </CardDescription>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setItems(initialItems);
              setAnnual(true);
            }}
            disabled={isPristine && annual}
          >
            <RotateCcw />
            Reset
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-muted-foreground">Item</TableHead>
              <TableHead className="text-muted-foreground hidden text-right sm:table-cell">
                Unit price
              </TableHead>
              <TableHead className="text-muted-foreground hidden text-center sm:table-cell">
                Qty
              </TableHead>
              <TableHead className="text-muted-foreground text-right">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length ? (
              items.map((item) => (
                <TableRow key={item.sku}>
                  <TableCell className="whitespace-normal">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground hidden text-xs sm:inline">
                        {item.sku}
                      </span>
                      <span className="text-muted-foreground text-xs sm:hidden">
                        {currency.format(item.price)} / {item.unit}
                      </span>
                      <div className="mt-2 sm:hidden">
                        {renderStepper(item)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden text-right tabular-nums sm:table-cell">
                    {currency.format(item.price)}
                    <span className="text-xs"> / {item.unit}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {renderStepper(item, "mx-auto")}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {currency.format(item.price * item.qty)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="text-muted-foreground h-24 text-center"
                >
                  No line items left. Use Reset to restore the quote.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="bg-transparent font-normal">
            <TableRow className="hover:bg-transparent">
              <TableCell className="text-muted-foreground sm:hidden">
                Subtotal
              </TableCell>
              <TableCell
                colSpan={3}
                className="text-muted-foreground hidden sm:table-cell"
              >
                Subtotal
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {currency.format(subtotal)}
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className="text-muted-foreground sm:hidden">
                Annual billing (10%)
              </TableCell>
              <TableCell
                colSpan={3}
                className="text-muted-foreground hidden sm:table-cell"
              >
                Annual billing discount (10%)
              </TableCell>
              <TableCell
                className={cn(
                  "text-right tabular-nums",
                  annual
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground",
                )}
              >
                {annual ? `-${currency.format(discount)}` : currency.format(0)}
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className="text-muted-foreground sm:hidden">
                Sales tax (8%)
              </TableCell>
              <TableCell
                colSpan={3}
                className="text-muted-foreground hidden sm:table-cell"
              >
                Sales tax (8%)
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {currency.format(tax)}
              </TableCell>
            </TableRow>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableCell className="font-medium sm:hidden">Total due</TableCell>
              <TableCell
                colSpan={3}
                className="hidden font-medium sm:table-cell"
              >
                Total due
              </TableCell>
              <TableCell className="text-right text-base font-semibold tabular-nums">
                {currency.format(total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <div className="flex items-center justify-between gap-4 rounded-xl border p-3">
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="quote-annual-billing">Bill annually</Label>
            <span className="text-muted-foreground text-xs">
              Prepay for 12 months and save 10% on every line item.
            </span>
          </div>
          <Switch
            id="quote-annual-billing"
            checked={annual}
            onCheckedChange={setAnnual}
          />
        </div>
      </CardContent>
    </Card>
  );
}
