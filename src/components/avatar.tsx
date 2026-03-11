import Image from "next/image";
import { getAvatarUrl } from "@/lib/supabase/storage";

const SIZES = {
  sm: { container: "h-8 w-8", text: "text-sm", px: 32 },
  md: { container: "h-12 w-12", text: "text-lg", px: 48 },
  lg: { container: "h-24 w-24", text: "text-3xl", px: 96 },
} as const;

export function Avatar({
  nickname,
  avatarUrl,
  size = "md",
}: {
  nickname: string;
  avatarUrl: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const s = SIZES[size];
  const initial = nickname.charAt(0);

  if (avatarUrl) {
    return (
      <div className={`${s.container} shrink-0 overflow-hidden rounded-full`}>
        <Image
          src={getAvatarUrl(avatarUrl)}
          alt={nickname}
          width={s.px}
          height={s.px}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${s.container} flex shrink-0 items-center justify-center rounded-full bg-blue-100 ${s.text} font-bold text-blue-600`}
    >
      {initial}
    </div>
  );
}
