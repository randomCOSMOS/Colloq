'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image 
            src="/images/colloq transparent.png" 
            alt="Colloq" 
            width={150} 
            height={150} 
            priority
          />
        </Link>

        <div className="flex items-center gap-6">
          {session ? (
            <>
              <Link href="/events" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Browse Events
              </Link>
              <Link href="/create-event" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Create Event
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Log In
              </Link>
              <Link href="/signup" className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
