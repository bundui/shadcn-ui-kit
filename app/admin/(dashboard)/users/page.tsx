import { Metadata } from "next";
import { generateMeta } from "@/lib/metadata";

import Link from "next/link";
import { CirclePlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UsersDataTable from "./data-table";
import users from "./data.json";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Users",
    description:
      "A list of users created using the Tanstack Table. Tailwind is built on CSS and React.",
  });
}

export default function Page() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <Button variant="secondary" asChild>
          <Link href="#">
            <CirclePlusIcon /> Add New User
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent>
          <UsersDataTable data={users} />
        </CardContent>
      </Card>
    </>
  );
}
