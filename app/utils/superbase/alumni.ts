"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getAlumni(search: string = "") {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll: () => {}, // no-op for Server Components
      },
    }
  );

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      phone,
      job_title,
      company,
      avatar_url
    `)
    .ilike("full_name", `%${search}%`)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Failed to fetch alumni:", error);
    return [];
  }

  return data ?? [];
}
