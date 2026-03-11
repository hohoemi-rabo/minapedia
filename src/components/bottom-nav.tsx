"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "ホーム", icon: "🏠" },
  { href: "/posts/new", label: "投稿する", icon: "✏️" },
  { href: "/mypage", label: "マイページ", icon: "👤" },
] as const;

const ADMIN_ITEM = { href: "/admin", label: "管理", icon: "🔧" };

export function BottomNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  const items = isAdmin ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]"
      aria-label="メインナビゲーション"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {items.map(({ href, label, icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-[56px] min-w-[64px] flex-col items-center justify-center px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "font-bold text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span className="text-xl" aria-hidden="true">
                {icon}
              </span>
              <span className="mt-0.5">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
