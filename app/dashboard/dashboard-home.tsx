import Link from "next/link";
import {
  Users,
  UserCircle,
  Image,
  MessageSquare,
  Calendar,
  Briefcase,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function DashboardHome({ profile }: { profile: any }) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-6 lg:py-12 space-y-16"> 

      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold tracking-wide">
            Alumni Dashboard
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {profile.full_name?.split(" ")[0] || "Alumni"}
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          Manage your profile, connect with classmates, and explore opportunities — all in one place.
        </p>
      </div>


      {/* Feature Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Alumni Directory"
          description="Browse classmates and view profiles."
          icon={Users}
          href="/dashboard/alumni"
        />

        <DashboardCard
          title="My Profile"
          description="Update your information & privacy."
          icon={UserCircle}
          href="/dashboard/profile"
        />

        <DashboardCard
          title="Gallery"
          description="Share memories and photos."
          icon={Image}
          href="/dashboard/gallery"
        />

        <DashboardCard
          title="Messages"
          description="Chat with other alumni."
          icon={MessageSquare}
          badge="Coming Soon"
        />

        <DashboardCard
          title="Events"
          description="Reunions & meetups."
          icon={Calendar}
          badge="Coming Soon"
        />

        <DashboardCard
          title="Jobs & Opportunities"
          description="Career opportunities."
          icon={Briefcase}
          badge="Coming Soon"
        />
      </div>
    </section>
  );
}

/* -------------------- Components -------------------- */

function DashboardCard({
  title,
  description,
  icon: Icon,
  badge,
  href,
}: {
  title: string;
  description: string;
  icon: any;
  badge?: string;
  href?: string;
}) {
  const Card = (
    <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-8 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      
      {/* Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
            <Icon className="w-6 h-6 text-white" />
          </div>

          {badge && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900">
          {title}
        </h3>

        <p className="text-gray-600">
          {description}
        </p>

        {href && (
          <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
            Open <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );

  return href ? <Link href={href}>{Card}</Link> : Card;
}

