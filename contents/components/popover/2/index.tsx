"use client";

import { BellIcon } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const initialNotifications = [
  {
    action: "requested review on",
    id: 1,
    target: "PR #42: Feature implementation",
    timestamp: "15 minutes ago",
    unread: true,
    user: "Chris Tompson"
  },
  {
    action: "shared",
    id: 2,
    target: "New component library",
    timestamp: "45 minutes ago",
    unread: true,
    user: "Emma Davis"
  },
  {
    action: "assigned you to",
    id: 3,
    target: "API integration task",
    timestamp: "4 hours ago",
    unread: false,
    user: "James Wilson"
  },
  {
    action: "replied to your comment in",
    id: 4,
    target: "Authentication flow",
    timestamp: "12 hours ago",
    unread: false,
    user: "Alex Morgan"
  },
  {
    action: "commented on",
    id: 5,
    target: "Dashboard redesign",
    timestamp: "2 days ago",
    unread: false,
    user: "Sarah Chen"
  },
  {
    action: "mentioned you in",
    id: 6,
    target: "shadcnuikit.com open graph image",
    timestamp: "2 weeks ago",
    unread: false,
    user: "Miky Derya"
  }
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height="6"
      viewBox="0 0 6 6"
      width="6">
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function PopoverComponent() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false
      }))
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button aria-label="Open notifications" className="relative" size="icon" variant="outline">
          <BellIcon aria-hidden="true" size={16} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">Notifications</div>
          {unreadCount > 0 && (
            <button
              className="text-xs font-medium hover:underline"
              onClick={handleMarkAllAsRead}
              type="button">
              Mark all as read
            </button>
          )}
        </div>
        <div
          aria-orientation="horizontal"
          className="bg-border -mx-1 my-1 h-px"
          role="separator"
          tabIndex={-1}
        />
        {notifications.map((notification) => (
          <div
            className="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
            key={notification.id}>
            <div className="relative flex items-start pe-3">
              <div className="flex-1 space-y-1">
                <button
                  className="text-foreground/80 text-left after:absolute after:inset-0"
                  onClick={() => handleNotificationClick(notification.id)}
                  type="button">
                  <span className="text-foreground font-medium hover:underline">
                    {notification.user}
                  </span>{" "}
                  {notification.action}{" "}
                  <span className="text-foreground font-medium hover:underline">
                    {notification.target}
                  </span>
                  .
                </button>
                <div className="text-muted-foreground text-xs">{notification.timestamp}</div>
              </div>
              {notification.unread && (
                <div className="absolute end-0 self-center">
                  <span className="sr-only">Unread</span>
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
