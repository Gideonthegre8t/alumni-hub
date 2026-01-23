// app/dashboard/profile/page.tsx
import React, { Suspense } from "react";
import ProfileFormWrapper from "./profile-form-wrapper";
import DashboardLoading from "../loading";


export default function ProfilePage() {
  return (
    <Suspense fallback={<DashboardLoading /> }>
      {/* Server Component can be async */}
      <ProfileFormWrapper />
    </Suspense>
  );
}
