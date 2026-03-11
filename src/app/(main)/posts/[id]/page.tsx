import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ImageCarousel } from "@/components/image-carousel";
import { DeletePostButton } from "@/components/delete-post-button";
import { ReactionButtons } from "@/components/reaction-buttons";
import type { ReactionType } from "@/app/(main)/posts/[id]/actions";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post } = await supabase
    .from("posts")
    .select(
      "id, user_id, title, spot_name, area, body_good, body_memo, status, created_at, profiles(nickname), categories(name, icon, color), post_images(storage_path, order_index)"
    )
    .eq("id", id)
    .single();

  if (!post) {
    notFound();
  }

  // published OR 自分の投稿のみ閲覧可
  const isOwner = user?.id === post.user_id;
  if (post.status !== "published" && !isOwner) {
    notFound();
  }

  const category = Array.isArray(post.categories)
    ? post.categories[0]
    : post.categories;
  const profile = Array.isArray(post.profiles)
    ? post.profiles[0]
    : post.profiles;
  const images = [...post.post_images].sort(
    (a, b) => a.order_index - b.order_index
  );

  // リアクションデータ取得
  const { data: allReactions } = await supabase
    .from("reactions")
    .select("type, user_id")
    .eq("post_id", id);

  const reactionTypes: ReactionType[] = ["suteki", "ikitai", "sanko"];
  const reactions = reactionTypes.map((type) => {
    const ofType = (allReactions ?? []).filter((r) => r.type === type);
    return {
      type,
      count: ofType.length,
      reacted: ofType.some((r) => r.user_id === user?.id),
    };
  });

  return (
    <article>
      {/* 画像 or テーマアイコン背景 */}
      {images.length > 0 ? (
        <ImageCarousel images={images} alt={post.title} />
      ) : (
        <div
          className="flex aspect-[16/9] w-full items-center justify-center rounded-xl"
          style={{ backgroundColor: category.color }}
        >
          <span className="text-7xl">{category.icon}</span>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {/* ステータスバッジ（pending の場合） */}
        {post.status === "pending" && (
          <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
            この投稿は先生の確認待ちです。確認後に公開されます。
          </div>
        )}

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
        <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>

        {/* 投稿者 */}
        <p className="text-base text-gray-500">{profile.nickname}</p>

        {/* 場所の名前 */}
        {post.spot_name && (
          <div>
            <h2 className="text-base font-medium text-gray-500">場所</h2>
            <p className="mt-1 text-lg text-gray-900">{post.spot_name}</p>
          </div>
        )}

        {/* どこがよかった？ */}
        {post.body_good && (
          <div>
            <h2 className="text-base font-medium text-gray-500">
              どこがよかった？
            </h2>
            <p className="mt-1 whitespace-pre-wrap text-lg text-gray-900">
              {post.body_good}
            </p>
          </div>
        )}

        {/* ひとこと感想 */}
        {post.body_memo && (
          <div>
            <h2 className="text-base font-medium text-gray-500">
              ひとこと感想
            </h2>
            <p className="mt-1 whitespace-pre-wrap text-lg text-gray-900">
              {post.body_memo}
            </p>
          </div>
        )}

        {/* リアクション */}
        <div className="border-t pt-4">
          <ReactionButtons postId={post.id} reactions={reactions} />
        </div>

        {/* 自分の投稿のみ: 編集・削除 */}
        {isOwner && (
          <div className="space-y-3 border-t pt-4">
            <p className="text-sm text-gray-500">
              あとで自分で編集・削除できます。
            </p>
            <div className="flex gap-3">
              <Link
                href={`/posts/${post.id}/edit`}
                className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 text-center text-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                編集する
              </Link>
              <DeletePostButton postId={post.id} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
