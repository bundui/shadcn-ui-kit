import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { getCampaignTitle } from "@/lib/campaign";

export default function FaqSection() {
  return (
    <section>
      <div className="container mx-auto grid grid-cols-1 gap-4 border-x py-8 md:grid-cols-3 lg:py-20">
        <div className="mb-8 space-y-4 md:col-span-1 lg:mb-12">
          <h2 className="font-heading font-semibold mb-4 text-center text-2xl lg:text-3xl/tight">
            Frequently <br /> Asked <br /> Questions
          </h2>
        </div>

        <div className="col-span-2 grid gap-4 lg:grid-cols-2 lg:gap-10">
          <div>
            <h3 className="text-xl font-heading font-semibold mb-3">General</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="general-1" className="[&>h3]:font-sans">
                <AccordionTrigger>What is Shadcn UI Kit?</AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    Shadcn UI Kit is a carefully crafted collection of blocks,
                    components, website templates, and admin dashboards. It
                    includes a variety of tools designed to help developers save
                    time and streamline their workflow. By reducing both
                    development time and costs, it enables teams to ship
                    products faster and more efficiently.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="general-2" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  Why do I need Shadcn UI Kit?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    Building everything from scratch when starting a new project
                    is time-consuming and inefficient. Shadcn UI Kit provides
                    dozens of ready-made pages and hundreds of reusable
                    components designed to save developers valuable time. With
                    purpose-built templates, components, blocks, and real-world
                    examples, you can build up to twice as fast, focusing on
                    your product instead of rebuilding common UI patterns.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="general-3" className="[&>h3]:font-sans">
                <AccordionTrigger>Do you offer a free trial?</AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground space-y-2 leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    We’ve published several free projects on our GitHub account.
                    You can explore and use them to get a clear idea of the code
                    quality and architecture behind our premium projects.
                  </p>
                  <Link
                    href="https://github.com/shadcn-ui-kit"
                    target="_blank"
                    className="font-medium hover:underline"
                  >
                    Go to Github projects.
                  </Link>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="general-4" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  What do I get with the Premium version?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground space-y-2 leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    With a Shadcn UI Kit Premium license, you gain access to all
                    existing components, blocks, examples, templates, admin
                    dashboards and developer tools. You’ll also receive lifetime
                    access to all future components and templates we release,
                    with no additional fees.
                  </p>
                  For more information, please refer to the{" "}
                  <Link href="https://shadcnuikit.com/pricing" className="font-medium hover:underline">
                    pricing
                  </Link>{" "}
                  section.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="general-5" className="[&>h3]:font-sans">
                <AccordionTrigger>Can I customize it?</AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  Yes, absolutely. Everything is fully customizable, with no
                  restrictions. If you have specific requirements or need
                  tailored solutions, feel free to contact us.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="general-6" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  Which frameworks and technologies are supported?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground space-y-2 leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    Shadcn UI Kit is built with Next.js 16, React 19, Tailwind
                    CSS v4, and TypeScript, following modern standards and best
                    practices.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="general-7" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  How do I access my purchase, and what does it include?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground space-y-2 leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    After completing your purchase, you’ll receive an email with
                    a login link. Use that link to access your account and
                    create your personal password. The entire process is
                    explained step by step, so there’s nothing to worry about.
                    Once logged in, you’ll have full access to all included
                    content.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-xl mb-3">Payment</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="payment-1" className="[&>h3]:font-sans">
                <AccordionTrigger>Is it a one-time payment?</AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    Yes, pay once and use it for a lifetime. There are no
                    subscriptions, no commitments, and no hidden or recurring
                    fees.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="payment-2" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  Can I generate or modify my invoice?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    After completing your purchase, you’ll instantly receive an
                    email containing your download link and invoice. If you need
                    to make any changes to the invoice, you may need to contact
                    Paddle’s support team for assistance.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="payment-3" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  What should I do if I encounter a payment issue?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    If your card or bank has restrictions, please contact them
                    first or try using a different card. If the issue persists,
                    feel free to reach out to us. You can also message us via
                    live support, we typically respond within 2 hours.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="payment-4" className="[&>h3]:font-sans">
                <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    Since our products are digital and access is granted
                    immediately after purchase, we generally do not offer
                    refunds. This policy aligns with industry standards and
                    helps prevent misuse.
                  </p>
                  <p>
                    However, if you experience a technical issue caused directly
                    by our code, you may submit a refund request along with
                    detailed information and proof of the issue. If the claim is
                    valid, we will make an exception.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="payment-5" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  Which payment methods are accepted?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    We securely process all payments through Paddle, which
                    supports all major credit cards (Visa, Mastercard, AMEX),
                    PayPal, Google Pay, and Apple Pay.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="payment-6" className="[&>h3]:font-sans">
                <AccordionTrigger>Is VAT included?</AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    Yes, VAT is included in all listed prices, so the price you
                    see is the final amount you pay. If you are purchasing on
                    behalf of a company, you can enter your VAT ID during
                    checkout to exclude tax.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="payment-7" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  Do you offer discounts for students or non-profits?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    Yes. The {getCampaignTitle()} is live now with 40% off all
                    plans, open to everyone including students and non-profit
                    organizations. Check the{" "}
                    <Link href="https://shadcnuikit.com/pricing" className="font-medium hover:underline">
                      pricing page
                    </Link>{" "}
                    to get the deal.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-xl mb-3">Licenses</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="license-1" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  Can I use Shadcn UI Kit for commercial projects?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    Yes, absolutely. Your license allows you to build an
                    unlimited number of projects, from simple public websites to
                    paid SaaS applications where users subscribe or pay for
                    access.
                  </p>
                  <p>
                    However, you may not use Shadcn UI Kit to create website
                    builders, template marketplaces, or tools that allow others
                    to build sites using Shadcn UI Kit components directly.
                  </p>
                  <Link
                    href="https://shadcnuikit.com/terms-conditions"
                    className="font-medium hover:underline"
                  >
                    For more information, please review the license details.
                  </Link>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="license-2" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  Can I use Shadcn UI Kit for client projects?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    Yes. You can use the components and templates to build
                    custom websites or applications for a single client.
                  </p>
                  <p>
                    However, you may not resell or redistribute the projects to
                    multiple clients without making substantial modifications.
                  </p>
                  <Link
                    href="https://shadcnuikit.com/terms-conditions"
                    className="font-medium hover:underline"
                  >
                    For more information, please review the license details.
                  </Link>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="license-3" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  Do I need to credit Shadcn UI Kit?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    No, you don&apos;t need to provide attribution or a link
                    back to us in your projects. You are free to use the
                    components and templates without any visible credit.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="license-4" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  Can I upgrade my license later?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    Yes, you can upgrade your license at any time. You&apos;ll
                    only need to pay the difference between your current plan
                    and the new one. Contact support to arrange an upgrade.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="license-5" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  Can I use it in an open-source project?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    You cannot use the premium components or templates in an
                    open-source project where the source code is publicly
                    available, as this would redistribute our paid content for
                    free. You may only use them in closed-source projects.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="license-6" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  Which license is right for me?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    Refer to our pricing tables for detailed plan information.
                    If you need further clarification, please{" "}
                    <Link
                      className="text-primary font-semibold underline"
                      href="https://shadcnuikit.com/pricing"
                    >
                      contact us
                    </Link>
                    , and we'll assist you promptly.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-xl mb-3">Support</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="support-1" className="[&>h3]:font-sans">
                <AccordionTrigger>Do you provide support?</AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    Definitely! Our support is handled by the actual creators of
                    Shadcn UI Kit. Send us your questions, and we'll reply
                    within 48 working hours. Support covers usage-related
                    questions for components, blocks, and templates.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="support-2" className="[&>h3]:font-sans">
                <AccordionTrigger>How do I get in touch?</AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    You can reach us via live chat on our website. You can also
                    contact us by email, simply send a message to
                    hello@tobybelhome.com.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="support-4" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  Can I request a new component?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    Yes! We actively listen to our community. If you have a
                    specific component or template need, let us know via live
                    chat or email. We prioritize updates based on user feedback.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="support-5" className="[&>h3]:font-sans">
                <AccordionTrigger>What if I discover a bug?</AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    We strive for perfection, but bugs happen. If you find one,
                    please report it via live chat, email, or GitHub. We
                    typically fix reported issues within 1-2 business days.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="support-6" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  Do you offer custom development?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    While our primary focus is on improving Shadcn UI Kit, we
                    occasionally take on custom projects. Contact us with your
                    requirements, and we&apos;ll let you know if we can help.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="support-9" className="[&>h3]:font-sans">
                <AccordionTrigger>
                  How often do you release updates?
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed [[data-state=closed]_&]:hidden"
                >
                  <p>
                    We release new updates, components, and templates regularly
                    based on user feedback and current design trends. You can
                    expect significant updates every week.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
