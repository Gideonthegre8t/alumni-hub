import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";
import DashboardHome from "./dashboard-home";
import { createClient } from "@/lib/supabase/server";
import DashboardFooter from "./dashboard-footer";

export default async function DashboardContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.full_name?.trim()) {
    return <ProfileForm profile={profile} />;
  }

  return (
      <> 
      <DashboardHome profile={profile} />;
    
       </>
  ) ;


}
