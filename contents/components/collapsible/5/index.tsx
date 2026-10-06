"use client";

import { useState } from "react";
import { ChevronDownIcon, MessageSquareIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const comments = [
  {
    id: 1,
    author: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    time: "2 hours ago",
    content: "This is an amazing feature! Great work on the implementation.",
    replies: [
      {
        id: 11,
        author: "Sarah Miller",
        avatar: "https://i.pravatar.cc/150?img=2",
        time: "1 hour ago",
        content: "I completely agree! The design is fantastic."
      },
      {
        id: 12,
        author: "Mike Johnson",
        avatar: "https://i.pravatar.cc/150?img=3",
        time: "45 min ago",
        content: "Thanks for sharing this. Very helpful!"
      }
    ]
  },
  {
    id: 2,
    author: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?img=4",
    time: "3 hours ago",
    content: "I have a question about how this works. Can someone explain?",
    replies: [
      {
        id: 21,
        author: "David Brown",
        avatar: "https://i.pravatar.cc/150?img=5",
        time: "2 hours ago",
        content: "Sure! It works by..."
      }
    ]
  }
];

function CommentItem({ comment }: { comment: (typeof comments)[0] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={comment.avatar} alt={comment.author} />
          <AvatarFallback>
            {comment.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{comment.author}</span>
            <span className="text-muted-foreground text-xs">{comment.time}</span>
          </div>
          <p className="text-sm">{comment.content}</p>
          {comment.replies.length > 0 && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 gap-2">
                  <MessageSquareIcon className="h-3 w-3" />
                  <span className="text-xs">
                    {comment.replies.length} {comment.replies.length === 1 ? "comment" : "comments"}
                  </span>
                  <ChevronDownIcon
                    className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex items-start gap-3 pl-6">
                    <Avatar className="size-8">
                      <AvatarImage src={reply.avatar} alt={reply.author} />
                      <AvatarFallback>
                        {reply.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{reply.author}</span>
                        <span className="text-muted-foreground text-xs">{reply.time}</span>
                      </div>
                      <p className="text-sm">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollapsibleComponent() {
  return (
    <div className="w-full max-w-2xl space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
