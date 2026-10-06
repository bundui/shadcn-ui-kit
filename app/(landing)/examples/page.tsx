import { Metadata } from "next";
import ExamplesContent from "./examples-content";
import { generateMeta } from "@/lib/metadata";
import { examplesCount } from "@/lib/content-count";

export const metadata: Metadata = generateMeta({
  title: "Shadcn Examples",
  description: `Explore ${examplesCount.total} free real-world UI examples for shadcn/ui, including review cards and date picker use cases. Every example is inspired by practical UI patterns you can copy and paste instantly or install via the shadcn CLI. Built with shadcn/ui, Tailwind CSS and React.`,
});

export default function Page() {
  return (
    <>
      <ExamplesContent />
    </>
  );
}
