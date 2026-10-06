export default function StatSection() {
  return (
    <section>
      <div className="container border-x px-0">
        <header className="mx-auto max-w-3xl space-y-4 py-8 text-center lg:py-16">
          <h2 className="font-heading font-semibold text-2xl lg:text-4xl">
            Trusted by Hundreds of Developers
          </h2>
          <p className="text-muted-foreground leading-relaxed text-balance">
            Join the growing shadcn ecosystem as a premium user and build with
            confidence. Get lifetime access to weekly updates and newly released
            features, with no recurring fees or additional charges.
          </p>
        </header>
        <dl className="grid grid-cols-1 gap-x-4 divide-x border-t text-center lg:grid-cols-3 max-md:divide-y">
          {[
            { id: 1, name: "Monthly Page Views", value: "120K+" },
            { id: 2, name: "Premium Customers", value: "2000+" },
            { id: 3, name: "Social Media Followers", value: "4K+" },
          ].map((stat) => (
            <div key={stat.id} className="flex flex-col gap-y-2 py-8 sm:py-12">
              <dt className="text-muted-foreground">{stat.name}</dt>
              <dd className="font-heading font-semibold order-first text-3xl sm:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
