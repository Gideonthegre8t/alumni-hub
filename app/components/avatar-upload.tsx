"use client";

import { useState } from "react";

type Props = {
  initialUrl?: string;
  initialPublicId?: string;
  userId: string; // needed for database update
  supabaseKey: string; // your Supabase anon/public key
  supabaseUrl: string; // your Supabase URL
  onUpload: (url: string, publicId: string) => void;
};

export default function AvatarUpload({
  initialUrl,
  initialPublicId,
  userId,
  supabaseKey,
  supabaseUrl,
  onUpload,
}: Props) {
  const [preview, setPreview] = useState(initialUrl);
  const [publicId, setPublicId] = useState(initialPublicId);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  // Upload new avatar
  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setPreview(data.secure_url);
      setPublicId(data.public_id);
      onUpload(data.secure_url, data.public_id);

      // Update Supabase immediately
      await fetch("/api/profile/avatar", {
        method: "POST",
        body: JSON.stringify({
          userId,
          avatar_url: data.secure_url,
          avatar_public_id: data.public_id,
        }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error(err);
      alert("Avatar upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  // Remove avatar from Cloudinary + Supabase
  async function removeAvatar() {
    if (!publicId) {
      setPreview("");
      onUpload("", "");
      return;
    }

    setRemoving(true);
    try {
      // Delete from Cloudinary
      await fetch("/api/profile/avatar", {
        method: "DELETE",
        body: JSON.stringify({ publicId, userId }),
        headers: { "Content-Type": "application/json" },
      });

      setPreview("");
      setPublicId("");
      onUpload("", "");
    } catch (err) {
      console.error(err);
      alert("Failed to remove avatar. Try again.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      {/* Avatar Preview */}
      <div className="relative w-20 h-20 rounded-full border overflow-hidden shadow-sm">
        <img
          src={preview || "/avatar-placeholder.png"}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        {/* Upload / Change Button */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            hidden
            disabled={uploading || removing}
            onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
          />
          <span className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition-colors">
            {uploading ? "Uploading..." : preview ? "Change" : "Upload"}
          </span>
        </label>

        {/* Remove Button */}
        {preview && (
          <button
            type="button"
            onClick={removeAvatar}
            disabled={uploading || removing}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium shadow hover:bg-red-600 transition-colors"
          >
            {removing ? "Removing..." : "Remove"}
          </button>
        )}
      </div>
    </div>
  );
}
