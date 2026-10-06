"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

const notifications = [
  {
    id: 1,
    user: "Chris Tompson",
    action: "requested review on PR #42: Feature implementation.",
    time: "15 minutes ago",
    dateGroup: "Today",
    unread: true,
    highlighted: false
  },
  {
    id: 2,
    user: "Emma Davis",
    action: "shared New component library.",
    time: "45 minutes ago",
    dateGroup: "Today",
    unread: true,
    highlighted: true
  },
  {
    id: 3,
    user: "James Wilson",
    action: "assigned you to API integration task.",
    time: "4 hours ago",
    dateGroup: "Today",
    unread: false,
    highlighted: false
  },
  {
    id: 4,
    user: "Alex Morgan",
    action: "replied to your comment in Authentication flow.",
    time: "12 hours ago",
    dateGroup: "Today",
    unread: false,
    highlighted: false
  },
  {
    id: 5,
    user: "Sarah Chen",
    action: "commented on Dashboard redesign.",
    time: "2 days ago",
    dateGroup: "Yesterday",
    unread: false,
    highlighted: false
  },
  {
    id: 7,
    user: "Robert Kim",
    action: "approved your changes in Payment gateway PR.",
    time: "3 days ago",
    dateGroup: "Yesterday",
    unread: false,
    highlighted: false
  },
  {
    id: 6,
    user: "Miky Derya",
    action: "mentioned you in shadcnuikit.com open graph image.",
    time: "2 weeks ago",
    dateGroup: "This Week",
    unread: false,
    highlighted: false
  },
  {
    id: 8,
    user: "Laura Martinez",
    action: "created new issue: Bug in user authentication.",
    time: "5 days ago",
    dateGroup: "This Week",
    unread: false,
    highlighted: false
  },
  {
    id: 9,
    user: "Daniel Park",
    action: "merged your pull request: Dark mode implementation.",
    time: "1 week ago",
    dateGroup: "This Week",
    unread: false,
    highlighted: false
  },
  {
    id: 10,
    user: "Olivia Brown",
    action: "requested changes on Mobile responsive design PR.",
    time: "1 week ago",
    dateGroup: "This Week",
    unread: false,
    highlighted: false
  },
  {
    id: 11,
    user: "Michael Chen",
    action: "commented on Database migration strategy.",
    time: "2 weeks ago",
    dateGroup: "Last Week",
    unread: false,
    highlighted: false
  },
  {
    id: 12,
    user: "Sophia Lee",
    action: "tagged you in Performance optimization discussion.",
    time: "3 weeks ago",
    dateGroup: "Last Week",
    unread: false,
    highlighted: false
  },
  {
    id: 13,
    user: "David Johnson",
    action: "closed issue: Memory leak in image processing.",
    time: "3 weeks ago",
    dateGroup: "Last Week",
    unread: false,
    highlighted: false
  },
  {
    id: 14,
    user: "Emily White",
    action: "updated documentation: API endpoint reference.",
    time: "1 month ago",
    dateGroup: "Older",
    unread: false,
    highlighted: false
  },
  {
    id: 15,
    user: "Thomas Anderson",
    action: "deployed new version: v2.3.0 to production.",
    time: "1 month ago",
    dateGroup: "Older",
    unread: false,
    highlighted: false
  }
];

type Notification = (typeof notifications)[number];

function groupNotificationsByDate(notifications: Notification[]) {
  const grouped: Record<string, Notification[]> = {};

  notifications.forEach((notification) => {
    const dateGroup = notification.dateGroup;
    if (!grouped[dateGroup]) {
      grouped[dateGroup] = [];
    }
    grouped[dateGroup].push(notification);
  });

  return grouped;
}

const dateGroupOrder = ["Today", "Yesterday", "This Week", "Last Week", "Older"];

export default function Example() {
  const groupedNotifications = groupNotificationsByDate(notifications);
  const sortedDateGroups = dateGroupOrder.filter((group) => groupedNotifications[group]);

  return (
    <ScrollArea className="h-96 w-full max-w-xs rounded-md border">
      <div className="space-y-4">
        {sortedDateGroups.map((dateGroup) => (
          <div key={dateGroup} className="space-y-1">
            <div className="bg-background/80 text-muted-foreground sticky top-0 z-0 px-4 py-2 text-xs backdrop-blur-sm">
              {dateGroup}
            </div>
            {groupedNotifications[dateGroup].map((notification) => (
              <div
                key={notification.id}
                className="hover:bg-muted flex items-start gap-4 px-4 py-2.5 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">
                    <span className="font-semibold">{notification.user}</span>{" "}
                    <span className="text-foreground">{notification.action}</span>
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
