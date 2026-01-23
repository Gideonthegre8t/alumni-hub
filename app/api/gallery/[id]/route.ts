import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { v2 as cloudinary } from "cloudinary";

// Optional: configure Cloudinary if you're storing images there
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: Request) {
  const supabase = await createClient();

  // Extract the ID from the URL
  const urlParts = req.url.split("/");
  const id = urlParts[urlParts.length - 1];

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch the image to get public_id (for Cloudinary deletion if needed)
  const { data: image, error: fetchError } = await supabase
    .from("gallery")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  try {
    // Optional: delete from Cloudinary if you store images there
    if (image.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    // Delete from Supabase
    const { error: deleteError } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
