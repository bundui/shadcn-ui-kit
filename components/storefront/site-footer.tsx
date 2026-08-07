import Link from "next/link";
import { CreditCard, FacebookIcon, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconBrandInstagram } from "@tabler/icons-react";

export function SiteFooter() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-card/80 backdrop-blur-xl border-t border-border/50 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-10 py-16 max-w-7xl mx-auto w-full relative z-10">
        <div className="col-span-1">
          <Link href="/" className="group text-xl md:text-2xl font-black tracking-tighter inline-flex items-center gap-2.5 mb-6 transition-all duration-300">
            <span className="flex items-center tracking-tight">
              <span className="bg-gradient-to-r from-violet-500 via-purple-400 to-fuchsia-400 dark:from-violet-300 dark:via-purple-200 dark:to-fuchsia-300 bg-clip-text text-transparent animate-shimmer-metallic drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]">
                Luxe
              </span>
              <span className="ml-0.5 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-800 dark:from-slate-100 dark:via-white dark:to-slate-300 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                Commerce
              </span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Trải nghiệm mua sắm đẳng cấp với những sản phẩm được tuyển chọn kỹ lưỡng, mang đến sự sang trọng và khác biệt.</p>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-background/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:border-primary/50 hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"><FacebookIcon className="w-5 h-5" /></div>
            <div className="w-10 h-10 rounded-[12px] bg-background/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:border-primary/50 hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"><IconBrandInstagram className="w-5 h-5" /></div>
          </div>
        </div>

        <div className="col-span-1">
          <h4 className="text-sm font-semibold mb-6 uppercase tracking-wider">Thông tin</h4>
          <ul className="space-y-4">
            <li><Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">Về chúng tôi</Link></li>
            <li><Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">Cửa hàng</Link></li>
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className="text-sm font-semibold mb-6 uppercase tracking-wider">Hỗ trợ</h4>
          <ul className="space-y-4">
            <li><Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">Chính sách đổi trả</Link></li>
            <li><Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">Chính sách bảo mật</Link></li>
            <li><Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">Điều khoản dịch vụ</Link></li>
          </ul>
        </div>

        <div className="col-span-1">
          <h4 className="text-sm font-bold mb-6 uppercase tracking-widest text-foreground">Bản tin</h4>
          <p className="text-sm text-muted-foreground mb-4">Đăng ký để nhận ưu đãi và tin tức mới nhất.</p>
          <form className="flex gap-2">
            <input 
              className="w-full bg-background/50 backdrop-blur-sm py-2.5 px-4 rounded-[12px] border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all" 
              placeholder="Email của bạn" 
              type="email"
            />
            <Button type="button" className="rounded-[12px] shadow-sm hover:shadow-md transition-all">Gửi</Button>
          </form>
        </div>
      </div>

      <div className="border-t border-border/50 px-4 md:px-10 py-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-4 relative z-10">
        <p className="text-sm text-muted-foreground font-medium text-center md:text-left">
          © 2026 LuxeCommerce. All rights reserved.
        </p>
        {/* <div className="flex gap-4">
          <div className="w-10 h-7 rounded bg-background/50 border border-border/50 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="w-10 h-7 rounded bg-background/50 border border-border/50 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
          </div>
        </div> */}
      </div>
    </footer>
  );
}
