"use server";

import { v2 as cloudinary } from "cloudinary";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function deleteAvatar() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_public_id")
    .eq("id", user.id)
    .single();

  if (!profile?.avatar_public_id) return;

  await cloudinary.uploader.destroy(profile.avatar_public_id);

  await supabase.from("profiles").update({
    avatar_url: null,
    avatar_public_id: null,
  }).eq("id", user.id);
}
