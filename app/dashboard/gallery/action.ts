"use server";

import { createClient } from "@/lib/supabase/server";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadGalleryImage(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const file = formData.get("file") as File | null;
  const caption = formData.get("caption") as string | null;

  if (!file) throw new Error("No file provided");

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "alumni_gallery",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  const { error } = await supabase.from("gallery").insert({
    user_id: user.id,
    image_url: uploadResult.secure_url,
    public_id: uploadResult.public_id,
    caption,
  });

  if (error) throw error;

  revalidatePath("/dashboard/gallery");
}

export async function deleteGalleryImage(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery")
    .select("public_id")
    .eq("id", id)
    .single();

  if (error || !data) throw new Error("Image not found");

  await cloudinary.uploader.destroy(data.public_id);

  const { error: deleteError } = await supabase
    .from("gallery")
    .delete()
    .eq("id", id);

  if (deleteError) throw deleteError;

  revalidatePath("/dashboard/gallery");
}
