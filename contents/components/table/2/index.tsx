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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    status: "Pending",
    date: "2024-01-17"
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
    <Card className="w-full max-w-6xl shadow-none">
      <CardHeader>
        <CardTitle>Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
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
                <TableCell className="text-muted-foreground">{formatDate(payment.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
