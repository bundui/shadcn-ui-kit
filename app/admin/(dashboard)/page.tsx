import { ChartAreaInteractive } from "@/components/admin/chart-area-interactive"
import { DataTable } from "@/components/admin/data-table"
import { SectionCards } from "@/components/admin/section-cards"

import data from "./data.json"
import { Metadata } from "next";
import { generateMeta } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata>{
  return generateMeta({
    title: "Dashboard Template",
    description:
      "A list of users created using the Tanstack Table. Tailwind is built on CSS and React.",
  });
}

export default function Page() {
  return (
    <>

      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold tracking-tight">Welcome Toby</h1>
      </div>
      <SectionCards />
        <ChartAreaInteractive />
      <DataTable data={data} />
    </>
  )
}
