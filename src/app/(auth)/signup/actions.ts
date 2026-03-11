"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignupState = {
  message: string;
} | undefined;

export async function signup(
  prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nickname = formData.get("nickname") as string;

  if (!email || !password || !nickname) {
    return { message: "すべての項目を入力してください。" };
  }

  if (password.length < 6) {
    return { message: "パスワードは6文字以上で入力してください。" };
  }

  if (nickname.length > 20) {
    return { message: "ニックネームは20文字以内で入力してください。" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
      },
    },
  });

  if (error) {
    return { message: "登録に失敗しました。もう一度お試しください。" };
  }

  redirect("/login");
}
