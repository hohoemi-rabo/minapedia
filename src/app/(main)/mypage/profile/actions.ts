"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  message: string;
} | undefined;

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

  const { error } = await supabase
    .from("profiles")
    .update({ nickname })
    .eq("id", user.id);

  if (error) {
    return { message: "更新に失敗しました。もう一度お試しください。" };
  }

  revalidatePath("/mypage");
  redirect("/mypage");
}
