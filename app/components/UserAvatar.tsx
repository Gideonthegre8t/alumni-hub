"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UserAvatar() {
  const supabase = createClient();
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAvatar(data.user?.user_metadata?.avatar_url ?? null);
    });
  }, []);

  return (
    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
      {avatar ? (
        <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-xs">
          👤
        </div>
      )}
    </div>
  );
}
