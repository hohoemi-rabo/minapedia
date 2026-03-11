import { createClient } from "@/lib/supabase/server";
import { PostCard } from "@/components/post-card";
import { PostFeed } from "@/components/post-feed";

const POST_SELECT =
  "id, title, spot_name, area, body_good, body_memo, created_at, profiles(nickname), categories(name, icon, color), post_images(storage_path, order_index), reactions(type, user_id)";
const POSTS_PER_PAGE = 5;

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, role")
    .eq("id", user!.id)
    .single();

  // 先生おすすめ投稿（最大3件）
  const { data: featuredPosts } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(3);

  // 新着投稿（初期5件）
  const { data: initialPosts } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(POSTS_PER_PAGE);

  // カテゴリ一覧
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, icon, color")
    .eq("phase", 1)
    .order("id");

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
      />

    </div>
  );
}
