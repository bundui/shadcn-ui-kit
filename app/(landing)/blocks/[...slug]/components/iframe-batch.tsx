"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BATCH_SIZE = 15;

type IframeBatchContextValue = {
  count: number;
  reveal: (index: number) => void;
};

const IframeBatchContext = createContext<IframeBatchContextValue | null>(null);

export function IframeBatchProvider({
  total,
  children,
}: {
  total: number;
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = count < total;

  const loadMore = useCallback(
    () => setCount((c) => Math.min(c + BATCH_SIZE, total)),
    [total],
  );

  const reveal = useCallback(
    (index: number) =>
      setCount((c) =>
        Math.max(c, Math.ceil((index + 1) / BATCH_SIZE) * BATCH_SIZE),
      ),
    [],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!hasMore || !el) return;
    const check = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 400 && rect.bottom > -400) {
        window.removeEventListener("scroll", check);
        loadMore();
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [hasMore, count, loadMore]);

  return (
    <IframeBatchContext.Provider value={{ count, reveal }}>
      {children}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex justify-center py-4 [overflow-anchor:none]"
        >
          <Button variant="outline" onClick={loadMore}>
            Show more blocks ({total - count} left)
          </Button>
        </div>
      )}
    </IframeBatchContext.Provider>
  );
}

export function useIframeBatch() {
  return useContext(IframeBatchContext);
}

export function BatchItem({
  id,
  index,
  className,
  children,
}: {
  id: string;
  index: number;
  className?: string;
  children: React.ReactNode;
}) {
  const batch = useIframeBatch();
  const isHidden = Boolean(batch && index >= batch.count);
  const reveal = batch?.reveal;

  useEffect(() => {
    const scrollToSelf = () => {
      if (decodeURIComponent(window.location.hash.slice(1)) !== id) return;
      reveal?.(index);
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView(),
      );
    };
    scrollToSelf();
    window.addEventListener("hashchange", scrollToSelf);
    return () => window.removeEventListener("hashchange", scrollToSelf);
  }, [id, index, reveal]);

  return (
    <div
      id={id}
      className={cn("scroll-mt-32", className, isHidden && "hidden")}
    >
      {children}
    </div>
  );
}
