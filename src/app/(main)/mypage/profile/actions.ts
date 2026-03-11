"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  message: string;
} | undefined;

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "ログインしてください。" };
  }

  const nickname = (formData.get("nickname") as string)?.trim();

  if (!nickname) {
    return { message: "ニックネームを入力してください。" };
  }

  if (nickname.length > 20) {
    return { message: "ニックネームは20文字以内で入力してください。" };
  }

  // 現在のavatar_urlを取得（古いファイル削除用）
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .single();
  const oldAvatarPath = currentProfile?.avatar_url;

  const updateData: { nickname: string; avatar_url?: string | null } = { nickname };

  // アバター削除
  const deleteAvatar = formData.get("delete_avatar") === "1";
  if (deleteAvatar) {
    if (oldAvatarPath) {
      await supabase.storage.from("avatars").remove([oldAvatarPath]);
    }
    updateData.avatar_url = null;
  }

  // アバター画像のアップロード
  if (!deleteAvatar) {
    const avatarRaw = formData.get("avatar");
    const avatarFile = avatarRaw instanceof File ? avatarRaw : null;

    if (avatarFile && avatarFile.size > 0) {
      if (avatarFile.size > MAX_AVATAR_SIZE) {
        return { message: "アイコン画像は5MB以下にしてください。" };
      }

      // タイムスタンプ付きファイル名でキャッシュ問題を回避
      const storagePath = `${user.id}/${Date.now()}`;

      // 古いファイル削除と新ファイルアップロードを並列実行
      const [, { error: uploadError }] = await Promise.all([
        oldAvatarPath
          ? supabase.storage.from("avatars").remove([oldAvatarPath])
          : Promise.resolve(),
        supabase.storage
          .from("avatars")
          .upload(storagePath, avatarFile, { contentType: avatarFile.type }),
      ]);

      if (uploadError) {
        return { message: "アイコンのアップロードに失敗しました。もう一度お試しください。" };
      }

      updateData.avatar_url = storagePath;
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    return { message: "更新に失敗しました。もう一度お試しください。" };
  }

  revalidatePath("/mypage");
  revalidatePath("/");
  redirect("/mypage");
}
