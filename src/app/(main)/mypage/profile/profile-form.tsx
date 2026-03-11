"use client";

import { useActionState } from "react";
import {
  updateProfile,
  type ProfileFormState,
} from "./actions";
import { AvatarInput } from "@/components/avatar-input";

const inputClass =
  "mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-lg text-gray-900 placeholder:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

export function ProfileForm({
  nickname,
  avatarUrl,
}: {
  nickname: string;
  avatarUrl: string | null;
}) {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(
    updateProfile,
    undefined
  );

  return (
    <form action={action} className="space-y-6">
      {state?.message && (
        <div
          className="rounded-lg bg-red-50 p-4 text-red-700"
          role="alert"
          aria-live="polite"
        >
          {state.message}
        </div>
      )}

      {/* アバター */}
      <AvatarInput
        nickname={nickname}
        currentAvatarUrl={avatarUrl}
        disabled={pending}
      />

      <div>
        <label
          htmlFor="nickname"
          className="block text-lg font-medium text-foreground"
        >
          ニックネーム <span className="text-red-500">*</span>
        </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          required
          maxLength={20}
          defaultValue={nickname}
          className={inputClass}
          placeholder="表示される名前を入力"
        />
        <p className="mt-1 text-sm text-gray-500">20文字以内</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-blue-600 px-4 py-4 text-lg font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {pending ? "保存中..." : "保存する"}
      </button>
    </form>
  );
}
