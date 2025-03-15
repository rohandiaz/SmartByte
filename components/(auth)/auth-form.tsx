// components/auth/auth-form.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import Link from 'next/link';

type AuthFormProps = {
  type: 'sign-in' | 'sign-up';
};

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const { signIn, isLoaded: signInLoaded, setActive: setSignInActive } = useSignIn();
  const { signUp, isLoaded: signUpLoaded, setActive: setSignUpActive } = useSignUp();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isSignIn = type === 'sign-in';
  const isLoaded = isSignIn ? signInLoaded : signUpLoaded;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignIn) {
        const result = await signIn?.create({
          identifier: email,
          password,
        });
        
        if (result?.status === 'complete' && setSignInActive) {
          await setSignInActive({ session: result.createdSessionId });
          router.push('/dashboard');
        } else {
          setError('An error occurred during sign in');
        }
      } else {
        const result = await signUp?.create({
          emailAddress: email,
          password,
          firstName,
          lastName,
        });
        
        if (result?.status === 'complete' && setSignUpActive) {
          await setSignUpActive({ session: result.createdSessionId });
          router.push('/dashboard');
        } else {
          setError('An error occurred during sign up');
        }
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isSignIn ? 'Sign In' : 'Create an Account'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {!isSignIn && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : isSignIn ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-4 text-center text-sm">
        {isSignIn ? (
          <p>
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}