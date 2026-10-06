import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I get started with Vitalize?",
    answer:
      "Getting started is easy. Download the app, create your account, complete a quick fitness assessment, and we'll build a personalized workout plan for you in minutes.",
  },
  {
    question: "Are the workouts suitable for beginners?",
    answer:
      "Absolutely! Vitalize offers programs for all fitness levels, from complete beginners to advanced athletes. Every workout includes difficulty ratings and modification options.",
  },
  {
    question: "Do I need any equipment to work out?",
    answer:
      "No equipment is required for most programs. We offer bodyweight-only workouts as well as programs that use dumbbells, resistance bands, or gym machines.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No hidden fees. Our pricing is fully transparent. You only pay for the plan you choose, and any premium add-ons are clearly listed on our pricing page.",
  },
  {
    question: "How is my health data protected?",
    answer:
      "We take your privacy seriously. All health and fitness data is encrypted at rest and in transit. We comply with GDPR and never sell your personal data to third parties.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards, Apple Pay, Google Pay, and PayPal. Annual plans can also be paid via bank transfer.",
  },
];

export default function FAQSection() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold text-primary">FAQ</p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            We compiled a list of answers to address your most pressing
            questions regarding our Services.
          </p>
        </div>

        <Accordion type="single" collapsible defaultValue="item-1">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
