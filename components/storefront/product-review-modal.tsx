"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, CheckCircle2, MessageSquarePlus, Sparkles, X, ThumbsUp, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

export interface ReviewItemData {
  productId: string;
  productName: string;
  productImage?: string;
  variantName?: string;
  price?: number;
  orderId?: string;
}

interface ProductReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ReviewItemData | null;
  onSuccess?: (productId: string) => void;
}

const RATING_LABELS: Record<number, { text: string; color: string; desc: string }> = {
  1: { text: "Rất không hài lòng", color: "text-red-500", desc: "Sản phẩm kém chất lượng hoặc gặp vấn đề lớn" },
  2: { text: "Không hài lòng", color: "text-orange-500", desc: "Sản phẩm chưa đạt kỳ vọng" },
  3: { text: "Bình thường", color: "text-yellow-600", desc: "Sản phẩm tạm ổn trong tầm giá" },
  4: { text: "Hài lòng", color: "text-blue-600", desc: "Sản phẩm tốt, đóng gói và dịch vụ chu đáo" },
  5: { text: "Tuyệt vời", color: "text-amber-500 font-bold", desc: "Chất lượng hoàn hảo, cực kỳ hài lòng!" },
};

const QUICK_SUGGESTIONS = [
  "Chất liệu cao cấp",
  "Đúng mô tả",
  "Giao hàng nhanh",
  "Đóng gói cẩn thận",
  "Đáng đồng tiền",
  "Màu sắc đẹp",
];

