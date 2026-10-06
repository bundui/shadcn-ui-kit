import { RiFacebookFill, RiGithubFill, RiGoogleFill, RiTwitterXFill } from "@remixicon/react";

import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline">
        <RiGoogleFill
          aria-hidden="true"
          className="me-1 text-[#DB4437] dark:text-white/60"
          size={16}
        />
        Login with Google
      </Button>
      <Button variant="outline">
        <RiTwitterXFill
          aria-hidden="true"
          className="me-1 text-[#14171a] dark:text-white/60"
          size={16}
        />
        Login with X
      </Button>
      <Button variant="outline">
        <RiFacebookFill
          aria-hidden="true"
          className="me-1 text-[#1877f2] dark:text-white/60"
          size={16}
        />
        Login with Facebook
      </Button>
      <Button variant="outline">
        <RiGithubFill
          aria-hidden="true"
          className="me-1 text-[#333333] dark:text-white/60"
          size={16}
        />
        Login with GitHub
      </Button>
    </div>
  );
}
