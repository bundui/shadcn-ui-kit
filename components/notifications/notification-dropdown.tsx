"use client";

import { useEffect, useState } from "react";
import { Bell, Gift, Package, Info, CheckCheck, AlertTriangle, Tag, Hand, Star, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Notification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
  deleteNotification,
} from "@/lib/services/notification.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function NotificationDropdown({ userId }: { userId?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      queueMicrotask(() => {
        setNotifications([]);
        setUnreadCount(0);
      });
      return;
    }

    const fetchNotifications = async () => {
      const [{ data }, { count }] = await Promise.all([
        getUserNotifications(userId),
        getUnreadCount(userId),
      ]);
      if (data) setNotifications(data);
      if (count !== null) setUnreadCount(count);
    };

    fetchNotifications();

    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleDelete = async (e: React.MouseEvent, notification: Notification) => {
    e.stopPropagation(); // ngăn trigger mở link
    await deleteNotification(notification.id);
    if (!notification.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    toast.success("Đã xóa thông báo.");
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    await markAllNotificationsAsRead(userId);
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="w-4 h-4 text-blue-500" />;
      case "promotion":
        return <Gift className="w-4 h-4 text-rose-500" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "coupon":
        return <Tag className="w-4 h-4 text-violet-500" />;
      case "welcome":
        return <Hand className="w-4 h-4 text-sky-500" />;
      case "review":
        return <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />;
      case "system":
      default:
        return <Info className="w-4 h-4 text-emerald-500" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      if (hours === 0) {
        const mins = Math.floor(diff / 60000);
        return mins <= 1 ? "Vừa xong" : `${mins} phút trước`;
      }
      return `${hours} giờ trước`;
    }

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hidden sm:inline-flex text-muted-foreground hover:text-primary transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl shadow-xl border-border/50 z-[100] overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-muted/30">
          <DropdownMenuLabel className="font-bold p-0 text-base">Thông báo của bạn</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-8 px-2 text-xs text-primary hover:bg-primary/10 hover:text-primary gap-1">
              <CheckCheck className="w-3.5 h-3.5" />
              Đã đọc tất cả
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />

        <ScrollArea className="h-[350px]">
          {!userId ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm">Đăng nhập để xem thông báo</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm">Bạn chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "group flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/60 border-b border-border/50 last:border-0 relative",
                    !notification.is_read ? "bg-primary/5" : ""
                  )}
                >
                  <div className="mt-0.5 shrink-0 bg-background p-2 rounded-full border shadow-sm">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex flex-col gap-1 flex-1 overflow-hidden pr-4">
                    <p className={cn(
                      "text-sm font-medium leading-tight",
                      !notification.is_read ? "text-foreground font-semibold" : "text-foreground/80"
                    )}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/80 font-medium mt-1">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>

                  {/* Chấm đỏ chưa đọc */}
                  {!notification.is_read && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5 group-hover:opacity-0 transition-opacity" />
                  )}

                  {/* Nút xóa X khi Hover */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(e, notification)}
                    className="absolute right-2 top-3 size-6 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950 transition-opacity text-muted-foreground"
                    title="Xóa thông báo"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
