// app/components/DashboardFooter.tsx
"use client"; // <<< make it a client component

import Link from "next/link";

export default function DashboardFooter() {

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-5xl mx-auto px-6 py-6 lg:py-12 md:flex md:justify-between md:items-start space-y-8 md:space-y-0">
        {/* Branding */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">Alumni Hub</h2>
          <p className="text-sm text-gray-500 max-w-xs">
            Stay connected, explore opportunities, and celebrate memories with your alumni community.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-12">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Dashboard</h3>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-gray-900 transition">Home</Link>
              </li>
              <li>
                <Link href="/dashboard/profile" className="hover:text-gray-900 transition">My Profile</Link>
              </li>
              <li>
                <Link href="/dashboard/alumni" className="hover:text-gray-900 transition">Alumni Directory</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Community</h3>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>
                <Link href="/dashboard/gallery" className="hover:text-gray-900 transition">Gallery</Link>
              </li>
              <li>
                <Link href="/dashboard/messages" className="hover:text-gray-900 transition cursor-not-allowed">Messages</Link>
              </li>
              <li>
                <Link href="/dashboard/events" className="hover:text-gray-900 transition cursor-not-allowed">Events</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Opportunities</h3>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>
                <Link href="/dashboard/jobs" className="hover:text-gray-900 transition cursor-not-allowed">Jobs & Opportunities</Link>
              </li>
              <li>
                <Link href="/dashboard/network" className="hover:text-gray-900 transition cursor-not-allowed">Networking</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
         <p> Alumni Hub. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link href="/dashboard" className="hover:text-gray-900 transition">Dashboard</Link>
            {/* <Link href="/privacy" className="hover:text-gray-900 cursor-not-allowed transition">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-900 cursor-not-allowed transition">Terms</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
