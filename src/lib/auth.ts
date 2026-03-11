import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * リクエスト内でデデュプリケーションされる認証ユーザー取得
 */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * リクエスト内でデデュプリケーションされるプロフィール取得
 */
export const getProfile = cache(async () => {
  const supabase = await createClient();
  const user = await getAuthUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("nickname, role, avatar_url")
    .eq("id", user.id)
    .single();

  return data;
});
