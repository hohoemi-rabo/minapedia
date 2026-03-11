"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Toast } from "@/components/toast";

const MESSAGES: Record<string, string> = {
  posted: "先生に送りました！確認後に公開されます。",
  updated: "投稿を更新しました！",
};

export function SuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const msg = searchParams.get("message");
    if (msg && MESSAGES[msg]) {
      setMessage(MESSAGES[msg]);
      // URLからパラメータを消す
      router.replace("/", { scroll: false });
    }
  }, [searchParams, router]);

  const handleClose = useCallback(() => setMessage(null), []);

  if (!message) return null;

  return <Toast message={message} variant="success" onClose={handleClose} />;
}
