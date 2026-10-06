import Link from "next/link";
import { Github, SparkleIcon, Twitter } from "lucide-react";
import { buttonVariants } from "./ui/button";

export function FooterButtons() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Link
        href="https://shadcnuikit.com/pricing"
        className={buttonVariants({ variant: "secondary", size: "sm" })}
      >
        <SparkleIcon /> Get Shadcn UI Kit
      </Link>
      <Link
        href="https://github.com/shadcn-ui-kit"
        target="_blank"
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <Github />
        Github
      </Link>
      <Link
        href="https://x.com/TobyBelhome"
        target="_blank"
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <Twitter />X (Twitter)
      </Link>
    </div>
  );
}
