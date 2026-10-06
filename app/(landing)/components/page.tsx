import type { Metadata } from "next";
import ComponentsContent from "./components-content";
import { generateMeta } from "@/lib/metadata";
import { componentsCount } from "@/lib/content-count";

export const metadata: Metadata = generateMeta({
  title: `${componentsCount.rounded}+ Free Shadcn UI Components for React`,
  description: `${componentsCount.total} shadcn/ui component variants, ${componentsCount.free} of them free. Preview live, copy the code or install with the shadcn CLI. Radix UI, Base UI and Tailwind CSS v4.`,
});

export default function Page() {
  return (
    <>
      <ComponentsContent />
    </>
  );
}
