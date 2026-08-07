import { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import { getDashboardStats } from "@/lib/services/dashboard.service";
import { DashboardView } from "@/components/admin/dashboard-view";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Tổng quan Quản trị | LuxeCommerce",
    description: "Trung tâm điều hành và thống kê số liệu kinh doanh LuxeCommerce",
  });
}

export default async function Page() {
  const stats = await getDashboardStats();

  return (
    <div className="w-full">
      <DashboardView initialStats={stats} />
    </div>
  );
}
