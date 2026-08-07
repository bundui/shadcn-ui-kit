import { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import RoleGuard from "@/components/guards/role-guard";
import UsersClient from "./users-client";


export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Users",
    description: "Manage system users and their roles.",
  });
}

export default function Page() {
  return (
    <RoleGuard allowedRoles={["admin", "staff"]}>
      <UsersClient />
    </RoleGuard>
  );
}
