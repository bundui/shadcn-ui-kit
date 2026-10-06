import Link from "next/link";
import { Button } from "../ui/button";

export default function CTASection({
  title = "Get Lifetime Access Now",
  description = "Unlock lifetime access today and become part of the growing shadcn ecosystem, empowering you to build your projects faster and more efficiently. Keep this continuously updated and ever-expanding collection at your fingertips, and stay ahead with the latest components, templates, and improvements.",
  buttonText = "Get All Access",
  buttonHref = "https://shadcnuikit.com/pricing",
}: {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}) {
  return (
    <section>
      <div className="bg-muted/50 container border-x px-4 py-4 text-center lg:py-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col space-y-6 rounded-lg p-8 md:rounded-xl lg:items-center lg:p-10">
          <h2 className="font-heading mb-4 text-center text-2xl font-semibold text-balance md:text-4xl">
            {title}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-balance lg:text-lg">
            {description}
          </p>
          <Button size="lg" asChild>
            <Link href={buttonHref}>{buttonText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
