"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { UserCircleIcon } from "@heroicons/react/24/outline"; // For avatar icon

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/signin");
  };

  if (!user) return null;

  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg border-b border-indigo-400">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left - Logo / Title */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-white drop-shadow-md tracking-wide">
              📰 Personalized AI Newsletter
            </span>
          </div>

          {/* Right - User Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
              <span className = "text-lg text-white font-bold ">Hello,  </span>
              <UserCircleIcon className="w-6 h-6 text-white" />
              <span className="text-sm text-white font-medium truncate">
                {user.email?.split('@')[0]} 
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 shadow-md hover:scale-105 transition-transform duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
