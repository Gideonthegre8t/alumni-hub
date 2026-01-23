import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const id = params?.id;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  // get logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // get image row
  const { data: image, error: fetchError } = await supabase
    .from("gallery")
    .select("public_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !image) {
    return NextResponse.json(
      { error: "Image not found" },
      { status: 404 }
    );
  }

  // delete from cloudinary
  if (image.public_id) {
    await cloudinary.uploader.destroy(image.public_id);
  }

  // delete from database
  const { error: deleteError } = await supabase
    .from("gallery")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data: images, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ images });
}