"use client";

import { useState } from "react";
import { ImageCarousel } from "@/components/image-carousel";

export function PostCardDetail({
  spotName,
  bodyGood,
  bodyMemo,
  images,
}: {
  spotName: string | null;
  bodyGood: string | null;
  bodyMemo: string | null;
  images: { storage_path: string; order_index: number }[];
}) {
  const [open, setOpen] = useState(false);

  const hasDetail = spotName || bodyGood || bodyMemo || images.length > 1;
  if (!hasDetail) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="mt-3 text-base font-medium text-blue-600 hover:text-blue-800"
      >
        {open ? "閉じる" : "続きを読む →"}
      </button>

      {open && (
        <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
          {/* 複数画像カルーセル */}
          {images.length > 1 && (
            <ImageCarousel images={images} alt="投稿画像" />
          )}

          {/* 場所 */}
          {spotName && (
            <div>
              <p className="text-sm font-medium text-gray-500">場所</p>
              <p className="mt-0.5 text-lg text-gray-900">{spotName}</p>
            </div>
          )}

          {/* どこがよかった？ */}
          {bodyGood && (
            <div>
              <p className="text-sm font-medium text-gray-500">
                どこがよかった？
              </p>
              <p className="mt-0.5 whitespace-pre-wrap text-lg text-gray-900">
                {bodyGood}
              </p>
            </div>
          )}

          {/* ひとこと感想 */}
          {bodyMemo && (
            <div>
              <p className="text-sm font-medium text-gray-500">ひとこと感想</p>
              <p className="mt-0.5 whitespace-pre-wrap text-lg text-gray-900">
                {bodyMemo}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
