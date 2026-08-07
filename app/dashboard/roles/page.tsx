"use client";

import RoleGuard from "@/components/guards/role-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconShieldCheck } from "@tabler/icons-react";

export default function RolesPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Roles Management</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconShieldCheck className="size-5" />
            System Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Admin</p>
                <p className="text-muted-foreground text-sm">
                  Full access to all resources including user and role management
                </p>
              </div>
              <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">
                System Role
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">User</p>
                <p className="text-muted-foreground text-sm">
                  Access to dashboard and products only
                </p>
              </div>
              <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium">
                System Role
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </RoleGuard>
  );
}
