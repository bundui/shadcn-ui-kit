"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getWishlistGroups, createWishlistGroup, addToWishlistWithGroup } from "@/lib/services/wishlist.service";
import { toast } from "sonner";
import { IconLoader2, IconPlus } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function WishlistModal({
  isOpen,
  onClose,
  productId,
  onSuccess
}: {
  isOpen: boolean,
  onClose: () => void,
  productId: string,
  onSuccess: () => void
}) {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [note, setNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const loadGroups = async () => {
    setLoading(true);
    const { data } = await getWishlistGroups();
    if (data) {
      setGroups(data);
      if (data.length > 0) {
        setSelectedGroup(prev => prev ? prev : data[0].id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadGroups();
      setNote("");
      setIsCreatingGroup(false);
      setNewGroupName("");
    }
  }, [isOpen]);

  const handleSave = async () => {
    setIsAdding(true);

    let targetGroupId = selectedGroup || null;

    // Nếu đang ở chế độ tạo nhóm mới và có nhập tên nhóm
    if (isCreatingGroup && newGroupName.trim()) {
      const { data: newGroup, error: groupError } = await createWishlistGroup(newGroupName.trim());
      if (groupError || !newGroup) {
        toast.error("Không thể tạo nhóm mới, vui lòng thử lại.");
        setIsAdding(false);
        return;
      }
      targetGroupId = newGroup.id;
    }

    const { error } = await addToWishlistWithGroup(productId, targetGroupId, note);
    setIsAdding(false);

    if (error) {
      // Postgres unique constraint error code is usually '23505'
      if ((error as any).code === '23505') {
        toast.error("Sản phẩm này đã có trong nhóm đã chọn");
      } else {
        toast.error("Đã xảy ra lỗi");
      }
    } else {
      toast.success("Đã thêm vào yêu thích");
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent showCloseButton={false}  className="sm:max-w-md p-0 overflow-hidden bg-card/80 backdrop-blur-3xl border border-border/50 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] gap-0 animate__animated animate__bounceIn">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl -z-10 -translate-x-10 translate-y-10 pointer-events-none" />

        <DialogHeader className="p-6 border-b border-border/50 bg-card/40 relative z-10">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
              <Image src="/icons/love.png" alt="Love" width={25} height={25} className="object-contain drop-shadow-sm" />
            </div>
            Thêm vào Yêu Thích
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-5 relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-medium text-muted-foreground">Đang tải danh sách nhóm...</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Chọn nhóm yêu thích
                </label>
                {!isCreatingGroup ? (
                  <div className="flex gap-2.5">
                    <div className="relative flex-1">
                      <select
                        className="flex h-11 w-full appearance-none items-center justify-between rounded-[16px] border border-border/50 bg-background/50 px-4 py-2 text-sm font-medium transition-colors hover:bg-background hover:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                      >
                        <option value="">-- Mặc định (Không thuộc nhóm nào) --</option>
                        {groups.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                      
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setIsCreatingGroup(true)} type="button" className="h-11 w-11 shrink-0 rounded-[16px] border-border/50 hover:bg-primary/5 hover:text-primary transition-all shadow-sm">
                      <IconPlus className="w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2.5">
                    <Input
                      placeholder="Nhập tên nhóm mới..."
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      autoFocus
                      className="h-11 rounded-[16px] border-border/50 bg-background/50 font-medium px-4 focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary/50 transition-all"
                    />
                    <Button variant="ghost" onClick={() => {
                      setIsCreatingGroup(false);
                      setNewGroupName("");
                    }} type="button" className="h-11 px-4 rounded-[16px] text-red-500 hover:text-red-600 hover:bg-red-500/10 font-bold transition-all">
                      Hủy
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Ghi chú <span className="text-muted-foreground font-normal">(Tùy chọn)</span>
                </label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-[16px] border border-border/50 bg-background/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-background hover:border-pink-500/30 focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/50 resize-none placeholder:text-muted-foreground/60"
                  placeholder="Ví dụ: Đợi sale ngày 11/11..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="p-6 pt-2 relative z-10 border-t border-border/10">
          <Button variant="outline" onClick={onClose} type="button" className="rounded-full px-6 h-11 font-bold border-border/50 hover:bg-muted/50 transition-all">Hủy</Button>
          <Button onClick={handleSave} disabled={loading || isAdding || (isCreatingGroup && !newGroupName.trim())} type="button" className="gap-1 rounded-full px-8 h-11 font-bold bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 group">
            {isAdding ? <IconLoader2 className="w-4 h-4 animate-spin mr-2" /> : <Image src="/icons/love3.png" alt="Love" width={16} height={16} className="mr-2 group-hover:scale-110 transition-transform" />}
            {isAdding ? "Đang xử lý..." : "Lưu sản phẩm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
