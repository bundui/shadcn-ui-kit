import { Metadata } from "next";
import BlocksContent from "./blocks-content";
import { generateMeta } from "@/lib/metadata";
import { blocksCount } from "@/lib/content-count";

export const metadata: Metadata = generateMeta({
  title: `${blocksCount.rounded}+ Shadcn UI Blocks & Sections`,
  description: `A library of ${blocksCount.total} free shadcn/ui blocks and page sections: hero sections, newsletter forms, FAQs, sign in forms, stat cards, modal dialogs, tables and application screens. Preview any block live, then copy the code or install it in seconds with the shadcn CLI. Built with shadcn/ui, Tailwind CSS and React.`,
});

export default function Page() {
  return (
    <>
      <BlocksContent />
    </>
  );
}
