"use server";

import { createClient } from "@/lib/supabase/server";
import { POST_SELECT } from "@/lib/constants";

export async function fetchPosts({
  limit,
  categoryId,
  cursor,
}: {
  limit: number;
  categoryId?: number;
  cursor?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  // カーソルベースページネーション: 前回の最後のcreated_atより古い投稿を取得
  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data: posts, error } = await query;

  if (error) {
    return { posts: [], hasMore: false };
  }

  const postsWithHeart = (posts ?? []).map((post) => {
    const reactions = (post.reactions ?? []) as { type: string; user_id: string }[];
    const hearts = reactions.filter((r) => r.type === "suteki");
    return {
      ...post,
      heartCount: hearts.length,
      heartReacted: user ? hearts.some((r) => r.user_id === user.id) : false,
    };
  });

  return {
    posts: postsWithHeart,
    hasMore: (posts?.length ?? 0) === limit,
  };
}
