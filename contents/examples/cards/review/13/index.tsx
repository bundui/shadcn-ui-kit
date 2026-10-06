import { StarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function ReviewCard() {
  return (
    <Card className="w-full shadow-none md:w-[680px]">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face"
              alt="Sabri S."
              className="size-11 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">Sabri S.</p>
              <p className="text-xs text-muted-foreground">CEO at Nexora Group</p>
              <p className="text-xs text-muted-foreground">Review on 12 Mar 2025</p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-1.5 rounded-full px-3 py-1">
            <GoogleIcon />
            <span className="text-xs font-medium">Google Review</span>
          </Badge>
        </div>

        <Separator />

        <div className="flex items-end gap-6">
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
            The team managed our entire platform rebuild from discovery to
            launch. Their expertise spanned UX research, frontend engineering,
            and cloud infrastructure, all delivered under tight timelines without
            cutting corners on quality. The final product exceeded expectations
            and our users have noticed the difference. Communication throughout
            was clear and proactive. Among every vendor we have worked with,
            this team stands out as a true partner rather than just a supplier.
          </p>
          <Separator orientation="vertical" className="self-stretch" />
          <div className="shrink-0 text-right">
            <p className="text-3xl font-bold leading-none">5.0</p>
            <div className="mt-1.5 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="size-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
