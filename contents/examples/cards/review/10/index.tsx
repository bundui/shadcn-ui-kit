import { StarIcon } from "lucide-react";

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(Math.max(value - i, 0), 1);
        return (
          <span key={i} className="relative inline-block size-5">
            <StarIcon className="size-5 fill-muted text-muted" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}>
              <StarIcon className="size-5 fill-amber-400 text-amber-400" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function ReviewCard() {
  return (
    <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-950 via-purple-900 to-violet-950 p-8 md:p-12">
      <div className="relative w-full max-w-sm pt-8">

        <div className="relative rounded-2xl bg-card px-7 pb-7 pt-12 text-center shadow-xl">
          <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2">
            <div className="rounded-full p-[3px] ring-2 ring-violet-400 bg-violet-950">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face"
                alt="Alex Reynolds"
                className="size-16 rounded-full object-cover"
              />
            </div>
          </div>

          <h3 className="text-xl font-extrabold uppercase tracking-wide">
            Alex Reynolds
          </h3>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
            Senior Product Manager
          </p>

          <div className="mt-3">
            <Stars value={3.5} />
          </div>

          <div className="relative mt-4 px-6 py-2 text-left">
            <span className="absolute left-0 top-0 font-serif text-5xl leading-none text-violet-500">&ldquo;</span>
            <span className="absolute bottom-0 right-0 font-serif text-5xl leading-none text-violet-500">&rdquo;</span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Switched to this product after years of trying different options
              and the difference was immediately noticeable. Setup took less than
              five minutes, the interface is intuitive, and the results have been
              consistently reliable. Customer support actually answered my
              questions without sending me to a FAQ page. Genuinely one of the
              better purchases I have made this year.
            </p>
          </div>

          <div className="absolute -bottom-3 left-10 size-6 rotate-45 bg-card" />
        </div>
      </div>
    </div>
  );
}
