"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type SignupState } from "./actions";

export default function SignupPage() {
  const [state, action, pending] = useActionState<SignupState, FormData>(
    signup,
    undefined
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Minapedia</h1>
          <p className="mt-2 text-lg text-gray-600">アカウント登録</p>
        </div>

        <div className="rounded-lg bg-green-50 p-4 text-green-800">
          先生と一緒に登録しましょう。ニックネームだけで参加できます。
        </div>

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

          <div>
            <label
              htmlFor="nickname"
              className="block text-lg font-medium text-foreground"
            >
              ニックネーム
            </label>
            <p className="mt-1 text-sm text-gray-500">
              教室のみんなに表示される名前です
            </p>
            <input
              id="nickname"
              name="nickname"
              type="text"
              required
              maxLength={20}
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: はなこ"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-foreground"
            >
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-foreground"
            >
              パスワード
            </label>
            <p className="mt-1 text-sm text-gray-500">6文字以上</p>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-600 px-4 py-4 text-lg font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {pending ? "登録中..." : "登録する"}
          </button>
        </form>

        <p className="text-center text-lg">
          すでにアカウントをお持ちの方は
          <Link href="/login" className="text-blue-600 hover:underline">
            こちらからログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
