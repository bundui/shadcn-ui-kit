import { RiFacebookFill, RiGithubFill, RiGoogleFill, RiTwitterXFill } from "@remixicon/react";

import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <div className="flex flex-col gap-2">
      <Button className="bg-[#DB4437] text-white after:flex-1 hover:bg-[#DB4437]/90">
        <span className="pointer-events-none me-2 flex-1">
          <RiGoogleFill aria-hidden="true" className="opacity-60" size={16} />
        </span>
        Login with Google
      </Button>
      <Button className="bg-[#14171a] text-white after:flex-1 hover:bg-[#14171a]/90">
        <span className="pointer-events-none me-2 flex-1">
          <RiTwitterXFill aria-hidden="true" className="opacity-60" size={16} />
        </span>
        Login with X
      </Button>
      <Button className="bg-[#1877f2] text-white after:flex-1 hover:bg-[#1877f2]/90">
        <span className="pointer-events-none me-2 flex-1">
          <RiFacebookFill aria-hidden="true" className="opacity-60" size={16} />
        </span>
        Login with Facebook
      </Button>
      <Button className="bg-[#333333] text-white after:flex-1 hover:bg-[#333333]/90">
        <span className="pointer-events-none me-2 flex-1">
          <RiGithubFill aria-hidden="true" className="opacity-60" size={16} />
        </span>
        Login with GitHub
      </Button>
    </div>
  );
}
