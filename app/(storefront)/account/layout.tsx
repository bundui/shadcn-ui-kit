"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Settings, 
  LogOut,
  ShoppingCart
} from "lucide-react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, logout } = useAuth();
  
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (!user) {
    return null;
  }

  const menuItems = [
    { name: "Tổng quan", href: "/account", icon: User },
    { name: "Đơn hàng", href: "/account/orders", icon: ShoppingCart },
    { name: "Sổ địa chỉ", href: "/account/addresses", icon: MapPin },
    { name: "Yêu thích", href: "/account/wishlist", icon: Heart },
    { name: "Tuỳ chỉnh", href: "/account/settings", icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl min-h-[calc(100vh-200px)] animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-72 shrink-0">
          <div className="bg-card/60 backdrop-blur-xl rounded-[24px] shadow-sm border border-border/50 p-5 sticky top-24">
            <div className="mb-8 flex items-center gap-4 px-2">
              <div className="size-14 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-primary-foreground text-xl font-bold shadow-md ring-4 ring-primary/10 shrink-0 overflow-hidden">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.email?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <h2 className="text-lg font-bold truncate">Tài khoản</h2>
                <p className="text-[13px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            
            <nav className="flex flex-col space-y-1.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-[14.5px] font-medium rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary/20"
                        : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("mr-3 size-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
                    {item.name}
                  </Link>
                );
              })}
              
              <div className="py-2">
                <div className="h-px w-full bg-border/50" />
              </div>
              
              <button
                onClick={() => logout()}
                className="flex items-center px-4 py-3 text-[14.5px] font-medium rounded-xl text-red-600/80 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-500 transition-colors w-full text-left"
              >
                <LogOut className="mr-3 size-5 text-red-500/70" />
                Đăng xuất
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="min-h-[400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
