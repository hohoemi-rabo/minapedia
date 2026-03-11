import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminPostActions } from "@/components/admin-post-actions";

export default async function AdminFeaturedPage() {
  const supabase = await createClient();

  // 現在のおすすめ投稿
  const { data: featuredPosts } = await supabase
    .from("posts")
    .select(
      "id, title, status, is_featured, created_at, profiles(nickname), categories(name, icon)"
    )
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  // おすすめ候補（published かつ非おすすめ）
  const { data: candidatePosts } = await supabase
    .from("posts")
    .select(
      "id, title, status, is_featured, created_at, profiles(nickname), categories(name, icon)"
    )
    .eq("status", "published")
    .eq("is_featured", false)
    .order("created_at", { ascending: false })
    .limit(20);

  const featured = featuredPosts ?? [];
  const candidates = candidatePosts ?? [];
  const isFull = featured.length >= 3;

  return (
    <div>
      <h1 className="text-2xl font-bold">おすすめ管理</h1>
      <p className="mt-2 text-gray-600">
        ホーム画面上部に表示する「先生おすすめ」投稿を最大3件まで選べます。
      </p>

      {/* 現在のおすすめ */}
      <section className="mt-6">
        <h2 className="text-xl font-bold">
          現在のおすすめ（{featured.length}/3）
        </h2>
        {featured.length > 0 ? (
          <div className="mt-3 space-y-3">
            {featured.map((post) => {
              const profile = Array.isArray(post.profiles)
                ? post.profiles[0]
                : post.profiles;
              const category = Array.isArray(post.categories)
                ? post.categories[0]
                : post.categories;
              return (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/posts/${post.id}`}
                      className="block text-lg font-bold text-gray-900 hover:text-blue-600"
                    >
                      {category.icon} {post.title}
                    </Link>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {profile.nickname}
                    </p>
                  </div>
                  <AdminPostActions
                    postId={post.id}
                    status={post.status}
                    isFeatured={true}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 text-gray-500">
            おすすめ投稿が設定されていません。
          </p>
        )}
      </section>

      {/* 候補一覧 */}
      <section className="mt-8">
        <h2 className="text-xl font-bold">おすすめに追加</h2>
        {isFull && (
          <p className="mt-2 text-sm text-yellow-700">
            おすすめは最大3件です。追加するには先に解除してください。
          </p>
        )}
        {candidates.length > 0 ? (
          <div className="mt-3 space-y-3">
            {candidates.map((post) => {
              const profile = Array.isArray(post.profiles)
                ? post.profiles[0]
                : post.profiles;
              const category = Array.isArray(post.categories)
                ? post.categories[0]
                : post.categories;
              return (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/posts/${post.id}`}
                      className="block text-lg font-bold text-gray-900 hover:text-blue-600"
                    >
                      {category.icon} {post.title}
                    </Link>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {profile.nickname}
                    </p>
                  </div>
                  {!isFull && (
                    <AdminPostActions
                      postId={post.id}
                      status="published"
                      isFeatured={false}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 text-gray-500">
            追加できる投稿がありません。
          </p>
        )}
      </section>
    </div>
  );
}
