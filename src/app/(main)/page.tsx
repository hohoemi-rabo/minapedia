import { createClient } from "@/lib/supabase/server";
import { getAuthUser, getProfile } from "@/lib/auth";
import { PostCard } from "@/components/post-card";
import { PostFeed } from "@/components/post-feed";
import { POST_SELECT, POSTS_PER_PAGE } from "@/lib/constants";

export default async function HomePage() {
  const supabase = await createClient();
  const [user, profile] = await Promise.all([getAuthUser(), getProfile()]);

  // 3つのクエリを並列実行
  const [{ data: featuredPosts }, { data: initialPosts }, { data: categories }] =
    await Promise.all([
      // 先生おすすめ投稿（最大3件）
      supabase
        .from("posts")
        .select(POST_SELECT)
        .eq("status", "published")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(3),
      // 新着投稿（初期5件）
      supabase
        .from("posts")
        .select(POST_SELECT)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(POSTS_PER_PAGE),
      // カテゴリ一覧
      supabase
        .from("categories")
        .select("id, name, icon, color")
        .eq("phase", 1)
        .order("id"),
    ]);

  const isAdmin = profile?.role === "admin";
  const posts = (initialPosts ?? []).map((post) => {
    const hearts = (post.reactions ?? []).filter((r) => r.type === "suteki");
    return {
      ...post,
      heartCount: hearts.length,
      heartReacted: hearts.some((r) => r.user_id === user!.id),
    };
  });
  const hasMore = posts.length === POSTS_PER_PAGE;

  return (
    <div>
      <h1 className="text-2xl font-bold">Minapedia</h1>
      <p className="mt-2 text-lg text-gray-600">
        ようこそ、{profile?.nickname ?? "ユーザー"}さん！
      </p>

      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <p className="text-blue-800">
          このサービスは教室の生徒さんだけが見られます。
        </p>
      </div>

      {/* 先生おすすめ */}
      {featuredPosts && featuredPosts.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold">⭐ 先生おすすめ</h2>
          <div className="mt-4 space-y-4">
            {featuredPosts.map((post) => {
              const hearts = (post.reactions ?? []).filter((r) => r.type === "suteki");
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  heartCount={hearts.length}
                  heartReacted={hearts.some((r) => r.user_id === user!.id)}
                  canEdit={isAdmin}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* テーマフィルタ + 新着一覧 + もっと見る */}
      <PostFeed
        initialPosts={posts}
        initialHasMore={hasMore}
        categories={categories ?? []}
        isAdmin={isAdmin}
      />

    </div>
  );
}
