"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden");

  return supabase;
}

async function updatePostStatus(postId: string, status: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("posts")
    .update({ status })
    .eq("id", postId);

  if (error) {
    return { error: "更新に失敗しました。" };
  }

  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  return { error: null };
}

export async function approvePost(postId: string) {
  return updatePostStatus(postId, "published");
}

export async function rejectPost(postId: string) {
  return updatePostStatus(postId, "hidden");
}

export async function unpublishPost(postId: string) {
  return updatePostStatus(postId, "hidden");
}

export async function republishPost(postId: string) {
  return updatePostStatus(postId, "published");
}

const MAX_FEATURED = 3;

export async function toggleFeatured(postId: string) {
  const supabase = await requireAdmin();

  const { data: post } = await supabase
    .from("posts")
    .select("is_featured")
    .eq("id", postId)
    .single();

  if (!post) {
    return { error: "投稿が見つかりません。" };
  }

  // おすすめ追加時に最大3件チェック
  if (!post.is_featured) {
    const { count } = await supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("is_featured", true);

    if ((count ?? 0) >= MAX_FEATURED) {
      return { error: `おすすめは最大${MAX_FEATURED}件までです。先に他の投稿のおすすめを解除してください。` };
    }
  }

  const { error } = await supabase
    .from("posts")
    .update({ is_featured: !post.is_featured })
    .eq("id", postId);

  if (error) {
    return { error: "更新に失敗しました。" };
  }

  revalidatePath("/admin/posts");
  revalidatePath("/admin/featured");
  revalidatePath("/");
  return { error: null };
}
