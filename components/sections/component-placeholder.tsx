"use client";

import dynamic from "next/dynamic";

export const ComponentPlaceholder = dynamic(
  () =>
    import("@/app/(landing)/components/component-placeholders").then(
      ({ componentPlaceholders }) =>
        function Placeholder({ href }: { href: string }) {
          return (
            componentPlaceholders.find((p) =>
              href.split("/").some((segment) => segment === p.name),
            )?.placeholder ?? null
          );
        },
    ),
  { ssr: false },
);
