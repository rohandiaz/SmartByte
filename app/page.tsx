import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GiCookingPot } from 'react-icons/gi';
import { MdOutlineTimer } from 'react-icons/md';
import { FaStar, FaHeart } from 'react-icons/fa';
import { BiDish } from 'react-icons/bi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950 flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <GiCookingPot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-xl text-slate-900 dark:text-white">SmartByte</span>
          </Link>

          <div className="flex items-center gap-4">
            {userId ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard"><Button variant="ghost">Dashboard</Button></Link>
                <SignOutButton><Button variant="outline" size="sm">Sign Out</Button></SignOutButton>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/sign-in"><Button variant="ghost">Sign In</Button></Link>
                <Link href="/sign-up"><Button variant="default" size="sm">Sign Up</Button></Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center py-16 px-4">
        <div className="max-w-5xl w-full space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6 relative">
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

            <Badge className="mb-4 px-4 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">
              Discover New Recipes Daily
            </Badge>

            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              <span className="text-blue-600 dark:text-blue-400">SmartByte</span>: Turn Ingredients into Delicious Meals
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Enter what you have in your kitchen and let our AI suggest personalized recipes just for you.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center">
              {userId ? (
                <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg">
                  <Link href="/dashboard">Go to Dashboard →</Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg">
                    <Link href="/sign-up">Get Started Free →</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: BiDish, value: "2,500+", label: "Recipes Available" },
              { icon: FaStar, value: "4.9/5", label: "User Satisfaction" },
              { icon: MdOutlineTimer, value: "15 min", label: "Average Cook Time" }
            ].map((stat, i) => (
              <Card key={i} className="bg-white dark:bg-gray-800 shadow-md border-none">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center">
                    <stat.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-8 text-slate-900 dark:text-white">How SmartByte Works</h2>

            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="personalize">Personalize</TabsTrigger>
                <TabsTrigger value="cook">Cook</TabsTrigger>
              </TabsList>

              {/* Search Tab */}
              <TabsContent value="search" className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/2">
                    <h3 className="text-xl font-semibold mb-2">Ingredient-Based Search</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Enter the ingredients you have on hand, and SmartByte will instantly find recipes that match what's in your kitchen.
                    </p>
                  </div>
                  <div className="w-full md:w-1/2 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                    <div className="flex gap-2 flex-wrap">
                      {['Chicken', 'Rice', 'Broccoli', 'Garlic', 'Soy Sauce'].map((item, i) => (
                        <Badge key={i} variant="outline" className="bg-white dark:bg-gray-800">{item}</Badge>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Button className="w-full">Find Recipes</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Personalize Tab */}
              <TabsContent value="personalize" className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/2">
                    <h3 className="text-xl font-semibold mb-2">Personalized Suggestions</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Our AI learns your preferences and dietary needs to suggest recipes that are perfect for you.
                    </p>
                  </div>
                  <div className="w-full md:w-1/2 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
                      <p className="font-medium">Welcome back, John!</p>
                    </div>
                    <div className="space-y-2">
                      {['Thai Green Curry', 'Mediterranean Salad', 'Vegetable Stir Fry'].map((item, i) => (
                        <Card key={i} className="bg-white dark:bg-gray-800 shadow-sm">
                          <CardContent className="p-3 flex justify-between items-center">
                            <span>{item}</span>
                            <FaHeart className="text-red-500" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Cook Tab */}
              <TabsContent value="cook" className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/2">
                    <h3 className="text-xl font-semibold mb-2">Easy to Follow</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Clear, step-by-step instructions make cooking simple and enjoyable, even for beginners.
                    </p>
                  </div>
                  <div className="w-full md:w-1/2 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                    <div className="space-y-3">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex gap-2 items-center">
                          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                            {step}
                          </div>
                          <p className="text-slate-700 dark:text-slate-300">
                            {step === 1 ? "Prep ingredients" : step === 2 ? "Follow simple steps" : "Enjoy your meal!"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <GiCookingPot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-lg text-slate-900 dark:text-white">SmartByte</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm">Made with 💗 by HumbleRohan</p>
        </div>
      </footer>
    </div>
  );
}