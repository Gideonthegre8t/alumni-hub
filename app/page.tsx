// app/page.tsx
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Users, Shield, Sparkles } from "lucide-react";
import DashboardFooter from "./dashboard/dashboard-footer";

/* -------------------------------- Skeleton -------------------------------- */
function HomeSkeleton() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="h-14 w-72 mx-auto bg-indigo-200/40 rounded-2xl mb-6" />
        <div className="h-6 w-[420px] max-w-full mx-auto bg-gray-200/60 rounded-xl mb-10" />
        <div className="flex justify-center gap-4">
          <div className="h-12 w-32 bg-gray-300/60 rounded-xl" />
          <div className="h-12 w-40 bg-gray-200/60 rounded-xl" />
        </div>
      </div>
    </main>
  );
}

/* ------------------------------- Main Content ------------------------------- */
function HomeContent() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 text-gray-900">
      {/* ------------------------------- NAVBAR ------------------------------- */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-white/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-black text-lg tracking-tight text-indigo-600">
           UNILAG M.P.A
          </span>

          <Link
            href="/auth/login"
            className="text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition"
          >
            Login
          </Link>
        </div>
      </header>

      {/* ------------------------------- HERO ------------------------------- */}
      <section className="relative pt-28 pb-32 px-6 text-center overflow-hidden">
        {/* Decorative gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-white/60 shadow-sm text-sm font-semibold mb-6">
            <Sparkles size={16} className="text-indigo-600" />
            Official Alumni Network
          </span>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
             UNILAG M.P.A 
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              CLASS OF 2024/2025
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A private, secure space for masters alumni to connect, grow
            professionally, and celebrate achievements together.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              Join Alumni
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white/80 backdrop-blur border border-white/60 font-semibold hover:bg-white transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------- FEATURES ------------------------------- */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-xl hover:-translate-y-1 transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-lg">
              <Users />
            </div>
            <h3 className="text-xl font-bold mb-2">Alumni Directory</h3>
            <p className="text-gray-600 leading-relaxed">
              Discover and connect with fellow alumni, explore careers, and
              strengthen professional relationships.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-xl hover:-translate-y-1 transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-6 shadow-lg">
              <Shield />
            </div>
            <h3 className="text-xl font-bold mb-2">Privacy First</h3>
            <p className="text-gray-600 leading-relaxed">
              Control what you share. Your data is protected with modern
              authentication and visibility controls.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-xl hover:-translate-y-1 transition">
            <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center mb-6 shadow-lg">
              <Sparkles />
            </div>
            <h3 className="text-xl font-bold mb-2">Modern Experience</h3>
            <p className="text-gray-600 leading-relaxed">
              A fast, elegant platform designed for today’s alumni communities.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------------------------------- Page ---------------------------------- */
export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
      <DashboardFooter />
    </Suspense>
  );
}
