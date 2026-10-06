const steps = [
  {
    number: "01",
    title: "We listen to your story",
    description:
      "You tell us how you were affected by the outage and how you were impacted financially. We record every detail carefully.",
    image: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=750",
  },
  {
    number: "02",
    title: "We prepare your complaint",
    description:
      "We build a strong complaint seeking compensation, backed by our experience to give your case the best possible outcome.",
    image: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=750",
  },
  {
    number: "03",
    title: "We manage your complaint",
    description:
      "We submit your complaint and create a tracking page, keeping you updated at every step and standing by you if needed.",
    image: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=750",
  },
  {
    number: "04",
    title: "You get a resolution",
    description:
      "The company responds with a formal outcome. We stay with you to ensure the resolution fully meets your expectations.",
    image: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=750",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-14">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col">
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                {step.number}
              </p>
              <h3 className="mb-2 text-xl font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              <div className="overflow-hidden rounded-xl border border-border">
                <img
                  src={step.image}
                  alt={step.title}
                  className="aspect-4/3 w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
