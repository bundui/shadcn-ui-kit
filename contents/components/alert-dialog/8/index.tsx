import { MailIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function Component() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Newsletter</Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-sm">
        <div className="mb-2 flex flex-col items-center gap-2">
          <div
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-drama-icon lucide-drama"
            >
              <path d="M10 11h.01" />
              <path d="M14 6h.01" />
              <path d="M18 6h.01" />
              <path d="M6.5 13.1h.01" />
              <path d="M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3" />
              <path d="M17.4 9.9c-.8.8-2 .8-2.8 0" />
              <path d="M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7" />
              <path d="M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="font-normal sm:text-center">
              Never miss an update
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Subscribe to receive news and special offers.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="*:not-first:mt-2">
            <div className="relative">
              <Input
                aria-label="Email"
                className="peer ps-9"
                id="dialog-subscribe"
                placeholder="hi@yourcompany.com"
                type="email"
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <MailIcon aria-hidden="true" size={16} />
              </div>
            </div>
          </div>
          <Button className="w-full" type="button">
            Subscribe
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-xs">
          By subscribing you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Privacy Policy
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}
