import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { SignOutButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GiCookingPot } from 'react-icons/gi'
import { MdOutlineRestaurantMenu, MdFoodBank } from 'react-icons/md'

export default async function Home() {
  const { userId } = await auth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-4xl w-full space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-block p-2 bg-blue-100 rounded-full mb-4">
              <GiCookingPot className="w-8 h-8 text-blue-600" />
            </div>
            
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
              <span className="text-blue-600">SmartByte</span>: Turn Ingredients into Delicious Meals
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Enter what you have in your kitchen and let our AI suggest personalized recipes just for you.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8">
              {userId ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button size="lg" className="text-lg px-8 py-6">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <SignOutButton>
                    <Button variant="destructive" size="lg" className="text-lg px-8 py-6">
                      Sign Out
                    </Button>
                  </SignOutButton>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/sign-in">
                    <Button size="lg" className="text-lg px-8 py-6">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <MdFoodBank className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ingredient-Based Search</h3>
                <p className="text-slate-600">Search for recipes using ingredients you already have at home.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <MdOutlineRestaurantMenu className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Personalized Suggestions</h3>
                <p className="text-slate-600">Get AI-powered recommendations tailored to your preferences and dietary needs.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <GiCookingPot className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Easy to Follow</h3>
                <p className="text-slate-600">Step-by-step instructions make cooking simple and enjoyable.</p>
              </CardContent>
            </Card>
          </div>

          {/* Testimonial Section */}
          <Card className="bg-blue-50 border-none">
            <CardContent className="pt-6 text-center">
              <p className="text-lg italic text-slate-700 mb-4">
                "SmartByte completely changed how I cook. No more wasted ingredients or boring meals!"
              </p>
              <p className="font-semibold text-slate-900">— Happy Home Chef</p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Footer - Brighter version */}
      <footer className="bg-slate-800 py-12">
        <div className="container mx-auto px-4 text-center text-white">
          <p>Made with 💗 by HumbleRohan</p>
        </div>
      </footer>
    </div>
  )
}