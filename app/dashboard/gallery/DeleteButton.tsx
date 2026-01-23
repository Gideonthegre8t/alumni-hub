"use client";
import { useTransition } from "react";
import { deleteGalleryImage } from "./action";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteButton({ imageId, onDeleted }: { imageId: string; onDeleted?: () => void }) {
  const [isDeleting, startDeleting] = useTransition();

  

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    startDeleting(async () => {
      try {
        await deleteGalleryImage(imageId);
        onDeleted?.(); // notify parent to remove from UI immediately
      } catch (err) {
        alert("Delete failed. Please try again.");
        console.error(err);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-8 w-8 p-0 rounded-full hover:bg-red-500/20"
    >
      <Trash2 className={`h-4 w-4 ${isDeleting ? "animate-pulse" : ""}`} />
    </Button>
  );
}
