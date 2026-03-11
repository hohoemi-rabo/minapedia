"use client";

import { useState, useTransition } from "react";
import { deletePost } from "@/app/(main)/posts/[id]/actions";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function DeletePostButton({
  postId,
  size = "lg",
}: {
  postId: string;
  size?: "sm" | "lg";
}) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(false);
    startTransition(async () => {
      await deletePost(postId);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className={
          size === "sm"
            ? "text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
            : "flex-1 rounded-lg border-2 border-red-300 px-4 py-3 text-center text-lg font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        }
      >
        {isPending ? "削除中..." : "削除"}
      </button>

      <ConfirmDialog
        open={showConfirm}
        title="投稿を削除しますか？"
        message="削除すると元に戻せません。"
        confirmLabel="削除する"
        cancelLabel="やめる"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
