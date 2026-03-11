import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminPostActions } from "@/components/admin-post-actions";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending: { label: "確認中", className: "bg-yellow-100 text-yellow-800" },
  published: { label: "公開済み", className: "bg-green-100 text-green-800" },
  hidden: { label: "非公開", className: "bg-gray-100 text-gray-600" },
};

export default async function AdminPostsPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, title, status, is_featured, created_at, profiles(nickname), categories(name, icon)"
    )
    .order("created_at", { ascending: false });

  const pendingPosts = (posts ?? []).filter((p) => p.status === "pending");
  const otherPosts = (posts ?? []).filter((p) => p.status !== "pending");

  return (
    <div>
      <h1 className="text-2xl font-bold">投稿管理</h1>

      {/* 確認待ち */}
      <section className="mt-6">
        <h2 className="text-xl font-bold text-yellow-700">
          確認待ち（{pendingPosts.length}件）
        </h2>
        {pendingPosts.length > 0 ? (
          <div className="mt-3 space-y-3">
            {pendingPosts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-gray-500">確認待ちの投稿はありません。</p>
        )}
      </section>

      {/* その他の投稿 */}
      <section className="mt-8">
        <h2 className="text-xl font-bold">すべての投稿</h2>
        {otherPosts.length > 0 ? (
          <div className="mt-3 space-y-3">
            {otherPosts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-gray-500">投稿はありません。</p>
        )}
      </section>
    </div>
  );
}

function PostRow({
  post,
}: {
  post: {
    id: string;
    title: string;
    status: string;
    is_featured: boolean;
    created_at: string;
    profiles: { nickname: string } | { nickname: string }[];
    categories: { name: string; icon: string } | { name: string; icon: string }[];
  };
}) {
  const profile = Array.isArray(post.profiles)
    ? post.profiles[0]
    : post.profiles;
  const category = Array.isArray(post.categories)
    ? post.categories[0]
    : post.categories;
  const badge = STATUS_BADGE[post.status] ?? STATUS_BADGE.pending;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
            >
              {badge.label}
            </span>
            {post.is_featured && (
              <span className="inline-block rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700">
                ⭐ おすすめ
              </span>
            )}
          </div>
          <Link
            href={`/posts/${post.id}`}
            className="mt-1 block text-lg font-bold text-gray-900 hover:text-blue-600"
          >
            {category.icon} {post.title}
          </Link>
          <p className="mt-0.5 text-sm text-gray-500">
            {profile.nickname} ・{" "}
            {new Date(post.created_at).toLocaleDateString("ja-JP")}
          </p>
        </div>
      </div>
      <div className="mt-3">
        <AdminPostActions
          postId={post.id}
          status={post.status}
          isFeatured={post.is_featured}
        />
      </div>
    </div>
  );
}
