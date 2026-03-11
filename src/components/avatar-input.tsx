"use client";

import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { Avatar } from "@/components/avatar";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.3,
  maxWidthOrHeight: 512,
  useWebWorker: true,
};

export function AvatarInput({
  nickname,
  currentAvatarUrl,
  disabled,
}: {
  nickname: string;
  currentAvatarUrl: string | null;
  disabled?: boolean;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteAvatar, setDeleteAvatar] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const hasAvatar = !deleteAvatar && (previewUrl || currentAvatarUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
      const url = URL.createObjectURL(compressed);
      setPreviewUrl(url);
      setDeleteAvatar(false);

      if (hiddenInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(compressed);
        hiddenInputRef.current.files = dt.files;
      }
    } catch {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setDeleteAvatar(false);

      if (hiddenInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(file);
        hiddenInputRef.current.files = dt.files;
      }
    } finally {
      setCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = () => {
    setDeleteAvatar(true);
    setPreviewUrl(null);
    if (hiddenInputRef.current) {
      hiddenInputRef.current.files = new DataTransfer().files;
    }
  };

  const displayAvatarUrl = deleteAvatar ? null : (previewUrl ? null : currentAvatarUrl);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* プレビュー or 現在のアバター */}
      {previewUrl && !deleteAvatar ? (
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="新しいアイコン"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <Avatar nickname={nickname} avatarUrl={displayAvatarUrl} size="lg" />
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || compressing}
          className="rounded-full border border-gray-300 px-5 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {compressing ? "準備中..." : "写真を変える"}
        </button>

        {hasAvatar && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={disabled}
            className="rounded-full border border-red-200 px-4 py-2 text-base font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
          >
            削除
          </button>
        )}
      </div>

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
        name="avatar"
        className="hidden"
      />

      {/* 削除フラグ */}
      {deleteAvatar && (
        <input type="hidden" name="delete_avatar" value="1" />
      )}
    </div>
  );
}
