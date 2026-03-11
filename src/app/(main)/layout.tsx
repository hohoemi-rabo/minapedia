import { BottomNav } from "@/components/bottom-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen max-w-lg">
      <main className="px-4 pb-24 pt-6">{children}</main>
      <BottomNav />
    </div>
  );
}
