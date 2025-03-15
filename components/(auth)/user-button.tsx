// components/auth/user-button.tsx
import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function UserButton() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isLoaded) {
    return <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => router.push('/sign-in')}
          className="px-4 py-2 text-sm bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push('/sign-up')}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Sign Up
        </button>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <>
      <div className="relative">
          <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center focus:outline-none"
          >
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200">
                  {user.imageUrl ? (
                      <Image
                          src={user.imageUrl}
                          alt={user.fullName || 'User profile'}
                          width={40}
                          height={40}
                          className="object-cover" />
                  ) : (
                      <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-medium text-lg">
                          {user.firstName?.[0] || user.username?.[0] || 'U'}
                      </div>
                  )}
              </div>
              <span className="ml-2 hidden md:block">{user.firstName || user.username}</span>
          </button>

      {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium">{user.fullName || user.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
              <a
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                  Dashboard
              </a>
              <a
                  href="/recipes"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                  My Recipes
              </a>
              <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                  Sign Out
          </div>
      )}
    </div>
    </>
  );
} </div>
}