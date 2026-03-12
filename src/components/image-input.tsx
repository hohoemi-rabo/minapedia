"use client";

import { useState, useRef, useCallback } from "react";
import { getPublicImageUrl } from "@/lib/supabase/storage";

const MAX_IMAGES = 1;
const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

type CompressedImage = {
  file: File;
  previewUrl: string;
};

type ExistingImage = {
  storage_path: string;
  order_index: number;
};

export function ImageInput({
  disabled,
  existingImages = [],
}: {
  disabled?: boolean;
  existingImages?: ExistingImage[];
}) {
  const [newImages, setNewImages] = useState<CompressedImage[]>([]);
  const [deletedPaths, setDeletedPaths] = useState<string[]>([]);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const remaining =
    existingImages.filter((img) => !deletedPaths.includes(img.storage_path));
  const totalCount = remaining.length + newImages.length;

  const updateHiddenInput = useCallback((files: CompressedImage[]) => {
    if (!hiddenInputRef.current) return;
    const dt = new DataTransfer();
    files.forEach((img) => dt.items.add(img.file));
    hiddenInputRef.current.files = dt.files;
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length === 0) return;

    const availableSlots = MAX_IMAGES - totalCount;
    const filesToProcess = selectedFiles.slice(0, availableSlots);

    if (filesToProcess.length === 0) return;

    setCompressing(true);

    try {
      const { default: imageCompression } = await import("browser-image-compression");
      const compressed = await Promise.all(
        filesToProcess.map(async (file) => {
          const compressedFile = await imageCompression(
            file,
            COMPRESSION_OPTIONS
          );
          return {
            file: compressedFile,
            previewUrl: URL.createObjectURL(compressedFile),
          };
        })
      );

      const updated = [...newImages, ...compressed];
      setNewImages(updated);
      updateHiddenInput(updated);
    } catch {
      const fallback = filesToProcess.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      const updated = [...newImages, ...fallback];
      setNewImages(updated);
      updateHiddenInput(updated);
    } finally {
      setCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeNewImage = (index: number) => {
    const removed = newImages[index];
    URL.revokeObjectURL(removed.previewUrl);
    const updated = newImages.filter((_, i) => i !== index);
    setNewImages(updated);
    updateHiddenInput(updated);
  };

  const removeExistingImage = (storagePath: string) => {
    setDeletedPaths((prev) => [...prev, storagePath]);
  };

  return (
    <div>
      <label className="block text-lg font-medium text-foreground">
        写真（1枚）
      </label>

      {/* プレビュー */}
      {(remaining.length > 0 || newImages.length > 0) && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {/* 既存画像 */}
          {remaining.map((img) => (
            <div key={img.storage_path} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getPublicImageUrl(img.storage_path)}
                alt={`既存の写真`}
                className="h-24 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(img.storage_path)}
                disabled={disabled}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm text-white shadow hover:bg-red-600"
                aria-label="写真を削除"
              >
                x
              </button>
            </div>
          ))}
          {/* 新規画像 */}
          {newImages.map((img, index) => (
            <div key={`new-${index}`} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.previewUrl}
                alt={`新しい写真 ${index + 1}`}
                className="h-24 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => removeNewImage(index)}
                disabled={disabled}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm text-white shadow hover:bg-red-600"
                aria-label={`写真を削除`}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 圧縮中表示 */}
      {compressing && (
        <p className="mt-2 text-sm text-gray-500">写真を準備しています...</p>
      )}

      {/* ファイル選択ボタン */}
      {totalCount < MAX_IMAGES && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || compressing}
          className="mt-3 w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-4 text-lg text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-50"
        >
          {compressing ? "準備中..." : "写真を選ぶ"}
        </button>
      )}

      {/* 非表示のfile input（選択用） */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 非表示のfile input（FormData送信用） */}
      <input
        ref={hiddenInputRef}
        type="file"
        name="images"
        className="hidden"
      />

      {/* 削除マーク用 hidden inputs */}
      {deletedPaths.map((path) => (
        <input
          key={path}
          type="hidden"
          name="deleted_images"
          value={path}
        />
      ))}
    </div>
  );
}
