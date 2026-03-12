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
      <h1 className="text-2xl font-bold">✏️ 新しい投稿</h1>
      <p className="mt-1 text-sm text-gray-500">
        あなたの体験を教えてください
      </p>
      <div className="mt-4 rounded-xl bg-white p-5 shadow-lg ring-1 ring-gray-100">
        <PostForm categories={categories ?? []} />
      </div>
    </div>
  );
}
