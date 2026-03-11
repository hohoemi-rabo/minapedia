import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/(auth)/login/actions";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, role")
    .eq("id", user!.id)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold">Minapedia</h1>
      <p className="mt-2 text-lg text-gray-600">
        ようこそ、{profile?.nickname ?? "ユーザー"}さん！
      </p>

      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <p className="text-blue-800">
          このサービスは教室の生徒さんだけが見られます。
        </p>
      </div>

      <div className="mt-6 space-y-2 rounded-lg border p-4 text-sm text-gray-600">
        <p>メール: {user?.email}</p>
        <p>ロール: {profile?.role}</p>
      </div>

      <form action={logout} className="mt-8">
        <button
          type="submit"
          className="w-full rounded-lg bg-gray-200 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-300"
        >
          ログアウト
        </button>
      </form>
    </div>
  );
}
