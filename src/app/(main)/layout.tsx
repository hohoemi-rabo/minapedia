import { getProfile } from "@/lib/auth";
import { BottomNav } from "@/components/bottom-nav";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  const isAdmin = profile?.role === "admin";

  return (
    <div className="mx-auto min-h-screen max-w-lg">
      <main className="px-4 pb-24 pt-6">{children}</main>
      <BottomNav isAdmin={isAdmin} />
    </div>
  );
}
