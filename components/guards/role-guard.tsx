"use client"

import { useEffect } from "react";
import { useAuth } from "../providers/auth-provider";
import { useRouter } from "next/navigation";

type RoleGuardProps = {
    allowedRoles: string[];
    children: React.ReactNode;
}


export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
    const router = useRouter()
    const { user, role, loading } = useAuth();

    const isAllowed = role !== null && allowedRoles.includes(role);

    useEffect(() => {
        if (loading || !user) return; // AuthGuard already handles !user

        if (!isAllowed) {
            router.replace("/");
        }
    }, [user, isAllowed, loading, router]);

    if (loading || !user || !isAllowed) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}