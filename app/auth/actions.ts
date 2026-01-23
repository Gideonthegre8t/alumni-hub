"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = (formData.get("full_name") as string) ?? "";

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // 1️⃣ Sign up the user
  const { data: userData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signupError) return { error: signupError.message || String(signupError) };

  const userId = userData.user?.id;
  if (!userId) return { error: "User ID not returned from Supabase" };

  // 2️⃣ Insert profile row immediately (full_name may be empty string)
  const { error: profileError } = await supabase.from("profiles").insert([
    {
      id: userId,
      full_name,
      email,
      email_visible: true,
      phone_visible: false,
    },
  ]);

  if (profileError) return { error: profileError.message || String(profileError) };

  // 3️⃣ Redirect to dashboard
  redirect("/dashboard");
}
