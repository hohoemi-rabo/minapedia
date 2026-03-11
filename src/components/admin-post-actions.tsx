"use client";

import { useTransition } from "react";
import {
  approvePost,
  rejectPost,
  unpublishPost,
  republishPost,
  toggleFeatured,
} from "@/app/(main)/admin/posts/actions";

type Props = {
  postId: string;
  status: string;
  isFeatured: boolean;
};

export function AdminPostActions({ postId, status, isFeatured }: Props) {
  const [isPending, startTransition] = useTransition();

  const handle = (action: (id: string) => Promise<{ error: string | null }>) => {
    startTransition(async () => {
      const result = await action(postId);
      if (result.error) {
        alert(result.error);
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {status === "pending" && (
        <>
          <button
            type="button"
            onClick={() => handle(approvePost)}
            disabled={isPending}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            公開する
          </button>
          <button
            type="button"
            onClick={() => handle(rejectPost)}
            disabled={isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            差し戻す
          </button>
        </>
      )}

      {status === "published" && (
        <>
          <button
            type="button"
            onClick={() => handle(unpublishPost)}
            disabled={isPending}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            非公開にする
          </button>
          <button
            type="button"
            onClick={() => handle(toggleFeatured)}
            disabled={isPending}
            className={`rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50 ${
              isFeatured
                ? "border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {isFeatured ? "おすすめ解除" : "おすすめに設定"}
          </button>
        </>
      )}

      {status === "hidden" && (
        <button
          type="button"
          onClick={() => handle(republishPost)}
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          再公開する
        </button>
      )}

      {isPending && (
        <span className="self-center text-sm text-gray-500">処理中...</span>
      )}
    </div>
  );
}
