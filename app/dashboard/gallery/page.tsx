"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GalleryUpload } from "./upload";
import DashboardFooter from "../dashboard-footer";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);

 useEffect(() => {
  fetch("/api/gallery")
    .then(async (res) => {
      if (!res.ok) throw new Error("Failed to fetch images");
      return res.json();
    })
    .then((data) => setImages(data.images || []))
    .catch(console.error);
}, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;

    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok || data.error) {
      alert(data.error || "Delete failed");
      return;
    }

    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
   <>
    <section className="max-w-5xl mx-auto p-6 pt-0">
      {/* Header */}
      <div className="text-center  mb-6">
        <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pt-6">
          Gallery
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Share memories that are safe forever
        </p>

       
      </div>
      <GalleryUpload />

      <div className="mt-10 columns-2 md:columns-3 gap-4 space-y-4">
        {images.map((img) => (
          <div key={img.id} className="relative rounded-xl overflow-hidden">
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
              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      
    </section>
    <DashboardFooter />
    </>
  );
}
