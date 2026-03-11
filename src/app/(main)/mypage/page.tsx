import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/(auth)/login/actions";
import { PostCard } from "@/components/post-card";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending: {
    label: "確認中",
    className: "bg-yellow-100 text-yellow-800",
  },
  published: {
    label: "公開済み",
    className: "bg-green-100 text-green-800",
  },
  hidden: {
    label: "非公開",
    className: "bg-gray-100 text-gray-600",
  },
};

export default async function MyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, role")
    .eq("id", user!.id)
    .single();

  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, title, spot_name, area, body_good, body_memo, status, created_at, profiles(nickname), categories(name, icon, color), post_images(storage_path, order_index), reactions(type)"
    )
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      {/* プロフィールヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {profile?.nickname ?? "ユーザー"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">マイページ</p>
        </div>
        <Link
          href="/mypage/profile"
          className="rounded-lg border border-gray-300 px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
        >
          プロフィール編集
        </Link>
      </div>

      <div className="mt-4 rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          本名や大切な個人情報は表示されません。安心してご利用ください。
        </p>
      </div>

      {/* 自分の投稿一覧 */}
      <section className="mt-8">
        <h2 className="text-xl font-bold">自分の投稿</h2>
        {posts && posts.length > 0 ? (
          <div className="mt-4 space-y-4">
            {posts.map((post) => {
              const badge = STATUS_BADGE[post.status] ?? STATUS_BADGE.pending;
              return (
                <div key={post.id}>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      編集する
                    </Link>
                  </div>
                  <div className="mt-1">
                    <PostCard post={post} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-center text-gray-500">
            まだ投稿がありません。最初の投稿をしてみましょう！
          </p>
        )}
      </section>

      {/* ログアウト */}
      <form action={logout} className="mt-8">
        <button
          type="submit"
          className="w-full rounded-lg bg-gray-200 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-300"
        >
          ログアウト
        </button>
      </form>
    </div>
  );
}
