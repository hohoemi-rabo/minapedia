import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export default async function ProfileEditPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold">プロフィール編集</h1>

      <div className="mt-4 rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          本名や大切な個人情報は表示されません。安心してご利用ください。
        </p>
      </div>

      <div className="mt-6">
        <ProfileForm
          nickname={profile?.nickname ?? ""}
          avatarUrl={profile?.avatar_url ?? null}
        />
      </div>
    </div>
  );
}
