"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Briefcase,
  Building2,
  Phone,
  Camera,
  Trash2,
  ShieldCheck,
  Save,
} from "lucide-react";
import { updateProfile } from "../utils/superbase/server";

type ProfileFormProps = {
  profile: any;
};

export default function ProfileForm({ profile }: ProfileFormProps) {
  const safeProfile = profile ?? {};

  const [avatar, setAvatar] = useState("");
  const [avatarPublicId, setAvatarPublicId] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (safeProfile.avatar_url) setAvatar(safeProfile.avatar_url);
    if (safeProfile.avatar_public_id)
      setAvatarPublicId(safeProfile.avatar_public_id);
  }, [safeProfile]);

  async function uploadAvatar(file: File) {
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
      setAvatar(data.secure_url);
      setAvatarPublicId(data.public_id);
    } catch {
      alert("Avatar upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  function removeAvatar() {
    setAvatar("");
    setAvatarPublicId("");
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-6 lg:py-16">
      {/* Header */}
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Keep your information up to date so other alumnis can easily connect with you.
        </p>
      </div>

      <form
        action={updateProfile}
        className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl p-8 space-y-10"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
            </div>

            {/* Hover overlay */}
            <label className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={(e) =>
                  e.target.files && uploadAvatar(e.target.files[0])
                }
              />
            </label>
          </div>

          {avatar && (
            <button
              type="button"
              onClick={removeAvatar}
              className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Remove avatar
            </button>
          )}

          {uploading && (
            <p className="text-sm text-gray-500">Uploading avatar…</p>
          )}

          <input type="hidden" name="avatar_url" value={avatar} />
          <input
            type="hidden"
            name="avatar_public_id"
            value={avatarPublicId}
          />
        </div>

        {/* Fields */}
        <Field
          label="Email"
          name="email"
          defaultValue={safeProfile.email}
          icon={Mail}
          type="email"
          required
        />

        <Field
          label="Full name"
          name="full_name"
          defaultValue={safeProfile.full_name}
          icon={User}
          required
        />

        <Field
          label="Job title"
          name="job_title"
          defaultValue={safeProfile.job_title}
          icon={Briefcase}
        />

        <Field
          label="Company"
          name="company"
          defaultValue={safeProfile.company}
          icon={Building2}
        />

        <Field
          label="Phone"
          name="phone"
          defaultValue={safeProfile.phone}
          icon={Phone}
          placeholder="+234…"
        />

        {/* Privacy */}
        <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/60 p-6 space-y-4 border">
          <div className="flex items-center gap-2 text-gray-800 font-semibold">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            Privacy settings
          </div>

          <Toggle
            label="Show my email"
            name="email_visible"
            defaultChecked={safeProfile.email_visible}
          />

          <Toggle
            label="Show my phone number"
            name="phone_visible"
            defaultChecked={safeProfile.phone_visible}
          />
        </div>

        {/* Save */}
        <button
          disabled={uploading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          Save profile
        </button>
      </form>
    </section>
  );
}

/* ---------------- Components ---------------- */

function Field({
  label,
  icon: Icon,
  ...props
}: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          {...props}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 transition"
        />
      </div>
    </div>
  );
}

function Toggle({
  label,
  ...props
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type="checkbox"
        {...props}
        className="w-11 h-6 rounded-full appearance-none bg-gray-300 checked:bg-indigo-600 relative transition before:content-[''] before:absolute before:w-5 before:h-5 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition"
      />
    </label>
  );
}
