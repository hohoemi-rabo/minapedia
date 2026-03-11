"use client";

import { useTransition } from "react";
import { deletePost } from "@/app/(main)/posts/[id]/actions";

export function DeletePostButton({ postId }: { postId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm("この投稿を削除しますか？\n削除すると元に戻せません。")) {
      return;
    }

    startTransition(async () => {
      await deletePost(postId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="flex-1 rounded-lg border-2 border-red-300 px-4 py-3 text-center text-lg font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? "削除中..." : "削除する"}
    </button>
  );
}
