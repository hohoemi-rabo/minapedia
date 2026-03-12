"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPath) {
      // ページ遷移完了
      setLoading(false);
      setPrevPath(pathname);
    }
  }, [pathname, prevPath]);

  // リンククリックを検知してローディング開始
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#")) return;

      // 現在のページと同じならスキップ
      if (href === pathname) return;

      setLoading(true);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[100] h-1">
      <div className="h-full animate-progress rounded-r-full bg-blue-500" />
    </div>
  );
}
