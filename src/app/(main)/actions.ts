"use server";

import { createClient } from "@/lib/supabase/server";

const POST_SELECT =
  "id, title, spot_name, area, body_good, body_memo, created_at, profiles(nickname), categories(name, icon, color), post_images(storage_path, order_index), reactions(type)";

export async function fetchPosts({
  offset,
  limit,
  categoryId,
}: {
  offset: number;
  limit: number;
  categoryId?: number;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data: posts, error } = await query;

  if (error) {
    return { posts: [], hasMore: false };
  }

  return {
    posts: posts ?? [],
    hasMore: (posts?.length ?? 0) === limit,
  };
}
