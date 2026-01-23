"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export default function AuthRedirect() {
  const router = useRouter();
  const supabase = createBrowserClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace("/dashboard"); // redirect logged-in users
      }
    });
  }, [supabase, router]);

  return null; // renders nothing
}
