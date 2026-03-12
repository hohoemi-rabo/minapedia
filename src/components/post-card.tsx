import Image from "next/image";
import { getPublicImageUrl } from "@/lib/supabase/storage";
import { HeartButton } from "@/components/heart-button";
import { PostCardDetail } from "@/components/post-card-detail";
import { Avatar } from "@/components/avatar";

type Profile = { nickname: string; avatar_url?: string | null };

export type Post = {
  id: string;
  title: string;
  spot_name: string | null;
  area: string | null;
  body_good: string | null;
  body_memo: string | null;
  created_at: string;
  profiles: Profile | Profile[];
  categories: { name: string; icon: string; color: string } | { name: string; icon: string; color: string }[];
  post_images: { storage_path: string; order_index: number }[];
};

type PostCardProps = {
  post: Post;
  heartReacted?: boolean;
  heartCount?: number;
  canEdit?: boolean;
};

export function PostCard({ post, heartReacted = false, heartCount = 0, canEdit = false }: PostCardProps) {
  const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;
  const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
  const images = post.post_images;
  const sortedImages = [...images].sort((a, b) => a.order_index - b.order_index);
  const firstImage = sortedImages[0];
  const previewText = post.body_good || post.body_memo;

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* 画像（ある場合のみ表示） */}
      {firstImage && (
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={getPublicImageUrl(firstImage.storage_path)}
            alt={post.title}
            fill
            sizes="(max-width: 512px) 100vw, 512px"
            className="object-cover"
          />
        </div>
      )}

      <div className="p-3">
        {/* アイコン + バッジ行 + ハート */}
        <div className="flex items-center gap-2">
          <Avatar
            nickname={profile.nickname}
            avatarUrl={profile.avatar_url ?? null}
            size="sm"
          />
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium text-white"
              style={{ backgroundColor: category.color }}
            >
              <span>{category.icon}</span>
              {category.name}
            </span>
            {post.area && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-sm text-gray-700">
                {post.area}
              </span>
            )}
          </div>
          <HeartButton
            postId={post.id}
            initialReacted={heartReacted}
            initialCount={heartCount}
          />
        </div>

        {/* タイトル */}
        <h2 className="mt-2 text-lg font-bold text-gray-900">{post.title}</h2>

        {/* 本文プレビュー（閉じている時だけ表示） */}
        {previewText && (
          <p className="mt-1 line-clamp-2 text-base text-gray-700">
            {previewText}
          </p>
        )}

        {/* 続きを読む → その場で展開 */}
        <PostCardDetail
          postId={post.id}
          spotName={post.spot_name}
          bodyGood={post.body_good}
          bodyMemo={post.body_memo}
          images={sortedImages}
          canEdit={canEdit}
        />
      </div>
    </article>
  );
}
