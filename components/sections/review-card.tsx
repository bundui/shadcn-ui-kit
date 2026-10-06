import Link from "next/link";
import { Heart, Link2, MessageCircle } from "lucide-react";
import { Review } from "./reviews-data";

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 22" aria-label="Verified account" className={className}>
      <path
        fill="currentColor"
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
      />
    </svg>
  );
}

export default function ReviewCard({ review }: { review: Review }) {
  const tweetUrl = `https://x.com/${review.handle}/status/${review.id}`;
  const profileUrl = `https://x.com/${review.handle}`;

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <Link href={profileUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={review.avatar}
              alt={review.name}
              width={48}
              height={48}
              loading="lazy"
              className="size-12 rounded-full"
            />
          </Link>
          <div className="min-w-0">
            <Link
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-bold hover:underline"
            >
              <span className="truncate">{review.name}</span>
              {review.verified && (
                <VerifiedBadge className="size-4.5 shrink-0 text-sky-500" />
              )}
            </Link>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <span className="truncate">@{review.handle}</span>
              <span>·</span>
              <Link
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-0.5 font-semibold text-sky-500 hover:underline"
              >
                Follow
              </Link>
            </div>
          </div>
        </div>
        <Link
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on X"
        >
          <XLogo className="size-5" />
        </Link>
      </div>

      <div>
        <p className="text-muted-foreground text-sm">
          Replying to {review.replyingTo.join(" and ")}
        </p>
        <p className="mt-1 whitespace-pre-line text-lg">{review.text}</p>
      </div>

      <p className="text-muted-foreground text-sm">{review.date}</p>

      <div className="mt-auto flex items-center gap-6 border-t pt-3">
        <Link
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${review.likes} likes, view on X`}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Heart className="size-4.5 fill-pink-500 text-pink-500" />
          {review.likes > 0 && <span>{review.likes}</span>}
        </Link>
        <Link
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <MessageCircle className="size-4.5 fill-sky-500 text-sky-500" />
          Reply
        </Link>
        <Link
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Link2 className="size-4.5" />
          Copy link
        </Link>
      </div>

      <Link
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:bg-accent w-full rounded-full border py-1.5 text-center text-sm font-semibold text-sky-500"
      >
        Read more on X
      </Link>
    </div>
  );
}
