"use client";

import { useAuthModal } from "@/lib/store/use-auth-modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { isEmailRegistered, sendOtp, verifyOtp, completeRegister } from "@/lib/services/register.service";
import { getProfile } from "@/lib/services/profile.service";
import { getRole } from "@/lib/services/role.service";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AuthModal() {
  const router = useRouter();
  const { showLockedAlert } = useAuth();
  const { isOpen, closeModal, view, setView } = useAuthModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [regStep, setRegStep] = useState<"email" | "otp" | "password">("email");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setErrorMsg("");
        setPassword("");
        setOtp("");
        setRegStep("email");
        setView("login");
      }, 300); // Wait for modal slide-out animation to finish before clearing
      return () => clearTimeout(timer);
    }
  }, [isOpen, setView]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const targetPath = typeof window !== "undefined" && window.location.pathname === "/cart" ? "/checkout" : (typeof window !== "undefined" ? window.location.pathname : "/");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${targetPath}`,
        },
      });
      if (error) throw error;
      // Supabase sẽ redirect sang Google, không cần closeModal
    } catch (err: any) {
      toast.error(err.message || "Lỗi đăng nhập bằng Google");
      setErrorMsg(err.message || "Không thể kết nối đến Google.");
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      let userRole = "customer";
      if (authData?.user) {
        const { data: profileData } = await getProfile(authData.user.id);
        if (profileData?.is_locked) {
          await supabase.auth.signOut();
          closeModal();
          showLockedAlert();
          return;
        }
        if (profileData?.role_id) {
          const { data: roleData } = await getRole(profileData.role_id);
          if (roleData?.name) {
            userRole = roleData.name;
          }
        }
      }
      toast.success("Đăng nhập thành công!");
      closeModal();
      if (userRole === "admin" || userRole === "staff") {
        router.push("/dashboard");
      } else if (typeof window !== "undefined" && window.location.pathname === "/cart") {
        router.push("/checkout");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      let msg = err.message || "Lỗi đăng nhập";
      if (msg === "Invalid login credentials") msg = "Email hoặc mật khẩu không chính xác.";
      toast.error(msg);
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const exists = await isEmailRegistered(email);
      if (exists) {
        toast.error("Email này đã được đăng ký. Vui lòng đăng nhập.");
        setView("login");
        return;
      }
      const { error } = await sendOtp(email);
      if (error) throw error;
      toast.success("Mã xác thực đã được gửi đến email của bạn!");
      setRegStep("otp");
    } catch (err: any) {
      toast.error(err.message || "Lỗi gửi mã OTP");
      setErrorMsg(err.message || "Lỗi gửi mã OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const { error } = await verifyOtp(email, otp);
      if (error) throw error;
      toast.success("Xác thực email thành công!");
      setRegStep("password");
    } catch (err: any) {
      toast.error(err.message || "Mã OTP không hợp lệ");
      setErrorMsg("Mã OTP không chính xác hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMsg("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setErrorMsg("Mật khẩu phải chứa ít nhất 1 chữ in hoa.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setErrorMsg("Mật khẩu phải chứa ít nhất 1 chữ số.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      await completeRegister(fullName, password);
      toast.success("Đăng ký hoàn tất! Chào mừng bạn.");
      closeModal();
      if (typeof window !== "undefined" && window.location.pathname === "/cart") {
        router.push("/checkout");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi cập nhật thông tin");
      setErrorMsg(err.message || "Đã xảy ra lỗi khi hoàn tất đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  // Reset steps when changing view
  const switchView = (newView: "login" | "register" | "forgot_password") => {
    setErrorMsg("");
    setView(newView);
    if (newView === "register") setRegStep("email");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden bg-white dark:bg-card/95 border border-border/50 shadow-2xl shadow-primary/20 rounded-[32px]  backdrop-blur-xl animate__animated animate__bounceIn">
        <div className="flex flex-col relative">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 -translate-x-10 translate-y-10" />

          <div className="pt-8 pb-4 px-8 text-center relative z-10">
            <div  className="group text-lg md:text-2xl font-black tracking-tighter flex-shrink-0 flex justify-center items-center gap-1.5 md:gap-2.5 transition-all duration-300 min-w-0 overflow-hidden">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-full group-hover:opacity-80 transition duration-800 animate-pulse" />
                <Image src="/icons/luxecommerce.png" alt="Logo" width={28} height={28} className="relative md:w-[34px] md:h-[34px]" />
              </div>
              <span className="flex items-center tracking-tight truncate">
                <span className="bg-gradient-to-r from-violet-500 via-purple-400 to-fuchsia-400 dark:from-violet-300 dark:via-purple-200 dark:to-fuchsia-300 bg-clip-text text-transparent animate-shimmer-metallic drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]">
                  Luxe
                </span>
                <span className="ml-0.5 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-800 dark:from-slate-100 dark:via-white dark:to-slate-300 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] truncate">
                  Commerce
                </span>
                <Image src="/icons/star.png" alt="Logo" width={20} height={20} className="ml-1 md:w-[25px] md:h-[25px] animate__animated animate__flash animate__infinite hidden sm:inline-block shrink-0" />
              </span>
            </div>

            <p className="text-muted-foreground text-[14.5px] mt-2 font-medium">
              {view === "login" ? "Chào mừng trở lại! Đăng nhập để tiếp tục." : "Tạo tài khoản mới để trải nghiệm mua sắm."}
            </p>
          </div>

          <div className="px-8 pb-8 pt-2 relative z-10">
            {view === "login" ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="font-semibold text-foreground/90 ml-1">Email của bạn</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-[16px] bg-background/50 border-border/60 focus:bg-background transition-colors px-4 shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-1">
                      <Label htmlFor="password" className="font-semibold text-foreground/90">Mật khẩu</Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showLoginPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 rounded-[16px] bg-background/50 border-border/60 focus:bg-background transition-colors px-4 shadow-sm pr-12"
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[13.5px] p-3 rounded-[12px] font-medium flex items-start gap-2">
                    <span className="mt-0.5">⚠️</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <Button type="submit" className="w-full h-12 m-0 rounded-[16px] font-bold text-[15px] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform duration-300" disabled={loading}>
                  {loading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Đăng nhập
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/60" /></div>
                  <div className="relative flex justify-center text-[11px] font-bold uppercase tracking-wider">
                    <span className="bg-white dark:bg-card rounded-full px-3  text-muted-foreground">Hoặc tiếp tục với</span>
                  </div>
                </div>

                <Button type="button" variant="outline" className="w-full h-12 rounded-[16px] font-semibold text-[14px] bg-background/50 hover:bg-muted/50 border-border/60 hover:border-border transition-all duration-300 shadow-sm" disabled={loading} onClick={handleGoogleLogin}>
                  <svg width="20" height="20" viewBox="0 0 24 24" className="mr-3">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Đăng nhập bằng Google
                </Button>

                <div className="text-center text-[14.5px] mt-2 font-medium text-muted-foreground">
                  Chưa có tài khoản?{" "}
                  <button type="button" className="text-primary font-bold hover:underline hover:text-primary/80 transition-colors" onClick={() => switchView("register")}>
                    Đăng ký ngay
                  </button>
                </div>
              </form>
            ) : view === "register" ? (
              <div className="space-y-5">
                {regStep === "email" && (
                  <form onSubmit={handleRegisterEmail} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-email" className="font-semibold text-foreground/90 ml-1">Email đăng ký</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-[16px] bg-background/50 border-border/60 focus:bg-background transition-colors px-4 shadow-sm"
                      />
                    </div>

                    {errorMsg && (
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[13.5px] p-3 rounded-[12px] font-medium flex items-start gap-2">
                        <span className="mt-0.5">⚠️</span>
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <Button type="submit" className="w-full h-12 rounded-[16px] font-bold text-[15px] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform duration-300" disabled={loading}>
                      {loading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Tiếp tục
                    </Button>
                  </form>
                )}

                {regStep === "otp" && (
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div className="bg-primary/5 border border-primary/10 rounded-[16px] p-4 text-center">
                      <p className="text-[14.5px] text-muted-foreground leading-relaxed">
                        Mã xác thực 6 chữ số đã được gửi đến<br />
                        <span className="font-bold text-foreground">{email}</span>
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Input
                        id="otp"
                        type="text"
                        placeholder="••••••"
                        maxLength={6}
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="h-14 rounded-[16px] bg-background/50 border-border/60 focus:bg-background transition-colors text-center tracking-[0.5em] text-2xl font-bold shadow-sm"
                      />
                    </div>

                    {errorMsg && (
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[13.5px] p-3 rounded-[12px] font-medium flex items-start gap-2">
                        <span className="mt-0.5">⚠️</span>
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <Button type="submit" className="w-full h-12 rounded-[16px] font-bold text-[15px] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform duration-300" disabled={loading || otp.length < 6}>
                      {loading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Xác nhận mã
                    </Button>

                    <div className="text-center mt-2">
                      <button type="button" className="text-[14px] text-muted-foreground font-medium hover:text-foreground transition-colors" onClick={() => setRegStep("email")} disabled={loading}>
                        ← Nhập email khác
                      </button>
                    </div>
                  </form>
                )}

                {regStep === "password" && (
                  <form onSubmit={handleCompleteRegister} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullname" className="font-semibold text-foreground/90 ml-1">Họ và tên</Label>
                      <Input
                        id="fullname"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-12 rounded-[16px] bg-background/50 border-border/60 focus:bg-background transition-colors px-4 shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-password" className="font-semibold text-foreground/90 ml-1">Mật khẩu</Label>
                      <div className="relative">
                        <Input
                          id="reg-password"
                          type={showRegPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          minLength={8}
                          placeholder="Ít nhất 8 ký tự, 1 hoa, 1 số"
                          className="h-12 rounded-[16px] bg-background/50 border-border/60 focus:bg-background transition-colors px-4 shadow-sm pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                        >
                          {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </Button>
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[13.5px] p-3 rounded-[12px] font-medium flex items-start gap-2">
                        <span className="mt-0.5">⚠️</span>
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <Button type="submit" className="w-full h-12 rounded-[16px] font-bold text-[15px] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform duration-300 mt-2" disabled={loading}>
                      {loading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Hoàn tất đăng ký
                    </Button>
                  </form>
                )}

                {regStep === "email" && (
                  <div className="text-center text-[14.5px] mt-6 font-medium text-muted-foreground">
                    Đã có tài khoản?{" "}
                    <button type="button" className="text-primary font-bold hover:underline hover:text-primary/80 transition-colors" onClick={() => switchView("login")}>
                      Đăng nhập ngay
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚧</span>
                </div>
                <h3 className="text-lg font-bold">Đang phát triển</h3>
                <p className="text-sm text-muted-foreground px-4 leading-relaxed mb-6">
                  Tính năng quên mật khẩu đang được chúng tôi hoàn thiện và sẽ sớm ra mắt.
                </p>
                <Button variant="outline" className="w-full h-12 rounded-[16px] font-semibold" onClick={() => setView("login")}>
                  Quay lại đăng nhập
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
