import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostForm } from "@/components/post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: post } = await supabase
    .from("posts")
    .select(
      "id, user_id, title, spot_name, area, body_good, body_memo, category_id, post_images(storage_path, order_index)"
    )
    .eq("id", id)
    .single();

  if (!post || post.user_id !== user.id) {
    notFound();
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, icon, color")
    .eq("phase", 1)
    .order("id");

  return (
    <div>
      <h1 className="text-2xl font-bold">投稿を編集</h1>
      <div className="mt-6">
        <PostForm
          categories={categories ?? []}
          mode="edit"
          postId={post.id}
          defaultValues={{
            title: post.title,
            category_id: post.category_id,
            spot_name: post.spot_name,
            area: post.area,
            body_good: post.body_good,
            body_memo: post.body_memo,
            post_images: post.post_images,
          }}
        />
      </div>
    </div>
  );
}
