import { Suspense } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";


async function AlumniContent() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() { },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      job_title,
      company,
      email,
      phone,
      avatar_url,
      email_visible,
      phone_visible,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-red-500">
          Failed to load alumni directory.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-16 ">
        <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pt-6">
          Alumni Directory
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Connect with fellow alumni and celebrate our community.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow">
            👥 {profiles?.length || 0} Alumni
          </span>

        </div>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-16 px-4">
        <div className="relative">
          <input
            placeholder="Search alumni by name, role or company…"
            className="w-full pl-12 pr-16 py-4 rounded-3xl border-2 border-gray-100 bg-white shadow-xl focus:ring-4 focus:ring-indigo-300 focus:outline-none"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
            ⌘
          </span>
        </div>
      </div>

      {/* Alumni Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {profiles?.map((profile) => (
            <Link
              key={profile.id}
              href={`/dashboard/alumni/${profile.id}`}
              className="group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:-translate-y-2 transition-all relative">
                {/* Avatar */}
                <div className="w-24 h-24 mx-auto mb-6">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      className="w-full h-full rounded-2xl object-cover shadow"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                      {profile.full_name?.[0]}
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-center">
                  {profile.full_name}
                </h3>

                {/* Badges */}
                <div className="flex justify-center gap-2 mt-3">
                  <span className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                    ✔ Verified
                  </span>
                  <span className="text-xs px-3 py-1 bg-gray-100 rounded-full">
                    Alumni
                  </span>
                </div>

                {/* Job */}
                {profile.job_title && (
                  <p className="mt-4 text-sm text-gray-600 text-center break-words px-2">
                    <span className="font-medium block truncate">
                      {profile.job_title}
                    </span>

                    {profile.company && (
                      <span className="text-indigo-600 block break-words truncate">
                        @{profile.company}
                      </span>
                    )}
                  </p>

                )}

                {/* Contact Info */}
                <div className="mt-6 space-y-3 text-sm">
                  {profile.email_visible && profile.email && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl">
                      <span className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-600 text-white rounded-xl">
                        <Mail size={18} />
                      </span>

                      <span className="font-medium text-gray-800 break-all leading-snug max-w-[14rem] sm:max-w-full">
                        {profile.email}
                      </span>
                    </div>

                  )}

                  {profile.phone_visible && profile.phone && (
                    <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl">
                      <span className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-xl">
                        <Phone size={18} />
                      </span>
                      <span className="font-medium text-gray-800">
                        {profile.phone}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            </Link>
          ))}
        </div>

        {!profiles?.length && (
          <div className="text-center py-32">
            <h3 className="text-3xl font-black">No Alumni Yet</h3>
            <p className="mt-4 text-gray-600">
              Be the first to join the alumni network.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function AlumniSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold text-gray-400">Loading alumni…</p>
    </div>
  );
}

export default function AlumniDirectoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Suspense fallback={<AlumniSkeleton />}>
        <AlumniContent />
      </Suspense>
    </div>
  );
}
