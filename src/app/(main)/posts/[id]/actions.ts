"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type PostFormState = {
  message: string;
} | undefined;

export async function deletePost(postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "ログインしてください。" };
  }

  // 権限チェック
  const { data: post } = await supabase
    .from("posts")
    .select("id, user_id")
    .eq("id", postId)
    .single();

  if (!post || post.user_id !== user.id) {
    return { message: "この投稿を削除する権限がありません。" };
  }

  // Storage画像を削除（DBレコードはCASCADEで自動削除）
  const { data: images } = await supabase
    .from("post_images")
    .select("storage_path")
    .eq("post_id", postId);

  if (images && images.length > 0) {
    await supabase.storage
      .from("post-images")
      .remove(images.map((img) => img.storage_path));
  }

  // 投稿削除（post_images, reactions は CASCADE で自動削除）
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    return { message: "削除に失敗しました。もう一度お試しください。" };
  }

  revalidatePath("/");
  redirect("/");
}

const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export async function updatePost(
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

  const postId = formData.get("post_id") as string;
  const categoryId = formData.get("category_id") as string;
  const title = (formData.get("title") as string)?.trim();
  const spotName = (formData.get("spot_name") as string)?.trim() || null;
  const area = (formData.get("area") as string) || null;
  const bodyGood = (formData.get("body_good") as string)?.trim() || null;
  const bodyMemo = (formData.get("body_memo") as string)?.trim() || null;

  // 権限チェック
  const { data: existingPost } = await supabase
    .from("posts")
    .select("id, user_id")
    .eq("id", postId)
    .single();

  if (!existingPost || existingPost.user_id !== user.id) {
    return { message: "この投稿を編集する権限がありません。" };
  }

  if (!categoryId) {
    return { message: "テーマを選んでください。" };
  }

  if (!title) {
    return { message: "タイトルを入力してください。" };
  }

  if (title.length > 100) {
    return { message: "タイトルは100文字以内で入力してください。" };
  }

  // 削除対象の既存画像
  const deletedImagePaths = formData.getAll("deleted_images") as string[];

  // 新しい画像ファイル
  const newImageFiles = formData
    .getAll("images")
    .filter((item): item is File => item instanceof File && item.size > 0);

  // 既存画像の残数を確認
  const { data: currentImages } = await supabase
    .from("post_images")
    .select("id, storage_path, order_index")
    .eq("post_id", postId)
    .order("order_index");

  const remainingImages = (currentImages ?? []).filter(
    (img) => !deletedImagePaths.includes(img.storage_path)
  );

  if (remainingImages.length + newImageFiles.length > MAX_IMAGES) {
    return { message: `写真は${MAX_IMAGES}枚までです。` };
  }

  for (const file of newImageFiles) {
    if (file.size > MAX_IMAGE_SIZE) {
      return { message: "写真のサイズは1枚あたり5MB以下にしてください。" };
    }
  }

  // 投稿を更新
  const { error: updateError } = await supabase
    .from("posts")
    .update({
      category_id: Number(categoryId),
      title,
      spot_name: spotName,
      area,
      body_good: bodyGood,
      body_memo: bodyMemo,
    })
    .eq("id", postId);

  if (updateError) {
    return { message: "更新に失敗しました。もう一度お試しください。" };
  }

  // 削除対象の画像をStorage + DBから並列削除
  if (deletedImagePaths.length > 0) {
    await Promise.all([
      supabase.storage.from("post-images").remove(deletedImagePaths),
      ...deletedImagePaths.map((path) =>
        supabase
          .from("post_images")
          .delete()
          .eq("post_id", postId)
          .eq("storage_path", path)
      ),
    ]);
  }

  // 新しい画像をアップロード
  if (newImageFiles.length > 0) {
    const startIndex = remainingImages.length;

    for (let i = 0; i < newImageFiles.length; i++) {
      const file = newImageFiles[i];
      const storagePath = `${user.id}/${postId}/${startIndex + i}`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        return { message: "写真のアップロードに失敗しました。もう一度お試しください。" };
      }

      await supabase.from("post_images").insert({
        post_id: postId,
        storage_path: storagePath,
        order_index: startIndex + i,
      });
    }
  }

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}`);
}

export type ReactionType = "suteki" | "ikitai" | "sanko";

export async function toggleReaction(postId: string, type: ReactionType) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { reacted: false };
  }

  // DB関数でアトミックにトグル（レースコンディション防止）
  const { data: reacted } = await supabase.rpc("toggle_reaction", {
    p_post_id: postId,
    p_type: type,
  });

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  return { reacted: reacted ?? false };
}
