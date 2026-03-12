"use client";

import { useState } from "react";

export function PasswordInput({
  id,
  name,
  required,
  minLength,
  autoComplete,
}: {
  id: string;
  name: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-16 text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
        aria-label={show ? "パスワードを隠す" : "パスワードを表示"}
      >
        {show ? "隠す" : "表示"}
      </button>
    </div>
  );
}
