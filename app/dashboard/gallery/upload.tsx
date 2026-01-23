"use client";

import { useRef, useState } from "react";
import { uploadGalleryImage } from "./action";
import { Button } from "@/components/ui/button";
import { Loader2, ImagePlus } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled} className="gap-2">
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Upload
    </Button>
  );
}

interface GalleryUploadProps {
  onUploadComplete?: () => void;
}

export function GalleryUpload({ onUploadComplete }: GalleryUploadProps) {
  const [fileName, setFileName] = useState("");
  const [caption, setCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  return (
    <div className="flex items-center justify-center">
      <form
        action={async (formData) => {
          await uploadGalleryImage(formData);

          // Clear input fields
          setFileName("");
          setCaption("");
          if (fileRef.current) fileRef.current.value = "";

          // Refresh the page / gallery section
          router.refresh();
          
          // Force gallery refresh (calls parent's refetch)
          onUploadComplete?.();
        }}
        className="flex flex-col gap-3 w-full md:w-96"
      >
        <div className="flex items-center justify-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <ImagePlus className="h-5 w-5" />
            <input
              ref={fileRef}
              type="file"
              name="file"
              accept="image/*"
              hidden
              onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
            />
            {fileName || "Choose photo"}
          </label>
          <SubmitButton disabled={!fileName} />
        </div>

        <input
          type="text"
          name="caption"
          placeholder="Add a caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </form>
    </div>
  );
}
