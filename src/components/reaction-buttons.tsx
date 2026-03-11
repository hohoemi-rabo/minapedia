"use client";

import { useOptimistic, useTransition } from "react";
import {
  toggleReaction,
  type ReactionType,
} from "@/app/(main)/posts/[id]/actions";

const REACTION_CONFIG: {
  type: ReactionType;
  icon: string;
  label: string;
  activeColor: string;
  activeIconColor: string;
}[] = [
  { type: "suteki", icon: "♥", label: "すてき", activeColor: "bg-pink-50 border-pink-300", activeIconColor: "text-pink-600" },
  { type: "ikitai", icon: "📍", label: "行ってみたい", activeColor: "bg-blue-50 border-blue-300", activeIconColor: "text-blue-600" },
  { type: "sanko", icon: "💡", label: "参考になった", activeColor: "bg-green-50 border-green-300", activeIconColor: "text-green-600" },
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
  postId: string;
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
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-base font-medium transition-colors ${
              isActive
                ? config.activeColor
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <span className={`text-xl ${isActive ? config.activeIconColor : "grayscale opacity-60"}`}>
              {config.icon}
            </span>
            <span className={isActive ? "text-gray-900" : "text-gray-500"}>
              {config.label}
            </span>
            {count > 0 && (
              <span className={`text-sm font-bold ${isActive ? "text-gray-700" : "text-gray-400"}`}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
