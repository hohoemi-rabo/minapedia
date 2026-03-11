"use client";

import { useOptimistic, useTransition } from "react";
import {
  toggleReaction,
  type ReactionType,
} from "@/app/(main)/posts/[id]/actions";

const REACTION_CONFIG: {
  type: ReactionType;
  label: string;
  activeColor: string;
}[] = [
  { type: "suteki", label: "すてき", activeColor: "bg-pink-100 text-pink-700 border-pink-300" },
  { type: "ikitai", label: "行ってみたい", activeColor: "bg-blue-100 text-blue-700 border-blue-300" },
  { type: "sanko", label: "参考になった", activeColor: "bg-green-100 text-green-700 border-green-300" },
];

type ReactionState = {
  type: ReactionType;
  count: number;
  reacted: boolean;
}[];

export function ReactionButtons({
  postId,
  reactions,
}: {
  postId: number;
  reactions: ReactionState;
}) {
  const [optimisticReactions, addOptimistic] = useOptimistic(
    reactions,
    (state, toggledType: ReactionType) =>
      state.map((r) =>
        r.type === toggledType
          ? {
              ...r,
              reacted: !r.reacted,
              count: r.reacted ? r.count - 1 : r.count + 1,
            }
          : r
      )
  );
  const [, startTransition] = useTransition();

  const handleToggle = (type: ReactionType) => {
    startTransition(async () => {
      addOptimistic(type);
      await toggleReaction(postId, type);
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {REACTION_CONFIG.map((config) => {
        const reaction = optimisticReactions.find((r) => r.type === config.type);
        const isActive = reaction?.reacted ?? false;
        const count = reaction?.count ?? 0;

        return (
          <button
            key={config.type}
            type="button"
            onClick={() => handleToggle(config.type)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-base font-medium transition-colors ${
              isActive
                ? config.activeColor
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {config.label}
            {count > 0 && (
              <span className="text-sm opacity-70">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
