"use client";

import { useEffect } from "react";

export function Toast({
  message,
  variant = "success",
  onClose,
}: {
  message: string;
  variant?: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass =
    variant === "success"
      ? "bg-green-600"
      : "bg-red-600";

  const icon = variant === "success" ? "✓" : "!";

  return (
    <div className="fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <div
        className={`flex items-center gap-3 rounded-2xl ${bgClass} px-6 py-4 text-lg font-medium text-white shadow-lg`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-base">
          {icon}
        </span>
        {message}
      </div>
    </div>
  );
}
