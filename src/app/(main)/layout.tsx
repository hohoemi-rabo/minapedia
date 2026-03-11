import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/bottom-nav";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg">
      <main className="px-4 pb-24 pt-6">{children}</main>
      <BottomNav isAdmin={isAdmin} />
    </div>
  );
}
