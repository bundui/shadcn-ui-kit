"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

type AnchorProps = ComponentProps<typeof Link> & {
  absolute?: boolean;
  href?: string;
  activeClassName?: string;
  disabled?: boolean;
  blankTarget?: boolean;
};

export default function Anchor({
  absolute,
  className = "",
  activeClassName = "",
  href,
  disabled,
  blankTarget,
  children,
  ...props
}: AnchorProps) {
  const path = usePathname();
  const isExternal = /^https?:\/\//.test(href.toString());
  const isMatch =
    !isExternal &&
    (absolute ? href.toString().split("/")[1] == path.split("/")[1] : path === href);

  if (disabled) return <div className={cn(className, "cursor-not-allowed")}>{children}</div>;
  return (
    <Link
      href={href}
      target={blankTarget ? "_blank" : ""}
      className={cn(className, isMatch && activeClassName)}
      {...props}>
      {children}
    </Link>
  );
}
