"use client";

import { useActionState } from "react";
import Link from "next/link";
import { PasswordInput } from "@/components/password-input";
import { login, type AuthState } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    login,
    undefined
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Minapedia</h1>
          <p className="mt-2 text-lg text-gray-600">ログイン</p>
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
            <PasswordInput
              id="password"
              name="password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-600 px-4 py-4 text-lg font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {pending ? "ログイン中..." : "ログインする"}
          </button>
        </form>

        <p className="text-center text-lg">
          アカウントをお持ちでない方は
          <Link href="/signup" className="text-blue-600 hover:underline">
            こちらから登録
          </Link>
        </p>
      </div>
    </div>
  );
}
