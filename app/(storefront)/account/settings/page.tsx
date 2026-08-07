"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile, updatePassword, uploadAvatar } from "@/lib/services/profile.service";
import { IconLoader2, IconUpload, IconCamera } from "@tabler/icons-react";
import { Eye, EyeOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Image from "next/image";

export default function AccountSettingsPage() {
  const { user, profile } = useAuth();
  const authProvider = user?.app_metadata?.provider || "email";
  const isOAuth = ["google", "github", "facebook", "apple"].includes(authProvider);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      }));
      setAvatarUrl(profile.avatar_url || user?.user_metadata?.avatar_url || null);
    }
  }, [profile, user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    const file = e.target.files[0];
    
    setUploadingAvatar(true);
    
    try {
      const newAvatarUrl = await uploadAvatar(user.id, file);
      setAvatarUrl(newAvatarUrl);
      
      // Update profile immediately with new avatar
      await updateProfile(user.id, { avatar_url: newAvatarUrl });
      toast.success("Ảnh đại diện đã được cập nhật!");
    } catch (err: any) {
      toast.error("Lỗi tải lên ảnh: " + (err.message || err.toString()));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Validation
    if (formData.phone) {
      // Regex for Vietnamese phone numbers
      const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
        toast.error("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại (VD: 0912345678).");
        return;
      }
    }

    if (formData.full_name && formData.full_name.trim().length < 2) {
      toast.error("Họ và tên quá ngắn.");
      return;
    }

    if (!isOAuth && formData.password) {
      if (formData.password.length < 8) {
        toast.error("Mật khẩu mới phải có ít nhất 8 ký tự.");
        return;
      }
      if (!/[A-Z]/.test(formData.password)) {
        toast.error("Mật khẩu mới phải chứa ít nhất 1 chữ in hoa.");
        return;
      }
      if (!/[0-9]/.test(formData.password)) {
        toast.error("Mật khẩu mới phải chứa ít nhất 1 chữ số.");
        return;
      }
      if (formData.password !== formData.confirm_password) {
        toast.error("Mật khẩu xác nhận không khớp.");
        return;
      }
    }

    setLoading(true);

    try {
      // 1. Cập nhật profile (tên, SĐT)
      const { error: profileError } = await updateProfile(user.id, {
        full_name: formData.full_name,
        phone: formData.phone,
      });

      if (profileError) throw profileError;

      // 2. Cập nhật mật khẩu nếu có nhập (chỉ áp dụng khi không phải OAuth)
      if (!isOAuth && formData.password) {
        const { error: passwordError } = await updatePassword(formData.password);
        if (passwordError) throw passwordError;
      }

      toast.success("Cập nhật thông tin thành công!");
      setFormData(prev => ({ ...prev, password: "", confirm_password: "" }));
    } catch (err: any) {
      toast.error(err.message || "Đã xảy ra lỗi khi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10 mt-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Cài đặt tài khoản</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8 bg-card/60 backdrop-blur-xl rounded-[24px] border border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent" />
          <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/30 to-primary/0 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Avatar className="h-28 w-28 shadow-xl ring-4 ring-background relative z-10 transition-transform duration-300 group-hover:scale-[1.02]">
              <AvatarImage src={avatarUrl || ""} className="object-cover" />
              <AvatarFallback className="bg-primary/5 text-primary text-3xl font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
              {uploadingAvatar ? (
                <IconLoader2 className="size-8 text-white animate-spin" />
              ) : (
                <IconCamera className="size-8 text-white shadow-sm" />
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/png, image/jpeg, image/webp" 
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
            />
          </div>
          <div className="text-center sm:text-left pt-2">
            <h3 className="text-lg font-bold">Ảnh đại diện</h3>
            <p className="text-[13px] text-muted-foreground mt-1.5 mb-4 max-w-sm leading-relaxed mx-auto sm:mx-0">
              Dùng định dạng PNG, JPG hoặc WEBP. Kích thước tối đa là 5MB.
            </p>
            <Button type="button" variant="outline" className="rounded-xl border-border/60 shadow-sm hover:bg-muted/50" onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar}>
              {uploadingAvatar ? "Đang tải lên..." : "Chọn ảnh mới"}
            </Button>
          </div>
        </div>

        {/* Personal Info Section */}
        <div className="p-6 sm:p-8 bg-card/60 backdrop-blur-xl rounded-[24px] border border-border/50 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold">Thông tin cá nhân</h2>
            <p className="text-sm text-muted-foreground">Cập nhật thông tin liên hệ của bạn.</p>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-[13px] font-semibold text-foreground/80">Email đăng nhập</Label>
              <Input 
                id="email" 
                type="email" 
                value={user?.email || ""} 
                disabled 
                className="h-11 bg-muted/50 border-transparent text-muted-foreground opacity-70 cursor-not-allowed rounded-xl font-medium"
              />
              <p className="text-[11px] font-medium text-muted-foreground/70">Tài khoản email được liên kết không thể thay đổi lúc này.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label htmlFor="full_name" className="text-[13px] font-semibold text-foreground/80">Họ và tên</Label>
                <Input 
                  id="full_name" 
                  name="full_name"
                  value={formData.full_name} 
                  onChange={handleChange}
                  placeholder="Nhập họ và tên..."
                  className="h-11 bg-background/50 border-border/60 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary rounded-xl transition-all"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="phone" className="text-[13px] font-semibold text-foreground/80">Số điện thoại</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  type="tel"
                  value={formData.phone} 
                  onChange={handleChange}
                  placeholder="Ví dụ: 0912345678"
                  className="h-11 bg-background/50 border-border/60 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary rounded-xl transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="p-6 sm:p-8 bg-card/60 backdrop-blur-xl rounded-[24px] border border-border/50 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold">Bảo mật & Đăng nhập</h2>
            <p className="text-sm text-muted-foreground">Quản lý cách bạn đăng nhập vào hệ thống.</p>
          </div>
          
          {isOAuth ? (
            <div className="relative overflow-hidden rounded-2xl border border-green-200/50 dark:border-green-900/30 bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-950/20 p-5 sm:p-6 shadow-sm">
              <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                <Image src="/icons/google.png" alt="Google Background" width={120} height={120} />
              </div>
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 z-10">
                <div className="p-3.5 rounded-[18px] bg-white dark:bg-gray-900 border border-border/50 shadow-sm shrink-0 flex items-center justify-center">
                  <Image src="/icons/google.png" alt="Google" width={32} height={32} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                    <h4 className="font-bold text-[15px] text-foreground">Xác thực bằng Google</h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                      Đã liên kết
                    </span>
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed max-w-lg">
                    Tài khoản của bạn được quản lý bảo mật trực tiếp bởi <strong>Google</strong>. 
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-blue-50/50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 px-4 py-3 rounded-xl text-[13px] border border-blue-200/50 dark:border-blue-800/50">
                Bỏ trống các trường bên dưới nếu bạn không muốn đổi mật khẩu.
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <Label htmlFor="password" className="text-[13px] font-semibold text-foreground/80">Mật khẩu mới</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password} 
                      onChange={handleChange}
                      placeholder="Ít nhất 8 ký tự, 1 hoa, 1 số"
                      className="h-11 pr-10 bg-background/50 border-border/60 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary rounded-xl transition-all"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 size-9 hover:bg-muted text-muted-foreground rounded-lg"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="confirm_password" className="text-[13px] font-semibold text-foreground/80">Xác nhận mật khẩu mới</Label>
                  <div className="relative">
                    <Input 
                      id="confirm_password" 
                      name="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirm_password} 
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu mới"
                      className="h-11 pr-10 bg-background/50 border-border/60 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary rounded-xl transition-all"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 size-9 hover:bg-muted text-muted-foreground rounded-lg"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={loading} 
            size="lg"
            className="rounded-full px-8 h-12 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all font-bold text-[14px]"
          >
            {loading ? <IconLoader2 className="size-5 mr-2 animate-spin" /> : null}
            Lưu Thay Đổi
          </Button>
        </div>
      </form>
    </div>
  );
}
