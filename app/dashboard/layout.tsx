import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardFooter from "./dashboard-footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔒 Protect all dashboard routes
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <DashboardNavbar />

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
