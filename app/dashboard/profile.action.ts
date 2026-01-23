"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies(); 

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(), // now works
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

  if (!user) return;

  // upsert profile
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    email: formData.get("email"),
    full_name: formData.get("full_name"),
    job_title: formData.get("job_title"),
    company: formData.get("company"),
    phone: formData.get("phone"),
    avatar_url: formData.get("avatar_url"),
    avatar_public_id: formData.get("avatar_public_id"),
    email_visible: formData.get("email_visible") === "on",
    phone_visible: formData.get("phone_visible") === "on",
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to update profile:", error);
    throw new Error("Profile update failed");
  }

  redirect("/dashboard");
}
