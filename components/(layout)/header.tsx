// components/layout/header.tsx
'use client';

import Link from 'next/link';
import { useAuth, UserButton } from '@clerk/nextjs';

export default function Header() {
  const { isSignedIn } = useAuth();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Recipe Suggester
        </Link>
        
        <nav>
          <ul className="flex items-center gap-6">
            {isSignedIn ? (
              <>
                <li>
                  <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/recipes" className="text-gray-700 hover:text-blue-600">
                    My Recipes
                  </Link>
                </li>
                <li>
                  <UserButton afterSignOutUrl="/" />
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/sign-in" className="text-gray-700 hover:text-blue-600">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/sign-up" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}