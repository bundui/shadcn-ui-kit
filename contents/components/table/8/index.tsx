"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, RotateCcw, Trash2, MoreHorizontal } from "lucide-react";

const payments = [
  {
    id: "PAY-001",
    customer: { name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1" },
    product: "Premium Plan",
    price: "$99.00",
    paymentType: "Credit Card",
    status: "Completed",
    date: "2024-01-15"
  },
  {
    id: "PAY-002",
    customer: { name: "Jane Smith", avatar: "https://i.pravatar.cc/150?img=2" },
    product: "Basic Plan",
    price: "$29.00",
    paymentType: "PayPal",
    status: "Completed",
    date: "2024-01-16"
  },
  {
    id: "PAY-003",
    customer: { name: "Mike Johnson", avatar: "https://i.pravatar.cc/150?img=3" },
    product: "Enterprise Plan",
    price: "$299.00",
    paymentType: "Bank Transfer",
    status: "Pending"
  },
  {
    id: "PAY-004",
    customer: { name: "Sarah Wilson", avatar: "https://i.pravatar.cc/150?img=4" },
    product: "Premium Plan",
    price: "$99.00",
    paymentType: "Stripe",
    status: "Completed",
    date: "2024-01-18"
  },
  {
    id: "PAY-005",
    customer: { name: "David Brown", avatar: "https://i.pravatar.cc/150?img=5" },
    product: "Basic Plan",
    price: "$29.00",
    paymentType: "Credit Card",
    status: "Failed",
    date: "2024-01-19"
  },
  {
    id: "PAY-006",
    customer: { name: "Emily Davis", avatar: "https://i.pravatar.cc/150?img=6" },
    product: "Premium Plan",
    price: "$99.00",
    paymentType: "PayPal",
    status: "Completed",
    date: "2024-01-20"
  },
  {
    id: "PAY-007",
    customer: { name: "Robert Taylor", avatar: "https://i.pravatar.cc/150?img=7" },
    product: "Enterprise Plan",
    price: "$299.00",
    paymentType: "Credit Card",
    status: "Completed",
    date: "2024-01-21"
  },
  {
    id: "PAY-008",
    customer: { name: "Lisa Anderson", avatar: "https://i.pravatar.cc/150?img=8" },
    product: "Basic Plan",
    price: "$29.00",
    paymentType: "Stripe",
    status: "Pending"
  },
  {
    id: "PAY-009",
    customer: { name: "James Martinez", avatar: "https://i.pravatar.cc/150?img=9" },
    product: "Premium Plan",
    price: "$99.00",
    paymentType: "Bank Transfer",
    status: "Failed",
    date: "2024-01-22"
  }
];

export type Payment = (typeof payments)[number];

export default function TableComponent() {
  const getStatusVariant = (status: Payment["status"]) => {
    switch (status) {
      case "Completed":
        return "default";
      case "Pending":
        return "secondary";
      case "Failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="w-full max-w-6xl overflow-auto [&>div]:max-h-80">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted sticky top-0 z-20 border-b-0! *:first:rounded-tl-lg *:first:rounded-bl-lg *:last:rounded-tr-lg *:last:rounded-br-lg hover:bg-transparent">
            <TableHead className="bg-muted">ID</TableHead>
            <TableHead className="bg-muted">Customer</TableHead>
            <TableHead className="bg-muted">Product</TableHead>
            <TableHead className="bg-muted">Price</TableHead>
            <TableHead className="bg-muted">Payment Type</TableHead>
            <TableHead className="bg-muted">Status</TableHead>
            <TableHead className="bg-muted">Date</TableHead>
            <TableHead className="bg-muted text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="*:border-b-0">
          {payments.map((payment) => (
            <TableRow key={payment.id} className="hover:bg-transparent">
              <TableCell className="font-mono text-sm">{payment.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={payment.customer.avatar} alt={payment.customer.name} />
                    <AvatarFallback>
                      {payment.customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{payment.customer.name}</span>
                </div>
              </TableCell>
              <TableCell>{payment.product}</TableCell>
              <TableCell className="font-medium">{payment.price}</TableCell>
              <TableCell>{payment.paymentType}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {payment.date ? formatDate(payment.date) : "-"}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit />
                      Edit
                    </DropdownMenuItem>
                    {payment.status === "Completed" && (
                      <DropdownMenuItem>
                        <RotateCcw />
                        Refund
                      </DropdownMenuItem>
                    )}
                    {payment.status === "Failed" && (
                      <DropdownMenuItem>
                        <RotateCcw />
                        Retry payment
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
