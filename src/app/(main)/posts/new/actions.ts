"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type PostFormState = {
  message: string;
} | undefined;

const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export async function createPost(
  prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "ログインしてください。" };
  }

  const categoryId = formData.get("category_id") as string;
  const title = (formData.get("title") as string)?.trim();
  const spotName = (formData.get("spot_name") as string)?.trim() || null;
  const area = (formData.get("area") as string) || null;
  const bodyGood = (formData.get("body_good") as string)?.trim() || null;
  const bodyMemo = (formData.get("body_memo") as string)?.trim() || null;

  if (!categoryId) {
    return { message: "テーマを選んでください。" };
  }

  if (!title) {
    return { message: "タイトルを入力してください。" };
  }

  if (title.length > 100) {
    return { message: "タイトルは100文字以内で入力してください。" };
  }

  // 画像ファイルの取得とバリデーション
  const imageFiles = formData
    .getAll("images")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (imageFiles.length > MAX_IMAGES) {
    return { message: `写真は${MAX_IMAGES}枚までです。` };
  }

  for (const file of imageFiles) {
    if (file.size > MAX_IMAGE_SIZE) {
      return { message: "写真のサイズは1枚あたり5MB以下にしてください。" };
    }
  }

  // 投稿をINSERT（idを取得するため select() を使用）
  const { data: post, error: postError } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      category_id: Number(categoryId),
      title,
      spot_name: spotName,
      area,
      body_good: bodyGood,
      body_memo: bodyMemo,
    })
    .select("id")
    .single();

  if (postError || !post) {
    return { message: "投稿に失敗しました。もう一度お試しください。" };
  }

  // 画像がある場合はStorageアップロード + post_images INSERT
  if (imageFiles.length > 0) {
    const imageRecords: { post_id: number; storage_path: string; order_index: number }[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const storagePath = `${user.id}/${post.id}/${i}`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        // アップロード失敗時：投稿とアップロード済み画像を削除
        await supabase.storage
          .from("post-images")
          .remove(imageRecords.map((r) => r.storage_path));
        await supabase.from("posts").delete().eq("id", post.id);
        return { message: "写真のアップロードに失敗しました。もう一度お試しください。" };
      }

      imageRecords.push({
        post_id: post.id,
        storage_path: storagePath,
        order_index: i,
      });
    }

    const { error: imageInsertError } = await supabase
      .from("post_images")
      .insert(imageRecords);

    if (imageInsertError) {
      // DB記録失敗時：Storageの画像と投稿を削除
      await supabase.storage
        .from("post-images")
        .remove(imageRecords.map((r) => r.storage_path));
      await supabase.from("posts").delete().eq("id", post.id);
      return { message: "投稿に失敗しました。もう一度お試しください。" };
    }
  }

  revalidatePath("/");
  redirect("/?message=posted");
}
