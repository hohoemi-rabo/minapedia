import Image from "next/image";
import Link from "next/link";
import { getPublicImageUrl } from "@/lib/supabase/storage";

export type Post = {
  id: number;
  title: string;
  spot_name: string | null;
  area: string | null;
  body_good: string | null;
  body_memo: string | null;
  created_at: string;
  profiles: { nickname: string } | { nickname: string }[];
  categories: { name: string; icon: string; color: string } | { name: string; icon: string; color: string }[];
  post_images: { storage_path: string; order_index: number }[];
  reactions?: { type: string }[];
};

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;
  const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
  const images = post.post_images;
  const sortedImages = [...images].sort((a, b) => a.order_index - b.order_index);
  const firstImage = sortedImages[0];
  const previewText = post.body_good || post.body_memo;

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* 画像 or テーマアイコン背景 */}
      {firstImage ? (
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={getPublicImageUrl(firstImage.storage_path)}
            alt={post.title}
            fill
            sizes="(max-width: 512px) 100vw, 512px"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className="flex aspect-[16/9] w-full items-center justify-center"
          style={{ backgroundColor: category.color }}
        >
          <span className="text-6xl">{category.icon}</span>
        </div>
      )}

      <div className="p-4">
        {/* バッジ行 */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium text-white"
            style={{ backgroundColor: category.color }}
          >
            <span>{category.icon}</span>
            {category.name}
          </span>
          {post.area && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              {post.area}
            </span>
          )}
        </div>

        {/* タイトル */}
        <h2 className="mt-3 text-xl font-bold text-gray-900">{post.title}</h2>

        {/* 投稿者 */}
        <p className="mt-1 text-sm text-gray-500">{profile.nickname}</p>

        {/* 本文プレビュー */}
        {previewText && (
          <p className="mt-2 line-clamp-2 text-base text-gray-700">
            {previewText}
          </p>
        )}

        {/* リアクションカウント */}
        {post.reactions && post.reactions.length > 0 && (
          <div className="mt-2 flex gap-3 text-sm text-gray-400">
            {(() => {
              const counts = { suteki: 0, ikitai: 0, sanko: 0 };
              post.reactions.forEach((r) => {
                if (r.type in counts) counts[r.type as keyof typeof counts]++;
              });
              return (
                <>
                  {counts.suteki > 0 && <span>すてき {counts.suteki}</span>}
                  {counts.ikitai > 0 && <span>行ってみたい {counts.ikitai}</span>}
                  {counts.sanko > 0 && <span>参考になった {counts.sanko}</span>}
                </>
              );
            })()}
          </div>
        )}

        {/* 続きを読む */}
        <Link
          href={`/posts/${post.id}`}
          className="mt-3 inline-block text-base font-medium text-blue-600 hover:text-blue-800"
        >
          続きを読む →
        </Link>
      </div>
    </article>
  );
}
