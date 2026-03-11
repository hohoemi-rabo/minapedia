"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { getPublicImageUrl } from "@/lib/supabase/storage";

type ImageCarouselProps = {
  images: { storage_path: string; order_index: number }[];
  alt: string;
};

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const sorted = [...images].sort((a, b) => a.order_index - b.order_index);
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(Math.max(0, Math.min(index, sorted.length - 1)));
    },
    [sorted.length]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(current + (diff > 0 ? 1 : -1));
    }
  };

  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Image
        src={getPublicImageUrl(sorted[current].storage_path)}
        alt={`${alt} - 写真 ${current + 1}`}
        fill
        sizes="(max-width: 512px) 100vw, 512px"
        className="object-cover"
        priority={current === 0}
      />

      {/* 左右ボタン */}
      {sorted.length > 1 && (
        <>
          {current > 0 && (
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-lg text-white"
              aria-label="前の写真"
            >
              ‹
            </button>
          )}
          {current < sorted.length - 1 && (
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-lg text-white"
              aria-label="次の写真"
            >
              ›
            </button>
          )}

          {/* インジケーター */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {sorted.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === current ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`写真 ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
