"use client";

import { getProfile, updateProfile } from "@/lib/services/profile.service";
import { getRole } from "@/lib/services/role.service";
import { syncGuestCartToSupabase } from "@/lib/services/cart.service";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { isSessionValid } from "@/lib/supabase/client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IconLock, IconUserX } from "@tabler/icons-react";
import Image from "next/image";

type AuthContextType = {
    user: User | null;
    profile: any;
    role: string | null;
    loading: boolean;
    logout: () => Promise<void>;
    showLockedAlert: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    role: null,
    loading: true,
    logout: async () => {},
    showLockedAlert: () => {},
});

const clearAuthCache = () => {
    if (typeof window !== "undefined") {
        try {
            Object.keys(sessionStorage).forEach(k => {
                if (k.startsWith('luxe_auth_cache_')) sessionStorage.removeItem(k);
            });
        } catch (e) {}
    }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<any>(null)
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [authAlert, setAuthAlert] = useState<'none' | 'locked' | 'deleted'>('none');

    const showLockedAlert = useCallback(() => {
        setAuthAlert('locked');
    }, []);

    const logout = useCallback(async () => {
        clearAuthCache();
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        router.push("/");
    }, [router]);
    const fetchProfileAndRole = useCallback(async (userObj: User) => {
        const { data, error } = await getProfile(userObj.id);
        if (error) {
            if (error.code === 'PGRST116') {
                clearAuthCache();
                await supabase.auth.signOut();
                setUser(null); setProfile(null); setRole(null);
                setAuthAlert('deleted');
            } else {
                console.error(error);
            }
            return;
        }
        
        let currentProfile = data;
        if (currentProfile?.is_locked) {
            clearAuthCache();
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setRole(null);
            setAuthAlert('locked');
            return;
        }

        const meta = userObj.user_metadata;

        // Only update profile from Google metadata if key fields are truly missing
        // (not on every reload — only when avatar_url is absent from DB)
        if (meta && currentProfile) {
            const googleName = meta.full_name || meta.name;
            const googleAvatar = meta.avatar_url || meta.picture;
            // Strict check: only update if DB fields are null/empty, not just equal to email prefix
            const needsNameUpdate = googleName && !currentProfile.full_name;
            const needsAvatarUpdate = googleAvatar && !currentProfile.avatar_url;

            if (needsNameUpdate || needsAvatarUpdate) {
                const { data: updated } = await updateProfile(userObj.id, {
                    full_name: needsNameUpdate ? googleName : currentProfile.full_name,
                    avatar_url: needsAvatarUpdate ? googleAvatar : currentProfile.avatar_url,
                });
                if (updated) currentProfile = updated;
            }
        }

        // Run getRole in parallel with setProfile (no sequential dependency)
        const rolePromise = currentProfile?.role_id
            ? getRole(currentProfile.role_id)
            : Promise.resolve({ data: null });

        setProfile(currentProfile);

        const { data: roleData } = await rolePromise;
        if (roleData) setRole(roleData.name);

        if (typeof window !== "undefined" && currentProfile) {
            sessionStorage.setItem(`luxe_auth_cache_${userObj.id}`, JSON.stringify({
                profile: currentProfile,
                role: roleData?.name ?? null
            }));
        }
    }, []);

    const lastUserIdRef = useRef<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            // 1. Kiểm tra nhanh session trong bộ nhớ cục bộ (0ms network latency)
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user ?? null;
            if (!isMounted) return;

            setUser(prev => (prev?.id === currentUser?.id ? prev : currentUser));

            if (currentUser) {
                lastUserIdRef.current = currentUser.id;

                // 2. Kiểm tra bộ nhớ đệm tab (SessionStorage) để mở khóa giao diện NGAY LẬP TỨC (0ms spinner khi F5)
                if (typeof window !== "undefined") {
                    const cachedStr = sessionStorage.getItem(`luxe_auth_cache_${currentUser.id}`);
                    if (cachedStr) {
                        try {
                            const cached = JSON.parse(cachedStr);
                            if (cached.profile) {
                                setProfile(cached.profile);
                                if (cached.role) setRole(cached.role);
                                setLoading(false); // Mở khóa ngay lập tức không chờ truy vấn PostgreSQL!
                            }
                        } catch (e) {
                            console.error("Lỗi parse auth cache", e);
                        }
                    }
                }

                // 3. Chạy fetchProfileAndRole để cập nhật dữ liệu mới nhất (Stale-While-Revalidate)
                await fetchProfileAndRole(currentUser);
                if (isMounted) setLoading(false);

                // 4. Đồng bộ giỏ hàng chạy hoàn toàn ngầm trong background, không chặn loading UI
                syncGuestCartToSupabase().then(({ mergedCount }) => {
                    if (mergedCount > 0 && typeof window !== "undefined") {
                        window.dispatchEvent(new Event("cart-updated"));
                    }
                }).catch(console.error);
            } else {
                if (isMounted) setLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isMounted) return;
            const currentUser = session?.user ?? null;
            setUser(prev => (prev?.id === currentUser?.id ? prev : currentUser));

            if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
                if (currentUser && currentUser.id !== lastUserIdRef.current) {
                    lastUserIdRef.current = currentUser.id;
                    setLoading(true);
                    await fetchProfileAndRole(currentUser);
                    if (isMounted) setLoading(false);

                    syncGuestCartToSupabase().then(({ mergedCount }) => {
                        if (mergedCount > 0) {
                            window.dispatchEvent(new Event("cart-updated"));
                        }
                        if (typeof window !== "undefined" && window.location.pathname === "/cart") {
                            router.push("/checkout");
                        }
                    }).catch(console.error);
                }
            } else if (event === "SIGNED_OUT") {
                lastUserIdRef.current = null;
                clearAuthCache();
                setUser(null);
                setProfile(null);
                setRole(null);
                if (isMounted) setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            subscription?.unsubscribe();
        };
    }, [fetchProfileAndRole, router]);

    // Periodic check for session expiration (in case Supabase does not emit SIGNED_OUT)
    useEffect(() => {
        const check = async () => {
            const valid = await isSessionValid();
            if (!valid) {
                logout();
            }
        };
        const interval = setInterval(check, 300000); // every 5 minutes
        return () => clearInterval(interval);
    }, [logout]);

    // Hybrid Listener: Real-time + Visibility API + Polling (Chống trượt 100%)
    useEffect(() => {
        if (!user?.id) return;

        const checkLockStatus = async (forceDeleted = false) => {
            if (forceDeleted) {
                clearAuthCache();
                await supabase.auth.signOut();
                setUser(null); setProfile(null); setRole(null);
                setAuthAlert('deleted');
                router.push("/");
                return;
            }

            const { data, error } = await getProfile(user.id);
            if (error && error.code === 'PGRST116') {
                clearAuthCache();
                await supabase.auth.signOut();
                setUser(null); setProfile(null); setRole(null);
                setAuthAlert('deleted');
                router.push("/");
            } else if (data?.is_locked) {
                clearAuthCache();
                await supabase.auth.signOut();
                setUser(null);
                setProfile(null);
                setRole(null);
                setAuthAlert('locked');
                router.push("/");
            } else if (data && data.is_locked === false && profile?.is_locked) {
                setProfile((prev: any) => ({ ...prev, is_locked: false }));
            }
        };

        // 1. Lắng nghe qua WebSocket (Real-time) - Hoạt động khi DB bật Replication
        const profileSubscription = supabase.channel(`profile-lock-listener-${user.id}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
                (payload) => { 
                    if (payload.eventType === 'DELETE') checkLockStatus(true);
                    else checkLockStatus(); 
                }
            ).subscribe();

        // 2. Lắng nghe khi User chuyển qua lại giữa các Tab (Visibility API & Focus)
        // Khi user chuyển tab về lại trang web, ngay lập tức kiểm tra (tạo cảm giác đá văng tức thì)
        const onFocusOrVisible = () => {
            if (document.visibilityState === 'visible') {
                checkLockStatus();
            }
        };
        window.addEventListener("visibilitychange", onFocusOrVisible);
        window.addEventListener("focus", onFocusOrVisible);

        // 3. Fallback Polling: Tự động kiểm tra chìm mỗi 30 giây để đảm bảo 100% không bỏ lọt
        const intervalId = setInterval(checkLockStatus, 30000);

        return () => {
            supabase.removeChannel(profileSubscription);
            window.removeEventListener("visibilitychange", onFocusOrVisible);
            window.removeEventListener("focus", onFocusOrVisible);
            clearInterval(intervalId);
        };
    }, [user?.id, router, profile?.is_locked]);

    return (
        <AuthContext.Provider value={{ user, profile, role, loading, logout, showLockedAlert }}>
            {children}
            <AlertDialog open={authAlert !== 'none'} onOpenChange={(open) => !open && setAuthAlert('none')}>
                <AlertDialogContent className="sm:max-w-md z-[9999] animate__animated animate__bounceIn">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
                            <div className="p-2 rounded-full bg-red-500/10 shrink-0">
                                {authAlert === 'deleted' ? (
                                    <IconUserX className="w-6 h-6 text-red-600" />
                                ) : (
                                    <Image src="/icons/lock.png" alt="lock" width={24} height={24} />
                                )}
                            </div>
                            <AlertDialogTitle className="text-xl font-bold">
                                {authAlert === 'deleted' ? "Tài khoản không tồn tại" : "Tài khoản của bạn đã bị khóa"}
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="space-y-3  text-foreground/90 text-sm">
                            <p>
                                {authAlert === 'deleted' 
                                    ? "Hệ thống phát hiện tài khoản của bạn đã bị xóa. Vui lòng liên hệ ban quản trị nếu đây là sự nhầm lẫn."
                                    : "Hệ thống phát hiện tài khoản của bạn hiện đang bị tạm khóa do vi phạm điều khoản dịch vụ hoặc yêu cầu bảo mật từ ban quản trị."}
                            </p>
                            <div className="bg-red-50 dark:bg-red-950/40 p-3.5 rounded-lg border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 leading-relaxed">
                                <strong>Vui lòng liên hệ bộ phận chăm sóc khách hàng:</strong>
                                <ul className="  list-disc list-inside opacity-90">
                                    <li>Email: <strong>support@luxecommerce.vn</strong></li>
                                    <li>Hotline: <strong>1900 6868</strong> (8:00 - 22:00 hàng ngày)</li>
                                </ul>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                            onClick={() => {
                                setAuthAlert('none');
                                router.push("/");
                            }}
                        >
                            Đã hiểu và quay về Trang chủ
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
