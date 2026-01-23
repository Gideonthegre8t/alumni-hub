// app/api/profile/avatar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key in server-only routes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // <-- server-side only key, never expose to client
);

// POST => update avatar URL and public_id
export async function POST(req: NextRequest) {
  const { userId, avatar_url, avatar_public_id } = await req.json();

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      avatar_url,
      avatar_public_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Failed to update avatar:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// DELETE => remove avatar both from Cloudinary & Supabase
export async function DELETE(req: NextRequest) {
  const { publicId, userId } = await req.json();

  // Delete from Cloudinary
  try {
    await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/delete_by_token`,
      {
        method: "POST",
        body: JSON.stringify({ token: publicId }),
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Failed to delete avatar from Cloudinary:", err);
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      avatar_url: "",
      avatar_public_id: "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Failed to remove avatar in Supabase:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