export function ProductReviewModal({ isOpen, onClose, item, onSuccess }: ProductReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset state mỗi khi mở modal mới
  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setHoverRating(null);
      setComment("");
      setIsSubmitting(false);
      setIsSubmitted(false);
      setErrorMessage(null);
    }
  }, [isOpen, item]);

  const handleAddSuggestion = (tag: string) => {
    const trimmed = comment.trim();
    if (!trimmed) {
      setComment(tag);
    } else if (!trimmed.includes(tag)) {
      setComment(`${trimmed}. ${tag}`);
    }
  };

  const handleSubmit = async () => {
    if (!item) return;

    if (comment.trim().length < 5) {
      setErrorMessage("Vui lòng viết ít nhất 5 ký tự để chia sẻ cảm nhận cụ thể hơn về sản phẩm bạn nhé!");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData?.user) {
        setErrorMessage("Bạn cần đăng nhập để gửi đánh giá sản phẩm.");
        setIsSubmitting(false);
        return;
      }

      const googleAvatar = userData.user.user_metadata?.picture || userData.user.user_metadata?.avatar_url;
      const googleName = userData.user.user_metadata?.full_name || userData.user.user_metadata?.name;
      if (googleAvatar || googleName) {
        await supabase.from("profiles").update({
          ...(googleAvatar ? { avatar_url: googleAvatar } : {}),
          ...(googleName ? { full_name: googleName } : {}),
        }).eq("id", userData.user.id);
      }

      // Ghi nhận đánh giá vào bảng product_reviews
      const { error: insertError } = await supabase.from("product_reviews").insert({
        product_id: item.productId,
        rating: rating,
        comment: comment.trim(),
        user_id: userData.user.id,
      });

      if (insertError) {
        setErrorMessage(`Không thể gửi đánh giá: ${insertError.message}`);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
      if (onSuccess && item.productId) {
        onSuccess(item.productId);
      }

      // Tự động đóng modal sau 1.8 giây khi gửi thành công
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMessage(err?.message || "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hoverRating || rating;
  const currentLabel = RATING_LABELS[activeRating] || RATING_LABELS[5];

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border shadow-2xl rounded-2xl bg-background animate__animated animate__zoomIn">
        {/* Header Banner */}
        <div className="p-6 pb-4 border-b border-border/80 bg-card">
          <DialogHeader className="text-left space-y-1.5">
            <DialogTitle className="text-xl font-bold text-foreground tracking-tight">
              Viết đánh giá sản phẩm
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Nhận xét của bạn sẽ giúp những người mua khác có thêm thông tin thực tế khi lựa chọn sản phẩm.
            </DialogDescription>
          </DialogHeader>
        </div>

        {isSubmitted ? (
          /* Màn hình thành công rực rỡ */
          <div className="p-8 text-center space-y-4 my-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="size-16 bg-green-100 dark:bg-green-950/60 rounded-full flex items-center justify-center mx-auto border border-green-200 dark:border-green-800 shadow-inner">
              <CheckCircle2 className="size-9 text-green-600 dark:text-green-400 " />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Gửi đánh giá thành công!</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Cảm ơn bạn đã dành thời gian chia sẻ cảm nhận chân thực về <strong>{item?.productName}</strong>.
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950/40 px-4 py-1.5 rounded-full border border-green-200/60">
                <ShieldCheck className="size-4" /> Đánh giá đã được xác thực từ khách hàng mua thực tế
              </span>
            </div>
          </div>
        ) : (
          /* Form Đánh giá */
          <div className="p-6 space-y-6">
            {/* Thẻ sản phẩm đang được đánh giá */}
            {item && (
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-muted/40 border border-border/80">
                <Image
                  width={56}
                  height={56}
                  unoptimized
                  src={item.productImage || "https://placehold.co/56x56"}
                  alt={item.productName}
                  className="size-14 rounded-lg object-cover border shrink-0 bg-background"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm line-clamp-1 text-foreground">{item.productName}</h4>
                  {item.variantName && (
                    <p className="text-xs text-muted-foreground mt-0.5">Phân loại: <span className="font-medium text-foreground">{item.variantName}</span></p>
                  )}
                  {item.price && (
                    <p className="text-xs font-bold text-primary mt-1">{formatCurrency(item.price)}</p>
                  )}
                </div>
              </div>
            )}

            {/* Chọn số sao (Star Rating Selector) */}
            <div className="space-y-3 text-center bg-card p-4 rounded-2xl border shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Chất lượng sản phẩm thế nào?
              </label>
              <div 
                className="flex items-center justify-center gap-2 py-1"
                onMouseLeave={() => setHoverRating(null)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= activeRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="p-1.5 focus:outline-none transition-transform hover:scale-125 active:scale-95 group/star"
                      aria-label={`Đánh giá ${star} sao`}
                    >
                      <Star
                        className={`size-8 transition-all duration-200 ${
                          isFilled
                            ? "text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]"
                            : "text-muted-foreground/30 hover:text-amber-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="min-h-[2.5rem] flex flex-col justify-center items-center">
                <span className={`text-sm font-bold transition-colors ${currentLabel.color}`}>
                  {currentLabel.text}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {currentLabel.desc}
                </span>
              </div>
            </div>

            {/* Gợi ý đánh giá nhanh (Quick Suggestions) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ThumbsUp className="size-3.5 text-primary" /> Gợi ý nhận xét nhanh:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SUGGESTIONS.map((tag, idx) => {
                  const isSelected = comment.includes(tag);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSuggestion(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-200 ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary font-medium shadow-xs"
                          : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Khung nhập cảm nhận chi tiết */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="comment-box" className="font-semibold text-foreground flex items-center gap-1.5">
                  <MessageSquarePlus className="size-3.5 text-primary" /> Cảm nhận chi tiết của bạn:
                </label>
                <span className="text-muted-foreground font-mono text-[11px]">
                  {comment.length}/500
                </span>
              </div>
              <Textarea
                id="comment-box"
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                placeholder="Hãy chia sẻ cảm nhận về chất liệu, độ bền, màu sắc hay đóng gói của sản phẩm..."
                rows={4}
                className="resize-none text-sm rounded-xl border-border/80 focus:border-primary focus:ring-primary/20 p-3 shadow-inner"
              />
            </div>

            {/* Thông báo lỗi nếu có */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2">
                <X className="size-4 shrink-0 mt-0.5 cursor-pointer" onClick={() => setErrorMessage(null)} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Nút thao tác Footer */}
            <DialogFooter className="gap-2 sm:gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl px-5 text-xs font-medium"
              >
                Hủy bỏ
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" /> Gửi đánh giá ngay
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
