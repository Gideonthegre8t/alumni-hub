"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import Image from "next/image";
import { GalleryUpload } from "./upload";
import DashboardFooter from "../dashboard-footer";
import { deleteGalleryImage } from "./action";
import { useRouter } from "next/navigation";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/gallery")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch images");
        return res.json();
      })
      .then((data) => setImages(data.images || []))
      .catch(console.error);
  }, []);

  const refetchImages = useCallback(() => {
    fetch("/api/gallery")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch images");
        return res.json();
      })
      .then((data) => setImages(data.images || []))
      .catch(console.error);
  }, []);

  // Auto-refresh after upload completes
  const handleUploadComplete = useCallback(() => {
    refetchImages();
  }, [refetchImages]);

  async function handleDelete(imageId: string) {
    setDeletingId(imageId);
    
    startTransition(async () => {
      setImages(prev => prev.filter(img => img.id !== imageId));
      
      try {
        await deleteGalleryImage(imageId);
      } catch (error) {
        console.error("Delete failed:", error);
        refetchImages();
      } finally {
        setDeletingId(null);
      }
    });
  }

  return (
    <section className="flex flex-col min-h-screen">
      <div className="max-w-5xl mx-auto p-6 pt-0 flex-1">
        <div className="text-center mb-6">
          <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pt-6">
            Gallery
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Share memories that are safe forever
          </p>
        </div>

        {/* Pass callback to GalleryUpload */}
        <GalleryUpload onUploadComplete={handleUploadComplete} />

        <div className="mt-10 columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img) => (
            <div key={img.id} className="relative rounded-xl overflow-hidden break-inside-avoid">
              <Image
                src={img.image_url}
                alt=""
                width={500}
                height={500}
                className="w-full h-auto"
                loading="eager"
              />
              {img.caption && (
                <div className="absolute bottom-0 w-full bg-black/60 text-white p-2 text-sm">
                  {img.caption}
                </div>
              )}
              <button
                onClick={() => handleDelete(img.id)}
                disabled={isPending || deletingId === img.id}
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {deletingId === img.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      </div>
      <DashboardFooter />
    </section>
  );
}
