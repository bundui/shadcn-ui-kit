import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSection() {
  return (
    <footer className="w-full">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between space-y-4 px-4 py-10 md:flex-row lg:space-y-8 lg:py-16">
        <div className="mb-8 lg:mb-0 lg:max-w-md">
          <h3 className="text-foreground mb-2 font-bold text-3xl">Join our newsletter</h3>
          <p className="text-muted-foreground text-balance">
            Stay updated with the latest news, insights, and exclusive offers
            delivered straight to your inbox.
          </p>
        </div>

        <div className="w-full lg:w-auto">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="min-w-[280px] flex-1"
            />
            <Button className="whitespace-nowrap">Subscribe</Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
