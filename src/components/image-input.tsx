"use client";

import { useState, useRef, useCallback } from "react";
import imageCompression from "browser-image-compression";

const MAX_IMAGES = 3;
const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

type CompressedImage = {
  file: File;
  previewUrl: string;
};

export function ImageInput({ disabled }: { disabled?: boolean }) {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const updateHiddenInput = useCallback((files: CompressedImage[]) => {
    if (!hiddenInputRef.current) return;
    const dt = new DataTransfer();
    files.forEach((img) => dt.items.add(img.file));
    hiddenInputRef.current.files = dt.files;
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length === 0) return;

    const remaining = MAX_IMAGES - images.length;
    const filesToProcess = selectedFiles.slice(0, remaining);

    if (filesToProcess.length === 0) return;

    setCompressing(true);

    try {
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

      const newImages = [...images, ...compressed];
      setImages(newImages);
      updateHiddenInput(newImages);
    } catch {
      // 圧縮失敗時は元ファイルをそのまま使用
      const fallback = filesToProcess.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      const newImages = [...images, ...fallback];
      setImages(newImages);
      updateHiddenInput(newImages);
    } finally {
      setCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    const removed = images[index];
    URL.revokeObjectURL(removed.previewUrl);
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    updateHiddenInput(newImages);
  };

  return (
    <div>
      <label className="block text-lg font-medium text-foreground">
        写真（最大{MAX_IMAGES}枚まで）
      </label>

      {/* プレビュー */}
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {images.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img.previewUrl}
                alt={`写真 ${index + 1}`}
                className="h-24 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={disabled}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm text-white shadow hover:bg-red-600"
                aria-label={`写真${index + 1}を削除`}
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
      {images.length < MAX_IMAGES && (
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
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 非表示のfile input（FormData送信用） */}
      <input
        ref={hiddenInputRef}
        type="file"
        name="images"
        multiple
        className="hidden"
      />
    </div>
  );
}
