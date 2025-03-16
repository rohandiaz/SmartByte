// app/recipes/[id]/page.tsx
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import Link from 'next/link';
import { Clock, Star, ChefHat, Tag, Calendar, ArrowLeft } from 'lucide-react';

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: RecipePageProps) {
  // Now await params as suggested by the error message
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const { userId } = await auth();
  
  if (!userId) {
    notFound();
  }
  
  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });
  
  if (!user) {
    notFound();
  }
  
  const recipe = await db.recipe.findUnique({
    where: { 
      id: id,
      userId: user.id, 
    },
  });
  
  if (!recipe) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link 
        href="/dashboard" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        <span>Back to Dashboard</span>
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {recipe.imageUrl && (
          <div className="relative h-80 overflow-hidden">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-4xl font-bold mb-2 text-shadow">{recipe.title}</h1>
              
              {recipe.cuisine && (
                <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-2 mr-2">
                  <ChefHat className="w-4 h-4 mr-1" />
                  {recipe.cuisine} Cuisine
                </div>
              )}
              
              {recipe.cookTime && (
                <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                  {recipe.cookTime} minutes
                </div>
              )}
            </div>
          </div>
        )}
        
        {!recipe.imageUrl && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <h1 className="text-3xl font-bold mb-2 text-white">{recipe.title}</h1>
            
            <div className="flex flex-wrap gap-2">
              {recipe.cuisine && (
                <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                  <ChefHat className="w-4 h-4 mr-1" />
                  {recipe.cuisine} Cuisine
                </div>
              )}
              
              {recipe.cookTime && (
                <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                  <Clock className="w-4 h-4 mr-1" />
                  {recipe.cookTime} minutes
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="p-6 md:p-8">
          {!recipe.imageUrl && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{recipe.title}</h1>
            </div>
          )}
          
          {recipe.description && (
            <div className="mb-8">
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {recipe.description}
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Tag className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            {recipe.tags && recipe.tags.length > 0 ? (
              recipe.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-sm">No tags</span>
            )}
          </div>
          
          {recipe.calories && (
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Nutrition Facts</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Calories:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{recipe.calories} kcal</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                <ChefHat className="w-5 h-5 mr-2 text-blue-500" />
                Instructions
              </h2>
              <ol className="space-y-4">
                {recipe.instructions && recipe.instructions.map((step, index) => (
                  <li key={index} className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                Created on {new Date(recipe.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {recipe.isGenerated && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI Generated
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}