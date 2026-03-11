import { createClient } from "@/lib/supabase/server";
import { PostForm } from "@/components/post-form";

export default async function NewPostPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, icon, color")
    .eq("phase", 1)
    .order("id");

  return (
    <div>
      <h1 className="text-2xl font-bold">新しい投稿</h1>
      <div className="mt-6">
        <PostForm categories={categories ?? []} />
      </div>
    </div>
  );
}
