"use client";

import { useState, useTransition } from "react";
import { toggleReaction } from "@/app/(main)/posts/[id]/actions";

export function HeartButton({
  postId,
  initialReacted,
  initialCount,
}: {
  postId: string;
  initialReacted: boolean;
  initialCount: number;
}) {
  const [reacted, setReacted] = useState(initialReacted);
  const [count, setCount] = useState(initialCount);
  const [, startTransition] = useTransition();

  const handleToggle = () => {
    const nextReacted = !reacted;
    setReacted(nextReacted);
    setCount((c) => (nextReacted ? c + 1 : c - 1));

    startTransition(async () => {
      const result = await toggleReaction(postId, "suteki");
      setReacted(result.reacted);
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="flex items-center gap-1 p-1"
      aria-label="すてき"
    >
      <span className={`text-2xl transition-transform ${reacted ? "scale-110" : ""}`}>
        {reacted ? "❤️" : "🤍"}
      </span>
      {count > 0 && (
        <span className="text-sm font-medium text-gray-600">{count}</span>
      )}
    </button>
  );
}
