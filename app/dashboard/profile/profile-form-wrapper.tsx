import ProfileForm from "../profile-form";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Suspense } from "react";
import DashboardLoading from "../loading";

export default async function ProfileFormWrapper() {
  const cookieStore = await cookies(); // ✅ always await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <p>Please log in</p>;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <Suspense fallback={<DashboardLoading /> }>
      <ProfileForm profile={profile || { email: user.email }} />
    </Suspense>
  );
}
